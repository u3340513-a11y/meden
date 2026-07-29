import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useCartStore } from '@/stores/cartStore'
import toast from 'react-hot-toast'
import type { Address } from '@/types'
import { MapPin, FileText, Lock, ShoppingBag, Plus, CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const { total, items } = useCartStore()
  const navigate = useNavigate()

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => { const { data } = await api.get('/addresses'); return data.data as Address[] },
  })

  const handleOrder = async () => {
    if (!selectedAddress) return toast.error('Lütfen teslimat adresi seçin.')
    setLoading(true)
    try {
      const { data } = await api.post('/checkout', { address_id: selectedAddress, note })
      toast.success(`✓ Sipariş oluşturuldu: ${data.data.order_no}`)
      navigate('/siparislerim')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı.')
    } finally {
      setLoading(false)
    }
  }

  const SECTION: React.CSSProperties = {
    background: '#fff', borderRadius: 16, border: '1.5px solid #e8edf2',
    padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 20px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock style={{ width: 17, height: 17, color: '#0F5EA8' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e' }}>Güvenli Ödeme</h1>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', paddingLeft: 46 }}>🔒 256-bit SSL şifreleme ile korumalı</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Address */}
          <div style={SECTION}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin style={{ width: 18, height: 18, color: '#0F5EA8' }} />
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>Teslimat Adresi</h2>
              </div>
              <Link to="/adreslerim" style={{
                fontSize: 12, fontWeight: 700, color: '#0F5EA8', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                background: '#eff6ff', borderRadius: 8,
              }}>
                <Plus style={{ width: 12, height: 12 }} /> Adres Ekle
              </Link>
            </div>

            {addresses && addresses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {addresses.map(addr => (
                  <label key={addr.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                    borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s',
                    border: selectedAddress === addr.id ? '2px solid #0F5EA8' : '1.5px solid #e2e8f0',
                    background: selectedAddress === addr.id ? '#eff6ff' : '#fafafa',
                  }}>
                    <div style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
                      <input type="radio" name="address" checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        style={{ width: 18, height: 18, accentColor: '#0F5EA8', cursor: 'pointer' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{addr.title}</span>
                        {addr.is_default && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#0F5EA8', background: '#eff6ff', padding: '2px 7px', borderRadius: 999 }}>
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{addr.address_line}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {addr.district?.name || ''}{addr.district?.name ? ', ' : ''}{addr.city?.name || ''}
                      </p>
                    </div>
                    {selectedAddress === addr.id && (
                      <CheckCircle style={{ width: 18, height: 18, color: '#0F5EA8', flexShrink: 0 }} />
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px 20px', background: '#f8fafc', borderRadius: 12, border: '1.5px dashed #e2e8f0' }}>
                <MapPin style={{ width: 28, height: 28, color: '#cbd5e1', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: '#475569', marginBottom: 4 }}>Kayıtlı adresiniz yok</p>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>Sipariş verebilmek için adres eklemeniz gerekiyor.</p>
                <Link to="/adreslerim" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', background: '#0F5EA8', color: '#fff',
                  borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700,
                }}>
                  <Plus style={{ width: 14, height: 14 }} /> Adres Ekle
                </Link>
              </div>
            )}
          </div>

          {/* Order note */}
          <div style={SECTION}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <FileText style={{ width: 18, height: 18, color: '#64748b' }} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>Sipariş Notu</h2>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Opsiyonel</span>
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              rows={3} maxLength={500}
              placeholder="Siparişle ilgili özel notunuzu buraya yazabilirsiniz..."
              className="field" style={{ resize: 'none' }} />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, textAlign: 'right' }}>
              {note.length}/500
            </p>
          </div>
        </div>

        {/* Right — Order summary */}
        <div style={{ ...SECTION, position: 'sticky', top: 88 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag style={{ width: 18, height: 18, color: '#0F5EA8' }} />
            Sipariş Özeti
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.product_name}
                  <span style={{ color: '#94a3b8' }}> ×{item.quantity}</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', flexShrink: 0 }}>
                  {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Ara Toplam</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{total.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Kargo</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>Ücretsiz</span>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e' }}>Toplam</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0F5EA8' }}>{total.toLocaleString('tr-TR')} ₺</span>
            </div>
          </div>

          <button onClick={handleOrder} disabled={loading || !selectedAddress}
            style={{
              width: '100%', padding: '15px', border: 'none', borderRadius: 14, cursor: 'pointer',
              fontSize: 15, fontWeight: 800,
              background: (!selectedAddress || loading) ? '#e2e8f0' : 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
              color: (!selectedAddress || loading) ? '#94a3b8' : '#fff',
              transition: 'all 0.2s',
              boxShadow: (!selectedAddress || loading) ? 'none' : '0 4px 16px rgba(15,94,168,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            <Lock style={{ width: 16, height: 16 }} />
            {loading ? 'Sipariş oluşturuluyor...' : 'Siparişi Onayla'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
            🔒 256-bit SSL ile korumalı ödeme
          </p>
        </div>
      </div>
    </div>
  )
}
