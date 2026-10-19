import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Props {
  email: string
}

export default function ResendVerification({ email }: Props) {
  const [sending, setSending] = useState(false)

  const resend = async () => {
    setSending(true)
    try {
      await api.post('/auth/email/resend', { email })
      toast.success('Doğrulama e-postası tekrar gönderildi. Spam klasörünü de kontrol edin.')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setSending(false)
    }
  }

  return (
    <button
      type="button" onClick={resend} disabled={sending}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
        background: '#fff', color: '#0F5EA8', fontWeight: 700, fontSize: 14,
        border: '1.5px solid #0F5EA8', borderRadius: 12,
        cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.6 : 1,
      }}
    >
      <Mail style={{ width: 16, height: 16 }} />
      {sending ? 'Gönderiliyor...' : 'Doğrulama e-postasını tekrar gönder'}
    </button>
  )
}
