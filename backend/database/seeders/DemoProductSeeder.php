<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoProductSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@medeniyetpazari.com')->first();
        if (!$admin) {
            $this->command->warn('Admin user not found, skipping DemoProductSeeder.');
            return;
        }

        if ($admin->role !== 'seller' && $admin->role !== 'super_admin') {
            $admin->update(['role' => 'super_admin']);
        }

        $products = [
            [
                'category_id' => 3,   // Elbise
                'name' => 'Vintage Çiçek Desenli Midi Elbise',
                'description' => "Özel dokunuşlu vintage çiçek desenli midi elbise. Yüksek bel kesimi ve A-line silüeti ile her vücut tipine uygun şıklık sunar.\n\n• %100 Viskon kumaş\n• El yıkama önerilir\n• Renk: Krem/Yeşil\n• Beden: S-M-L-XL",
                'price' => 349.90,
                'discounted_price' => 249.90,
                'stock' => 15,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
            ],
            [
                'category_id' => 48,  // Erkek Tişört
                'name' => 'Premium Oversize Basic Tişört',
                'description' => "Kalın dokulu oversize kesimli premium basic tişört. Günlük kullanım için ideal.\n\n• %100 Pamuk (280gr)\n• Makine yıkama\n• Renk: Siyah/Beyaz/Gri\n• Beden: XS-XXL",
                'price' => 199.90,
                'discounted_price' => null,
                'stock' => 30,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            ],
            [
                'category_id' => 130, // Cep Telefonu
                'name' => 'iPhone 13 Pro Max 256GB Grafit',
                'description' => "Az kullanılmış, kutusunda, orijinal aksesuarları tam. Pil sağlığı %94.\n\n• iOS 17 güncellemesi yapıldı\n• Kamera camı temiz, gövdede minimal çizik\n• Fatura ve kutu mevcut\n• Garanti: Sona ermiş",
                'price' => 45000,
                'discounted_price' => 42000,
                'stock' => 1,
                'condition' => 'lightly_used',
                'cover' => 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80',
            ],
            [
                'category_id' => 188, // Nemlendirici
                'name' => 'Hyaluronik Asit Serum + Nemlendirici Set',
                'description' => "Kore kökenli 2'li cilt bakım seti. Aydınlatıcı ve nemlendirici etkisi ile her gün kullanıma uygun.\n\n• Hyaluronik Asit Serum 30ml\n• Ceramide Nemlendirici 50ml\n• Parfümsüz, vegan formül\n• Tüm cilt tipine uygun",
                'price' => 389.90,
                'discounted_price' => 299.90,
                'stock' => 20,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
            ],
            [
                'category_id' => 207, // Roman
                'name' => 'Kuyucaklı Yusuf - Sabahattin Ali',
                'description' => "Türk edebiyatının başyapıtlarından biri. Orta çağ Anadolu'sunda geçen bu roman, aşkı, ihaneti ve toplumsal baskıyı ele alır.\n\n• Yayınevi: Yapı Kredi Yayınları\n• Sayfa: 224\n• ISBN: 978-975-363-197-5\n• Durum: Çok az okunmuş",
                'price' => 85,
                'discounted_price' => 70,
                'stock' => 5,
                'condition' => 'lightly_used',
                'cover' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
            ],
            [
                'category_id' => 167, // Yoga Matı
                'name' => 'Profesyonel 6mm Yoga & Pilates Matı',
                'description' => "Kaymaz yüzeyiyle ekstra tutuş sağlayan, 6mm kalınlığında premium yoga matı.\n\n• Eco-Friendly TPE malzeme\n• Çift taraflı kullanım\n• Taşıma askısı dahil\n• Boyut: 183 x 61 cm",
                'price' => 450,
                'discounted_price' => 329,
                'stock' => 12,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
            ],
            [
                'category_id' => 101, // Nevresim
                'name' => 'Pamuk Saten King Size Nevresim Takımı',
                'description' => "Nefes alan pamuk saten kumaşından üretilmiş, 4 parçalı lüks nevresim takımı.\n\n• %100 pamuk saten\n• 200 iplik sayısı\n• King size (240x220)\n• 2 yastık kılıfı dahil\n• Renk: Krem/Taş",
                'price' => 1250,
                'discounted_price' => 899,
                'stock' => 8,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
            ],
            [
                'category_id' => 26,  // Çanta
                'name' => 'Hakiki Deri Omuz Çantası — Kahverengi',
                'description' => "El yapımı gerçek deri, zamansız tasarım. Günlük kullanım ve özel günler için ideal.\n\n• %100 Hakiki Sığır Derisi\n• Fermuar + Manyetik kapaklı\n• İç cep: 3 bölüm\n• Boyut: 30x25x10cm\n• Omuz askısı ayarlanabilir",
                'price' => 2800,
                'discounted_price' => null,
                'stock' => 3,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            ],
            [
                'category_id' => 136, // Laptop
                'name' => 'MacBook Air M2 13" 8GB/256GB Gece Yarısı',
                'description' => "2022 model, az kullanılmış MacBook Air M2. Kutusu ve aksesuarları tam.\n\n• Apple M2 çip (8 çekirdekli CPU)\n• 8GB Unified Memory\n• 256GB SSD\n• Pil sağlığı: %97\n• Garanti bitiş: Aralık 2025",
                'price' => 42000,
                'discounted_price' => 38500,
                'stock' => 1,
                'condition' => 'lightly_used',
                'cover' => 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
            ],
            [
                'category_id' => 210, // Din & Tasavvuf
                'name' => 'Mesnevi Şerhi — Hz. Mevlana (5 Cilt)',
                'description' => "Hz. Mevlana'nın başyapıtı Mesnevi'nin Türkçe açıklamalı 5 ciltlik şerhi. Tasavvuf edebiyatının temel kaynak eseri.\n\n• Yayınevi: Türkiye Diyanet Vakfı\n• Toplam 2400+ sayfa\n• Sert kapak, lüks baskı\n• Durum: Hiç okunmamış",
                'price' => 650,
                'discounted_price' => 520,
                'stock' => 4,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80',
            ],
            [
                'category_id' => 109, // Mum & Aroma
                'name' => 'El Yapımı Soya Mum Seti — Lavanta & Vanilya',
                'description' => "Doğal soya mumundan el yapımı, aromatik iç mekan mum seti.\n\n• %100 soya mumu\n• Lavanta & Vanilya esansiyel yağ\n• Yanma süresi: 40-50 saat\n• 3'lü set (180ml x3)\n• Hediye kutusunda",
                'price' => 280,
                'discounted_price' => 229,
                'stock' => 18,
                'condition' => 'new',
                'cover' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
            ],
            [
                'category_id' => 67,  // Erkek Saat
                'name' => 'Seiko 5 Otomatik Erkek Kol Saati',
                'description' => "Japon işçiliğinin simgesi Seiko 5 serisi otomatik kol saati. Koleksiyondan çıkıyor.\n\n• Otomatik mekanizma (21 mücevher)\n• Su direnci: 100m\n• Çelik kasa ve bileklik\n• Yıl: 2021 alım, çok az kullanıldı\n• Kutu ve etiket tam",
                'price' => 8500,
                'discounted_price' => 7200,
                'stock' => 1,
                'condition' => 'lightly_used',
                'cover' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            ],
        ];

        foreach ($products as $pd) {
            $slug = Str::slug($pd['name']) . '-' . Str::random(6);

            $product = Product::create([
                'seller_id'       => $admin->id,
                'category_id'     => $pd['category_id'],
                'name'            => $pd['name'],
                'slug'            => $slug,
                'description'     => $pd['description'],
                'price'           => $pd['price'],
                'discounted_price'=> $pd['discounted_price'],
                'stock'           => $pd['stock'],
                'condition'       => $pd['condition'],
                'status'          => 'approved',
                'is_active'       => true,
            ]);

            ProductImage::create([
                'product_id'     => $product->id,
                'path'           => $pd['cover'],
                'thumbnail_path' => $pd['cover'],
                'sort_order'     => 0,
                'is_cover'       => true,
            ]);
        }

        $this->command->info('✓ 12 demo ürün eklendi.');
    }
}
