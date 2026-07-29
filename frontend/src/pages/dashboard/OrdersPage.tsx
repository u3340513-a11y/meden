import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ShoppingBag } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Bekliyor', color: '#d97706', bg: '#fffbeb' },
  processing: { label: 'Hazırlanıyor', color: '#0F5EA8', bg: '#eff6ff' },
  shipped: { label: 'Kargoda', color: '#7c3aed', bg: '#f5f3ff' },
  delivered: { label: 'Teslim Edildi', color: '#059669', bg: '#ecfdf5' },
  cancelled: { label: 'İptal', color: '#dc2626', bg: '#fff5f5' },
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => { const { data } = await api.get('/orders'); return data.data },
  })

  const list: any[] = orders?.data ?? []

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Siparişlerim</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{list.length} sipariş</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag style={{ width: 20, height: 20, color: '#7c3aed' }} />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />)}
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShoppingBag style={{ width: 28, height: 28, color: '#7c3aed' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz siparişiniz yok</h3>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Ürünleri keşfetmeye başlayın!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Sipariş No</th>
                  <th style={TH}>Durum</th>
                  <th style={TH}>Toplam</th>
                  <th style={TH}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order: any, idx: number) => {
                  const s = STATUS_MAP[order.status] || { label: order.status, color: '#64748b', bg: '#f1f5f9' }
                  return (
                    <tr key={order.id}
                      style={{ borderBottom: idx < list.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <code style={{ fontSize: 12, fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6 }}>
                          {order.order_no}
                        </code>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: '#0F5EA8' }}>
                        {Number(order.total).toLocaleString('tr-TR')} ₺
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                        {new Date(order.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
