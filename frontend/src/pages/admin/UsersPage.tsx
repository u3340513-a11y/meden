import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Users } from 'lucide-react'

const ROLE_MAP: Record<string, { label: string; color: string; bg: string }> = {
  super_admin: { label: 'Süper Admin', color: '#7c3aed', bg: '#f5f3ff' },
  admin: { label: 'Admin', color: '#0F5EA8', bg: '#eff6ff' },
  user: { label: 'Üye', color: '#64748b', bg: '#f1f5f9' },
}

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '13px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => { const { data } = await api.get('/admin/users'); return data.data },
  })

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>Kullanıcılar</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            {data?.total ?? (data?.data?.length ?? 0)} kullanıcı listeleniyor
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Users style={{ width: 20, height: 20, color: '#0F5EA8' }} />
        </div>
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={TH}>Ad Soyad</th>
                  <th style={TH}>E-posta</th>
                  <th style={TH}>Rol</th>
                  <th style={TH}>Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((user: any, idx: number) => (
                  <tr key={user.id} style={{
                    borderBottom: idx < data.data.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#0F5EA8,#1A7FD4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>
                          {user.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {(() => {
                        const r = ROLE_MAP[user.role] || ROLE_MAP.user
                        return (
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '4px 10px',
                            borderRadius: 999, color: r.color, background: r.bg,
                          }}>
                            {r.label}
                          </span>
                        )
                      })()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {new Date(user.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.data || data.data.length === 0) && (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                Kullanıcı bulunamadı.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
