
import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Categories.css"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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

      let categoriesData = []
      if (response.data && Array.isArray(response.data.results)) {
        categoriesData = response.data.results
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="moving-sticks">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`stick stick-${i + 1} absolute bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-500/30 dark:to-indigo-500/30`}
          />
        ))}
      </div>

      {/* Glass Orbs */}
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
            Categories
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Explore our product categories</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchCategories}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category.id || index}
                  className="glass-card p-6 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/categories/${category.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <img
                        src={category.imageUrl || "/placeholder.svg?height=80&width=80&query=category"}
                        alt={category.name?.en || "Category"}
                        className="w-full h-full object-cover rounded-full border-4 border-gradient-to-r from-blue-500 to-indigo-500 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                        onError={(e) => {
                          e.target.src = "/abstract-categories.png"
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800"></div>
                      </div>
                      <img
                        src={category.imageUrl || "/placeholder.svg?height=80&width=80&query=category"}
                        alt={category.name?.en || "Category"}
                        className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/abstract-categories.png"
                        }}
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {category.name?.en || category.name || `Category ${index + 1}`}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                      {category.description?.en || category.description || "No description available"}
                    </p>
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-blue-500/25"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/categories/${category.id}`)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="glass-card p-8 max-w-md mx-auto">
                  <p className="text-slate-600 dark:text-slate-300">No categories available</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories
