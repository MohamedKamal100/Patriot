
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import "./CategoryDetails.css"

const CategoryDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  useEffect(() => {
    fetchCategoryDetails()
  }, [id])

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true)
      console.log(`🔄 Fetching category details for ID: ${id}`)

      const response = await axios.get(`${API_BASE_URL}/categories/${id}`)
      console.log("✅ Category Details API Response:", response.data)

      setCategory(response.data)
      setError(null)
    } catch (error) {
      console.error("❌ Error fetching category details:", error)
      setError("Failed to load category details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Category not found"}</p>
          <button
            onClick={() => navigate("/categories")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900 py-8">
      <div className="category-details-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button
          onClick={() => navigate("/categories")}
          className="mb-8 flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Categories</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="category-image-container group">
              <img
                src={category.imageUrl || "/placeholder.svg?height=400&width=400&query=category"}
                alt={category.name?.en || "Category"}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "/abstract-categories.png"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="stats-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {new Date(category.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Created</div>
                </div>
              </div>

              <div className="stats-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-200 dark:border-indigo-700 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{category.id}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Category ID</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="category-header">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                {category.name?.en || "Category Name"}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300 mb-6">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            <div className="description-card bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg p-8 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Description</span>
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {category.description?.en || "No description available for this category."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/products")}
                className="action-btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>View Products</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryDetails
