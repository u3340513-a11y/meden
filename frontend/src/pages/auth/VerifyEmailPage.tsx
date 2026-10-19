import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const { id, hash } = useParams()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const expires = searchParams.get('expires')
    const signature = searchParams.get('signature')
    if (!id || !hash || !expires || !signature) {
      setStatus('error')
      return
    }
    api.get(`/auth/email/verify/${id}/${hash}`, { params: { expires, signature } })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [id, hash, searchParams])

  return (
    <div className="animate-slide-up" style={{ textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <Loader2 style={{ width: 48, height: 48, color: '#0F5EA8', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>E-posta doğrulanıyor...</h2>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle style={{ width: 56, height: 56, color: '#16a34a', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>E-posta adresiniz doğrulandı 🎉</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Artık hesabınıza giriş yapabilirsiniz.</p>
          <Link to="/giris" className="btn" style={{ background: '#0F5EA8', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
            Giriş Yap
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle style={{ width: 56, height: 56, color: '#dc2626', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Doğrulama bağlantısı geçersiz</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            Bağlantının süresi dolmuş olabilir. Giriş sayfasından yeni bir doğrulama e-postası isteyebilirsiniz.
          </p>
          <Link to="/giris" style={{ color: '#0F5EA8', fontWeight: 700, textDecoration: 'none' }}>Giriş sayfasına git →</Link>
        </>
      )}
    </div>
  )
}
