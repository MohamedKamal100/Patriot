
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProducts } from "../../contexts/ProductContext"
import { useOrders } from "../../contexts/OrderContext"
import StarRating from "../../components/StarRating/StarRating"
import Swal from "sweetalert2"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    fetchProduct,
    addReview,
    removeReview,
    getProductReviews,
    getCachedProductReviews,
    getAverageRating,
    getRatingDistribution,
  } = useProducts()
  const { addProductToOrder } = useOrders()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  })
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const fetchProductData = async () => {
    try {
      setLoading(true)
      setError(null)
      const productData = await fetchProduct(id)
      setProduct(productData)

      setReviewsLoading(true)
      await getProductReviews(id)
      setReviewsLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProductData()
    }
  }, [id])

  const handleAddReview = async (e) => {
    e.preventDefault()
    try {
      await addReview(id, reviewForm)
      setReviewForm({ userName: "", rating: 5, comment: "" })
      setShowReviewForm(false)
    } catch (error) {
      console.error("Error adding review:", error)
    }
  }

  const handleRemoveReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        await removeReview(reviewId, id)
      } catch (error) {
        console.error("Error removing review:", error)
      }
    }
  }

  const handleAddToOrder = async () => {
    try {
      await addProductToOrder(product, quantity)
      alert(`${quantity} item(s) added to order successfully!`)
    } catch (error) {
      alert(`Failed to add to order: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-slate-600 dark:text-slate-300 text-xl font-medium">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-12 text-center shadow-2xl max-w-md">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-6xl text-white">❌</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            {error || "This product doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const productImages = [
    product.imageUrl ||
      `/placeholder.svg?height=600&width=600&query=product+${encodeURIComponent(product.name?.en || "product")}`,
    `/placeholder.svg?height=600&width=600&query=product+detail+view`,
    `/placeholder.svg?height=600&width=600&query=product+close+up`,
  ]

  const reviews = getCachedProductReviews(id)
  const averageRating = Number.parseFloat(getAverageRating(id))
  const ratingDistribution = getRatingDistribution(id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
        >
          <span>←</span> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name?.en || product.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "/elegant-product.png"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedImage === index ? "bg-blue-500 scale-125" : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImage === index ? "ring-4 ring-blue-500 scale-105" : "hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/elegant-product.png"
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                {product.name?.en || product.name || "Premium Product"}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold shadow-lg">
                  {product.width}" × {product.height}"
                </span>

                {averageRating > 0 && (
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <StarRating rating={averageRating} readonly={true} size="text-sm" className="text-white" />
                    <span>{averageRating}</span>
                    <span className="text-xs opacity-80">({reviews.length})</span>
                  </div>
                )}

                <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg capitalize">
                  {product.category || "General"}
                </span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {product.description?.en ||
                  product.description ||
                  "This is a premium quality product crafted with precision and excellence. Perfect for your needs with outstanding durability and performance."}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Dimensions</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                  {product.width}" × {product.height}"
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
                <div className="text-2xl mb-2">🏷️</div>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Category</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                  {product.category || "General"}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 space-y-6 shadow-xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold text-xl transform hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold text-xl transform hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToOrder}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Add to Order
                </button>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Customer Reviews
            </h2>
            {averageRating > 0 && (
              <div className="flex items-center justify-center gap-4 text-lg">
                <StarRating rating={averageRating} readonly={true} size="text-3xl" showValue={true} />
                <span className="text-slate-600 dark:text-slate-300">({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          {averageRating > 0 && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingDistribution[rating] || 0
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-8">{rating}★</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-8">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Write a Review</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={reviewForm.userName}
                    onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    className="w-full p-3 bg-white/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                  <StarRating
                    rating={reviewForm.rating}
                    onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                    size="text-3xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full p-3 bg-white/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 text-center shadow-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-8 text-center shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">REVIEWS</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Reviews Yet</h3>
                <p className="text-slate-600 dark:text-slate-300">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} readonly={true} size="text-lg" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveReview(review.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold"
                      title="Delete review"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
