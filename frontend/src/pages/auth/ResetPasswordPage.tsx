import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const MIN_PASSWORD_LENGTH = 8

export default function ResetPasswordPage() {
  const { token = '' } = useParams()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        token, email, password, password_confirmation: confirmation,
      })
      toast.success('Şifreniz değiştirildi. Giriş yapabilirsiniz.')
      navigate('/giris')
    } catch (err: any) {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach(msg => toast.error(msg as string))
      else toast.error(err.response?.data?.message || 'Şifre sıfırlanamadı.')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="animate-slide-up" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>Geçersiz bağlantı</h2>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>Şifre sıfırlama bağlantısı eksik veya hatalı.</p>
        <Link to="/sifremi-unuttum" style={{ color: '#0F5EA8', fontWeight: 700, textDecoration: 'none' }}>
          Yeni bağlantı iste →
        </Link>
      </div>
    )
  }

  const inputStyle = { paddingLeft: 42, paddingRight: 44 }
  const iconStyle = { position: 'absolute' as const, left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }
  const canSubmit = !loading && password.length >= MIN_PASSWORD_LENGTH && password === confirmation

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Yeni şifre belirleyin 🔐
        </h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>{email} hesabı için yeni bir şifre girin</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Yeni şifre</label>
          <div style={{ position: 'relative' }}>
            <Lock style={iconStyle} />
            <input
              type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              className="field" style={inputStyle}
              placeholder="En az 8 karakter, 1 büyük harf, 1 rakam"
              required autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
              style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
              {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Yeni şifre (tekrar)</label>
          <div style={{ position: 'relative' }}>
            <Lock style={iconStyle} />
            <input
              type={showPw ? 'text' : 'password'} value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
              className="field" style={inputStyle}
              placeholder="Şifreyi tekrar girin"
              required autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" disabled={!canSubmit}
          style={{
            width: '100%', padding: '13px', marginTop: 4,
            background: canSubmit ? 'linear-gradient(135deg, #0F5EA8, #1A7FD4)' : '#94a3b8',
            color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 12,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit ? '0 4px 16px rgba(15,94,168,0.3)' : 'none',
          }}>
          {loading ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, marginTop: 20 }}>
        <Link to="/giris" style={{ color: '#0F5EA8', fontWeight: 700, textDecoration: 'none' }}>Giriş sayfasına dön</Link>
      </p>
    </div>
  )
}
