import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { RotateCcw } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Bekliyor', color: '#d97706', bg: '#fffbeb' },
  approved: { label: 'Onaylandı', color: '#059669', bg: '#ecfdf5' },
  rejected: { label: 'Reddedildi', color: '#dc2626', bg: '#fff5f5' },
  completed: { label: 'Tamamlandı', color: '#64748b', bg: '#f1f5f9' },
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function AdminRefundsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: async () => { const { data } = await api.get('/admin/refunds'); return data.data },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/admin/refunds/${id}/status`, { status }),
    onSuccess: () => { toast.success('İade durumu güncellendi.'); qc.invalidateQueries({ queryKey: ['admin-refunds'] }) },
    onError: () => toast.error('Güncelleme başarısız.'),
  })

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>İade Talepleri</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Tüm iade ve geri ödeme talepleri</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RotateCcw style={{ width: 20, height: 20, color: '#dc2626' }} />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Sipariş No</th>
                  <th style={TH}>Alıcı</th>
                  <th style={TH}>Tutar</th>
                  <th style={TH}>Neden</th>
                  <th style={TH}>Durum</th>
                  <th style={{ ...TH, textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((r: any, idx: number) => {
                  const s = STATUS_MAP[r.status] || STATUS_MAP.pending
                  return (
                    <tr key={r.id}
                      style={{ borderBottom: idx < data.data.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <code style={{ fontSize: 11, fontWeight: 700, background: '#eff6ff', color: '#0F5EA8', padding: '3px 8px', borderRadius: 6 }}>
                          {r.order?.order_no}
                        </code>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{r.buyer?.name}</td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: '#dc2626' }}>
                        {Number(r.amount).toLocaleString('tr-TR')} ₺
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b', maxWidth: 180 }}>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {r.reason || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {r.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: 'approved' })}
                              style={{ padding: '6px 12px', background: '#ecfdf5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#059669', fontSize: 12, fontWeight: 700 }}>
                              Onayla
                            </button>
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: 'rejected' })}
                              style={{ padding: '6px 12px', background: '#fff5f5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#dc2626', fontSize: 12, fontWeight: 700 }}>
                              Reddet
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(!data?.data || data.data.length === 0) && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                ✅ Bekleyen iade talebi bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
