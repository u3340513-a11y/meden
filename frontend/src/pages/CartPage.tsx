import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShoppingCart, Lock } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

export default function CartPage() {
  const { items, total, isLoading, fetch, updateQuantity, removeItem, clear } = useCartStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => { if (isAuthenticated) fetch() }, [isAuthenticated])

  if (!isAuthenticated) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%', background: '#eff6ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
      }}>
        <ShoppingCart style={{ width: 36, height: 36, color: '#0F5EA8' }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Sepeti görüntülemek için giriş yapın</h2>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Ürünlerinizi sepete ekleyip güvenle alışveriş yapın.</p>
      <Link to="/giris" className="btn btn-primary">Giriş Yap <ArrowRight style={{ width: 16, height: 16 }} /></Link>
    </div>
  )

  if (isLoading) return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 16 }} />)}
      </div>
    </div>
  )

  if (items.length === 0) return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%', background: '#f8fafc',
        border: '2px dashed #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
      }}>
        <ShoppingBag style={{ width: 40, height: 40, color: '#cbd5e1' }} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Sepetiniz boş</h2>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>Beğendiğiniz ürünleri sepete ekleyin.</p>
      <Link to="/urunler" className="btn btn-primary" style={{ fontSize: 15 }}>
        Alışverişe Başla <ArrowRight style={{ width: 16, height: 16 }} />
      </Link>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>
            Sepetim
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{items.length} ürün</p>
        </div>
        <button onClick={clear} style={{
          fontSize: 13, color: '#ef4444', background: '#fff5f5',
          border: '1px solid #fecaca', borderRadius: 8, padding: '7px 14px',
          cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
        }}>
          Sepeti Temizle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Cart items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link to={`/urunler/${item.product_slug}`}
                style={{ width: 84, height: 84, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.cover_image
                  ? <img src={item.cover_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <ShoppingBag style={{ width: 28, height: 28, color: '#cbd5e1' }} />
                }
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/urunler/${item.product_slug}`} style={{
                  fontSize: 14, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {item.product_name}
                </Link>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F5EA8', marginTop: 4 }}>
                  {Number(item.price).toLocaleString('tr-TR')} ₺
                </div>
              </div>
              {/* Quantity + remove */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{ padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                    <Minus style={{ width: 14, height: 14 }} />
                  </button>
                  <span style={{ padding: '0 12px', fontSize: 14, fontWeight: 700, color: '#1a1a2e', minWidth: 32, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                    style={{ padding: '7px 10px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                    <Plus style={{ width: 14, height: 14 }} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)}
                  style={{ padding: 8, background: '#fff5f5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                  <Trash2 style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>Sipariş Özeti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
              <span>Ara Toplam</span>
              <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{Number(total).toLocaleString('tr-TR')} ₺</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
              <span>Kargo</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>Ücretsiz</span>
            </div>
          </div>
          <div style={{ height: 1, background: '#f1f5f9', marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Toplam</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#0F5EA8' }}>
              {Number(total).toLocaleString('tr-TR')} ₺
            </span>
          </div>
          <Link to="/odeme" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '14px', textDecoration: 'none',
            background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)', color: '#fff',
            fontWeight: 700, fontSize: 15, borderRadius: 12,
            boxShadow: '0 4px 16px rgba(15,94,168,0.3)',
            transition: 'all 0.2s',
          }}>
            <Lock style={{ width: 15, height: 15 }} />
            Güvenli Ödemeye Geç
          </Link>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
            🔒 256-bit SSL ile korumalı ödeme
          </p>
        </div>
      </div>
    </div>
  )
}
