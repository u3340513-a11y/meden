import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Shield, Truck, Users, ArrowRight, Star, ChevronRight, Heart, Sparkles, Tag, TrendingUp } from 'lucide-react'
import api from '@/lib/api'
import type { Category, Product } from '@/types'

const CATEGORY_ICONS: Record<string, string> = {
  'kadin': '👗', 'erkek': '👔', 'cocuk': '🧸', 'ev-yasam': '🏠',
  'elektronik': '💻', 'spor-outdoor': '⚽', 'kozmetik-kisisel-bakim': '💄',
  'kitap-hobi': '📚', 'anne-bebek': '🍼',
}

const CATEGORY_GRADS: Record<string, string> = {
  'kadin': 'linear-gradient(135deg,#f9a8d4,#ec4899)',
  'erkek': 'linear-gradient(135deg,#93c5fd,#3b82f6)',
  'cocuk': 'linear-gradient(135deg,#86efac,#22c55e)',
  'ev-yasam': 'linear-gradient(135deg,#fde68a,#f59e0b)',
  'elektronik': 'linear-gradient(135deg,#a5b4fc,#6366f1)',
  'spor-outdoor': 'linear-gradient(135deg,#6ee7b7,#10b981)',
  'kozmetik-kisisel-bakim': 'linear-gradient(135deg,#fca5a5,#ef4444)',
  'kitap-hobi': 'linear-gradient(135deg,#fdba74,#f97316)',
  'anne-bebek': 'linear-gradient(135deg,#d8b4fe,#a855f7)',
}

const features = [
  { icon: Shield, title: 'Güvenli Alışveriş', desc: 'Alıcı güvencesi, güvenli ödeme altyapısı', color: '#0F5EA8', bg: '#eff6ff' },
  { icon: Truck, title: 'Hızlı Kargo', desc: 'Satıcı kargo seçer, takip kodu anında güncellenir', color: '#059669', bg: '#ecfdf5' },
  { icon: Users, title: 'Referans Sistemi', desc: 'Arkadaşını davet et, birlikte büyü', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: ShoppingBag, title: 'Hem Al Hem Sat', desc: 'Tek hesapla alıcı ve satıcı olabilirsin', color: '#d97706', bg: '#fffbeb' },
]

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return (data.data as Category[]).filter((c: any) => !c.parent_id) },
  })

  const { data: latestProducts } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: async () => { const { data } = await api.get('/products?per_page=8&sort=newest'); return data.data.data as Product[] },
  })

  const { data: dealProducts } = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: async () => { const { data } = await api.get('/products?per_page=4&sort=price_asc'); return data.data.data as Product[] },
  })

  return (
    <div className="animate-fade-in">

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 580, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,46,100,0.96) 0%, rgba(15,94,168,0.88) 55%, rgba(26,127,212,0.80) 100%)',
        }} />
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: 60, width: 480, height: 480, background: 'rgba(226,185,59,0.12)', borderRadius: '50%', filter: 'blur(90px)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 360, height: 360, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 20px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60, alignItems: 'center' }}>
            {/* Text side */}
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '6px 16px', background: 'rgba(226,185,59,0.15)',
                border: '1px solid rgba(226,185,59,0.3)',
                borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#E2B93B',
                marginBottom: 28, backdropFilter: 'blur(8px)',
              }}>
                <Sparkles style={{ width: 13, height: 13 }} />
                Yeni nesil İslami pazar yeri
              </span>

              <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 22, letterSpacing: '-0.03em' }}>
                Güvenli alışverişin<br />
                <span style={{ color: '#E2B93B' }}>yeni adresi.</span>
              </h1>

              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.7, maxWidth: 500 }}>
                Binlerce ürün, güvenilir satıcılar ve referans sistemi ile büyüyen bir topluluk. Hemen katılın.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
                <Link to="/urunler" className="btn btn-accent" style={{ fontSize: 15 }}>
                  Ürünleri Keşfet <ArrowRight style={{ width: 17, height: 17 }} />
                </Link>
                <Link to="/kayit" className="btn btn-ghost" style={{ fontSize: 15 }}>
                  Ücretsiz Kayıt Ol
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 36 }}>
                {[['12+', 'Ürün'], ['100%', 'Güvenli'], ['7/24', 'Destek']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#E2B93B' }}>{val}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: 600 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating product preview card — son eklenen 3 ürün */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(latestProducts || []).slice(0, 3).map((p, i) => {
                const emoji = CATEGORY_ICONS[(p as any).category?.slug?.split('-')[0]] || '🛍️'
                const discount = p.discounted_price ? Math.round((1 - p.current_price / p.price) * 100) : 0
                const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'
                return (
                  <Link key={p.id} to={`/urunler/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 16, padding: '14px 18px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      transform: `translateX(${i * 8}px)`,
                      transition: 'transform 0.2s, background 0.2s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.12)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#E2B93B' }}>{fmt(p.current_price)}</span>
                          {p.discounted_price && (
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>{fmt(p.price)}</span>
                          )}
                        </div>
                      </div>
                      {discount > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#ef4444', color: '#fff', padding: '3px 7px', borderRadius: 6, flexShrink: 0 }}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: -36, position: 'relative', zIndex: 10 }}>
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="card card-hover" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 22, height: 22, color }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 5, color: '#1a1a2e' }}>{title}</h3>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      {categories && categories.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e' }}>Kategoriler</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>İhtiyacınız olan her şey burada</p>
            </div>
            <Link to="/urunler" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#0F5EA8', textDecoration: 'none', padding: '8px 14px', background: '#eff6ff', borderRadius: 10 }}>
              Tümünü Gör <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            {categories.map(cat => (
              <Link key={cat.id} to={`/urunler?category=${cat.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: 18, overflow: 'hidden', cursor: 'pointer', height: '100%', boxSizing: 'border-box',
                  background: CATEGORY_GRADS[cat.slug] || 'linear-gradient(135deg,#e2e8f0,#cbd5e1)',
                  padding: '22px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.15)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                  <span style={{ fontSize: 32, flexShrink: 0, width: 44, textAlign: 'center' }}>{CATEGORY_ICONS[cat.slug] || '🛍️'}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.35, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── DEALS / İNDİRİMLİ ─── */}
      {dealProducts && dealProducts.filter(p => p.discounted_price).length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag style={{ width: 20, height: 20, color: '#ef4444' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e' }}>Fırsatlar</h2>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Sınırlı süre indirimli ürünler</p>
              </div>
            </div>
            <Link to="/urunler" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#ef4444', textDecoration: 'none', padding: '8px 14px', background: '#fff5f5', borderRadius: 10 }}>
              Tümünü Gör <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 18 }}>
            {dealProducts.filter(p => p.discounted_price).slice(0, 4).map(product => {
              const discount = Math.round((1 - product.current_price / product.price) * 100)
              return (
                <Link key={product.id} to={`/urunler/${product.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ overflow: 'hidden', padding: 0, transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 24px rgba(0,0,0,0.1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                    <div style={{ width: 100, height: 100, flexShrink: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {product.cover_image
                        ? <img src={product.cover_image} alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display') }}
                          />
                        : null}
                      <ShoppingBag style={{ width: 32, height: 32, color: '#e2e8f0', display: product.cover_image ? 'none' : 'block' }} />
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1, position: 'relative' }}>
                      {discount > 0 && (
                        <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800, background: '#ef4444', color: '#fff', padding: '3px 7px', borderRadius: 6 }}>
                          -{discount}%
                        </span>
                      )}
                      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4, marginBottom: 8, paddingRight: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.name}
                      </h3>
                      <div style={{ fontSize: 17, fontWeight: 900, color: '#ef4444' }}>
                        {Number(product.current_price).toLocaleString('tr-TR')} ₺
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                        {Number(product.price).toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── NEW ARRIVALS ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: 20, height: 20, color: '#0F5EA8' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e' }}>Yeni Eklenenler</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>En güncel ürünleri keşfedin</p>
            </div>
          </div>
          <Link to="/urunler?sort=newest" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#0F5EA8', textDecoration: 'none', padding: '8px 14px', background: '#eff6ff', borderRadius: 10 }}>
            Tümünü Gör <ChevronRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        {latestProducts && latestProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {latestProducts.map(product => (
              <Link key={product.id} to={`/urunler/${product.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ borderRadius: 18, border: '1.5px solid #e8edf2', overflow: 'hidden', background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 14px 32px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#0F5EA8' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.borderColor = '#e8edf2' }}>
                  <div style={{ aspectRatio: '1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {product.cover_image
                      ? <img src={product.cover_image} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display') }}
                        />
                      : null}
                    <ShoppingBag style={{ width: 44, height: 44, color: '#e2e8f0', display: product.cover_image ? 'none' : 'block' }} />
                    {product.discounted_price && (
                      <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 800, background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>
                        İNDİRİM
                      </span>
                    )}
                    <button style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                      onClick={e => e.preventDefault()}>
                      <Heart style={{ width: 14, height: 14, color: '#94a3b8' }} />
                    </button>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0F5EA8', background: '#eff6ff', padding: '3px 8px', borderRadius: 999 }}>
                      {(product as any).condition_label || (product as any).condition}
                    </span>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginTop: 8, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#0F5EA8' }}>
                        {Number(product.current_price).toLocaleString('tr-TR')} ₺
                      </span>
                      {product.discounted_price && (
                        <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                          {Number(product.price).toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #dbeafe', borderRadius: 20, padding: '56px 32px', textAlign: 'center' }}>
            <ShoppingBag style={{ width: 40, height: 40, color: '#0F5EA8', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>İlk ilanı sen ekle!</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Satıcı panelinden hemen ilan verebilirsin.</p>
            <Link to="/satis/urunlerim" className="btn btn-primary">
              İlan Ver <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        )}
      </section>

      {/* ─── TRUST SECTION ─── */}
      <section style={{ background: 'linear-gradient(135deg,#f8fafc,#eff6ff)', padding: '64px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>Neden Medeniyet Pazarı?</h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 8 }}>Güven, kalite ve topluluk odaklı alışveriş deneyimi</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Alıcı Güvencesi', desc: 'Sorun yaşarsanız geri ödeme garantisi. Satıcı değerlendirme sistemi ile güvenli alışveriş.' },
              { icon: '🤝', title: 'Güvenilir Satıcılar', desc: 'Her satıcı kimlik doğrulamasından geçer. Ürünler admin onayından sonra yayımlanır.' },
              { icon: '💎', title: 'Kaliteli Ürünler', desc: 'Yeni ve az kullanılmış, incelenmiş ve onaylanmış ürünler. Sürpriz yok.' },
              { icon: '🌐', title: 'İslami Değerler', desc: 'Helal hassasiyetli, İslami değerlere uygun bir pazar yeri anlayışı.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1.5px solid #e8edf2', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ background: 'linear-gradient(135deg,#E2B93B 0%,#d4a82e 100%)', padding: '64px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <Star style={{ width: 34, height: 34, color: '#1a1a2e', margin: '0 auto 16px', opacity: 0.6 }} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: '#1a1a2e', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Hemen katıl, satışa başla!
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(26,26,46,0.65)', marginBottom: 32, lineHeight: 1.7 }}>
            Referans linkinle arkadaşlarını davet et, birlikte büyü.<br />
            Kayıt tamamen ücretsiz ve anında aktif.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/kayit" className="btn" style={{ background: '#1a1a2e', color: '#E2B93B', fontSize: 15 }}>
              Ücretsiz Hesap Aç <ArrowRight style={{ width: 17, height: 17 }} />
            </Link>
            <Link to="/urunler" className="btn" style={{ background: 'rgba(255,255,255,0.3)', color: '#1a1a2e', fontSize: 15, backdropFilter: 'blur(8px)' }}>
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
