import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Heart, Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

export default function FavoritesPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => { const { data } = await api.get('/favorites'); return data.data },
  })

  const removeFav = async (productId: number) => {
    try {
      await api.delete(`/favorites/${productId}`)
      toast.success('Favorilerden çıkarıldı.')
      qc.invalidateQueries({ queryKey: ['favorites'] })
    } catch { toast.error('İşlem başarısız.') }
  }

  const list: any[] = data?.data ?? data ?? []

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Favorilerim</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{list.length} ürün</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart style={{ width: 20, height: 20, color: '#ef4444' }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Heart style={{ width: 28, height: 28, color: '#fca5a5' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz favoriniz yok</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Beğendiğiniz ürünleri favorilerinize ekleyin.</p>
          <Link to="/urunler" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: '#0F5EA8', color: '#fff',
            borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700,
          }}>
            Ürünleri Keşfet
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          {list.map((fav: any) => (
            <div key={fav.id} className="card" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
              {/* Thumbnail */}
              <div style={{ aspectRatio: '1', background: 'linear-gradient(135deg,#f8fafc,#e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {fav.product?.images?.[0] ? (
                  <img src={fav.product.images[0].url} alt={fav.product?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 40 }}>🛍️</span>
                )}
                {/* Remove button */}
                <button onClick={() => removeFav(fav.product_id)}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}>
                  <Trash2 style={{ width: 14, height: 14, color: '#ef4444' }} />
                </button>
              </div>
              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {fav.product?.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#0F5EA8' }}>
                    {Number(fav.product?.current_price).toLocaleString('tr-TR')} ₺
                  </span>
                  <Link to={`/urunler/${fav.product?.slug}`}
                    style={{ color: '#94a3b8', display: 'flex' }}>
                    <ExternalLink style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
