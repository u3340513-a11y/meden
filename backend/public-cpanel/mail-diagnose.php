<?php

/**
 * Verification-mail diagnostics for the cPanel deployment.
 *
 * Why: the hosting has no SSH, and mail failures are swallowed by AuthService, so we need a
 *      single page that runs every step of the verification-mail pipeline and reports raw errors.
 * What: checks config cache, deployed code, mail config, DNS/socket, SMTP auth, mail rendering,
 *       optionally sends the real verification mail, and lists recent log errors.
 * Input (GET): token (must equal MAIL_DIAG_TOKEN in api_backend/.env, min 32 chars),
 *              email (optional, user to test), send=1 (optional, actually send the mail).
 * Output: text/plain report. Secrets are masked. DELETE THIS FILE AFTER USE.
 */

declare(strict_types=1);

const APP_DIR_NAME = 'api_backend';
const TOKEN_ENV_KEY = 'MAIL_DIAG_TOKEN';
const MIN_TOKEN_LENGTH = 32;
const SOCKET_TIMEOUT_SECONDS = 10;
const LOG_TAIL_BYTES = 300000;
const LOG_MAX_ENTRIES = 15;
const LOG_MESSAGE_MAX_CHARS = 600;

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

$appPath = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), '/') . '/' . APP_DIR_NAME;
$envFile = $appPath . '/.env';

authorize($envFile);

$secrets = [];

section('1. ORTAM');
line('PHP sürümü', PHP_VERSION);
foreach (['openssl', 'mbstring', 'intl', 'pdo_mysql'] as $extension) {
    line("ext-$extension", extension_loaded($extension) ? 'VAR' : 'YOK!');
}
line('.env satır 1 UTF-8 geçerli mi', envFirstLineIsValidUtf8($envFile) ? 'EVET' : 'HAYIR! (APP_NAME bozuk karakter içeriyor)');

section('2. CONFIG CACHE');
$configCache = $appPath . '/bootstrap/cache/config.php';
line('bootstrap/cache/config.php', is_file($configCache)
    ? 'VAR! (' . date('Y-m-d H:i:s', (int) filemtime($configCache)) . ') -> .env okunmuyor, bu dosyayı silin'
    : 'yok (iyi)');

define('LARAVEL_START', microtime(true));
require $appPath . '/vendor/autoload.php';
$app = require $appPath . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$secrets[] = (string) config('mail.mailers.smtp.password');

section('3. SUNUCUDAKİ KOD GÜNCEL Mİ');
checkFileContains($appPath . '/app/Services/AuthService.php', 'function sendVerificationMail', 'AuthService senkron gönderim');
checkFileContains($appPath . '/app/Providers/AppServiceProvider.php', 'createUrlUsing', 'AppServiceProvider SPA linki');
checkFileContains($appPath . '/app/Http/Controllers/Auth/VerificationController.php', 'function resend', 'VerificationController resend');
line('Route verification.verify', Illuminate\Support\Facades\Route::has('verification.verify') ? 'VAR' : 'YOK!');

section('4. MAIL AYARLARI (çalışan değerler)');
$mailer = (string) config('mail.default');
$host = (string) config('mail.mailers.smtp.host');
$port = (int) config('mail.mailers.smtp.port');
$scheme = (string) config('mail.mailers.smtp.scheme');
line('app.name', (string) config('app.name'));
line('app.name UTF-8 geçerli', mb_check_encoding((string) config('app.name'), 'UTF-8') ? 'EVET' : 'HAYIR!');
line('app.url', (string) config('app.url'));
line('mail.default', $mailer . ($mailer === 'smtp' ? '' : '  <-- smtp olmalı!'));
line('smtp.scheme', $scheme === '' ? '(boş)' : $scheme);
line('smtp.host', $host);
line('smtp.port', (string) $port);
line('smtp.username', (string) config('mail.mailers.smtp.username'));
line('smtp.password', config('mail.mailers.smtp.password') ? '*** (dolu, ' . strlen((string) config('mail.mailers.smtp.password')) . ' karakter)' : 'BOŞ!');
line('from.address', (string) config('mail.from.address'));
line('from.name', (string) config('mail.from.name'));
line('queue.default', (string) config('queue.default'));

section('5. DNS / BAĞLANTI');
$resolved = gethostbyname($host);
line('DNS ' . $host, $resolved === $host ? 'ÇÖZÜLEMEDİ!' : $resolved);
$transportPrefix = ($scheme === 'smtps' || $port === 465) ? 'ssl://' : 'tcp://';
runStep("Soket $transportPrefix$host:$port", static function () use ($transportPrefix, $host, $port): string {
    $started = microtime(true);
    $socket = @stream_socket_client($transportPrefix . $host . ':' . $port, $errno, $errstr, SOCKET_TIMEOUT_SECONDS);
    if ($socket === false) {
        throw new RuntimeException("bağlanamadı ($errno) $errstr");
    }
    fclose($socket);
    return sprintf('BAĞLANDI (%.2f sn)', microtime(true) - $started);
}, $secrets);

section('6. SMTP GİRİŞ (AUTH) TESTİ');
runStep('SMTP start()', static function (): string {
    $transport = Illuminate\Support\Facades\Mail::mailer('smtp')->getSymfonyTransport();
    if (!$transport instanceof Symfony\Component\Mailer\Transport\Smtp\SmtpTransport) {
        return 'SMTP transport değil: ' . get_class($transport);
    }
    $transport->start();
    $transport->stop();
    return 'BAŞARILI (kullanıcı adı/şifre doğru)';
}, $secrets);

section('7. KULLANICI VE MAIL OLUŞTURMA');
$email = filter_var((string) ($_GET['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$user = null;
if ($email === false) {
    line('email parametresi', 'verilmedi veya geçersiz (?email=... ekleyin)');
} else {
    $user = App\Models\User::query()->select(['id', 'name', 'email', 'email_verified_at'])->where('email', $email)->first();
    line('Kullanıcı', $user ? "BULUNDU (id={$user->id})" : 'BULUNAMADI!');
    if ($user) {
        line('Doğrulanmış mı', $user->email_verified_at ? 'EVET (' . $user->email_verified_at . ') -> resend mail göndermez!' : 'hayır');
        runStep('Mail içeriği render', static function () use ($user): string {
            $html = (string) (new Illuminate\Auth\Notifications\VerifyEmail())->toMail($user)->render();
            preg_match('~href="([^"]*e-posta-dogrula[^"]*)"~', $html, $match);
            return 'BAŞARILI, link: ' . html_entity_decode($match[1] ?? '(link bulunamadı!)');
        }, $secrets);
    }
}

section('8. GERÇEK GÖNDERİM');
if (($_GET['send'] ?? '') !== '1') {
    line('Atlandı', 'göndermek için &send=1 ekleyin');
} elseif (!$user) {
    line('Atlandı', 'geçerli bir kullanıcı yok');
} else {
    runStep('sendEmailVerificationNotification()', static function () use ($user): string {
        $user->sendEmailVerificationNotification();
        return 'SMTP KABUL ETTİ -> gelmezse Spam / cPanel "Teslimatı İzle"';
    }, $secrets);
}

section('9. SON LOG HATALARI');
foreach (recentLogErrors($appPath . '/storage/logs/laravel.log') as $entry) {
    echo maskSecrets($entry, $secrets), "\n";
}

section('BİTTİ - BU DOSYAYI SUNUCUDAN SİLİN');

/**
 * Stops with 404 unless the request token matches MAIL_DIAG_TOKEN, so the page is invisible to others.
 */
function authorize(string $envFile): void
{
    $env = is_file($envFile) ? (string) file_get_contents($envFile) : '';
    preg_match('/^' . TOKEN_ENV_KEY . '=["\']?([^"\'\r\n]+)/m', $env, $match);
    $expected = trim($match[1] ?? '');
    $given = (string) ($_GET['token'] ?? '');

    if (strlen($expected) < MIN_TOKEN_LENGTH || !hash_equals($expected, $given)) {
        http_response_code(404);
        exit('Not Found');
    }
}

function envFirstLineIsValidUtf8(string $envFile): bool
{
    $handle = @fopen($envFile, 'rb');
    if ($handle === false) {
        return false;
    }
    $firstLine = (string) fgets($handle);
    fclose($handle);
    return mb_check_encoding($firstLine, 'UTF-8');
}

function checkFileContains(string $file, string $needle, string $label): void
{
    $content = is_file($file) ? (string) file_get_contents($file) : '';
    line($label, str_contains($content, $needle) ? 'GÜNCEL' : 'ESKİ! (lokaldeki dosyayı yükleyin)');
}

/**
 * Runs one diagnostic step and prints either its result or the full exception chain.
 *
 * @param callable(): string $step
 * @param list<string> $secrets
 */
function runStep(string $label, callable $step, array $secrets): void
{
    try {
        line($label, $step());
    } catch (Throwable $exception) {
        line($label, 'HATA!');
        for ($current = $exception; $current !== null; $current = $current->getPrevious()) {
            echo '    ', get_class($current), ': ', maskSecrets($current->getMessage(), $secrets), "\n";
            echo '    @ ', basename($current->getFile()), ':', $current->getLine(), "\n";
        }
    }
}

/**
 * Returns the latest ERROR+ log headers (message only, no stack traces).
 *
 * @return list<string>
 */
function recentLogErrors(string $logFile): array
{
    if (!is_file($logFile)) {
        return ['(laravel.log yok)'];
    }

    $size = (int) filesize($logFile);
    $handle = fopen($logFile, 'rb');
    fseek($handle, max(0, $size - LOG_TAIL_BYTES));
    $tail = (string) stream_get_contents($handle);
    fclose($handle);

    preg_match_all('/^\[(\d{4}-\d{2}-\d{2} [\d:]+)\] \w+\.(ERROR|CRITICAL|ALERT|EMERGENCY): (.*)$/m', $tail, $matches, PREG_SET_ORDER);
    $entries = array_map(
        static fn (array $m): string => "[{$m[1]}] {$m[2]}: " . mb_strimwidth($m[3], 0, LOG_MESSAGE_MAX_CHARS, '…'),
        array_slice($matches, -LOG_MAX_ENTRIES)
    );

    return $entries ?: ['(son kısımda hata kaydı yok)'];
}

/** @param list<string> $secrets */
function maskSecrets(string $text, array $secrets): string
{
    foreach (array_filter($secrets) as $secret) {
        $text = str_replace($secret, '***', $text);
    }
    return $text;
}

function section(string $title): void
{
    echo "\n=== $title ===\n";
}

function line(string $label, string $value): void
{
    echo str_pad($label, 38), ': ', $value, "\n";
}
