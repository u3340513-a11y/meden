import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Package, Plus, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Onay Bekleyen', color: '#d97706', bg: '#fffbeb' },
  approved: { label: 'Aktif', color: '#059669', bg: '#ecfdf5' },
  rejected: { label: 'Reddedildi', color: '#dc2626', bg: '#fff5f5' },
  passive: { label: 'Pasif', color: '#64748b', bg: '#f1f5f9' },
}

const CONDITION_MAP: Record<string, string> = {
  new: '🆕 Sıfır',
  like_new: '✨ Az Kullanılmış',
  second_hand: '♻️ İkinci El',
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function SellerProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => { const { data } = await api.get('/seller/products'); return data.data },
  })

  const list: any[] = data?.data ?? []

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Ürünlerim</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{list.length} ürün</p>
        </div>
        <Link to="/satis/urunlerim/yeni" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', background: '#059669', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', textDecoration: 'none',
          fontSize: 13, fontWeight: 700, boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
        }}>
          <Plus style={{ width: 15, height: 15 }} />
          Ürün Ekle
        </Link>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />)}
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package style={{ width: 28, height: 28, color: '#059669' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz ürününüz yok</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>İlk ürününüzü listeleyerek satışa başlayın.</p>
            <Link to="/satis/urunlerim/yeni" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', background: '#059669', color: '#fff',
              borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700,
            }}>
              <Plus style={{ width: 15, height: 15 }} /> İlk Ürünümü Ekle
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Ürün</th>
                  <th style={TH}>Durum</th>
                  <th style={TH}>Kondisyon</th>
                  <th style={TH}>Fiyat</th>
                  <th style={{ ...TH, textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p: any, idx: number) => {
                  const s = STATUS_MAP[p.status] || { label: p.status, color: '#64748b', bg: '#f1f5f9' }
                  return (
                    <tr key={p.id}
                      style={{ borderBottom: idx < list.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                            background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {p.cover_image
                              ? <img src={p.cover_image} alt={p.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display') }}
                                />
                              : null}
                            <Package style={{ width: 18, height: 18, color: '#cbd5e1', display: p.cover_image ? 'none' : 'block' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b' }}>
                        {CONDITION_MAP[p.condition] || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: '#0F5EA8' }}>
                        {Number(p.current_price).toLocaleString('tr-TR')} ₺
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <Link to={`/satis/urunlerim/${p.id}/duzenle`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '6px 12px', background: '#eff6ff', borderRadius: 8,
                            textDecoration: 'none', color: '#0F5EA8', fontSize: 12, fontWeight: 600,
                          }}>
                          Düzenle <ArrowUpRight style={{ width: 12, height: 12 }} />
                        </Link>
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
