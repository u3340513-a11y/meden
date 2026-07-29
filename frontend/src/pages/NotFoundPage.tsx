import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center animate-slide-up">
        <h1 className="text-8xl font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Sayfa Bulunamadı</h2>
        <p className="text-text-muted mb-6">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link to="/" className="inline-flex px-6 py-3 bg-primary text-text-inverse font-semibold rounded-xl hover:bg-primary-dark transition-colors">Ana Sayfaya Dön</Link>
      </div>
    </div>
  )
}
