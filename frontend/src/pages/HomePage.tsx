import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag, Shield, Truck, Users, ArrowRight, Star,
  ChevronRight, Heart, Sparkles, Tag, TrendingUp, Flame, Zap, Award, Clock, ChevronLeft
} from 'lucide-react'
import api from '@/lib/api'
import type { Product } from '@/types'

const HERO_SLIDES = [
  {
    image: '/Gemini Resim-1.jpg',
    title: 'Güvenli alışverişin',
    highlight: 'yeni adresi.',
    desc: 'Binlerce ürün, güvenilir satıcılar ve referans sistemi ile büyüyen bir topluluk.',
    accent: '#E2B93B',
  },
  {
    image: '/Gemini Resim-2.jpg',
    title: 'En kaliteli ürünler',
    highlight: 'tek adreste.',
    desc: 'Moda, teknoloji, ev, kozmetik ve daha fazlası — hepsi onaylı satıcılardan.',
    accent: '#10b981',
  },
]


const FEATURES = [
  { icon: Shield, title: 'Güvenli Alışveriş', desc: 'Alıcı güvencesi, güvenli ödeme altyapısı', color: '#0F5EA8', bg: '#eff6ff' },
  { icon: Truck, title: 'Hızlı Kargo', desc: 'Satıcı kargo seçer, takip kodu aninda güncellenir', color: '#059669', bg: '#ecfdf5' },
  { icon: Users, title: 'Referans Sistemi', desc: 'Arkadaşını davet et, birlikte büyü', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: ShoppingBag, title: 'Hem Al Hem Sat', desc: 'Tek hesapla alıcı ve satıcı olabilirsin', color: '#d97706', bg: '#fffbeb' },
]

const CAMPAIGN_BANNERS = [
  { emoji: '💻', title: 'Elektronik Fırsatları', subtitle: "%30'a varan indirim", color: '#0F5EA8', bg: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)', link: '/urunler?category=elektronik' },
  { emoji: '👗', title: 'Moda & Giyim', subtitle: 'Yeni sezon koleksiyonu', color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)', link: '/urunler?category=moda' },
  { emoji: '🏠', title: 'Ev & Yaşam', subtitle: 'Evinizi güzelleştirin', color: '#059669', bg: 'linear-gradient(135deg,#059669,#10b981)', link: '/urunler?category=ev-yasam' },
  { emoji: '💄', title: 'Kozmetik', subtitle: 'Doğal & helal ürünler', color: '#db2777', bg: 'linear-gradient(135deg,#db2777,#ec4899)', link: '/urunler?category=kozmetik' },
]

function ProductCard({ product, badge, badgeColor }: { product: Product; badge?: string; badgeColor?: string }) {
  const discount = product.discounted_price ? Math.round((1 - product.current_price / product.price) * 100) : 0
  const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'

  return (
    <Link to={`/urunler/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ borderRadius: 18, border: '1.5px solid #e8edf2', overflow: 'hidden', background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-6px)'
          el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'
          el.style.borderColor = '#0F5EA8'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = ''
          el.style.boxShadow = ''
          el.style.borderColor = '#e8edf2'
        }}>
        <div style={{ aspectRatio: '1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {product.cover_image
            ? <img src={product.cover_image} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display') }}
              />
            : null}
          <ShoppingBag style={{ width: 44, height: 44, color: '#e2e8f0', display: product.cover_image ? 'none' : 'block' }} />
          {badge && (
            <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 800, background: badgeColor ?? '#f97316', color: '#fff', padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 10, fontWeight: 800, background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>
              -{discount}%
            </span>
          )}
          <button style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
            onClick={e => e.preventDefault()}>
            <Heart style={{ width: 14, height: 14, color: '#94a3b8' }} />
          </button>
        </div>
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#0F5EA8', background: '#eff6ff', padding: '3px 8px', borderRadius: 999, display: 'inline-block', marginBottom: 8 }}>
            {(product as any).condition_label || (product as any).condition}
          </span>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#0F5EA8' }}>
              {fmt(product.current_price)}
            </span>
            {product.discounted_price && (
              <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>
                {fmt(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({
  icon: Icon, iconBg, iconColor, title, subtitle, linkTo, linkColor, linkBg,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string
  title: string; subtitle: string; linkTo: string; linkColor: string; linkBg: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Icon style={{ width: 22, height: 22, color: iconColor }} />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{title}</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</p>
        </div>
      </div>
      <Link to={linkTo} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: linkColor, textDecoration: 'none', padding: '8px 16px', background: linkBg, borderRadius: 12, transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
        Tümünü Gör <ChevronRight style={{ width: 14, height: 14 }} />
      </Link>
    </div>
  )
}

export default function HomePage() {
  const [slideIdx, setSlideIdx] = useState(0)

  const nextSlide = useCallback(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), [])
  const prevSlide = useCallback(() => setSlideIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [])

  useEffect(() => {
    const t = setInterval(nextSlide, 5000)
    return () => clearInterval(t)
  }, [nextSlide])

  const { data: popularProducts } = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: async () => { const { data } = await api.get('/products?per_page=8&sort=popular'); return data.data.data as Product[] },
  })

  const { data: latestProducts } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: async () => { const { data } = await api.get('/products?per_page=8&sort=newest'); return data.data.data as Product[] },
  })

  const { data: dealProducts } = useQuery({
    queryKey: ['products', 'deals'],
    queryFn: async () => { const { data } = await api.get('/products?per_page=8&sort=price_asc'); return data.data.data as Product[] },
  })

  return (
    <div className="animate-fade-in">

      {/* ─── HERO SLIDER ─── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 'min(100vw, 90vh)' }}>
        {/* Slide backgrounds — img ile kırpma olmadan tam görünüm */}
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={i}
            src={slide.image}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              objectPosition: 'center center',
              opacity: slideIdx === i ? 1 : 0,
              transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
              filter: 'brightness(0.55)',
              background: '#05142b',
            }}
          />
        ))}

        {/* Gradient overlay — lighter so images show through */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, rgba(10,30,80,0.72) 0%, rgba(15,65,140,0.50) 55%, rgba(20,100,180,0.30) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Ambient blobs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: 60, width: 480, height: 480, background: `${HERO_SLIDES[slideIdx].accent}22`, borderRadius: '50%', filter: 'blur(90px)', transition: 'background 1s' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 360, height: 360, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', filter: 'blur(80px)' }} />
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 20px', position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', minHeight: 480 }}>
          <div style={{ maxWidth: 700 }}>
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

            {HERO_SLIDES.map((slide, i) => (
              <div key={i} style={{
                opacity: slideIdx === i ? 1 : 0,
                transform: slideIdx === i ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                position: slideIdx === i ? 'relative' : 'absolute',
                pointerEvents: slideIdx === i ? 'auto' : 'none',
              }}>
                <h1 style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 22, letterSpacing: '-0.03em' }}>
                  {slide.title}<br />
                  <span style={{ color: slide.accent, transition: 'color 0.6s' }}>{slide.highlight}</span>
                </h1>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', marginBottom: 40, lineHeight: 1.7, maxWidth: 520 }}>
                  {slide.desc}
                </p>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
              <Link to="/urunler" className="btn btn-accent" style={{ fontSize: 15 }}>
                Ürünleri Keşfet <ArrowRight style={{ width: 17, height: 17 }} />
              </Link>
              <Link to="/kayit" className="btn btn-ghost" style={{ fontSize: 15 }}>
                Ücretsize Kayıt Ol
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 36, marginBottom: 40 }}>
              {[['12+', 'Ürün'], ['100%', 'Güvenli'], ['7/24', 'Destek']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#E2B93B' }}>{val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: 600 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button onClick={prevSlide} aria-label="Geri" style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
          <ChevronLeft style={{ width: 20, height: 20 }} />
        </button>
        <button onClick={nextSlide} aria-label="İleri" style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
          <ChevronRight style={{ width: 20, height: 20 }} />
        </button>

        {/* Dot indicators */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, zIndex: 10,
        }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Slayt ${i + 1}`} style={{
              width: slideIdx === i ? 28 : 8, height: 8, borderRadius: 999,
              background: slideIdx === i ? '#E2B93B' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width 0.35s ease, background 0.35s ease',
            }} />
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: -36, position: 'relative', zIndex: 10 }}>
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
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

      {/* ─── KAMPANYA BANNERʼLARI ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {CAMPAIGN_BANNERS.map(banner => (
            <Link key={banner.title} to={banner.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: banner.bg, borderRadius: 20, padding: '28px 24px',
                display: 'flex', alignItems: 'center', gap: 18,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)' }}>
                <span style={{ fontSize: 36, lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{banner.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{banner.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{banner.subtitle}</div>
                </div>
                <ChevronRight style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.7)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── ÇOK SATANLAR ─── */}
      {popularProducts && popularProducts.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 0' }}>
          <SectionHeader
            icon={Flame} iconBg="#fff7ed" iconColor="#f97316"
            title="Çok Satanlar" subtitle="En çok ilgi gören ürünler"
            linkTo="/urunler?sort=popular" linkColor="#f97316" linkBg="#fff7ed"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {popularProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} badge={`🔥 #${idx + 1}`} badgeColor="#f97316" />
            ))}
          </div>
        </section>
      )}

      {/* ─── FıRSATLAR / İNDİRİMLİ ─── */}
      {dealProducts && dealProducts.filter(p => p.discounted_price).length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 0' }}>
          <SectionHeader
            icon={Tag} iconBg="#fff5f5" iconColor="#ef4444"
            title="Fırsatlar" subtitle="Sınırlı süre indirimli ürünler"
            linkTo="/urunler" linkColor="#ef4444" linkBg="#fff5f5"
          />
          {/* Big deal highlight */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {dealProducts.filter(p => p.discounted_price).slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ─── STAT BAR ─── */}
      <section style={{ background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)', margin: '72px 0 0', padding: '48px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
            {[
              { icon: Award, val: '500+', lbl: 'Güvenilir Satıcı', desc: 'Doğrulanmış satıcılar' },
              { icon: ShoppingBag, val: '10K+', lbl: 'Aktif İlan', desc: 'Her kategoride ürün' },
              { icon: Zap, val: '%100', lbl: 'Güvenli Ödeme', desc: 'Alıcı güvencesi' },
              { icon: Clock, val: '7/24', lbl: 'Destek', desc: 'Her zaman yanınızdayız' },
            ].map(({ icon: Icon, val, lbl, desc }) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{lbl}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── YENİ EKLENENLER ─── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 20px 80px' }}>
        <SectionHeader
          icon={TrendingUp} iconBg="#eff6ff" iconColor="#0F5EA8"
          title="Yeni Eklenenler" subtitle="En güncel ürünleri keşfedin"
          linkTo="/urunler?sort=newest" linkColor="#0F5EA8" linkBg="#eff6ff"
        />

        {latestProducts && latestProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
            {latestProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #dbeafe', borderRadius: 20, padding: '56px 32px', textAlign: 'center' }}>
            <ShoppingBag style={{ width: 40, height: 40, color: '#0F5EA8', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
              İlk ilanı sen ekle!
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
              Satıcı panelinden hemen ilan verebilirsin.
            </p>
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
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e' }}>
              Neden Medeniyet Pazarı?
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', marginTop: 8 }}>
              Güven, kalite ve topluluk odaklı alışveriş deneyimi
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {[
              { icon: '🛡️', title: 'Alıcı Güvencesi', desc: 'Sorun yaşarsınız geri ödeme garantisi. Satıcı değerlendirme sistemi ile güvenli alışveriş.' },
              { icon: '🤝', title: 'Güvenilir Satıcılar', desc: 'Her satıcı kimlik doğrulamasından geçer. Ürünler admin onayından sonra yayımlanır.' },
              { icon: '💎', title: 'Kaliteli Ürünler', desc: 'Yeni ve az kullanılmış, incelenmiş ve onaylanmış ürünler. Sürpriz yok.' },
              { icon: '🌐', title: 'İslami Değerler', desc: 'Helal hassasiyetli, İslami değerlere uygun bir pazar yeri anlayışı.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1.5px solid #e8edf2', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)' }}>
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
            Kayıt tamamen ücretsiz ve aninda aktif.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/kayit" className="btn" style={{ background: '#1a1a2e', color: '#E2B93B', fontSize: 15 }}>
              Ücresiz Hesap Aç <ArrowRight style={{ width: 17, height: 17 }} />
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
