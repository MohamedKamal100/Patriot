
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProducts } from "../../contexts/ProductContext"

const Products = () => {
  const navigate = useNavigate()
  const { products, loading, error, fetchProducts, getAverageRating, getProductReviews } = useProducts()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)

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
      case "rating":
        return Number.parseFloat(getAverageRating(b.id)) - Number.parseFloat(getAverageRating(a.id))
      case "reviews":
        return getProductReviews(b.id).length - getProductReviews(a.id).length
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-slate-300 text-xl font-medium">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl text-white">❌</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Error Loading Products</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-700/70 border border-blue-200 dark:border-blue-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-700/70 border border-indigo-200 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
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
                className="w-full p-4 bg-white/70 dark:bg-slate-700/70 border border-purple-200 dark:border-purple-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-12 text-center shadow-xl">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Products Found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">No products available at the moment.</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((product) => {
                const avgRating = getAverageRating(product.id)
                const reviewCount = getProductReviews(product.id).length

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <img
                        src={
                          product.imageUrl ||
                          `/placeholder.svg?height=300&width=300&query=product+${encodeURIComponent(product.name?.en || product.name?.ar || "product")}`
                        }
                        alt={product.name?.en || product.name?.ar || "Product"}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = "/elegant-product.png"
                        }}
                      />

                      <div className="absolute top-3 left-3">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                          {product.width}" × {product.height}"
                        </div>
                      </div>

                      {avgRating > 0 && (
                        <div className="absolute top-3 right-3">
                          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <span>⭐</span>
                            <span>{avgRating}</span>
                            <span className="text-xs opacity-80">({reviewCount})</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {product.name?.en || product.name || "Premium Product"}
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
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl">
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
                            : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
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
