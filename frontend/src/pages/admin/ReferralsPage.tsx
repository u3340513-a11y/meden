import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Link2, Users } from 'lucide-react'

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function AdminReferralsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-referrals'],
    queryFn: async () => { const { data } = await api.get('/admin/referrals'); return data.data },
  })

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Referans Ağacı</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Tüm kullanıcıların davet ilişkileri</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link2 style={{ width: 20, height: 20, color: '#7c3aed' }} />
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Kullanıcı</th>
                  <th style={TH}>Davet Eden</th>
                  <th style={TH}>Referans Kodu</th>
                  <th style={TH}>Davet Sayısı</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((r: any, idx: number) => (
                  <tr key={r.id}
                    style={{ borderBottom: idx < data.data.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#7c3aed,#9f67ff)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>
                          {r.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {r.referred_by_name || <span style={{ color: '#cbd5e1' }}>— Doğrudan —</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <code style={{ fontSize: 12, fontWeight: 700, background: '#f5f3ff', color: '#7c3aed', padding: '4px 10px', borderRadius: 6, letterSpacing: '0.08em' }}>
                        {r.referral_code}
                      </code>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users style={{ width: 14, height: 14, color: '#7c3aed' }} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: r.referral_count > 0 ? '#7c3aed' : '#94a3b8' }}>
                          {r.referral_count ?? 0}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.data || data.data.length === 0) && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                Henüz referans verisi bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
