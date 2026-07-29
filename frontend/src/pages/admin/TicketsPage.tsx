import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Ticket, AlertCircle, Clock, CheckCircle, X, Send, ChevronRight } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open: { label: 'Açık', color: '#d97706', bg: '#fffbeb', icon: AlertCircle },
  in_progress: { label: 'İnceleniyor', color: '#0F5EA8', bg: '#eff6ff', icon: Clock },
  resolved: { label: 'Çözümlendi', color: '#059669', bg: '#ecfdf5', icon: CheckCircle },
  closed: { label: 'Kapatıldı', color: '#64748b', bg: '#f1f5f9', icon: X },
}

const STATUS_OPTIONS = [
  { value: 'open', label: 'Açık' },
  { value: 'in_progress', label: 'İnceleniyor' },
  { value: 'resolved', label: 'Çözümlendi' },
  { value: 'closed', label: 'Kapatıldı' },
]

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px',
  fontSize: 11, fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  background: '#f8fafc', borderBottom: '1px solid #e8edf2',
}

export default function AdminTicketsPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<any>(null)
  const [reply, setReply] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => { const { data } = await api.get('/admin/support/tickets'); return data.data },
  })

  const { data: detail } = useQuery({
    queryKey: ['admin-ticket', selected?.ticket_no],
    queryFn: async () => { const { data } = await api.get(`/admin/support/tickets/${selected.ticket_no}`); return data.data },
    enabled: !!selected,
  })

  const sendReply = useMutation({
    mutationFn: () => api.post(`/admin/support/tickets/${selected.ticket_no}/reply`, { message: reply }),
    onSuccess: () => {
      toast.success('Yanıt gönderildi.')
      setReply('')
      qc.invalidateQueries({ queryKey: ['admin-ticket', selected.ticket_no] })
    },
  })

  const changeStatus = useMutation({
    mutationFn: (status: string) => api.patch(`/admin/support/tickets/${selected.ticket_no}/status`, { status }),
    onSuccess: () => {
      toast.success('Durum güncellendi.')
      qc.invalidateQueries({ queryKey: ['admin-tickets'] })
      qc.invalidateQueries({ queryKey: ['admin-ticket', selected.ticket_no] })
      if (selected) setSelected((p: any) => ({ ...p, status: detail?.status }))
    },
  })

  return (
    <div className="animate-fade-in">
      {selected ? (
        /* DETAIL */
        <div>
          <button onClick={() => setSelected(null)} style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
            background: 'none', border: 'none', cursor: 'pointer', color: '#0F5EA8', fontSize: 13, fontWeight: 600,
          }}>← Tüm Talepler</button>

          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <code style={{ fontSize: 11, background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, color: '#64748b' }}>{selected.ticket_no}</code>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', marginTop: 8 }}>{selected.subject}</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  {detail?.user?.name} · {selected.created_at ? new Date(selected.created_at).toLocaleDateString('tr-TR') : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={selected.status} onChange={e => changeStatus.mutate(e.target.value)}
                  className="field" style={{ width: 'auto', padding: '8px 14px', fontSize: 12, fontWeight: 600 }}>
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {detail?.replies?.map((r: any, i: number) => (
              <div key={i} style={{
                padding: '14px 18px', borderRadius: 14,
                background: r.is_admin ? '#f5f3ff' : '#f8fafc',
                border: `1px solid ${r.is_admin ? '#e9d5ff' : '#e2e8f0'}`,
                alignSelf: r.is_admin ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.is_admin ? '#7c3aed' : '#0F5EA8' }}>
                    {r.is_admin ? '🛡 Destek Ekibi (Siz)' : '👤 Kullanıcı'}
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{r.message}</p>
              </div>
            ))}
          </div>

          {selected.status !== 'closed' && (
            <div className="card" style={{ padding: 20 }}>
              <textarea className="field" value={reply} onChange={e => setReply(e.target.value)}
                placeholder="Admin yanıtını yazın..." rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
              <button onClick={() => sendReply.mutate()} disabled={!reply || sendReply.isPending}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: (!reply || sendReply.isPending) ? 0.6 : 1,
                }}>
                <Send style={{ width: 14, height: 14 }} />
                {sendReply.isPending ? 'Gönderiliyor...' : 'Admin Yanıtı Gönder'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* LIST */
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Destek Talepleri</h1>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Tüm kullanıcı talepleri</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket style={{ width: 20, height: 20, color: '#0F5EA8' }} />
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }} />)}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={TH}>Talep No</th>
                      <th style={TH}>Kullanıcı</th>
                      <th style={TH}>Konu</th>
                      <th style={TH}>Durum</th>
                      <th style={TH}>Tarih</th>
                      <th style={{ ...TH, textAlign: 'right' }}>Detay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.map((ticket: any, idx: number) => {
                      const s = STATUS_MAP[ticket.status] || STATUS_MAP.open
                      const StatusIcon = s.icon
                      return (
                        <tr key={ticket.id}
                          style={{ borderBottom: idx < data.data.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                          onClick={() => setSelected(ticket)}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '14px 16px' }}>
                            <code style={{ fontSize: 11, fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: 6 }}>
                              {ticket.ticket_no}
                            </code>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{ticket.user?.name ?? '—'}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', maxWidth: 240 }}>
                            <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {ticket.subject}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: s.color, background: s.bg }}>
                              <StatusIcon style={{ width: 11, height: 11 }} />
                              {s.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>
                            {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('tr-TR') : '—'}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <ChevronRight style={{ width: 16, height: 16, color: '#cbd5e1' }} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {(!data?.data || data.data.length === 0) && (
                  <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: 14 }}>
                    ✅ Bekleyen destek talebi bulunmuyor.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
