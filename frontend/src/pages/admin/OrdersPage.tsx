import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ShoppingBag } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Bekliyor', color: '#d97706', bg: '#fffbeb' },
  processing: { label: 'İşlemde', color: '#0F5EA8', bg: '#eff6ff' },
  shipped: { label: 'Kargoda', color: '#7c3aed', bg: '#f5f3ff' },
  delivered: { label: 'Teslim Edildi', color: '#059669', bg: '#ecfdf5' },
  cancelled: { label: 'İptal', color: '#dc2626', bg: '#fff5f5' },
  refunded: { label: 'İade Edildi', color: '#64748b', bg: '#f1f5f9' },
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '13px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function AdminOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => { const { data } = await api.get('/admin/orders'); return data.data },
  })

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>Siparişler</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Tüm platform siparişleri</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag style={{ width: 20, height: 20, color: '#7c3aed' }} />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Sipariş No</th>
                  <th style={TH}>Alıcı</th>
                  <th style={TH}>Toplam</th>
                  <th style={TH}>Durum</th>
                  <th style={TH}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((o: any, idx: number) => {
                  const st = STATUS_MAP[o.status] || { label: o.status, color: '#64748b', bg: '#f1f5f9' }
                  return (
                    <tr key={o.id} style={{ borderBottom: idx < data.data.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#0F5EA8', background: '#eff6ff', padding: '4px 10px', borderRadius: 6 }}>
                          {o.order_no}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{o.buyer?.name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: '#0F5EA8' }}>
                        {Number(o.total).toLocaleString('tr-TR')} ₺
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: st.color, background: st.bg }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('tr-TR') : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(!data?.data || data.data.length === 0) && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                Henüz sipariş bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
