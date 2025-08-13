"use client"

import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import "./Products.css"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const navigate = useNavigate()

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Fetching products from API...")

      const response = await axios.get(`${API_BASE_URL}/products`)
      console.log("✅ Products API Response:", response.data)
      console.log("📊 Total products:", response.data.total)
      console.log("📦 Products array:", response.data.results)

      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setProducts(response.data.results)
        console.log("🎯 Products loaded:", response.data.results.length)
        console.log("📋 First product structure:", response.data.results[0])
      } else {
        throw new Error("Invalid products data format - results array not found")
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      setError(error.message)

      setProducts([])
      console.log("🚫 No fallback data - showing empty state")

      Swal.fire({
        icon: "error",
        title: "Failed to Load Products",
        text: "Could not fetch products from server. Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const name = product.name?.en || product.name || ""
    const description = product.description?.en || product.description || ""
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name?.en || a.name || "").localeCompare(b.name?.en || b.name || "")
      case "price":
        return (a.price || 0) - (b.price || 0)
      case "category":
        return (a.category || "").localeCompare(b.category || "")
      default:
        return 0
    }
  })

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      <div className="products-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Our Products
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Discover our premium products crafted with precision and excellence
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6 mb-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-blue-200 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-purple-200 dark:border-purple-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="glass-card p-8 text-center rounded-2xl">
              <ClipLoader color="#3B82F6" size={50} />
              <p className="text-slate-600 dark:text-slate-300 mt-4 text-lg">Loading products...</p>
            </div>
          </div>
        ) : error && products.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">❌</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Error Loading Products</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">📦</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">No Products Found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">No products available at the moment.</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((product) => {
                console.log("🔍 Product debug:", {
                  id: product.id,
                  name: product.name,
                  nameEn: product.name?.en,
                  nameAr: product.name?.ar,
                  fullProduct: product,
                })

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <img
                        src={
                          product.imageUrl ||
                          `/glass-product.png?key=e3sty&height=300&width=300&query=product+${encodeURIComponent(product.name?.en || product.name?.ar || "product")}`
                        }
                        alt={product.name?.en || product.name?.ar || "Product"}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          console.log("🖼️ Image failed to load, using fallback")
                          e.target.src = "/elegant-glassware.png"
                        }}
                      />

                      <div className="absolute top-3 left-3">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                          {product.width}" × {product.height}"
                        </div>
                      </div>

                      {product.ratingsQuantity > 0 && (
                        <div className="absolute top-3 right-3">
                          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <span>⭐</span>
                            <span>{product.ratingsAverage.toFixed(1)}</span>
                            <span className="text-xs opacity-80">({product.ratingsQuantity})</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {(() => {
                            const displayName = product.name?.en || product.name || "Premium Product"
                            console.log("📝 Displaying name:", displayName, "from:", product.name)
                            return displayName
                          })()}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                          {product.description?.en ||
                            product.description ||
                            "High-quality product crafted with precision and excellence."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center">
                          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Dimensions</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-white">
                            {product.width}" × {product.height}"
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-3 text-center">
                          <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Category</div>
                          <div className="text-sm font-bold text-slate-800 dark:text-white capitalize">
                            {product.category || "General"}
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                        <span className="font-mono">ID: {product.id.slice(0, 8)}...</span>
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div> */}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleViewDetails(product.id)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          View Details
                        </button>

                        <button className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-sm transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                          💬
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="glass-card p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === index + 1
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                            : "bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-8">
              <p className="text-slate-600 dark:text-slate-300">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
                {sortedProducts.length} products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Products
