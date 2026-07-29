export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'super_admin' | 'admin' | 'user'
  role_label: string
  city: { id: number; name: string } | null
  avatar: string | null
  referral_code: string
  email_verified: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  children?: Category[]
  variant_fields?: VariantField[]
}

export interface VariantField {
  id: number
  field_name: string
  field_key: string
  is_required: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  discounted_price: number | null
  current_price: number
  stock: number
  condition: 'used' | 'lightly_used' | 'new'
  condition_label: string
  variant_data: Record<string, string> | null
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  status_label: string
  view_count: number
  cover_image: string | null
  images?: ProductImage[]
  category?: { id: number; name: string; slug: string }
  seller?: { id: number; name: string }
  created_at: string
}

export interface ProductImage {
  id: number
  url: string
  thumbnail: string
  is_cover: boolean
}

export interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_slug: string
  price: number
  quantity: number
  cover_image: string | null
  stock: number
}

export interface Order {
  id: number
  order_no: string
  status: string
  total: number
  commission_rate: number
  commission_amount: number
  shipping_address: {
    title: string
    city: string
    district: string
    address_line: string
    postal_code: string
  }
  cargo_provider: string | null
  cargo_tracking_no: string | null
  delivered_at: string | null
  note: string | null
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: number
  product_id: number
  seller_id: number
  product_snapshot: {
    name: string
    price: number
    condition: string
    image: string | null
  }
  quantity: number
  unit_price: number
  total: number
}

export interface Address {
  id: number
  title: string
  city_id: number
  district_id: number
  address_line: string
  postal_code: string | null
  is_default: boolean
  city?: { id: number; name: string }
  district?: { id: number; name: string }
}

export interface SupportTicket {
  id: number
  ticket_no: string
  subject: string
  description: string
  status: string
  created_at: string
  replies?: TicketReply[]
}

export interface TicketReply {
  id: number
  message: string
  is_admin: boolean
  user: { id: number; name: string; role: string }
  created_at: string
}

export interface City {
  id: number
  name: string
  plate_code: string
  districts: District[]
}

export interface District {
  id: number
  city_id: number
  name: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  errors: Record<string, string[]> | null
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
