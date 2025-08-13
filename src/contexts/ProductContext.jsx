
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState({})

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${API_BASE_URL}/products`)

      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setProducts(response.data.results)
      } else {
        throw new Error("Invalid products data format")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(error.message)
      setProducts([])

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

  // Fetch single product
  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  }

  // Get reviews for a product from API
  const getProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/${productId}`)
      const productReviews = response.data.results || []

      setReviews((prev) => ({
        ...prev,
        [productId]: productReviews,
      }))

      return productReviews
    } catch (error) {
      console.error("Error fetching reviews:", error)
      // Return cached reviews if API fails
      return reviews[productId] || []
    }
  }

  // Add review to product via API
  const addReview = async (productId, reviewData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, {
        productId,
        userName: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
      })

      const newReview = response.data

      // Update local state
      setReviews((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), newReview],
      }))

      Swal.fire({
        icon: "success",
        title: "Review Added!",
        text: "Thank you for your feedback",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      })

      return newReview
    } catch (error) {
      console.error("Error adding review:", error)

      // Fallback to local storage if API fails
      const fallbackReview = {
        id: Date.now().toString(),
        productId,
        userName: reviewData.userName || "Anonymous",
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString(),
      }

      setReviews((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), fallbackReview],
      }))

      Swal.fire({
        icon: "success",
        title: "Review Added!",
        text: "Thank you for your feedback",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      })

      return fallbackReview
    }
  }

  // Remove review via API
  const removeReview = async (reviewId, productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`)

      // Update local state
      setReviews((prev) => ({
        ...prev,
        [productId]: (prev[productId] || []).filter((review) => review.id !== reviewId),
      }))

      Swal.fire({
        icon: "success",
        title: "Review Removed",
        text: "Review has been deleted successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      })

      return true
    } catch (error) {
      console.error("Error removing review:", error)

      Swal.fire({
        icon: "error",
        title: "Failed to Remove Review",
        text: "Could not delete review. Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
      })

      throw error
    }
  }

  // Get cached reviews for a product (local state)
  const getCachedProductReviews = (productId) => {
    return reviews[productId] || []
  }

  // Calculate average rating for a product
  const getAverageRating = (productId) => {
    const productReviews = reviews[productId] || []
    if (productReviews.length === 0) return 0

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / productReviews.length).toFixed(1)
  }

  // Get rating distribution for a product
  const getRatingDistribution = (productId) => {
    const productReviews = reviews[productId] || []
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    productReviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })

    return distribution
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value = {
    products,
    loading,
    error,
    reviews,
    fetchProducts,
    fetchProduct,
    addReview,
    removeReview,
    getProductReviews,
    getCachedProductReviews,
    getAverageRating,
    getRatingDistribution,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}
