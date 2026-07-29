<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\District;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['01','Adana',['Seyhan','Çukurova','Yüreğir','Sarıçam','Ceyhan','Kozan','İmamoğlu','Karaisalı','Pozantı','Aladağ','Feke','Karataş','Saimbeyli','Tufanbeyli','Yumurtalık']],
            ['02','Adıyaman',['Merkez','Kahta','Besni','Gölbaşı','Gerger','Samsat','Çelikhan','Sincik','Tut']],
            ['03','Afyonkarahisar',['Merkez','Sandıklı','Dinar','Bolvadin','Emirdağ','Çay','İhsaniye','Sultandağı','Sinanpaşa','Şuhut','Başmakçı','Bayat','İscehisar','Çobanlar','Dazkırı','Evciler','Hocalar','Kızılören']],
            ['04','Ağrı',['Merkez','Doğubayazıt','Patnos','Diyadin','Eleşkirt','Taşlıçay','Tutak','Hamur']],
            ['05','Amasya',['Merkez','Merzifon','Suluova','Taşova','Göynücek','Gümüşhacıköy','Hamamözü']],
            ['06','Ankara',['Çankaya','Keçiören','Mamak','Yenimahalle','Sincan','Etimesgut','Altındağ','Pursaklar','Gölbaşı','Polatlı','Çubuk','Kahramankazan','Beypazarı','Haymana','Şereflikoçhisar','Ayaş','Bala','Elmadağ','Kalecik','Kızılcahamam','Nallıhan','Evren','Güdül','Akyurt','Çamlıdere']],
            ['07','Antalya',['Muratpaşa','Kepez','Konyaaltı','Aksu','Döşemealtı','Alanya','Manavgat','Serik','Kumluca','Kaş','Kemer','Finike','Gazipaşa','Elmalı','Korkuteli','Akseki','Demre','Gündoğmuş','İbradı']],
            ['08','Artvin',['Merkez','Hopa','Borçka','Arhavi','Şavşat','Yusufeli','Ardanuç','Murgul']],
            ['09','Aydın',['Efeler','Nazilli','Söke','Kuşadası','Didim','Çine','Germencik','İncirliova','Köşk','Sultanhisar','Bozdoğan','Buharkent','Karpuzlu','Karacasu','Koçarlı','Yenipazar','Kuyucak']],
            ['10','Balıkesir',['Altıeylül','Karesi','Bandırma','Edremit','Gönen','Susurluk','Bigadiç','Dursunbey','Erdek','Havran','Burhaniye','İvrindi','Manyas','Savaştepe','Sındırgı','Balya','Marmara']],
            ['11','Bilecik',['Merkez','Bozüyük','Söğüt','Osmaneli','Pazaryeri','Gölpazarı','İnhisar','Yenipazar']],
            ['12','Bingöl',['Merkez','Genç','Solhan','Karlıova','Adaklı','Kiğı','Yayladere','Yedisu']],
            ['13','Bitlis',['Merkez','Tatvan','Ahlat','Güroymak','Adilcevaz','Hizan','Mutki']],
            ['14','Bolu',['Merkez','Mudurnu','Göynük','Mengen','Gerede','Seben','Dörtdivan','Kıbrıscık','Yeniçağa']],
            ['15','Burdur',['Merkez','Bucak','Gölhisar','Yeşilova','Ağlasun','Çavdır','Çeltikçi','Altınyayla','Karamanlı','Kemer','Tefenni']],
            ['16','Bursa',['Osmangazi','Yıldırım','Nilüfer','İnegöl','Gemlik','Mudanya','Mustafakemalpaşa','Orhangazi','Kestel','Gürsu','Karacabey','Yenişehir','İznik','Orhaneli','Büyükorhan','Harmancık','Keles']],
            ['17','Çanakkale',['Merkez','Biga','Çan','Gelibolu','Ayvacık','Bayramiç','Ezine','Lapseki','Yenice','Bozcaada','Gökçeada']],
            ['18','Çankırı',['Merkez','Çerkeş','Ilgaz','Kurşunlu','Orta','Şabanözü','Yapraklı','Atkaracalar','Bayramören','Eldivan','Kızılırmak','Korgun','Sabanozu']],
            ['19','Çorum',['Merkez','Sungurlu','Osmancık','Alaca','İskilip','Bayat','Kargı','Boğazkale','Dodurga','Laçin','Mecitözü','Oğuzlar','Ortaköy','Uğurludağ']],
            ['20','Denizli',['Merkezefendi','Pamukkale','Çivril','Acıpayam','Tavas','Buldan','Sarayköy','Çal','Honaz','Serinhisar','Güney','Baklan','Kale','Çameli','Çardak','Bozkurt','Beyağaç','Babadağ']],
            ['21','Diyarbakır',['Bağlar','Kayapınar','Sur','Yenişehir','Bismil','Ergani','Çınar','Silvan','Dicle','Hani','Lice','Kulp','Hazro','Eğil','Kocaköy','Çermik','Çüngüş']],
            ['22','Edirne',['Merkez','Keşan','Uzunköprü','İpsala','Havsa','Enez','Lalapaşa','Meriç','Süloğlu']],
            ['23','Elazığ',['Merkez','Kovancılar','Karakoçan','Keban','Baskil','Palu','Maden','Sivrice','Arıcak','Alacakaya','Ağın']],
            ['24','Erzincan',['Merkez','Tercan','Üzümlü','Refahiye','Çayırlı','İliç','Kemaliye','Kemah','Otlukbeli']],
            ['25','Erzurum',['Yakutiye','Palandöken','Aziziye','Horasan','Oltu','Pasinler','Hınıs','Aşkale','İspir','Karayazı','Narman','Tekman','Tortum','Çat','Köprüköy','Karaçoban','Şenkaya','Uzundere','Pazaryolu','Olur']],
            ['26','Eskişehir',['Odunpazarı','Tepebaşı','Çifteler','Sivrihisar','Alpu','Mahmudiye','Beylikova','Han','İnönü','Mihalgazi','Mihalıççık','Sarıcakaya','Seyitgazi','Günyüzü']],
            ['27','Gaziantep',['Şahinbey','Şehitkamil','Nizip','İslahiye','Nurdağı','Oğuzeli','Araban','Karkamış','Yavuzeli']],
            ['28','Giresun',['Merkez','Bulancak','Görele','Espiye','Tirebolu','Keşap','Piraziz','Şebinkarahisar','Alucra','Güce','Çamoluk','Çanakçı','Doğankent','Dereli','Yağlıdere']],
            ['29','Gümüşhane',['Merkez','Kelkit','Şiran','Torul','Köse','Kürtün']],
            ['30','Hakkari',['Merkez','Yüksekova','Çukurca','Şemdinli','Derecik']],
            ['31','Hatay',['Antakya','İskenderun','Defne','Dörtyol','Erzin','Kırıkhan','Reyhanlı','Samandağ','Arsuz','Payas','Belen','Altınözü','Hassa','Kumlu','Yayladağı']],
            ['32','Isparta',['Merkez','Yalvaç','Eğirdir','Şarkikaraağaç','Gelendost','Senirkent','Keçiborlu','Atabey','Gönen','Uluborlu','Aksu','Sütçüler','Yenişarbademli']],
            ['33','Mersin',['Yenişehir','Mezitli','Toroslar','Akdeniz','Tarsus','Silifke','Erdemli','Anamur','Mut','Gülnar','Aydıncık','Bozyazı','Çamlıyayla']],
            ['34','İstanbul',['Kadıköy','Üsküdar','Ataşehir','Maltepe','Kartal','Pendik','Tuzla','Beykoz','Çekmeköy','Sancaktepe','Sultanbeyli','Ümraniye','Adalar','Şile','Beyoğlu','Beşiktaş','Şişli','Kağıthane','Sarıyer','Eyüpsultan','Fatih','Bayrampaşa','Zeytinburnu','Bakırköy','Bahçelievler','Bağcılar','Güngören','Esenler','Başakşehir','Arnavutköy','Sultangazi','Gaziosmanpaşa','Küçükçekmece','Avcılar','Esenyurt','Beylikdüzü','Büyükçekmece','Silivri','Çatalca']],
            ['35','İzmir',['Konak','Buca','Karabağlar','Bornova','Karşıyaka','Bayraklı','Çiğli','Gaziemir','Balçova','Narlıdere','Güzelbahçe','Torbalı','Menemen','Bergama','Ödemiş','Tire','Aliağa','Kemalpaşa','Seferihisar','Urla','Foça','Çeşme','Dikili','Kiraz','Bayındır','Beydağ','Karaburun','Menderes','Selçuk']],
            ['36','Kars',['Merkez','Sarıkamış','Kağızman','Selim','Arpaçay','Digor','Akyaka','Susuz']],
            ['37','Kastamonu',['Merkez','Tosya','Taşköprü','İnebolu','Araç','Cide','Daday','Devrekani','Çatalzeytin','Küre','Abana','Şenpazar','İhsangazi','Azdavay','Seydiler','Doğanyurt','Hanönü','Pınarbaşı']],
            ['38','Kayseri',['Melikgazi','Kocasinan','Talas','Hacılar','İncesu','Develi','Bünyan','Yahyalı','Pınarbaşı','Sarıoğlan','Tomarza','Yeşilhisar','Akkışla','Felahiye','Özvatan','Sarız']],
            ['39','Kırklareli',['Merkez','Lüleburgaz','Babaeski','Vize','Demirköy','Pehlivanköy','Pınarhisar','Kofçaz']],
            ['40','Kırşehir',['Merkez','Kaman','Mucur','Çiçekdağı','Akpınar','Boztepe','Akçakent']],
            ['41','Kocaeli',['İzmit','Gebze','Darıca','Çayırova','Dilovası','Körfez','Derince','Gölcük','Kandıra','Kartepe','Başiskele','Karamürsel']],
            ['42','Konya',['Selçuklu','Meram','Karatay','Ereğli','Akşehir','Beyşehir','Cihanbeyli','Kulu','Sarayönü','Seydişehir','Ilgın','Karapınar','Çumra','Bozkır','Hadım','Doğanhisar','Emirgazi','Güneysınır','Halkapınar','Hüyük','Kadınhanı','Taşkent','Tuzlukçu','Yalıhüyük','Ahırlı','Altınekin','Derebucak','Derbent']],
            ['43','Kütahya',['Merkez','Tavşanlı','Simav','Emet','Gediz','Altıntaş','Domaniç','Aslanapa','Dumlupınar','Çavdarhisar','Hisarcık','Pazarlar','Şaphane']],
            ['44','Malatya',['Battalgazi','Yeşilyurt','Doğanşehir','Akçadağ','Darende','Hekimhan','Arguvan','Arapgir','Yazıhan','Pütürge','Kale','Kuluncak','Doğanyol']],
            ['45','Manisa',['Şehzadeler','Yunusemre','Akhisar','Turgutlu','Soma','Salihli','Saruhanlı','Demirci','Kula','Alaşehir','Gördes','Kırkağaç','Sarıgöl','Ahmetli','Gölmarmara','Köprübaşı','Selendi']],
            ['46','Kahramanmaraş',['Dulkadiroğlu','Onikişubat','Elbistan','Afşin','Göksun','Pazarcık','Türkoğlu','Andırın','Çağlayancerit','Ekinözü','Nurhak']],
            ['47','Mardin',['Artuklu','Kızıltepe','Midyat','Nusaybin','Derik','Mazıdağı','Ömerli','Savur','Dargeçit','Yeşilli']],
            ['48','Muğla',['Menteşe','Bodrum','Fethiye','Marmaris','Milas','Dalaman','Ortaca','Datça','Köyceğiz','Kavaklıdere','Seydikemer','Ula','Yatağan']],
            ['49','Muş',['Merkez','Bulanık','Malazgirt','Varto','Hasköy','Korkut']],
            ['50','Nevşehir',['Merkez','Ürgüp','Avanos','Gülşehir','Hacıbektaş','Acıgöl','Derinkuyu','Kozaklı']],
            ['51','Niğde',['Merkez','Bor','Ulukışla','Çiftlik','Altunhisar','Çamardı']],
            ['52','Ordu',['Altınordu','Ünye','Fatsa','Perşembe','Korgan','Kumru','Akkuş','Gölköy','Mesudiye','Aybastı','Ulubey','Çamaş','Çatalpınar','Çaybaşı','Gülyalı','Gürgentepe','İkizce','Kabadüz','Kabataş']],
            ['53','Rize',['Merkez','Çayelı','Ardeşen','Pazar','Fındıklı','Çamlıhemşin','Güneysu','İkizdere','Derepazarı','İyidere','Hemşin','Kalkandere']],
            ['54','Sakarya',['Adapazarı','Serdivan','Erenler','Arifiye','Hendek','Akyazı','Geyve','Sapanca','Karasu','Kocaali','Kaynarca','Söğütlü','Ferizli','Pamukova','Taraklı','Karapürçek']],
            ['55','Samsun',['İlkadım','Atakum','Canik','Tekkeköy','Bafra','Çarşamba','Vezirköprü','Havza','Terme','Ladik','Kavak','Alaçam','Asarcık','Ayvacık','Salıpazarı','Yakakent','19Mayıs']],
            ['56','Siirt',['Merkez','Kurtalan','Baykan','Eruh','Pervari','Şirvan','Tillo']],
            ['57','Sinop',['Merkez','Boyabat','Gerze','Ayancık','Türkeli','Durağan','Erfelek','Dikmen','Saraydüzü']],
            ['58','Sivas',['Merkez','Şarkışla','Yıldızeli','Gemerek','Suşehri','Zara','Kangal','Divriği','Hafik','Gürün','İmranlı','Koyulhisar','Akıncılar','Altınyayla','Doğanşar','Gölova','Ulaş']],
            ['59','Tekirdağ',['Süleymanpaşa','Çorlu','Çerkezköy','Kapaklı','Ergene','Hayrabolu','Malkara','Muratlı','Saray','Şarköy','Marmaraereğlisi']],
            ['60','Tokat',['Merkez','Erbaa','Niksar','Turhal','Zile','Reşadiye','Almus','Artova','Başçiftlik','Pazar','Sulusaray','Yeşilyurt']],
            ['61','Trabzon',['Ortahisar','Akçaabat','Araklı','Of','Yomra','Arsin','Sürmene','Çarşıbaşı','Beşikdüzü','Vakfıkebir','Maçka','Tonya','Düzköy','Hayrat','Dernekpazarı','Köprübaşı','Çaykara','Şalpazarı']],
            ['62','Tunceli',['Merkez','Pertek','Çemişgezek','Hozat','Ovacık','Nazımiye','Pülümür','Mazgirt']],
            ['63','Şanlıurfa',['Eyyübiye','Haliliye','Karaköprü','Siverek','Viranşehir','Suruç','Akçakale','Birecik','Hilvan','Bozova','Ceylanpınar','Halfeti','Harran']],
            ['64','Uşak',['Merkez','Banaz','Eşme','Sivaslı','Ulubey','Karahallı']],
            ['65','Van',['İpekyolu','Tuşba','Edremit','Erciş','Özalp','Başkale','Çaldıran','Muradiye','Gürpınar','Gevaş','Çatak','Bahçesaray','Saray']],
            ['66','Yozgat',['Merkez','Sorgun','Yerköy','Akdağmadeni','Boğazlıyan','Çekerek','Sarıkaya','Şefaatli','Saraykent','Aydıncık','Kadışehri','Çandır','Çayıralan','Yenifakılı']],
            ['67','Zonguldak',['Merkez','Ereğli','Çaycuma','Devrek','Kozlu','Kilimli','Alaplı','Gökçebey']],
            ['68','Aksaray',['Merkez','Ortaköy','Güzelyurt','Eskil','Ağaçören','Gülağaç','Sarıyahşi','Sultanhanı']],
            ['69','Bayburt',['Merkez','Aydıntepe','Demirözü']],
            ['70','Karaman',['Merkez','Ermenek','Sarıveliler','Kazımkarabekir','Ayrancı','Başyayla']],
            ['71','Kırıkkale',['Merkez','Yahşihan','Keskin','Delice','Sulakyurt','Balışeyh','Bahşili','Çelebi','Karakeçili']],
            ['72','Batman',['Merkez','Kozluk','Sason','Beşiri','Gercüş','Hasankeyf']],
            ['73','Şırnak',['Merkez','Cizre','Silopi','İdil','Uludere','Beytüşşebap','Güçlükonak']],
            ['74','Bartın',['Merkez','Ulus','Kurucaşile','Amasra']],
            ['75','Ardahan',['Merkez','Göle','Çıldır','Hanak','Posof','Damal']],
            ['76','Iğdır',['Merkez','Tuzluca','Aralık','Karakoyunlu']],
            ['77','Yalova',['Merkez','Çiftlikköy','Çınarcık','Altınova','Armutlu','Termal']],
            ['78','Karabük',['Merkez','Safranbolu','Yenice','Eflani','Eskipazar','Ovacık']],
            ['79','Kilis',['Merkez','Musabeyli','Polateli','Elbeyli']],
            ['80','Osmaniye',['Merkez','Kadirli','Düziçi','Bahçe','Toprakkale','Hasanbeyli','Sumbas']],
            ['81','Düzce',['Merkez','Akçakoca','Cumayeri','Gölyaka','Çilimli','Gümüşova','Kaynaşlı','Yığılca']],
        ];

        foreach ($cities as [$plate, $name, $districts]) {
            $city = City::create(['name' => $name, 'plate_code' => $plate]);
            foreach ($districts as $districtName) {
                District::create(['city_id' => $city->id, 'name' => $districtName]);
            }
        }
    }
}
