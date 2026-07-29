import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { MapPin, Plus, Trash2, Star, X, Check } from 'lucide-react'

interface AddressFormProps { onClose: () => void }

function AddressModal({ onClose }: AddressFormProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: '', address_line: '',
    city_id: '', district_id: '', postal_code: '', is_default: false,
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => { const { data } = await api.get('/cities'); return data },
  })

  const selectedCity = cities.find((c: any) => String(c.id) === String(form.city_id))
  const districts: any[] = selectedCity?.districts ?? []

  const save = useMutation({
    mutationFn: () => api.post('/addresses', {
      title: form.title,
      address_line: form.address_line,
      city_id: Number(form.city_id),
      district_id: Number(form.district_id),
      postal_code: form.postal_code || undefined,
      is_default: form.is_default,
    }),
    onSuccess: () => {
      toast.success('Adres eklendi.')
      qc.invalidateQueries({ queryKey: ['addresses'] })
      onClose()
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((m: any) => toast.error(String(m)))
      else toast.error(err.response?.data?.message || 'Adres eklenemedi.')
    },
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>Yeni Adres Ekle</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Adres Başlığı *</label>
            <input className="field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ev, İş, vb." />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Açık Adres *</label>
            <textarea className="field" value={form.address_line} onChange={e => set('address_line', e.target.value)}
              placeholder="Mahalle, sokak, bina no, daire..." rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>İl *</label>
              <select className="field" value={form.city_id}
                onChange={e => { set('city_id', e.target.value); set('district_id', '') }}
                disabled={citiesLoading}>
                <option value="">— İl Seçin —</option>
                {cities.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>İlçe *</label>
              <select className="field" value={form.district_id} onChange={e => set('district_id', e.target.value)} disabled={!form.city_id}>
                <option value="">— İlçe Seçin —</option>
                {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Posta Kodu</label>
            <input className="field" value={form.postal_code} onChange={e => set('postal_code', e.target.value)} placeholder="34XXX" maxLength={5} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="is_default" checked={form.is_default} onChange={e => set('is_default', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#0F5EA8' }} />
            <label htmlFor="is_default" style={{ fontSize: 13, color: '#475569', cursor: 'pointer', fontWeight: 500 }}>
              Varsayılan adres olarak ayarla
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>İptal</button>
          <button onClick={() => save.mutate()}
            disabled={!form.title || !form.address_line || !form.city_id || !form.district_id || save.isPending}
            style={{
              padding: '10px 20px', background: '#0F5EA8', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              opacity: (!form.title || !form.address_line || !form.city_id || !form.district_id || save.isPending) ? 0.6 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <Check style={{ width: 14, height: 14 }} />
            {save.isPending ? 'Kaydediliyor...' : 'Adresi Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}


export default function AddressesPage() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => { const { data } = await api.get('/addresses'); return data.data },
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/addresses/${id}`),
    onSuccess: () => { toast.success('Adres silindi.'); qc.invalidateQueries({ queryKey: ['addresses'] }) },
    onError: () => toast.error('Adres silinemedi.'),
  })

  const setDefault = useMutation({
    mutationFn: (id: number) => api.put(`/addresses/${id}`, { is_default: true }),
    onSuccess: () => { toast.success('Varsayılan adres güncellendi.'); qc.invalidateQueries({ queryKey: ['addresses'] }) },
  })

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Adreslerim</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{addresses?.length ?? 0} kayıtlı adres</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', background: '#0F5EA8', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontSize: 13, fontWeight: 700,
          boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
        }}>
          <Plus style={{ width: 15, height: 15 }} />
          Adres Ekle
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)}
        </div>
      ) : !addresses?.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f8fafc', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MapPin style={{ width: 28, height: 28, color: '#cbd5e1' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz adresiniz yok</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Sipariş verirken kullanmak için adres ekleyin.</p>
          <button onClick={() => setShowModal(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: '#0F5EA8', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>
            <Plus style={{ width: 15, height: 15 }} /> İlk Adresi Ekle
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {addresses.map((addr: any) => (
            <div key={addr.id} className="card" style={{
              padding: 22,
              borderLeft: addr.is_default ? '3px solid #0F5EA8' : '3px solid transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin style={{ width: 17, height: 17, color: '#0F5EA8' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{addr.title}</h3>
                    {addr.is_default && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#0F5EA8', background: '#eff6ff', padding: '2px 7px', borderRadius: 999 }}>
                        Varsayılan
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!addr.is_default && (
                    <button onClick={() => setDefault.mutate(addr.id)}
                      title="Varsayılan yap"
                      style={{ padding: 6, background: '#fffbeb', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#d97706', display: 'flex' }}>
                      <Star style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                  <button onClick={() => { if (confirm('Bu adresi silmek istiyor musunuz?')) remove.mutate(addr.id) }}
                    style={{ padding: 6, background: '#fff5f5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 600 }}>{addr.full_name} · {addr.phone}</p>
                <p style={{ color: '#64748b' }}>{addr.address_line}</p>
                <p style={{ color: '#94a3b8' }}>{addr.district?.name || addr.district_name}, {addr.city?.name || addr.city_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <AddressModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
