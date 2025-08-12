"use client"

import { useState } from "react"
import "./Products.css"

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="products-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Products</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Discover our premium glass products</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">📦</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Products Coming Soon</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              We're working on bringing you the best glass products. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
