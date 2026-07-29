import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Link } from 'react-router-dom'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-bg flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-secondary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-light rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-text-inverse max-w-md w-full flex flex-col items-center text-center">
          <div className="mb-10">
            <img
              src="/logo.jpeg"
              alt="Medeniyet Pazarı"
              className="w-64 h-auto rounded-2xl object-contain shadow-2xl shadow-black/30 mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Güvenli alışverişin<br />
            <span className="text-accent">yeni adresi.</span>
          </h1>
          <p className="text-text-inverse/70 text-lg leading-relaxed">
            Binlerce ürün, güvenilir satıcılar ve referans sistemi ile büyüyen bir topluluk.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center mb-8 lg:hidden">
            <img src="/logo.jpeg" alt="Medeniyet Pazarı" className="h-16 w-auto rounded-xl object-contain" />
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
