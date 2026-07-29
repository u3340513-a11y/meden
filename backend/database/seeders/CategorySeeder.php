<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $tree = [
            'Kadın' => [
                'Giyim' => ['Elbise','Bluz','Pantolon','Etek','Ceket','Mont','Hırka','Triko','Gömlek','Tişört','Şort','Sweatshirt','Eşofman','Tayt','Tunik'],
                'Ayakkabı' => ['Topuklu','Düz Ayakkabı','Bot','Çizme','Sandalet','Terlik','Spor Ayakkabı'],
                'Çanta' => ['Omuz Çantası','El Çantası','Sırt Çantası','Cüzdan','Clutch'],
                'Aksesuar' => ['Takı','Saat','Şal & Eşarp','Şapka','Kemer','Gözlük'],
                'İç Giyim' => ['Sütyen','Külot','Pijama','Gecelik','Çorap'],
            ],
            'Erkek' => [
                'Giyim' => ['Gömlek','Tişört','Pantolon','Jean','Ceket','Mont','Sweatshirt','Triko','Şort','Takım Elbise','Eşofman','Yelek'],
                'Ayakkabı' => ['Klasik','Günlük','Spor Ayakkabı','Bot','Sandalet','Terlik'],
                'Aksesuar' => ['Saat','Kemer','Cüzdan','Kravat','Gözlük','Şapka'],
                'İç Giyim' => ['Boxer','Atlet','Çorap','Pijama'],
            ],
            'Çocuk' => [
                'Kız Çocuk' => ['Elbise','Üst Giyim','Alt Giyim','Dış Giyim','Ayakkabı','Aksesuar'],
                'Erkek Çocuk' => ['Üst Giyim','Alt Giyim','Dış Giyim','Ayakkabı','Aksesuar'],
                'Bebek' => ['Body & Tulum','Üst Giyim','Alt Giyim','Dış Giyim','Ayakkabı & Patik','Mama Önlüğü'],
            ],
            'Ev & Yaşam' => [
                'Ev Tekstili' => ['Nevresim Takımı','Yastık','Battaniye','Havlu','Perde','Halı','Kilim'],
                'Dekorasyon' => ['Mum & Aroma','Çerçeve','Vazo','Saat','Ayna','Tablo'],
                'Mutfak' => ['Tencere & Tava','Bardak & Kupa','Tabak','Saklama Kabı','Kesme Tahtası','Çatal & Bıçak'],
                'Banyo' => ['Sabunluk','Havluluk','Çöp Kovası','Banyo Paspası','Duş Perdesi'],
            ],
            'Elektronik' => [
                'Telefon' => ['Cep Telefonu','Tablet','Kılıf','Şarj & Kablo','Ekran Koruyucu'],
                'Bilgisayar' => ['Laptop','Monitör','Klavye & Mouse','Kulaklık','Webcam','USB Bellek'],
                'Oyun' => ['Oyun Konsolu','Oyun','Joystick','VR Gözlük'],
                'Fotoğraf' => ['Fotoğraf Makinesi','Objektif','Tripod','Fotoğraf Çantası'],
            ],
            'Spor & Outdoor' => [
                'Spor Giyim' => ['Tişört','Tayt','Şort','Sweatshirt','Spor Sütyeni','Eşofman'],
                'Spor Ayakkabı' => ['Koşu','Fitness','Yürüyüş','Basketbol','Futbol'],
                'Spor Ekipmanları' => ['Yoga Matı','Dambıl','Direnç Bandı','Atlama İpi','Pilates Topu'],
                'Outdoor' => ['Çadır','Uyku Tulumu','Matara','Kamp Sandalyesi','El Feneri'],
            ],
            'Kozmetik & Kişisel Bakım' => [
                'Makyaj' => ['Fondöten','Ruj','Maskara','Far','Allık','Kalem','Aydınlatıcı'],
                'Cilt Bakımı' => ['Nemlendirici','Temizleyici','Serum','Güneş Kremi','Maske','Tonik'],
                'Saç Bakımı' => ['Şampuan','Saç Kremi','Saç Maskesi','Saç Boyası','Şekillendirici'],
                'Parfüm' => ['Kadın Parfüm','Erkek Parfüm','Unisex','Deodorant'],
            ],
            'Kitap & Hobi' => [
                'Kitap' => ['Roman','Kişisel Gelişim','Tarih','Din & Tasavvuf','Çocuk Kitapları','Bilim'],
                'Kırtasiye' => ['Defter','Kalem','Planlayıcı','Sticker','Bant'],
                'Hobi' => ['Puzzle','Boyama','El Sanatları','Örgü & Nakış','Maket'],
            ],
            'Anne & Bebek' => [
                'Bebek Bakım' => ['Bebek Bezi','Islak Mendil','Bebek Şampuanı','Biberon','Emzik'],
                'Bebek Mobilya' => ['Bebek Yatağı','Mama Sandalyesi','Park Yatak','Bebek Arabası'],
                'Anne Sağlık' => ['Hamile Vitamini','Göğüs Pompası','Hamile Yastığı'],
            ],
        ];

        $sortOrder = 0;
        foreach ($tree as $mainName => $subCategories) {
            $main = Category::create([
                'name' => $mainName,
                'slug' => Str::slug($mainName),
                'sort_order' => $sortOrder++,
            ]);

            $subSort = 0;
            foreach ($subCategories as $subName => $items) {
                $sub = Category::create([
                    'name' => $subName,
                    'slug' => Str::slug($mainName . '-' . $subName),
                    'parent_id' => $main->id,
                    'sort_order' => $subSort++,
                ]);

                $itemSort = 0;
                foreach ($items as $itemName) {
                    Category::create([
                        'name' => $itemName,
                        'slug' => Str::slug($mainName . '-' . $subName . '-' . $itemName),
                        'parent_id' => $sub->id,
                        'sort_order' => $itemSort++,
                    ]);
                }
            }
        }
    }
}
