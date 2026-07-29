import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Settings, Percent, Save, Info } from 'lucide-react'

export default function AdminSettingsPage() {
  const qc = useQueryClient()
  const [commission, setCommission] = useState('')

  const { isLoading } = useQuery({
    queryKey: ['admin-commission'],
    queryFn: async () => {
      const { data } = await api.get('/admin/commission')
      setCommission(String(data.data.commission_rate))
      return data.data
    },
  })

  const update = useMutation({
    mutationFn: () => api.put('/admin/commission', { commission_rate: Number(commission) }),
    onSuccess: () => { toast.success('Komisyon oranı güncellendi.'); qc.invalidateQueries({ queryKey: ['admin-commission'] }) },
    onError: () => toast.error('Güncelleme başarısız.'),
  })

  return (
    <div className="animate-fade-in" style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Ayarlar</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Platform geneli yapılandırma</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings style={{ width: 20, height: 20, color: '#64748b' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Percent style={{ width: 22, height: 22, color: '#d97706' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Komisyon Oranı</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Her satış için platformun alacağı yüzde</p>
          </div>
        </div>

        {isLoading ? (
          <div className="skeleton" style={{ height: 52, borderRadius: 12 }} />
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8 }}>Oran (%)</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="number" value={commission}
                  onChange={e => setCommission(e.target.value)}
                  min={0} max={100} step={0.1}
                  className="field"
                  style={{ paddingRight: 48, fontSize: 18, fontWeight: 700 }}
                />
                <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18, fontWeight: 700, color: '#94a3b8' }}>%</span>
              </div>
              <button onClick={() => update.mutate()} disabled={update.isPending}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '0 24px', background: '#0F5EA8', color: '#fff',
                  border: 'none', borderRadius: 12, cursor: 'pointer',
                  fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                  opacity: update.isPending ? 0.6 : 1,
                  boxShadow: '0 2px 8px rgba(15,94,168,0.3)',
                }}>
                <Save style={{ width: 15, height: 15 }} />
                {update.isPending ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>

            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginTop: 16, padding: '12px 16px', background: '#eff6ff',
              border: '1px solid #bfdbfe', borderRadius: 10,
            }}>
              <Info style={{ width: 15, height: 15, color: '#0F5EA8', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 1.5 }}>
                Örneğin %{commission} oranında komisyon seçildiğinde, 100 ₺'lik bir satıştan {commission} ₺ platform geliri elde edilir.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
