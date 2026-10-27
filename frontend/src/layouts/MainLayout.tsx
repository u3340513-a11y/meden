import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, LayoutGrid } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import type { Category } from '@/types'

const SLUG_EMOJI: Record<string, string> = {
  'elektronik': '💻', 'moda': '🧕', 'kadin': '🧕', 'erkek': '👔', 'cocuk': '🧸',
  'ev-yasam': '🏠', 'anne-bebek': '🍼', 'spor-outdoor': '⚽',
  'kozmetik-kisisel-bakim': '🧴', 'kitap-kirtasiye': '📖', 'kitap-hobi': '📚',
  'oyuncak-hobi': '🎮', 'otomotiv-aksesuar': '🚗', 'supermarket': '🛒',
}
const FALLBACK_EMOJIS = ['🎁', '🌟', '✨', '🎯', '💎', '🔑', '🎪', '🏷']

function getCatEmoji(cat: Category, idx: number): string {
  const slug = (cat as any).slug as string | undefined
  if (slug && SLUG_EMOJI[slug]) return SLUG_EMOJI[slug]
  if (slug) {
    const entry = Object.entries(SLUG_EMOJI).find(([k]) => slug.includes(k) || k.includes(slug))
    if (entry) return entry[1]
  }
  return FALLBACK_EMOJIS[idx % FALLBACK_EMOJIS.length]
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuthStore()
  const cartItems = useCartStore((s) => s.items)
  const navigate = useNavigate()

  /**
   * Why: the account menu opens on click, so it must also close when the user taps elsewhere or presses Escape.
   * What: registers outside-pointer and Escape listeners only while the menu is open.
   */
  useEffect(() => {
    if (!accountOpen) return
    const closeOnOutsidePointer = (e: MouseEvent | TouchEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false)
    }
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsidePointer)
    document.addEventListener('touchstart', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsidePointer)
      document.removeEventListener('touchstart', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountOpen])

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return (data.data ?? data) as Category[]
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/urunler?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'clip' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 68, gap: 16 }}>

            <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img src="/logo.jpeg" alt="Medeniyet Pazarı"
                style={{ height: 44, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            </Link>

            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520 }}
              className="hidden md:flex">
              <div style={{ position: 'relative', width: '100%' }}>
                <Search style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  width: 16, height: 16, color: '#94a3b8',
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün, kategori veya marka ara..."
                  className="field"
                  style={{ paddingLeft: 42, paddingRight: 16, paddingTop: 10, paddingBottom: 10 }}
                />
              </div>
            </form>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              <Link to="/favorilerim" style={{
                padding: '8px', borderRadius: 10, color: '#64748b', display: 'flex',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Heart style={{ width: 20, height: 20 }} />
              </Link>

              <Link to="/sepet" style={{
                position: 'relative', padding: '8px', borderRadius: 10, color: '#64748b', display: 'flex',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <ShoppingCart style={{ width: 20, height: 20 }} />
                {cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    background: '#E2B93B', color: '#1a1a2e',
                    fontSize: 10, fontWeight: 700,
                    width: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{cartItems.length}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <div style={{ position: 'relative' }} ref={accountRef}>
                  <button onClick={() => setAccountOpen(o => !o)}
                    aria-haspopup="menu" aria-expanded={accountOpen} aria-label="Hesap menüsü"
                    style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 10, border: 'none',
                    background: 'transparent', cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User style={{ width: 16, height: 16, color: '#fff' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}
                      className="hidden lg:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown style={{ width: 13, height: 13, color: '#94a3b8' }} className="hidden lg:block" />
                  </button>
                  {accountOpen && (
                  <div role="menu" style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 6,
                    width: 220, background: '#fff',
                    borderRadius: 14, border: '1px solid #e2e8f0',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                    padding: '6px 0', zIndex: 60,
                  }}>
                    {[
                      { to: '/hesabim', label: 'Hesabım' },
                      { to: '/siparislerim', label: 'Siparişlerim' },
                      { to: '/favorilerim', label: 'Favorilerim' },
                      { to: '/satis/panel', label: 'Satıcı Paneli' },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setAccountOpen(false)} style={{
                        display: 'block', padding: '10px 16px',
                        fontSize: 13, color: '#334155', textDecoration: 'none',
                        transition: 'background 0.12s',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        {label}
                      </Link>
                    ))}
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <Link to="/admin" onClick={() => setAccountOpen(false)} style={{
                        display: 'block', padding: '10px 16px',
                        fontSize: 13, color: '#0F5EA8', fontWeight: 600, textDecoration: 'none',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        Admin Panel
                      </Link>
                    )}
                    <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                    <button onClick={() => { setAccountOpen(false); logout() }} style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      fontSize: 13, color: '#ef4444', background: 'none', border: 'none',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      Çıkış Yap
                    </button>
                  </div>
                  )}
                </div>
              ) : (
                <div style={{ gap: 8 }} className="hidden md:flex">
                  <Link to="/giris" style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 600,
                    color: '#0F5EA8', textDecoration: 'none', borderRadius: 10,
                    border: '1.5px solid #0F5EA8',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0F5EA8'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0F5EA8' }}>
                    Giriş Yap
                  </Link>
                  <Link to="/kayit" style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 600,
                    background: '#0F5EA8', color: '#fff', textDecoration: 'none', borderRadius: 10,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#0A4278')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#0F5EA8')}>
                    Kayıt Ol
                  </Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)}
                style={{ padding: 8, borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                className="md:hidden">
                {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
              </button>
            </nav>
          </div>
        </div>

        {/* ─── CATEGORY BAR — single-row, Tüm Kategoriler dropdown first ─── */}
        {categories && categories.length > 0 && (
          <div style={{ borderTop: '1px solid #f1f5f9', background: '#fff' }} className="hidden md:block">
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
              {(() => {
                const filtered = categories.filter(c => !c.name.toLowerCase().includes('süper'))
                const visible = filtered.slice(0, 7)
                const overflow = filtered.slice(7)
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '5px 0' }}>

                    {/* Tüm Kategoriler — always first */}
                    <div className="group" style={{ position: 'relative', flexShrink: 0 }}>
                      <button style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                        color: '#0F5EA8', background: '#eff6ff',
                        border: '1.5px solid #dbeafe', cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0F5EA8'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#0F5EA8' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff'; (e.currentTarget as HTMLButtonElement).style.color = '#0F5EA8'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#dbeafe' }}>
                        <LayoutGrid style={{ width: 13, height: 13 }} />
                        Tüm Kategoriler
                        <ChevronDown style={{ width: 11, height: 11 }} />
                      </button>

                      <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 60 }}
                        className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                        <div style={{
                          background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                          padding: '10px 0', minWidth: 260,
                          display: 'grid', gridTemplateColumns: '1fr 1fr',
                        }}>
                          {filtered.map((cat, idx) => (
                            <Link key={cat.id} to={`/urunler?category=${cat.id}`} style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '9px 16px', fontSize: 12.5, color: '#334155',
                              textDecoration: 'none', transition: 'background 0.12s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0F5EA8' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155' }}>
                              <span style={{ fontSize: 15 }}>{getCatEmoji(cat, idx)}</span>
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: 1, height: 20, background: '#e2e8f0', flexShrink: 0, margin: '0 6px' }} />

                    {/* First 7 visible categories (no Süpermarket) */}
                    {visible.map((cat, idx) => (
                      <div key={cat.id} className="group" style={{ position: 'relative', flexShrink: 0 }}>
                        <Link to={`/urunler?category=${cat.id}`} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                          color: '#334155', background: 'transparent',
                          textDecoration: 'none', whiteSpace: 'nowrap',
                          border: '1.5px solid transparent', transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0F5EA8'; e.currentTarget.style.borderColor = '#dbeafe' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = 'transparent' }}>
                          <span style={{ fontSize: 14, lineHeight: 1 }}>{getCatEmoji(cat, idx)}</span>
                          {cat.name}
                        </Link>

                        {(cat.children?.length ?? 0) > 0 && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 60 }}
                            className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                            <div style={{ minWidth: 200, background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(0,0,0,0.12)', padding: '6px 0' }}>
                              {cat.children!.map(sub => (
                                <Link key={sub.id} to={`/urunler?category=${sub.id}`} style={{ display: 'block', padding: '9px 16px', fontSize: 13, color: '#334155', textDecoration: 'none', transition: 'background 0.12s' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0F5EA8' }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155' }}>
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Extra overflow badge if more than 7 */}
                    {overflow.length > 0 && (
                      <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', marginLeft: 4, whiteSpace: 'nowrap' }}>
                        +{overflow.length} daha
                      </span>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}


        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #e2e8f0', padding: 16, background: '#fff' }}
            className="md:hidden animate-slide-down">
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94a3b8' }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ara..." className="field" style={{ paddingLeft: 38 }} />
              </div>
            </form>
            {categories && categories.length > 0 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 14, paddingBottom: 4, scrollbarWidth: 'none' }}>
                <Link to="/urunler" onClick={() => setMobileOpen(false)} style={{
                  flexShrink: 0, padding: '7px 14px', fontSize: 12, fontWeight: 700,
                  color: '#0F5EA8', background: '#eff6ff', borderRadius: 999, textDecoration: 'none',
                }}>
                  Tüm Ürünler
                </Link>
                {categories.map((cat, idx) => (
                  <Link key={cat.id} to={`/urunler?category=${cat.id}`} onClick={() => setMobileOpen(false)} style={{
                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '7px 14px', fontSize: 12, fontWeight: 600,
                    color: '#334155', background: '#f8fafc', borderRadius: 999, textDecoration: 'none',
                    whiteSpace: 'nowrap', border: '1px solid #e2e8f0',
                  }}>
                    <span>{getCatEmoji(cat, idx)}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            {!isAuthenticated && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
                <Link to="/giris" onClick={() => setMobileOpen(false)} style={{
                  padding: '12px 0', textAlign: 'center', fontSize: 14, fontWeight: 700,
                  color: '#0F5EA8', textDecoration: 'none', borderRadius: 12,
                  border: '1.5px solid #0F5EA8', background: '#fff',
                }}>
                  Giriş Yap
                </Link>
                <Link to="/kayit" onClick={() => setMobileOpen(false)} style={{
                  padding: '12px 0', textAlign: 'center', fontSize: 14, fontWeight: 700,
                  color: '#fff', textDecoration: 'none', borderRadius: 12,
                  background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
                  boxShadow: '0 4px 12px rgba(15,94,168,0.25)',
                }}>
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#1A1A2E', color: '#fff', padding: '56px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, paddingBottom: 40 }}>
            <div>
              <img src="/logo.jpeg" alt="Medeniyet Pazarı" style={{ height: 48, width: 'auto', borderRadius: 8, marginBottom: 16 }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                Güvenli alışverişin yeni adresi. Helal ve güvenilir, işbirliği ve kalkınma pazarı.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Hızlı Bağlantılar</h4>
              {[{ to: '/urunler', l: 'Ürünler' }, { to: '/kayit', l: 'Kayıt Ol' }, { to: '/giris', l: 'Giriş Yap' }].map(({ to, l }) => (
                <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E2B93B')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Yardım</h4>
              {[{ to: '/destek', l: 'Destek Talebi' }, { to: '#', l: 'Sıkça Sorulanlar' }, { to: '#', l: 'Gizlilik Politikası' }].map(({ to, l }) => (
                <Link key={l} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E2B93B')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>İletişim</h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>info@medeniyetpazari.com</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Medeniyet Pazarı. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  )
}
