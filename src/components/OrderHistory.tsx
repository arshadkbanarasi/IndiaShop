import React, { useState, useEffect } from 'react'
import { useApp, Order } from '../App'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Package, Calendar, DollarSign, MapPin } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { getSupabaseClient } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const supabase = getSupabaseClient()

export function OrderHistory() {
  const { user } = useApp()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please sign in again')
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1cef4ca6/orders`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500">When you place orders, they'll appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
        <p className="text-gray-600">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.split(':').pop()?.substring(0, 8)}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <div className="text-right">
                    <div className="flex items-center text-lg font-bold text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      {order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${item.total.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Shipping Address
                  </h4>
                  <p className="text-gray-600">{order.shippingAddress}</p>
                </div>
                
                {/* Payment Method */}
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <p className="text-gray-600 capitalize">
                    {order.paymentMethod.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}