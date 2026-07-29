import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { ClipboardList, ChevronDown, MapPin, User, Phone, Mail, Package, Truck, X } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Bekliyor', color: '#d97706', bg: '#fffbeb' },
  confirmed: { label: 'Onaylandı', color: '#0F5EA8', bg: '#eff6ff' },
  processing: { label: 'Hazırlanıyor', color: '#7c3aed', bg: '#f5f3ff' },
  shipped: { label: 'Kargoda', color: '#0891b2', bg: '#ecfeff' },
  delivered: { label: 'Teslim Edildi', color: '#059669', bg: '#ecfdf5' },
  cancelled: { label: 'İptal', color: '#dc2626', bg: '#fff5f5' },
}

const CARGO_PROVIDERS = [
  { value: 'yurtici', label: 'Yurtiçi Kargo' },
  { value: 'aras', label: 'Aras Kargo' },
  { value: 'ptt', label: 'PTT Kargo' },
  { value: 'mng', label: 'MNG Kargo' },
  { value: 'surat', label: 'Sürat Kargo' },
]

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function SellerOrdersPage() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [shipModal, setShipModal] = useState<number | null>(null)
  const [cargo, setCargo] = useState({ provider: '', tracking: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const { data } = await api.get('/seller/orders')
      return data.data
    },
  })

  const confirmOrder = useMutation({
    mutationFn: (id: number) => api.patch(`/seller/orders/${id}/confirm`),
    onSuccess: () => { toast.success('Sipariş onaylandı.'); qc.invalidateQueries({ queryKey: ['seller-orders'] }) },
    onError: () => toast.error('İşlem başarısız.'),
  })

  const shipOrder = useMutation({
    mutationFn: ({ id, provider, tracking }: { id: number; provider: string; tracking: string }) =>
      api.patch(`/seller/orders/${id}/ship`, { cargo_provider: provider, cargo_tracking_no: tracking }),
    onSuccess: () => {
      toast.success('Kargo bilgisi güncellendi.')
      setShipModal(null); setCargo({ provider: '', tracking: '' })
      qc.invalidateQueries({ queryKey: ['seller-orders'] })
    },
    onError: () => toast.error('İşlem başarısız.'),
  })

  const list: any[] = data?.data ?? []

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Gelen Siparişler</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{list.length} sipariş</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardList style={{ width: 20, height: 20, color: '#0F5EA8' }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 14 }} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ClipboardList style={{ width: 28, height: 28, color: '#0F5EA8' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz siparişiniz yok</h3>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Ürünleriniz onaylandıkça siparişler burada görünecek.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((order: any) => {
            const s = STATUS_MAP[order.status] || { label: order.status, color: '#64748b', bg: '#f1f5f9' }
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Header row */}
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <code style={{ fontSize: 13, fontWeight: 800, background: '#eff6ff', color: '#0F5EA8', padding: '5px 12px', borderRadius: 8 }}>
                    {order.order_no}
                  </code>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: s.color, background: s.bg }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 900, color: '#059669', marginLeft: 4 }}>
                    {Number(order.total).toLocaleString('tr-TR')} ₺
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                  </span>

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <button onClick={() => confirmOrder.mutate(order.id)}
                      disabled={confirmOrder.isPending}
                      style={{ padding: '7px 14px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: 8, cursor: 'pointer', color: '#059669', fontSize: 12, fontWeight: 700 }}>
                      Onayla
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button onClick={() => setShipModal(order.id)}
                      style={{ padding: '7px 14px', background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: 8, cursor: 'pointer', color: '#0F5EA8', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Truck style={{ width: 13, height: 13 }} /> Kargoya Ver
                    </button>
                  )}

                  <button onClick={() => setExpanded(isExpanded ? null : order.id)}
                    style={{ padding: '7px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s', transform: isExpanded ? 'rotate(180deg)' : '' }}>
                    <ChevronDown style={{ width: 15, height: 15, color: '#64748b' }} />
                  </button>
                </div>

                {/* Expandable detail */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '20px', background: '#fafafa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Buyer info */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Alıcı Bilgileri
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1a1a2e' }}>
                          <User style={{ width: 14, height: 14, color: '#0F5EA8', flexShrink: 0 }} />
                          <strong>{order.buyer?.name || '—'}</strong>
                        </div>
                        {order.buyer?.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                            <Mail style={{ width: 14, height: 14, color: '#64748b', flexShrink: 0 }} />
                            {order.buyer.email}
                          </div>
                        )}
                        {order.buyer?.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
                            <Phone style={{ width: 14, height: 14, color: '#64748b', flexShrink: 0 }} />
                            {order.buyer.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                        Teslimat Adresi
                      </div>
                      {order.address ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                            <MapPin style={{ width: 14, height: 14, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                            <div>
                              <div style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 3 }}>{order.address.title}</div>
                              <div style={{ color: '#64748b', lineHeight: 1.5 }}>{order.address.address_line}</div>
                              <div style={{ color: '#94a3b8', marginTop: 3, fontSize: 12 }}>
                                {order.address.district?.name}{order.address.district?.name ? ', ' : ''}{order.address.city?.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Adres bilgisi bulunamadı.</p>
                      )}
                    </div>

                    {/* Order items */}
                    {order.items?.length > 0 && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                          Sipariş Kalemleri
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {order.items.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                              <Package style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>
                                {item.product?.name || item.product_name || '—'}
                              </span>
                              <span style={{ fontSize: 12, color: '#64748b' }}>×{item.quantity}</span>
                              <span style={{ fontSize: 14, fontWeight: 800, color: '#0F5EA8' }}>
                                {Number(item.price).toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cargo info if shipped */}
                    {order.cargo_tracking_no && (
                      <div style={{ gridColumn: '1/-1', padding: '12px 16px', background: '#ecfeff', borderRadius: 10, border: '1px solid #a5f3fc', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Truck style={{ width: 16, height: 16, color: '#0891b2', flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: '#0891b2' }}>
                          <strong>{order.cargo_provider?.toUpperCase()}</strong> — Takip No: <code style={{ fontWeight: 700 }}>{order.cargo_tracking_no}</code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Ship modal */}
      {shipModal !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>Kargo Bilgisi</h3>
              <button onClick={() => setShipModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 7 }}>Kargo Firması *</label>
                <select className="field" value={cargo.provider} onChange={e => setCargo(c => ({ ...c, provider: e.target.value }))}>
                  <option value="">— Seçin —</option>
                  {CARGO_PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 7 }}>Takip Numarası *</label>
                <input className="field" value={cargo.tracking} onChange={e => setCargo(c => ({ ...c, tracking: e.target.value }))}
                  placeholder="Örn: 12345678901234" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShipModal(null)}
                style={{ padding: '10px 18px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                İptal
              </button>
              <button
                onClick={() => shipOrder.mutate({ id: shipModal!, provider: cargo.provider, tracking: cargo.tracking })}
                disabled={!cargo.provider || !cargo.tracking || shipOrder.isPending}
                style={{
                  padding: '10px 18px', background: '#0F5EA8', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: (!cargo.provider || !cargo.tracking || shipOrder.isPending) ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <Truck style={{ width: 14, height: 14 }} />
                {shipOrder.isPending ? 'Kaydediliyor...' : 'Kargoya Ver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
