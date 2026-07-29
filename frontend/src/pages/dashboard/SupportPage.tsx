import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Headphones, Plus, X, MessageCircle, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open: { label: 'Açık', color: '#d97706', bg: '#fffbeb', icon: AlertCircle },
  in_progress: { label: 'İnceleniyor', color: '#0F5EA8', bg: '#eff6ff', icon: Clock },
  resolved: { label: 'Çözümlendi', color: '#059669', bg: '#ecfdf5', icon: CheckCircle },
  closed: { label: 'Kapatıldı', color: '#64748b', bg: '#f1f5f9', icon: X },
}

interface NewTicketModalProps { onClose: () => void }

function NewTicketModal({ onClose }: NewTicketModalProps) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ subject: '', description: '' })

  const create = useMutation({
    mutationFn: () => api.post('/support/tickets', form),
    onSuccess: () => {
      toast.success('Destek talebiniz oluşturuldu!')
      qc.invalidateQueries({ queryKey: ['support-tickets'] })
      onClose()
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((m: any) => toast.error(m))
      else toast.error(err.response?.data?.message || 'Talep oluşturulamadı.')
    },
  })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>Yeni Destek Talebi</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>En geç 24 saat içinde yanıt verilecektir.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Konu *</label>
            <input className="field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Talebinizin konusu" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>Detay *</label>
            <textarea className="field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Sorununuzu veya talebinizi detaylı açıklayın..." rows={5}
              style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>İptal</button>
          <button onClick={() => create.mutate()}
            disabled={!form.subject || !form.description || create.isPending}
            style={{
              padding: '10px 20px', background: '#0F5EA8', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              opacity: (!form.subject || !form.description || create.isPending) ? 0.6 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            <Send style={{ width: 14, height: 14 }} />
            {create.isPending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [reply, setReply] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => { const { data } = await api.get('/support/tickets'); return data.data },
  })

  const { data: detail } = useQuery({
    queryKey: ['support-ticket', selected?.ticket_no],
    queryFn: async () => { const { data } = await api.get(`/support/tickets/${selected.ticket_no}`); return data.data },
    enabled: !!selected,
  })

  const sendReply = useMutation({
    mutationFn: () => api.post(`/support/tickets/${selected.ticket_no}/reply`, { message: reply }),
    onSuccess: () => {
      toast.success('Yanıtınız gönderildi.')
      setReply('')
      qc.invalidateQueries({ queryKey: ['support-ticket', selected.ticket_no] })
    },
  })

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Destek Talepleri</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{data?.data?.length ?? 0} talep</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones style={{ width: 20, height: 20, color: '#0F5EA8' }} />
          </div>
          <button onClick={() => setShowModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', background: '#0F5EA8', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
          }}>
            <Plus style={{ width: 15, height: 15 }} /> Yeni Talep
          </button>
        </div>
      </div>

      {selected ? (
        /* Detail view */
        <div>
          <button onClick={() => setSelected(null)} style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
            background: 'none', border: 'none', cursor: 'pointer', color: '#0F5EA8', fontSize: 13, fontWeight: 600,
          }}>
            ← Tüm Talepler
          </button>

          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <code style={{ fontSize: 11, background: '#f1f5f9', padding: '3px 8px', borderRadius: 6, color: '#64748b' }}>{selected.ticket_no}</code>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e', marginTop: 8 }}>{selected.subject}</h2>
              </div>
              {(() => { const s = STATUS_MAP[selected.status] || STATUS_MAP.open; return (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, color: s.color, background: s.bg }}>
                  {s.label}
                </span>
              )})()}
            </div>
          </div>

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {detail?.replies?.map((r: any, i: number) => (
              <div key={i} style={{
                padding: '14px 18px', borderRadius: 14,
                background: r.is_admin ? '#f5f3ff' : '#f8fafc',
                border: `1px solid ${r.is_admin ? '#e9d5ff' : '#e2e8f0'}`,
                alignSelf: r.is_admin ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.is_admin ? '#7c3aed' : '#0F5EA8' }}>
                    {r.is_admin ? '🛡 Destek Ekibi' : '👤 Siz'}
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{r.message}</p>
              </div>
            ))}
          </div>

          {/* Reply box — disabled if closed */}
          {selected.status !== 'closed' ? (
            <div className="card" style={{ padding: 20 }}>
              <textarea className="field" value={reply} onChange={e => setReply(e.target.value)}
                placeholder="Yanıtınızı yazın..." rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
              <button onClick={() => sendReply.mutate()} disabled={!reply || sendReply.isPending}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  background: '#0F5EA8', color: '#fff', border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  opacity: (!reply || sendReply.isPending) ? 0.6 : 1,
                }}>
                <Send style={{ width: 14, height: 14 }} />
                {sendReply.isPending ? 'Gönderiliyor...' : 'Yanıt Gönder'}
              </button>
            </div>
          ) : (
            <div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
              🔒 Bu talep kapatılmıştır. Yeni mesaj gönderilemez.
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
        </div>
      ) : !data?.data?.length ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 20px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MessageCircle style={{ width: 28, height: 28, color: '#0F5EA8' }} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Henüz destek talebiniz yok</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Bir sorun yaşıyorsanız bizimle iletişime geçin.</p>
          <button onClick={() => setShowModal(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: '#0F5EA8', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}>
            <Plus style={{ width: 15, height: 15 }} /> İlk Talebimi Oluştur
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.data.map((ticket: any) => {
            const s = STATUS_MAP[ticket.status] || STATUS_MAP.open
            const StatusIcon = s.icon
            return (
              <div key={ticket.id} className="card card-hover" style={{ padding: '18px 22px', cursor: 'pointer' }}
                onClick={() => setSelected(ticket)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StatusIcon style={{ width: 18, height: 18, color: s.color }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <code style={{ fontSize: 10, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#64748b' }}>
                          {ticket.ticket_no}
                        </code>
                        <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 999 }}>
                          {s.label}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginTop: 4 }}>{ticket.subject}</h3>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && <NewTicketModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
