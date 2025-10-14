import React from 'react'
import { Store } from 'lucide-react'

export function ProjectHeader() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">ShopMate</h1>
            <p className="text-blue-100 text-sm">Your one-stop e-commerce destination</p>
          </div>
        </div>
      </div>
    </header>
  )
}