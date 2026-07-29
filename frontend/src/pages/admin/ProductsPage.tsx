import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { ShieldCheck, CheckCircle, XCircle, Package, Filter } from 'lucide-react'

const STATUS_OPTS = [
  { value: 'pending', label: 'Onay Bekleyen' },
  { value: 'approved', label: 'Onaylı' },
  { value: 'rejected', label: 'Reddedilen' },
]

const CONDITION_MAP: Record<string, string> = {
  new: '🆕 Sıfır',
  like_new: '✨ Az Kullanılmış',
  second_hand: '♻️ İkinci El',
}

export default function AdminProductsPage() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('pending')
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', status],
    queryFn: async () => { const { data } = await api.get(`/admin/products?status=${status}`); return data.data },
  })

  const approve = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/products/${id}/approve`),
    onSuccess: () => { toast.success('Ürün onaylandı ✓'); qc.invalidateQueries({ queryKey: ['admin-products'] }) },
    onError: () => toast.error('İşlem başarısız.'),
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.patch(`/admin/products/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success('Ürün reddedildi.')
      setRejectId(null); setRejectReason('')
      qc.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: () => toast.error('İşlem başarısız.'),
  })

  const list: any[] = data?.data ?? []

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Ürün Moderasyon</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{list.length} ürün listeleniyor</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter style={{ width: 15, height: 15, color: '#94a3b8' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {STATUS_OPTS.map(o => (
              <button key={o.value} onClick={() => setStatus(o.value)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                  background: status === o.value ? '#0F5EA8' : '#f1f5f9',
                  color: status === o.value ? '#fff' : '#64748b',
                }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck style={{ width: 28, height: 28, color: '#059669' }} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Tüm temiz!</h3>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            {status === 'pending' ? 'Onay bekleyen ürün bulunmuyor.' : 'Bu durumda ürün yok.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((p: any) => (
            <div key={p.id} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {/* Thumbnail */}
                <div style={{
                  width: 60, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                  background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package style={{ width: 24, height: 24, color: '#cbd5e1' }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      👤 <strong>{p.seller?.name}</strong>
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0F5EA8' }}>
                      {Number(p.current_price).toLocaleString('tr-TR')} ₺
                    </span>
                    {p.condition && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: 999 }}>
                        {CONDITION_MAP[p.condition] || p.condition}
                      </span>
                    )}
                    {p.category && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>🗂 {p.category?.name}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => approve.mutate(p.id)}
                      disabled={approve.isPending}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '9px 16px', background: '#ecfdf5', border: '1.5px solid #a7f3d0',
                        borderRadius: 10, cursor: 'pointer', color: '#059669', fontSize: 12, fontWeight: 700,
                      }}>
                      <CheckCircle style={{ width: 14, height: 14 }} /> Onayla
                    </button>
                    <button onClick={() => setRejectId(p.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '9px 16px', background: '#fff5f5', border: '1.5px solid #fecaca',
                        borderRadius: 10, cursor: 'pointer', color: '#dc2626', fontSize: 12, fontWeight: 700,
                      }}>
                      <XCircle style={{ width: 14, height: 14 }} /> Reddet
                    </button>
                  </div>
                )}
                {status === 'approved' && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '5px 12px', borderRadius: 999 }}>✓ Onaylı</span>
                )}
                {status === 'rejected' && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fff5f5', padding: '5px 12px', borderRadius: 999 }}>✗ Reddedildi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject reason modal */}
      {rejectId !== null && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, padding: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Reddetme Nedeni</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Satıcıya iletilecek reddetme gerekçesini girin.</p>
            <textarea className="field" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Örn: Ürün görseli eksik, açıklama yetersiz..." rows={3}
              style={{ marginBottom: 16, resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setRejectId(null); setRejectReason('') }}
                style={{ padding: '10px 18px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                İptal
              </button>
              <button onClick={() => reject.mutate({ id: rejectId!, reason: rejectReason || 'Uygun değil.' })}
                disabled={reject.isPending}
                style={{
                  padding: '10px 18px', background: '#dc2626', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: reject.isPending ? 0.7 : 1,
                }}>
                {reject.isPending ? 'Reddediliyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
