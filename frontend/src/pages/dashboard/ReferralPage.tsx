import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Copy, Share2, Users, Link2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReferralPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-referral'],
    queryFn: async () => { const { data } = await api.get('/profile/referral'); return data.data },
  })

  const copyLink = () => {
    navigator.clipboard.writeText(data?.referral_link || '')
    toast.success('Referans linki kopyalandı!')
  }
  const copyCode = () => {
    navigator.clipboard.writeText(data?.referral_code || '')
    toast.success('Referans kodu kopyalandı!')
  }

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
    </div>
  )

  return (
    <div style={{ maxWidth: 680 }} className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>Referanslarım</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Arkadaşlarını davet et, topluluğu büyüt</p>
      </div>

      {/* Hero card */}
      <div style={{
        background: 'linear-gradient(135deg,#E2B93B,#d4a82e)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 20,
        boxShadow: '0 8px 32px rgba(226,185,59,0.25)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Share2 style={{ width: 28, height: 28, color: '#1a1a2e' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Davet Et & Kazan</h2>
          <p style={{ fontSize: 13, color: 'rgba(26,26,46,0.7)' }}>
            Referans linkiniz olmadan sisteme kayıt yapılamaz. Davet ettiğiniz kişiler toplulukta sizin sayınıza eklenir.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users style={{ width: 22, height: 22, color: '#0F5EA8' }} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0F5EA8' }}>{data?.referral_count ?? 0}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Davet Edilen Kişi</div>
          </div>
        </div>
        <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: 22, height: 22, color: '#16a34a' }} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>{data?.referral_count ?? 0}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Aktif Üye</div>
          </div>
        </div>
      </div>

      {/* Code & Link */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Referans Kodunuz
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text" value={data?.referral_code || ''} readOnly
              style={{
                flex: 1, padding: '13px 16px', background: '#f8fafc',
                border: '1.5px solid #e2e8f0', borderRadius: 12,
                fontFamily: 'monospace', fontSize: 18, fontWeight: 700,
                letterSpacing: '0.2em', color: '#0F5EA8',
              }}
            />
            <button onClick={copyCode} style={{
              padding: '13px 18px', background: '#0F5EA8', color: '#fff',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 600, fontSize: 13,
              boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
              transition: 'all 0.15s',
            }}>
              <Copy style={{ width: 15, height: 15 }} />
              Kopyala
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Referans Linkiniz
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Link2 style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94a3b8' }} />
              <input
                type="text" value={data?.referral_link || ''} readOnly
                style={{
                  width: '100%', padding: '13px 16px 13px 40px',
                  background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12,
                  fontSize: 13, color: '#475569', fontFamily: 'inherit',
                }}
              />
            </div>
            <button onClick={copyLink} style={{
              padding: '13px 18px', background: '#f8fafc',
              border: '1.5px solid #e2e8f0', borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontWeight: 600, fontSize: 13, color: '#64748b',
              transition: 'all 0.15s',
            }}>
              <Copy style={{ width: 15, height: 15 }} />
              Kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
