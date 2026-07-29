import { Outlet, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuthStore()
  const cartItems = useCartStore((s) => s.items)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/urunler?search=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 68, gap: 16 }}>

            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img src="/logo.jpeg" alt="Medeniyet Pazarı"
                style={{ height: 44, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
            </Link>

            {/* Search — desktop */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, display: 'flex' }}
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

            {/* Nav */}
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
                <div style={{ position: 'relative' }} className="group">
                  <button style={{
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
                  {/* Dropdown */}
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 6,
                    width: 220, background: '#fff',
                    borderRadius: 14, border: '1px solid #e2e8f0',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                    padding: '6px 0', zIndex: 60,
                  }} className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {[
                      { to: '/hesabim', label: 'Hesabım' },
                      { to: '/siparislerim', label: 'Siparişlerim' },
                      { to: '/favorilerim', label: 'Favorilerim' },
                      { to: '/satis/panel', label: 'Satıcı Paneli' },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} style={{
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
                      <Link to="/admin" style={{
                        display: 'block', padding: '10px 16px',
                        fontSize: 13, color: '#0F5EA8', fontWeight: 600, textDecoration: 'none',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#eff6ff')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        Admin Panel
                      </Link>
                    )}
                    <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
                    <button onClick={() => logout()} style={{
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      fontSize: 13, color: '#ef4444', background: 'none', border: 'none',
                      cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
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
