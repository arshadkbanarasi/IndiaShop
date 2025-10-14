import React, { useState } from 'react'
import { useApp, Product } from '../App'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Eye, Filter } from 'lucide-react'

interface ProductListingProps {
  onViewProduct: (productId: string) => void
}

export function ProductListing({ onViewProduct }: ProductListingProps) {
  const { products } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))]

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    
    let priceMatch = true
    if (priceRange === 'under-50') priceMatch = product.price < 50
    else if (priceRange === '50-100') priceMatch = product.price >= 50 && product.price <= 100
    else if (priceRange === '100-200') priceMatch = product.price > 100 && product.price <= 200
    else if (priceRange === 'over-200') priceMatch = product.price > 200
    
    return categoryMatch && priceMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
          <p className="text-gray-600 mt-1">Discover amazing products at great prices</p>
        </div>
        
        <div className="flex gap-3 items-center">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-50">Under $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="over-200">Over $200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 right-2 bg-white text-gray-900">
                  {product.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock} in stock
                  </span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  onClick={() => onViewProduct(product.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}