import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Users, Package, ShoppingBag, Ticket, RotateCcw, TrendingUp, Percent, ArrowUpRight, Clock, CheckCircle } from 'lucide-react'

const PALETTE = [
  { label: 'Kullanıcılar', key: 'users_count', icon: Users, color: '#0F5EA8', bg: '#eff6ff', trend: '+12%' },
  { label: 'Toplam Ürün', key: 'products_count', icon: Package, color: '#059669', bg: '#ecfdf5', trend: '+8%' },
  { label: 'Onay Bekleyen', key: 'pending_products', icon: Clock, color: '#d97706', bg: '#fffbeb', trend: '' },
  { label: 'Siparişler', key: 'orders_count', icon: ShoppingBag, color: '#7c3aed', bg: '#f5f3ff', trend: '+5%' },
  { label: 'Açık İadeler', key: 'open_refunds', icon: RotateCcw, color: '#dc2626', bg: '#fff5f5', trend: '' },
  { label: 'Açık Talepler', key: 'open_tickets', icon: Ticket, color: '#ea580c', bg: '#fff7ed', trend: '' },
  { label: 'Toplam Ciro', key: 'total_revenue', icon: TrendingUp, color: '#0F5EA8', bg: '#eff6ff', currency: true, trend: '+23%' },
  { label: 'Komisyon', key: 'total_commission', icon: Percent, color: '#E2B93B', bg: '#fffbeb', currency: true, trend: '' },
]

function StatCard({ label, value, icon: Icon, color, bg, trend }: any) {
  return (
    <div className="card card-hover" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: 22, height: 22, color }} />
        </div>
        {trend && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700, color: '#16a34a',
            background: '#f0fdf4', padding: '3px 8px', borderRadius: 999,
          }}>
            <ArrowUpRight style={{ width: 11, height: 11 }} />{trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => { const { data } = await api.get('/admin/dashboard'); return data.data },
  })

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg,#7c3aed,#9f67ff)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Yönetim Paneli
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
            Platform genelinde özet istatistikler
          </p>
        </div>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          <CheckCircle style={{ width: 32, height: 32, color: '#fff' }} />
        </div>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 120, background: '#f1f5f9', borderRadius: 16, animation: 'pulse 1.5s ease infinite' }} className="skeleton" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {PALETTE.map(({ label, key, icon, color, bg, currency, trend }) => (
            <StatCard
              key={key}
              label={label}
              icon={icon}
              color={color}
              bg={bg}
              trend={trend}
              value={currency
                ? `${Number(data?.[key] || 0).toLocaleString('tr-TR')} ₺`
                : data?.[key] ?? 0}
            />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Hızlı İşlemler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {[
            { label: 'Onay Bekleyen Ürünler', href: '/admin/urunler', color: '#d97706', bg: '#fffbeb' },
            { label: 'Açık Destek Talepleri', href: '/admin/destek', color: '#dc2626', bg: '#fff5f5' },
            { label: 'Kullanıcı Yönetimi', href: '/admin/kullanicilar', color: '#0F5EA8', bg: '#eff6ff' },
            { label: 'Referans Ağacı', href: '/admin/referanslar', color: '#7c3aed', bg: '#f5f3ff' },
          ].map(({ label, href, color, bg }) => (
            <a key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', background: bg, borderRadius: 12,
              border: `1px solid ${bg}`, textDecoration: 'none', color,
              fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              {label}
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
