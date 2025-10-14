import React, { useState, useEffect, createContext, useContext } from 'react'
import { getSupabaseClient } from './utils/supabase/client'
import { ProjectHeader } from './components/ProjectHeader'
import { ProductListing } from './components/ProductListing'
import { ProductDetails } from './components/ProductDetails'
import { ShoppingCart } from './components/ShoppingCart'
import { AuthForm } from './components/AuthForm'
import { OrderHistory } from './components/OrderHistory'
import { Checkout } from './components/Checkout'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Toaster } from './components/ui/sonner'
import { ShoppingCart as CartIcon, User, Package, LogOut } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from './utils/supabase/info'

// Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface CartItem {
  productId: string
  quantity: number
  userId: string
  product: Product
}

export interface Order {
  id: string
  userId: string
  items: {
    productId: string
    name: string
    price: number
    quantity: number
    total: number
  }[]
  total: number
  shippingAddress: string
  paymentMethod: string
  status: string
  createdAt: string
}

// Context
interface AppContextType {
  user: any
  setUser: (user: any) => void
  cartItems: CartItem[]
  setCartItems: (items: CartItem[]) => void
  refreshCart: () => void
  products: Product[]
  setProducts: (products: Product[]) => void
  isOfflineMode: boolean
}

const AppContext = createContext<AppContextType | null>(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

const supabase = getSupabaseClient()

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'products' | 'product-details' | 'cart' | 'auth' | 'orders' | 'checkout'>('products')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Check for existing session
  useEffect(() => {
    checkSession()
  }, [])

  // Initialize products when app loads
  useEffect(() => {
    initializeProducts()
  }, [])

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeProducts = async () => {
    try {
      console.log('Initializing products...')
      
      // Add fallback sample products in case server isn't available
      const fallbackProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          category: 'Electronics',
          stock: 50
        },
        {
          id: '2',
          name: 'Smartphone',
          description: 'Latest model smartphone with advanced camera features',
          price: 699.99,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          category: 'Electronics',
          stock: 30
        },
        {
          id: '3',
          name: 'Running Shoes',
          description: 'Comfortable running shoes for daily exercise',
          price: 129.99,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          category: 'Sports',
          stock: 75
        },
        {
          id: '4',
          name: 'Coffee Maker',
          description: 'Automatic coffee maker with programmable timer',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
          category: 'Home',
          stock: 25
        },
        {
          id: '5',
          name: 'Backpack',
          description: 'Durable travel backpack with multiple compartments',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          category: 'Travel',
          stock: 40
        },
        {
          id: '6',
          name: 'Desk Lamp',
          description: 'Adjustable LED desk lamp with USB charging port',
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          category: 'Home',
          stock: 60
        }
      ]
      
      try {
        // First try to get existing products from server
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/products`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Products response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            setProducts(data.products)
            console.log('Server products loaded successfully:', data.products.length)
            return
          }
        }
        
        // If no products from server, try to initialize them
        console.log('No products found, initializing sample products...')
        const initResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/products/init`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Init response status:', initResponse.status)
        
        if (initResponse.ok) {
          // Then fetch the products again
          const newResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/products`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (newResponse.ok) {
            const newData = await newResponse.json()
            if (newData.products && newData.products.length > 0) {
              setProducts(newData.products)
              console.log('Initialized products loaded successfully:', newData.products.length)
              return
            }
          }
        }
        
        // If server initialization fails, fall back to client-side products
        throw new Error('Server not available')
        
      } catch (serverError) {
        console.log('Server not available, using fallback products:', serverError)
        // Use fallback products when server is not available
        setProducts(fallbackProducts)
        toast.success('Products loaded (offline mode)')
        console.log('Fallback products loaded:', fallbackProducts.length)
        setIsOfflineMode(true)
      }
      
    } catch (error) {
      console.error('Failed to initialize products:', error)
      // Even if everything fails, provide some products so the app works
      setProducts([
        {
          id: '1',
          name: 'Sample Product',
          description: 'This is a sample product for demonstration',
          price: 99.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          category: 'Sample',
          stock: 10
        }
      ])
      toast.error('Using sample data. Backend connection failed.')
    }
  }

  const refreshCart = async () => {
    if (!user) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/cart`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems || [])
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCartItems([])
      setCurrentView('products')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId)
    setCurrentView('product-details')
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      cartItems,
      setCartItems,
      refreshCart,
      products,
      setProducts,
      isOfflineMode
    }}>
      <div className="min-h-screen bg-gray-50">
        <ProjectHeader />
        
        {/* Offline Mode Banner */}
        {isOfflineMode && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Offline Mode:</strong> Some features like cart synchronization and order placement may not work until the server is available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => setCurrentView('products')}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  Products
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <button
                      onClick={() => setCurrentView('cart')}
                      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <CartIcon className="h-6 w-6" />
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                          {cartItemCount}
                        </Badge>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setCurrentView('orders')}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Package className="h-6 w-6" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{user.user_metadata?.name || user.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => setCurrentView('auth')}
                    variant="default"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'products' && (
            <ProductListing onViewProduct={handleViewProduct} />
          )}
          
          {currentView === 'product-details' && selectedProductId && (
            <ProductDetails 
              productId={selectedProductId}
              onBack={() => setCurrentView('products')}
            />
          )}
          
          {currentView === 'cart' && (
            <ShoppingCart onCheckout={() => setCurrentView('checkout')} />
          )}
          
          {currentView === 'auth' && (
            <AuthForm onSuccess={() => setCurrentView('products')} />
          )}
          
          {currentView === 'orders' && <OrderHistory />}
          
          {currentView === 'checkout' && (
            <Checkout onBack={() => setCurrentView('cart')} onSuccess={() => setCurrentView('orders')} />
          )}
        </main>
      </div>
      <Toaster />
    </AppContext.Provider>
  )
}