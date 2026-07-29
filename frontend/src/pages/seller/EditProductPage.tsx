import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { Package, X, ImageIcon, ChevronRight, Info, Loader } from 'lucide-react'

const CONDITIONS = [
  { value: 'new', label: '🆕 Sıfır', desc: 'Hiç kullanılmamış, orijinal ambalajında' },
  { value: 'lightly_used', label: '✨ Az Kullanılmış', desc: 'Birkaç kez kullanılmış, kusursuz durumda' },
  { value: 'used', label: '♻️ İkinci El', desc: 'Kullanım izleri olabilir' },
]

const LABEL: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: '#64748b',
  display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em',
}

export default function SellerEditProductPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: '', description: '', category_id: '',
    price: '', discounted_price: '', stock: '1',
    condition: 'new',
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [removeIds, setRemoveIds] = useState<number[]>([])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data.data ?? data },
  })

  const { data: product, isLoading } = useQuery({
    queryKey: ['seller-product', id],
    queryFn: async () => {
      const { data } = await api.get(`/seller/products/${id}`)
      return data.data ?? data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (!product) return
    setForm({
      name: product.name ?? '',
      description: product.description ?? '',
      category_id: String(product.category?.id ?? ''),
      price: String(product.price ?? ''),
      discounted_price: String(product.discounted_price ?? ''),
      stock: String(product.stock ?? '1'),
      condition: product.condition ?? 'new',
    })
    setExistingImages(product.images ?? [])
  }, [product])

  const handleImages = (files: FileList | null) => {
    if (!files) return
    const total = existingImages.length - removeIds.length + newImages.length
    const arr = Array.from(files).slice(0, 10 - total)
    setNewImages(prev => [...prev, ...arr])
    setNewPreviews(prev => [...prev, ...arr.map(f => URL.createObjectURL(f))])
  }

  const removeExisting = (imgId: number) => {
    setRemoveIds(prev => [...prev, imgId])
    setExistingImages(prev => prev.filter(i => i.id !== imgId))
  }

  const removeNew = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx))
    setNewPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const submit = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      newImages.forEach(img => fd.append('images[]', img))
      removeIds.forEach(rid => fd.append('remove_images[]', String(rid)))
      fd.append('_method', 'PUT')
      return api.post(`/seller/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => {
      toast.success('Ürün güncellendi!')
      navigate('/satis/urunlerim')
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((m: any) => toast.error(String(m)))
      else toast.error(err.response?.data?.message || 'Ürün güncellenemedi.')
    },
  })

  const totalImages = existingImages.length + newImages.length
  const isValid = form.name && form.description && form.category_id && form.price && form.stock

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
      <Loader style={{ width: 32, height: 32, color: '#0F5EA8', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <button onClick={() => navigate('/satis/urunlerim')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 600, padding: 0 }}>
          Ürünlerim
        </button>
        <ChevronRight style={{ width: 14, height: 14, color: '#cbd5e1' }} />
        <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 700 }}>Ürün Düzenle</span>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Ürün Düzenle</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Ürün Kondisyonu *</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {CONDITIONS.map(c => (
              <button key={c.value} onClick={() => set('condition', c.value)} style={{
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: form.condition === c.value ? '2px solid #0F5EA8' : '1.5px solid #e2e8f0',
                background: form.condition === c.value ? '#eff6ff' : '#fff',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: form.condition === c.value ? '#0F5EA8' : '#1a1a2e', marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Temel Bilgiler</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={LABEL}>Ürün Adı *</label>
              <input className="field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ürün adı" />
            </div>
            <div>
              <label style={LABEL}>Kategori *</label>
              <select className="field" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                <option value="">— Kategori Seçin —</option>
                {(categories as any[]).map((cat: any) => (
                  <optgroup key={cat.id} label={cat.name}>
                    <option value={cat.id}>{cat.name} (Genel)</option>
                    {cat.children?.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label style={LABEL}>Açıklama *</label>
              <textarea className="field" value={form.description} onChange={e => set('description', e.target.value)}
                rows={5} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Fiyat & Stok</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={LABEL}>Satış Fiyatı (₺) *</label>
              <input className="field" type="number" min="1" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label style={LABEL}>İndirimli Fiyat (₺)</label>
              <input className="field" type="number" min="1" step="0.01" value={form.discounted_price} onChange={e => set('discounted_price', e.target.value)} placeholder="İsteğe bağlı" />
            </div>
            <div>
              <label style={LABEL}>Stok *</label>
              <input className="field" type="number" min="1" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
          </div>
          {form.discounted_price && Number(form.discounted_price) >= Number(form.price) && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, padding: '10px 14px', background: '#fff5f5', borderRadius: 10 }}>
              <Info style={{ width: 14, height: 14, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#ef4444' }}>İndirimli fiyat, normal fiyattan düşük olmalıdır.</p>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Ürün Görselleri</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>En fazla 10 görsel. İlk görsel kapak fotoğrafı olur.</p>

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              {existingImages.map((img, idx) => (
                <div key={img.id} style={{ position: 'relative', width: 90, height: 90 }}>
                  <img src={img.url || img.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1.5px solid #e2e8f0' }} />
                  {idx === 0 && <span style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 9, fontWeight: 700, background: '#0F5EA8', color: '#fff', padding: '2px 5px', borderRadius: 4 }}>KAPAK</span>}
                  <button onClick={() => removeExisting(img.id)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X style={{ width: 11, height: 11, color: '#fff' }} />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, idx) => (
                <div key={`new-${idx}`} style={{ position: 'relative', width: 90, height: 90 }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1.5px solid #0F5EA8' }} />
                  <button onClick={() => removeNew(idx)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X style={{ width: 11, height: 11, color: '#fff' }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalImages < 10 && (
            <div onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed #e2e8f0', borderRadius: 14, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5EA8'; e.currentTarget.style.background = '#eff6ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fafafa' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <ImageIcon style={{ width: 20, height: 20, color: '#0F5EA8' }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Görsel Ekle</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>JPG/PNG/WEBP, maks. 5MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => handleImages(e.target.files)} />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingBottom: 40 }}>
          <button onClick={() => navigate('/satis/urunlerim')}
            style={{ padding: '12px 24px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            İptal
          </button>
          <button onClick={() => submit.mutate()}
            disabled={!isValid || submit.isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', background: '#0F5EA8', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              opacity: (!isValid || submit.isPending) ? 0.6 : 1,
              boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
            }}>
            <Package style={{ width: 16, height: 16 }} />
            {submit.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
