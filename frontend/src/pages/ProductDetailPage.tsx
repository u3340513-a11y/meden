import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Heart, ShoppingCart, Eye, Shield, Truck, ChevronRight, Star, Package, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

const CONDITION_MAP: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: '🆕 Sıfır', color: '#059669', bg: '#ecfdf5' },
  lightly_used: { label: '✨ Az Kullanılmış', color: '#d97706', bg: '#fffbeb' },
  used: { label: '♻️ İkinci El', color: '#64748b', bg: '#f1f5f9' },
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [faved, setFaved] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => { const { data } = await api.get(`/products/${slug}`); return data.data as Product },
  })

  if (isLoading) return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[80, 200, 80, 120, 60].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 24, borderRadius: 8, width: w }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (!product) return null

  const condition = CONDITION_MAP[(product as any).condition] || null

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error('Sepete eklemek için giriş yapın.')
    try { await addItem(product.id, quantity); toast.success('Ürün sepete eklendi!') }
    catch { toast.error('Bir hata oluştu.') }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated) return toast.error('Favorilere eklemek için giriş yapın.')
    try {
      if (faved) { await api.delete(`/favorites/${product.id}`); setFaved(false); toast.success('Favorilerden çıkarıldı.') }
      else { await api.post('/favorites', { product_id: product.id }); setFaved(true); toast.success('Favorilere eklendi!') }
    } catch { toast.error('Bir hata oluştu.') }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }} className="animate-fade-in">
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <Link to="/urunler" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Ürünler
        </Link>
        <ChevronRight style={{ width: 14, height: 14, color: '#cbd5e1' }} />
        {product.category && (
          <>
            <span style={{ fontSize: 13, color: '#64748b' }}>{product.category.name}</span>
            <ChevronRight style={{ width: 14, height: 14, color: '#cbd5e1' }} />
          </>
        )}
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
          {product.name}
        </span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Images */}
        <div>
          <div style={{
            aspectRatio: '1', borderRadius: 20, overflow: 'hidden',
            background: '#f8fafc', border: '1.5px solid #e8edf2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            {product.images && product.images.length > 0 ? (
              <img src={product.images[selectedImage]?.url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Package style={{ width: 72, height: 72, color: '#e2e8f0' }} />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {product.images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImage(i)}
                  style={{
                    width: 68, height: 68, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                    border: i === selectedImage ? '2.5px solid #0F5EA8' : '1.5px solid #e2e8f0',
                    cursor: 'pointer', background: 'none', padding: 0, transition: 'border 0.15s',
                  }}>
                  <img src={img.thumbnail || img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Condition + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {condition && (
              <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999, color: condition.color, background: condition.bg }}>
                {condition.label}
              </span>
            )}
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye style={{ width: 13, height: 13 }} /> {(product as any).view_count || 0}
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 8 }}>
            {product.name}
          </h1>

          {product.seller && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#64748b' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                {(product.seller as any).name?.slice(0, 1)}
              </div>
              <span>Satıcı: <strong style={{ color: '#1a1a2e' }}>{(product.seller as any).name}</strong></span>
              <Star style={{ width: 12, height: 12, color: '#f59e0b', fill: '#f59e0b' }} />
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#0F5EA8', letterSpacing: '-0.02em' }}>
                {product.current_price.toLocaleString('tr-TR')} ₺
              </span>
              {product.discounted_price && (
                <span style={{ fontSize: 18, color: '#94a3b8', textDecoration: 'line-through' }}>
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
              )}
            </div>
            {product.discounted_price && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginTop: 6 }}>
                %{Math.round((1 - product.current_price / product.price) * 100)} İndirim
              </span>
            )}
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b', fontWeight: 700 }}>
                −
              </button>
              <span style={{ padding: '0 16px', fontSize: 16, fontWeight: 800, color: '#1a1a2e', minWidth: 40, textAlign: 'center' }}>
                {quantity}
              </span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#64748b', fontWeight: 700 }}>
                +
              </button>
            </div>
            <span style={{ fontSize: 13, color: product.stock > 0 ? '#059669' : '#ef4444', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ ${product.stock} adet stokta` : '✗ Stokta yok'}
            </span>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '15px', background: product.stock === 0 ? '#e2e8f0' : 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
                color: product.stock === 0 ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: 14, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontSize: 15, fontWeight: 800,
                boxShadow: product.stock === 0 ? 'none' : '0 4px 16px rgba(15,94,168,0.35)',
                transition: 'all 0.2s',
              }}>
              <ShoppingCart style={{ width: 19, height: 19 }} />
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </button>
            <button onClick={handleFavorite}
              style={{
                padding: '15px 18px', background: faved ? '#fff5f5' : '#fff',
                border: `1.5px solid ${faved ? '#fca5a5' : '#e2e8f0'}`,
                borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
              <Heart style={{ width: 20, height: 20, color: faved ? '#ef4444' : '#94a3b8', fill: faved ? '#ef4444' : 'transparent' }} />
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {[
              { icon: Shield, label: 'Güvenli Alışveriş', sub: 'Alıcı güvencesi', color: '#059669', bg: '#ecfdf5' },
              { icon: Truck, label: 'Hızlı Kargo', sub: 'Ücretsiz teslimat', color: '#0F5EA8', bg: '#eff6ff' },
            ].map(({ icon: Icon, label, sub, color, bg }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: bg }}>
                <Icon style={{ width: 18, height: 18, color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e8edf2' }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>Ürün Açıklaması</h2>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
