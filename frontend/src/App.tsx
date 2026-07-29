import { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'

import HomePage from '@/pages/HomePage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

import ProfilePage from '@/pages/dashboard/ProfilePage'
import OrdersPage from '@/pages/dashboard/OrdersPage'
import FavoritesPage from '@/pages/dashboard/FavoritesPage'
import AddressesPage from '@/pages/dashboard/AddressesPage'
import SupportPage from '@/pages/dashboard/SupportPage'
import ReferralPage from '@/pages/dashboard/ReferralPage'

import SellerDashboardPage from '@/pages/seller/DashboardPage'
import SellerProductsPage from '@/pages/seller/ProductsPage'
import SellerAddProductPage from '@/pages/seller/AddProductPage'
import SellerEditProductPage from '@/pages/seller/EditProductPage'
import SellerOrdersPage from '@/pages/seller/OrdersPage'

import AdminDashboardPage from '@/pages/admin/DashboardPage'
import AdminUsersPage from '@/pages/admin/UsersPage'
import AdminProductsPage from '@/pages/admin/ProductsPage'
import AdminOrdersPage from '@/pages/admin/OrdersPage'
import AdminCategoriesPage from '@/pages/admin/CategoriesPage'
import AdminRefundsPage from '@/pages/admin/RefundsPage'
import AdminTicketsPage from '@/pages/admin/TicketsPage'
import AdminReferralsPage from '@/pages/admin/ReferralsPage'
import AdminSettingsPage from '@/pages/admin/SettingsPage'

import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser)
  const isLoading = useAuthStore((s) => s.isLoading)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #0F5EA8',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/urunler" element={<ProductsPage />} />
        <Route path="/urunler/:slug" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/odeme" element={<CheckoutPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/hesabim" element={<ProfilePage />} />
          <Route path="/siparislerim" element={<OrdersPage />} />
          <Route path="/favorilerim" element={<FavoritesPage />} />
          <Route path="/adreslerim" element={<AddressesPage />} />
          <Route path="/destek" element={<SupportPage />} />
          <Route path="/referanslarim" element={<ReferralPage />} />

          <Route path="/satis/panel" element={<SellerDashboardPage />} />
          <Route path="/satis/urunlerim" element={<SellerProductsPage />} />
          <Route path="/satis/urunlerim/yeni" element={<SellerAddProductPage />} />
          <Route path="/satis/urunlerim/:id/duzenle" element={<SellerEditProductPage />} />
          <Route path="/satis/siparislerim" element={<SellerOrdersPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/kullanicilar" element={<AdminUsersPage />} />
            <Route path="/admin/urunler" element={<AdminProductsPage />} />
            <Route path="/admin/siparisler" element={<AdminOrdersPage />} />
            <Route path="/admin/kategoriler" element={<AdminCategoriesPage />} />
            <Route path="/admin/iadeler" element={<AdminRefundsPage />} />
            <Route path="/admin/destek" element={<AdminTicketsPage />} />
            <Route path="/admin/referanslar" element={<AdminReferralsPage />} />
            <Route path="/admin/ayarlar" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
