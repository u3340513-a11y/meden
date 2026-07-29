import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'
import {
  User, ShoppingBag, Heart, MapPin, Headphones, Share2,
  Store, Package, ClipboardList,
  LayoutDashboard, Users, Tag, FolderTree, RotateCcw, Ticket, Link2, Settings,
  LogOut, Menu, X, ChevronRight, Home
} from 'lucide-react'

const COLORS = {
  primary: '#0F5EA8',
  primaryLight: '#eff6ff',
  accent: '#E2B93B',
  bg: '#f8fafc',
  sidebar: '#fff',
  border: '#e8edf2',
  text: '#1a1a2e',
  muted: '#64748b',
  admin: '#7c3aed',
  adminLight: '#f5f3ff',
  seller: '#059669',
  sellerLight: '#ecfdf5',
}

const userLinks = [
  { to: '/hesabim', icon: User, label: 'Profilim' },
  { to: '/siparislerim', icon: ShoppingBag, label: 'Siparişlerim' },
  { to: '/favorilerim', icon: Heart, label: 'Favorilerim' },
  { to: '/adreslerim', icon: MapPin, label: 'Adreslerim' },
  { to: '/destek', icon: Headphones, label: 'Destek Talepleri' },
  { to: '/referanslarim', icon: Share2, label: 'Referanslarım' },
]

const sellerLinks = [
  { to: '/satis/panel', icon: Store, label: 'Satıcı Paneli' },
  { to: '/satis/urunlerim', icon: Package, label: 'Ürünlerim' },
  { to: '/satis/siparislerim', icon: ClipboardList, label: 'Gelen Siparişler' },
]

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/kullanicilar', icon: Users, label: 'Kullanıcılar' },
  { to: '/admin/urunler', icon: Tag, label: 'Ürün Moderasyon' },
  { to: '/admin/siparisler', icon: ShoppingBag, label: 'Siparişler' },
  { to: '/admin/kategoriler', icon: FolderTree, label: 'Kategoriler' },
  { to: '/admin/iadeler', icon: RotateCcw, label: 'İadeler' },
  { to: '/admin/destek', icon: Ticket, label: 'Destek Talepleri' },
  { to: '/admin/referanslar', icon: Link2, label: 'Referanslar' },
  { to: '/admin/ayarlar', icon: Settings, label: 'Ayarlar' },
]

interface NavItemProps {
  to: string
  icon: any
  label: string
  accent?: string
  accentBg?: string
}

function NavItem({ to, icon: Icon, label, accent, accentBg }: NavItemProps) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', borderRadius: 10, textDecoration: 'none',
      transition: 'all 0.15s',
      background: active ? (accentBg || COLORS.primaryLight) : 'transparent',
      color: active ? (accent || COLORS.primary) : COLORS.muted,
      fontWeight: active ? 600 : 400,
      fontSize: 13.5,
      borderLeft: active ? `3px solid ${accent || COLORS.primary}` : '3px solid transparent',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; if (!active) e.currentTarget.style.color = COLORS.text }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; if (!active) e.currentTarget.style.color = COLORS.muted }}
    >
      <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
      <span>{label}</span>
      {active && <ChevronRight style={{ width: 13, height: 13, marginLeft: 'auto', opacity: 0.6 }} />}
    </Link>
  )
}

function SidebarGroup({ title, links, accent, accentBg, dot }: {
  title: string; links: typeof userLinks; accent?: string; accentBg?: string; dot?: string
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px 4px',
      }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {links.map(item => (
          <NavItem key={item.to} {...item} accent={accent} accentBg={accentBg} />
        ))}
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const handleLogout = async () => {
    await logout()
    navigate('/giris')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const Sidebar = () => (
    <div style={{
      width: 240, background: COLORS.sidebar,
      borderRight: `1px solid ${COLORS.border}`,
      height: '100%', display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* User card */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: 'linear-gradient(135deg, #f8faff, #fff)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F5EA8, #1A7FD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 600, marginTop: 3,
              color: isAdmin ? COLORS.admin : COLORS.primary,
              background: isAdmin ? COLORS.adminLight : COLORS.primaryLight,
              display: 'inline-block', padding: '2px 8px', borderRadius: 999,
            }}>
              {user?.role === 'super_admin' ? 'Süper Admin' : user?.role === 'admin' ? 'Admin' : 'Üye'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        <SidebarGroup title="Hesabım" links={userLinks} dot="#0F5EA8" />
        <div style={{ height: 1, background: COLORS.border, margin: '8px 12px' }} />
        <SidebarGroup title="Satıcı" links={sellerLinks} accent={COLORS.seller} accentBg={COLORS.sellerLight} dot="#059669" />
        {isAdmin && (
          <>
            <div style={{ height: 1, background: COLORS.border, margin: '8px 12px' }} />
            <SidebarGroup title="Yönetim" links={adminLinks} accent={COLORS.admin} accentBg={COLORS.adminLight} dot="#7c3aed" />
          </>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ padding: '12px 8px', borderTop: `1px solid ${COLORS.border}` }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
          borderRadius: 10, textDecoration: 'none', color: COLORS.muted, fontSize: 13.5,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = COLORS.text }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.muted }}>
          <Home style={{ width: 16, height: 16 }} />
          Ana Sayfa
        </Link>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
          borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer',
          color: '#ef4444', fontSize: 13.5, width: '100%', textAlign: 'left',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <LogOut style={{ width: 16, height: 16 }} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', flexDirection: 'column' }}>
      {/* TOPBAR */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: `1px solid ${COLORS.border}`,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        height: 60, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px', gap: 16 }}>
          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 6, display: 'none' }}
            className="lg:hidden">
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>

          <Link to="/" style={{ flexShrink: 0 }}>
            <img src="/logo.jpeg" alt="Medeniyet Pazarı"
              style={{ height: 38, width: 'auto', borderRadius: 8, objectFit: 'contain' }} />
          </Link>

          <div style={{ flex: 1 }} />

          {/* Breadcrumb style title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: isAdmin
                ? 'linear-gradient(135deg,#7c3aed,#9f67ff)'
                : 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 8px rgba(15,94,168,0.25)',
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize: 10, color: COLORS.muted, lineHeight: 1.2 }}>
                {user?.role === 'super_admin' ? 'Süper Admin' : user?.role === 'admin' ? 'Admin' : 'Üye'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Desktop Sidebar */}
        <aside style={{
          width: 240, flexShrink: 0,
          position: 'sticky', top: 60, height: 'calc(100vh - 60px)',
          overflow: 'auto',
        }} className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
          }} onClick={() => setMobileOpen(false)}>
            <div style={{ width: 260, height: '100%' }} onClick={e => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <main style={{ flex: 1, padding: 28, minWidth: 0 }} className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
