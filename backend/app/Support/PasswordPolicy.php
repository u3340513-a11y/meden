<?php

namespace App\Support;

/**
 * Why: registration and password reset must enforce the exact same password rules; keeping them
 *      in one place prevents the two flows from drifting apart.
 * What: Laravel validation rules and Turkish messages for a new password.
 *
 * Uppercase detection uses the Unicode "uppercase letter" class (\p{Lu}) instead of [A-Z],
 * because [A-Z] only matches ASCII and rejected passwords whose only capital is a Turkish
 * letter such as Ç, Ş, Ğ, Ü, Ö or İ (e.g. "Çerçili.79").
 */
final class PasswordPolicy
{
    private const MIN_LENGTH = 8;
    private const UPPERCASE_PATTERN = '/\p{Lu}/u';
    private const DIGIT_PATTERN = '/[0-9]/';

    /**
     * @return array<int, string>
     */
    public static function rules(): array
    {
        return [
            'required',
            'string',
            'min:' . self::MIN_LENGTH,
            'regex:' . self::UPPERCASE_PATTERN,
            'regex:' . self::DIGIT_PATTERN,
            'confirmed',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function messages(string $field = 'password'): array
    {
        return [
            "{$field}.required" => 'Şifre zorunludur.',
            "{$field}.min" => 'Şifre en az ' . self::MIN_LENGTH . ' karakter olmalıdır.',
            "{$field}.regex" => 'Şifre en az 1 büyük harf ve 1 rakam içermelidir.',
            "{$field}.confirmed" => 'Şifre tekrarı uyuşmuyor.',
        ];
    }
}
