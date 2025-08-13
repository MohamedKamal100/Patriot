"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import Swal from "sweetalert2"
import "./ProductDetails.css"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`🔄 Fetching product ${id} from API...`)

      const response = await axios.get(`${API_BASE_URL}/products/${id}`)
      console.log("✅ Product API Response:", response.data)

      setProduct(response.data)
    } catch (error) {
      console.error("❌ Error fetching product:", error)
      setError(error.message)

      Swal.fire({
        icon: "error",
        title: "Product Not Found",
        text: "Could not load product details. Please try again.",
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
    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${quantity} item(s) added to your cart`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    })
  }

  const handleContactSeller = () => {
    Swal.fire({
      icon: "info",
      title: "Contact Seller",
      text: "Redirecting to contact form...",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-orange-900/10 dark:to-pink-900/10 flex items-center justify-center">
        <div className="glass-card p-12 text-center rounded-3xl animate-pulse-glow">
          <ClipLoader color="#F97316" size={60} />
          <p className="text-slate-600 dark:text-slate-300 mt-6 text-xl">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-orange-900/10 dark:to-pink-900/10 flex items-center justify-center">
        <div className="glass-card p-12 text-center rounded-3xl max-w-md">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-8 flex items-center justify-center animate-bounce">
            <span className="text-6xl text-white">❌</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            {error || "This product doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const productImages = [product.imageUrl || "/default-product.png", "/elegant-glassware.png", "/glass-product.png"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-orange-900/10 dark:to-pink-900/10">
      <div className="product-details-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>←</span> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name?.en || product.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "/default-product.png"
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
                      selectedImage === index ? "bg-orange-500 scale-125" : "bg-white/50 hover:bg-white/80"
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
                    selectedImage === index ? "ring-4 ring-orange-500 scale-105" : "hover:scale-105 hover:shadow-lg"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-product.png"
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4 animate-gradient-shift">
                {product.name?.en || product.name || "Premium Product"}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold shadow-lg animate-bounce-subtle">
                  {product.width}" × {product.height}"
                </span>

                {product.ratingsQuantity > 0 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-1 animate-bounce-subtle">
                    <span>⭐</span>
                    <span>{product.ratingsAverage?.toFixed(1)}</span>
                    <span className="text-xs opacity-80">({product.ratingsQuantity})</span>
                  </span>
                )}

                <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg capitalize animate-bounce-subtle">
                  {product.category || "General"}
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {product.description?.en ||
                  product.description ||
                  "This is a premium quality product crafted with precision and excellence. Perfect for your needs with outstanding durability and performance."}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Dimensions</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                  {product.width}" × {product.height}"
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl mb-2">🏷️</div>
                <div className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">Category</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                  {product.category || "General"}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Created</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <div className="text-2xl mb-2">🆔</div>
                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Product ID</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white font-mono">
                  {product.id.slice(0, 8)}...
                </div>
              </div> */}
            </div>

            {/* Quantity and Actions */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl transform hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold text-xl transform hover:scale-110 transition-all duration-300 shadow-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl animate-pulse-glow"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={handleContactSeller}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  💬 Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
