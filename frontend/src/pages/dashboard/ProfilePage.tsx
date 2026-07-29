import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Save, Shield } from 'lucide-react'

const ROLE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  super_admin: { label: 'Süper Admin', color: '#7c3aed', bg: '#f5f3ff' },
  admin: { label: 'Admin', color: '#0F5EA8', bg: '#eff6ff' },
  seller: { label: 'Satıcı', color: '#059669', bg: '#ecfdf5' },
  user: { label: 'Üye', color: '#64748b', bg: '#f1f5f9' },
}

export default function ProfilePage() {
  const { user, fetchUser } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)

  const role = ROLE_MAP[user?.role ?? 'user'] || ROLE_MAP.user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/profile', form)
      await fetchUser()
      toast.success('Profil güncellendi.')
    } catch { toast.error('Güncelleme başarısız.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 640 }} className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Profilim</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Hesap bilgilerinizi güncelleyin</p>
      </div>

      {/* Avatar card */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e' }}>{user?.name}</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{user?.email}</p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
            color: role.color, background: role.bg, marginTop: 6,
          }}>
            <Shield style={{ width: 11, height: 11 }} />
            {role.label}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 }}>Bilgileri Düzenle</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <User style={{ width: 13, height: 13 }} /> Ad Soyad
            </label>
            <input className="field" type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Mail style={{ width: 13, height: 13 }} /> E-posta
            </label>
            <input className="field" type="email" value={user?.email} disabled
              style={{ opacity: 0.55, cursor: 'not-allowed', background: '#f8fafc' }} />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>E-posta adresi değiştirilemez.</p>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Phone style={{ width: 13, height: 13 }} /> Telefon
            </label>
            <input className="field" type="tel" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="05xx xxx xx xx" />
          </div>
          <div style={{ paddingTop: 4 }}>
            <button type="submit" disabled={loading} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', background: '#0F5EA8', color: '#fff',
              border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
            }}>
              <Save style={{ width: 15, height: 15 }} />
              {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
