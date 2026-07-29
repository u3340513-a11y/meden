import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { csrf } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await csrf()
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Şifre sıfırlama bağlantısı gönderildi.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="animate-slide-up text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📧</span>
        </div>
        <h2 className="text-xl font-bold mb-2">E-posta Gönderildi</h2>
        <p className="text-text-muted text-sm mb-6">Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.</p>
        <Link to="/giris" className="text-sm text-primary font-medium hover:underline">Giriş Sayfasına Dön</Link>
      </div>
    )
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl font-bold mb-1">Şifremi Unuttum</h2>
      <p className="text-text-muted text-sm mb-8">E-posta adresinize sıfırlama bağlantısı göndereceğiz</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">E-posta</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="ornek@email.com" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-text-inverse font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>
      </form>
      <p className="text-center text-sm text-text-muted mt-6">
        <Link to="/giris" className="text-primary font-medium hover:underline">Giriş Yap</Link>
      </p>
    </div>
  )
}
