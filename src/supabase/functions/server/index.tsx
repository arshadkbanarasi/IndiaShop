import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS and logging middleware
app.use('*', cors({
  origin: ['*'],
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Auth middleware helper
async function requireAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (!user?.id) {
    throw new Error('Unauthorized');
  }
  return user.id;
}

// User Registration
app.post('/make-server-1cef4ca6/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log(`Registration error: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log(`Registration server error: ${error}`)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// Initialize sample products
app.post('/make-server-1cef4ca6/products/init', async (c) => {
  try {
    const sampleProducts = [
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
    
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product)
    }
    
    return c.json({ message: 'Sample products initialized successfully' })
  } catch (error) {
    console.log(`Product initialization error: ${error}`)
    return c.json({ error: 'Failed to initialize products' }, 500)
  }
})

// Get all products
app.get('/make-server-1cef4ca6/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:')
    return c.json({ products })
  } catch (error) {
    console.log(`Get products error: ${error}`)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

// Get single product
app.get('/make-server-1cef4ca6/products/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const product = await kv.get(`product:${id}`)
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }
    
    return c.json({ product })
  } catch (error) {
    console.log(`Get product error: ${error}`)
    return c.json({ error: 'Failed to fetch product' }, 500)
  }
})

// Add to cart
app.post('/make-server-1cef4ca6/cart/add', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const { productId, quantity = 1 } = await c.req.json()
    
    const cartKey = `cart:${userId}:${productId}`
    const existingItem = await kv.get(cartKey)
    
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity
    await kv.set(cartKey, { productId, quantity: newQuantity, userId })
    
    return c.json({ message: 'Item added to cart successfully' })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Add to cart error: ${error}`)
    return c.json({ error: 'Failed to add item to cart' }, 500)
  }
})

// Get cart
app.get('/make-server-1cef4ca6/cart', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const cartItems = await kv.getByPrefix(`cart:${userId}:`)
    
    // Get product details for each cart item
    const cartWithProducts = []
    for (const item of cartItems) {
      const product = await kv.get(`product:${item.productId}`)
      if (product) {
        cartWithProducts.push({
          ...item,
          product
        })
      }
    }
    
    return c.json({ cartItems: cartWithProducts })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Get cart error: ${error}`)
    return c.json({ error: 'Failed to fetch cart' }, 500)
  }
})

// Update cart item quantity
app.put('/make-server-1cef4ca6/cart/:productId', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const productId = c.req.param('productId')
    const { quantity } = await c.req.json()
    
    const cartKey = `cart:${userId}:${productId}`
    
    if (quantity <= 0) {
      await kv.del(cartKey)
      return c.json({ message: 'Item removed from cart' })
    }
    
    await kv.set(cartKey, { productId, quantity, userId })
    return c.json({ message: 'Cart updated successfully' })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Update cart error: ${error}`)
    return c.json({ error: 'Failed to update cart' }, 500)
  }
})

// Remove from cart
app.delete('/make-server-1cef4ca6/cart/:productId', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const productId = c.req.param('productId')
    
    await kv.del(`cart:${userId}:${productId}`)
    return c.json({ message: 'Item removed from cart successfully' })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Remove from cart error: ${error}`)
    return c.json({ error: 'Failed to remove item from cart' }, 500)
  }
})

// Create order
app.post('/make-server-1cef4ca6/orders', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const { shippingAddress, paymentMethod } = await c.req.json()
    
    // Get cart items
    const cartItems = await kv.getByPrefix(`cart:${userId}:`)
    
    if (cartItems.length === 0) {
      return c.json({ error: 'Cart is empty' }, 400)
    }
    
    // Calculate total and prepare order items
    let total = 0
    const orderItems = []
    
    for (const item of cartItems) {
      const product = await kv.get(`product:${item.productId}`)
      if (product && product.stock >= item.quantity) {
        const itemTotal = product.price * item.quantity
        total += itemTotal
        
        orderItems.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: itemTotal
        })
        
        // Update stock
        product.stock -= item.quantity
        await kv.set(`product:${item.productId}`, product)
      } else {
        return c.json({ error: `Insufficient stock for ${product?.name || item.productId}` }, 400)
      }
    }
    
    // Create order
    const orderId = `order:${userId}:${Date.now()}`
    const order = {
      id: orderId,
      userId,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    await kv.set(orderId, order)
    
    // Clear cart
    for (const item of cartItems) {
      await kv.del(`cart:${userId}:${item.productId}`)
    }
    
    return c.json({ order })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Create order error: ${error}`)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get user orders
app.get('/make-server-1cef4ca6/orders', async (c) => {
  try {
    const userId = await requireAuth(c.req)
    const orders = await kv.getByPrefix(`order:${userId}:`)
    
    // Sort orders by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return c.json({ orders })
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    console.log(`Get orders error: ${error}`)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

Deno.serve(app.fetch)