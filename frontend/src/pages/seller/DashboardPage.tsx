import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Package, ShoppingBag, TrendingUp, Clock, ArrowUpRight, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

const CARDS = [
  { key: 'total_products', label: 'Toplam Ürün', icon: Package, color: '#0F5EA8', bg: '#eff6ff' },
  { key: 'active_products', label: 'Aktif Ürün', icon: Package, color: '#059669', bg: '#ecfdf5' },
  { key: 'pending_products', label: 'Onay Bekleyen', icon: Clock, color: '#d97706', bg: '#fffbeb' },
  { key: 'total_orders', label: 'Toplam Sipariş', icon: ShoppingBag, color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'total_revenue', label: 'Toplam Gelir', icon: TrendingUp, color: '#059669', bg: '#ecfdf5', currency: true },
  { key: 'pending_payouts', label: 'Bekleyen Ödeme', icon: Clock, color: '#d97706', bg: '#fffbeb', currency: true },
]

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="card card-hover" style={{ padding: 22 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Icon style={{ width: 22, height: 22, color }} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{value ?? 0}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function SellerDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: async () => { const { data } = await api.get('/seller/dashboard'); return data.data },
  })

  return (
    <div className="animate-fade-in">
      {/* Header banner */}
      <div style={{
        background: 'linear-gradient(135deg,#059669,#0aad7b)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(5,150,105,0.2)',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            Satıcı Paneli
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Mağazanıza Hoş Geldiniz</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>Bugünkü satış özetiniz aşağıda</p>
        </div>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Store style={{ width: 30, height: 30, color: '#fff' }} />
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
          {CARDS.map(({ key, label, icon, color, bg, currency }) => (
            <StatCard
              key={key}
              label={label}
              icon={icon}
              color={color}
              bg={bg}
              value={currency
                ? `${Number(data?.[key] || 0).toLocaleString('tr-TR')} ₺`
                : data?.[key] ?? 0}
            />
          ))}
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>Hızlı İşlemler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {[
            { label: 'Yeni Ürün Ekle', href: '/satis/urunlerim/yeni', color: '#059669', bg: '#ecfdf5' },
            { label: 'Siparişlerimi Gör', href: '/satis/siparislerim', color: '#0F5EA8', bg: '#eff6ff' },
            { label: 'Ürünlerimi Yönet', href: '/satis/urunlerim', color: '#7c3aed', bg: '#f5f3ff' },
          ].map(({ label, href, color, bg }) => (
            <Link key={href} to={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', background: bg, borderRadius: 12,
              textDecoration: 'none', color, fontWeight: 600, fontSize: 13,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              {label}
              <ArrowUpRight style={{ width: 14, height: 14 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
