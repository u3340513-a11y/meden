import { useQuery } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { ShoppingBag, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'
import type { Product, Category } from '@/types'

const CONDITIONS = [
  { value: '', label: 'Tümü' },
  { value: 'new', label: '🆕 Sıfır' },
  { value: 'lightly_used', label: '✨ Az Kullanılmış' },
  { value: 'used', label: '♻️ İkinci El' },
]

const SORTS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Fiyat: Düşük → Yüksek' },
  { value: 'price_desc', label: 'Fiyat: Yüksek → Düşük' },
]

const FILTER_BTN = (active: boolean): React.CSSProperties => ({
  display: 'block', width: '100%', textAlign: 'left',
  padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: active ? 700 : 500,
  background: active ? '#eff6ff' : 'transparent',
  color: active ? '#0F5EA8' : '#64748b',
  transition: 'all 0.15s',
})

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const params = {
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
  }

  const updateParam = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams)
    if (value) sp.set(key, value)
    else sp.delete(key)
    sp.set('page', '1')
    setSearchParams(sp)
  }

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data.data as Category[] },
  })

  const { data: response, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const qs = new URLSearchParams()
      if (params.category) qs.set('category', params.category)
      if (params.condition) qs.set('condition', params.condition)
      if (params.search) qs.set('search', params.search)
      if (params.sort) qs.set('sort', params.sort)
      qs.set('page', params.page)
      const { data } = await api.get(`/products?${qs.toString()}`)
      return data.data as { data: Product[]; last_page: number; current_page: number; total: number }
    },
  })

  const products = response?.data || []
  const hasActiveFilter = params.category || params.condition || params.search

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e' }}>Ürünler</h1>
          {response && (
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{response.total} ürün bulundu</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Sort */}
          <select value={params.sort} onChange={e => updateParam('sort', e.target.value)}
            style={{
              padding: '10px 14px', background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer',
              outline: 'none',
            }}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {/* Mobile filter toggle */}
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', background: filtersOpen ? '#eff6ff' : '#fff',
              border: `1.5px solid ${filtersOpen ? '#0F5EA8' : '#e2e8f0'}`,
              borderRadius: 12, fontSize: 13, fontWeight: 600, color: filtersOpen ? '#0F5EA8' : '#475569',
              cursor: 'pointer',
            }}>
            <SlidersHorizontal style={{ width: 15, height: 15 }} />
            Filtrele
            {hasActiveFilter && (
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        {filtersOpen && (
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 88 }}>
            <div style={{
              background: '#fff', borderRadius: 16, border: '1.5px solid #e8edf2',
              padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1a2e' }}>Filtreler</span>
                {hasActiveFilter && (
                  <button onClick={() => setSearchParams({})}
                    style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <X style={{ width: 12, height: 12 }} /> Temizle
                  </button>
                )}
              </div>

              {/* Condition */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Ürün Durumu
                </h3>
                {CONDITIONS.map(c => (
                  <button key={c.value} onClick={() => updateParam('condition', c.value)}
                    style={FILTER_BTN(params.condition === c.value)}>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Categories */}
              {categories && categories.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                    Kategori
                  </h3>
                  <button onClick={() => updateParam('category', '')} style={FILTER_BTN(!params.category)}>
                    Tümü
                  </button>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {categories.map(cat => (
                      <div key={cat.id}>
                        <button onClick={() => updateParam('category', String(cat.id))}
                          style={FILTER_BTN(params.category === String(cat.id))}>
                          {cat.name}
                        </button>
                        {(cat as any).children?.map((sub: Category) => (
                          <button key={sub.id} onClick={() => updateParam('category', String(sub.id))}
                            style={{ ...FILTER_BTN(params.category === String(sub.id)), paddingLeft: 22, fontSize: 12 }}>
                            ↳ {sub.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Products grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ borderRadius: 16, aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag style={{ width: 32, height: 32, color: '#cbd5e1' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Ürün bulunamadı</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Filtrelerinizi değiştirerek tekrar deneyin.</p>
              {hasActiveFilter && (
                <button onClick={() => setSearchParams({})}
                  style={{ padding: '10px 20px', background: '#0F5EA8', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  Filtreleri Temizle
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                {products.map(product => (
                  <Link key={product.id} to={`/urunler/${product.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="card" style={{ overflow: 'hidden', padding: 0, transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
                      {/* Image */}
                      <div style={{ aspectRatio: '1', background: 'linear-gradient(135deg,#f8fafc,#e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {product.cover_image ? (
                          <img src={product.cover_image} alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ShoppingBag style={{ width: 40, height: 40, color: '#cbd5e1' }} />
                        )}
                        {/* Condition badge */}
                        {(product as any).condition && (
                          <span style={{
                            position: 'absolute', top: 10, left: 10,
                            fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 999,
                            background: 'rgba(255,255,255,0.92)', color: '#475569',
                            backdropFilter: 'blur(4px)',
                          }}>
                            {(product as any).condition_label || (product as any).condition}
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ padding: '14px 16px' }}>
                        <h3 style={{
                          fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 8,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4,
                        }}>
                          {product.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span style={{ fontSize: 17, fontWeight: 900, color: '#0F5EA8' }}>
                            {product.current_price.toLocaleString('tr-TR')} ₺
                          </span>
                          {product.discounted_price && (
                            <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>
                              {product.price.toLocaleString('tr-TR')} ₺
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {response && response.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40 }}>
                  {Array.from({ length: response.last_page }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => updateParam('page', String(page))}
                      style={{
                        width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
                        background: page === response.current_page ? '#0F5EA8' : '#f1f5f9',
                        color: page === response.current_page ? '#fff' : '#64748b',
                      }}>
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
