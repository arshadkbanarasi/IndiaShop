import React, { useState } from 'react'
import { useApp } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { getSupabaseClient } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const supabase = getSupabaseClient()

interface ProductDetailsProps {
  productId: string
  onBack: () => void
}

export function ProductDetails({ productId, onBack }: ProductDetailsProps) {
  const { products, user, refreshCart, isOfflineMode } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const product = products.find(p => p.id === productId)

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }

    setIsAddingToCart(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please sign in again')
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity
        })
      })

      if (response.ok) {
        await refreshCart()
        toast.success(`Added ${quantity} ${product.name}(s) to cart`)
        setQuantity(1)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add item to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={onBack}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-3">{product.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 && user && (
              <Card>
                <CardHeader>
                  <CardTitle>Add to Cart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-medium w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock === 0}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {product.stock === 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600 text-center font-medium">
                    This product is currently out of stock
                  </p>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-blue-600 text-center font-medium">
                    Please sign in to add items to your cart
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}