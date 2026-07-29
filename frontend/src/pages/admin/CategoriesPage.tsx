import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FolderTree, Plus, Trash2, Edit2, X, Check } from 'lucide-react'

const ICONS: Record<string, string> = {
  'kadin': '👗', 'erkek': '👔', 'cocuk': '🧸', 'ev-yasam': '🏠',
  'elektronik': '💻', 'spor-outdoor': '⚽', 'kozmetik-kisisel-bakim': '💄',
  'kitap-hobi': '📚', 'anne-bebek': '🍼',
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

interface ModalProps { onClose: () => void; editData?: any }

function CategoryModal({ onClose, editData }: ModalProps) {
  const qc = useQueryClient()
  const [name, setName] = useState(editData?.name || '')
  const [slug, setSlug] = useState(editData?.slug || '')
  const [parentId, setParentId] = useState<number | ''>(editData?.parent_id || '')

  const { data: allCats } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await api.get('/admin/categories'); return data.data },
  })

  const save = useMutation({
    mutationFn: () => editData
      ? api.put(`/admin/categories/${editData.id}`, { name, slug, parent_id: parentId || null })
      : api.post('/admin/categories', { name, slug, parent_id: parentId || null }),
    onSuccess: () => {
      toast.success(editData ? 'Kategori güncellendi.' : 'Kategori eklendi.')
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
      onClose()
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'İşlem başarısız.'),
  })

  const autoSlug = (v: string) => {
    setName(v)
    if (!editData) setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>
            {editData ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Kategori Adı *</label>
            <input className="field" value={name} onChange={e => autoSlug(e.target.value)} placeholder="Örn: Kadın Giyim" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Slug</label>
            <input className="field" value={slug} onChange={e => setSlug(e.target.value)} placeholder="kadin-giyim" style={{ fontFamily: 'monospace', fontSize: 13 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Üst Kategori (opsiyonel)</label>
            <select className="field" value={parentId} onChange={e => setParentId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">— Ana Kategori —</option>
              {allCats?.filter((c: any) => !c.parent_id && c.id !== editData?.id).map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0',
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer',
          }}>İptal</button>
          <button onClick={() => save.mutate()} disabled={!name || save.isPending} style={{
            padding: '10px 20px', background: '#0F5EA8', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            opacity: (!name || save.isPending) ? 0.6 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Check style={{ width: 14, height: 14 }} />
            {save.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCategoriesPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await api.get('/admin/categories'); return data.data },
  })

  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => { toast.success('Kategori silindi.'); qc.invalidateQueries({ queryKey: ['admin-categories'] }) },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Silinemedi.'),
  })

  const handleDelete = (cat: any) => {
    if (!confirm(`"${cat.name}" kategorisini silmek istiyor musunuz?`)) return
    remove.mutate(cat.id)
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Kategoriler</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{data?.length ?? 0} kategori</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderTree style={{ width: 20, height: 20, color: '#d97706' }} />
          </div>
          <button onClick={() => { setEditing(null); setModal('add') }} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', background: '#0F5EA8', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
          }}>
            <Plus style={{ width: 15, height: 15 }} />
            Kategori Ekle
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Kategori</th>
                  <th style={TH}>Slug</th>
                  <th style={TH}>Üst Kategori</th>
                  <th style={TH}>Alt Kategoriler</th>
                  <th style={{ ...TH, textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((cat: any, idx: number) => (
                  <tr key={cat.id}
                    style={{ borderBottom: idx < data.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{ICONS[cat.slug] || '🛍️'}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{cat.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <code style={{ fontSize: 12, background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, color: '#475569' }}>{cat.slug}</code>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>
                      {cat.parent?.name || <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {cat.children?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {cat.children.slice(0, 3).map((sub: any) => (
                            <span key={sub.id} style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: 999 }}>
                              {sub.name}
                            </span>
                          ))}
                          {cat.children.length > 3 && (
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>+{cat.children.length - 3}</span>
                          )}
                        </div>
                      ) : <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditing(cat); setModal('edit') }}
                          style={{ padding: '7px 12px', background: '#eff6ff', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#0F5EA8', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                          <Edit2 style={{ width: 13, height: 13 }} /> Düzenle
                        </button>
                        <button onClick={() => handleDelete(cat)}
                          style={{ padding: '7px 12px', background: '#fff5f5', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                          <Trash2 style={{ width: 13, height: 13 }} /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data || data.length === 0) && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                Henüz kategori yok. Eklemek için "Kategori Ekle" butonuna basın.
              </div>
            )}
          </div>
        )}
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <CategoryModal
          onClose={() => { setModal(null); setEditing(null) }}
          editData={modal === 'edit' ? editing : undefined}
        />
      )}
    </div>
  )
}
