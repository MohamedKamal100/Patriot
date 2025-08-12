"use client"

import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import "./Categories.css"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      console.log("🔄 Fetching categories from API...")

      const response = await axios.get(`${API_BASE_URL}/categories`)
      console.log("✅ Categories API Response:", response.data)
      console.log("📊 Response data type:", typeof response.data)
      console.log("📋 Is response.data an array?", Array.isArray(response.data))

      let categoriesData = []

      if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data
      } else if (response.data && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories
      } else {
        console.warn("⚠️ Unexpected API response structure:", response.data)
        categoriesData = []
      }

      console.log("📦 Final categories data:", categoriesData)
      setCategories(categoriesData)
      setError(null)
    } catch (error) {
      console.error("❌ Error fetching categories:", error)
      setError("Failed to load categories")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="categories-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Categories</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Explore our product categories</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category.id || index}
                  className="glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl text-white">📂</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {category.name?.en || category.name || `Category ${index + 1}`}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {category.description?.en || category.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-300">No categories available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
