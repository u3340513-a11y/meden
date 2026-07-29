import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Hoş geldiniz! 👋')
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.errors?.email?.[0]
        || err.response?.data?.message
        || 'Giriş başarısız.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Tekrar hoş geldiniz 👋
        </h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          Hesabınıza giriş yapın
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
            E-posta adresi
          </label>
          <div style={{ position: 'relative' }}>
            <Mail style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, color: '#94a3b8',
            }} />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="field" style={{ paddingLeft: 42 }}
              placeholder="ornek@email.com"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>Şifre</label>
            <Link to="/sifremi-unuttum" style={{ fontSize: 12, color: '#0F5EA8', textDecoration: 'none', fontWeight: 500 }}>
              Şifremi Unuttum
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, color: '#94a3b8',
            }} />
            <input
              type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              required className="field" style={{ paddingLeft: 42, paddingRight: 44 }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
                display: 'flex',
              }}>
              {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          style={{
            width: '100%', padding: '13px', marginTop: 4,
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0F5EA8, #1A7FD4)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(15,94,168,0.3)',
          }}>
          {loading ? (
            <>
              <div style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              Giriş yapılıyor...
            </>
          ) : (
            <>Giriş Yap <ArrowRight style={{ width: 16, height: 16 }} /></>
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>veya</span>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
        Hesabınız yok mu?{' '}
        <Link to="/kayit" style={{ color: '#0F5EA8', fontWeight: 700, textDecoration: 'none' }}>
          Ücretsiz Kayıt Ol →
        </Link>
      </p>
    </div>
  )
}
