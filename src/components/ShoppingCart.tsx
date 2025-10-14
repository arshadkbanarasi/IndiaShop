import React, { useState } from 'react'
import { useApp } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { getSupabaseClient } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const supabase = getSupabaseClient()

interface ShoppingCartProps {
  onCheckout: () => void
}

export function ShoppingCart({ onCheckout }: ShoppingCartProps) {
  const { cartItems, refreshCart } = useApp()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const updateQuantity = async (productId: string, newQuantity: number) => {
    setIsUpdating(productId)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please sign in again')
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        await refreshCart()
        if (newQuantity === 0) {
          toast.success('Item removed from cart')
        } else {
          toast.success('Cart updated')
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Update cart error:', error)
      toast.error('Failed to update cart')
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (productId: string) => {
    setIsUpdating(productId)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please sign in again')
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        await refreshCart()
        toast.success('Item removed from cart')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Remove item error:', error)
      toast.error('Failed to remove item')
    } finally {
      setIsUpdating(null)
    }
  }

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
        <p className="text-gray-600">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-lg">{item.product.name}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                    <p className="text-blue-600 font-semibold">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={isUpdating === item.productId || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={isUpdating === item.productId || item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="font-bold text-lg">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      disabled={isUpdating === item.productId}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${(totalAmount * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full"
                size="lg"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Free shipping on all orders
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}