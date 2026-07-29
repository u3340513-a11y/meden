import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, User, Mail, Lock, Hash, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const Field = ({
  icon: Icon, label, children, hint
}: { icon: any; label: string; children: React.ReactNode; hint?: React.ReactNode }) => (
  <div>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8', zIndex: 1 }} />
      {children}
    </div>
    {hint}
  </div>
)

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    referral_code: searchParams.get('ref') || '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refValid, setRefValid] = useState<boolean | null>(null)
  const [refName, setRefName] = useState('')
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  useEffect(() => {
    if (form.referral_code.length === 8) {
      api.get(`/auth/referral/${form.referral_code}/validate`)
        .then(({ data }) => { setRefValid(true); setRefName(data.data.referrer_name) })
        .catch(() => { setRefValid(false); setRefName('') })
    } else { setRefValid(null); setRefName('') }
  }, [form.referral_code])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!refValid) return toast.error('Geçerli bir referans kodu gerekli.')
    setLoading(true)
    try {
      await register(form)
      toast.success('Kayıt başarılı! E-posta doğrulama bağlantısı gönderildi. 📧')
      navigate('/giris')
    } catch (err: any) {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach(msg => toast.error(msg as string))
      else toast.error(err.response?.data?.message || 'Kayıt başarısız.')
    } finally { setLoading(false) }
  }

  const inputStyle = { paddingLeft: 42, paddingRight: 16 }

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Hesap Oluştur 🚀
        </h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Topluluğa katılmak için referans kodun gerekli</p>
      </div>

      {/* Referral banner */}
      {refValid === true && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', background: '#f0fdf4',
          border: '1px solid #bbf7d0', borderRadius: 12, marginBottom: 20,
        }}>
          <CheckCircle style={{ width: 18, height: 18, color: '#16a34a', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
            <strong>{refName}</strong> tarafından davet edildiniz ✓
          </p>
        </div>
      )}
      {refValid === false && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', background: '#fff5f5',
          border: '1px solid #fecaca', borderRadius: 12, marginBottom: 20,
        }}>
          <XCircle style={{ width: 18, height: 18, color: '#dc2626', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>Geçersiz referans kodu</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field icon={Hash} label="Referans Kodu *">
          <input
            type="text" value={form.referral_code}
            onChange={e => set('referral_code', e.target.value.toUpperCase())}
            className="field" style={{ ...inputStyle, letterSpacing: '0.12em', fontWeight: 600 }}
            placeholder="XXXXXXXX" maxLength={8} required
          />
        </Field>

        <Field icon={User} label="Ad Soyad">
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            className="field" style={inputStyle} placeholder="Adınız Soyadınız" required autoComplete="name" />
        </Field>

        <Field icon={Mail} label="E-posta Adresi">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className="field" style={inputStyle} placeholder="ornek@email.com" required autoComplete="email" />
        </Field>

        <Field icon={Lock} label="Şifre">
          <input
            type={showPw ? 'text' : 'password'} value={form.password}
            onChange={e => set('password', e.target.value)}
            className="field" style={{ ...inputStyle, paddingRight: 44 }}
            placeholder="En az 8 karakter" required autoComplete="new-password"
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex',
            }}>
            {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
          </button>
        </Field>

        <Field icon={Lock} label="Şifre Tekrar">
          <input
            type={showPw ? 'text' : 'password'} value={form.password_confirmation}
            onChange={e => set('password_confirmation', e.target.value)}
            className="field" style={inputStyle} placeholder="Şifreyi tekrar girin"
            required autoComplete="new-password"
          />
        </Field>

        {/* Password strength bar */}
        {form.password.length > 0 && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => {
                const score = Math.min(4, Math.floor(form.password.length / 2))
                return (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: i <= score
                      ? score <= 1 ? '#ef4444' : score <= 2 ? '#f97316' : score <= 3 ? '#eab308' : '#22c55e'
                      : '#e2e8f0',
                    transition: 'background 0.3s',
                  }} />
                )
              })}
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>
              {form.password.length < 4 ? 'Çok kısa' : form.password.length < 6 ? 'Zayıf' : form.password.length < 8 ? 'Orta' : 'Güçlü'}
            </p>
          </div>
        )}

        <button type="submit" disabled={loading || !refValid}
          style={{
            width: '100%', padding: '13px', marginTop: 4,
            background: (!refValid || loading) ? '#94a3b8' : 'linear-gradient(135deg, #0F5EA8, #1A7FD4)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            border: 'none', borderRadius: 12, cursor: (loading || !refValid) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: (!refValid || loading) ? 'none' : '0 4px 16px rgba(15,94,168,0.3)',
          }}>
          {loading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              Kayıt oluşturuluyor...
            </>
          ) : (
            <>Kayıt Ol <ArrowRight style={{ width: 16, height: 16 }} /></>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
          Kayıt olarak{' '}
          <a href="#" style={{ color: '#0F5EA8', textDecoration: 'none' }}>Kullanım Koşulları</a>
          {' '}ve{' '}
          <a href="#" style={{ color: '#0F5EA8', textDecoration: 'none' }}>Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
        </p>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        <span style={{ fontSize: 12, color: '#94a3b8' }}>veya</span>
        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
        Zaten hesabınız var mı?{' '}
        <Link to="/giris" style={{ color: '#0F5EA8', fontWeight: 700, textDecoration: 'none' }}>
          Giriş Yap →
        </Link>
      </p>
    </div>
  )
}
