"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const OrderContext = createContext()

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("userToken")
  }

  // Get user ID from localStorage
  const getUserId = () => {
    return localStorage.getItem("userId") || "0f8e52ab-6b3d-4a05-93a5-b866fdc84204"
  }

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()
      const today = new Date().toISOString().split("T")[0]

      const response = await axios.get(`${API_BASE_URL}/website/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          take: 50,
          page: 0,
          needPagination: false,
          startDate: today,
        },
      })

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data)
      } else if (response.data.results && Array.isArray(response.data.results)) {
        setOrders(response.data.results)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error.message)
      setOrders([])
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Create new order
  const createOrder = async (orderData) => {
    try {
      const token = getAuthToken()
      const userId = getUserId()

      const orderPayload = {
        priority: orderData.priority || "low",
        type: orderData.type || "custom",
        address: orderData.address,
        note: orderData.note || "",
        status: "pending",
        userId: userId,
        items: orderData.items || [],
      }

      const response = await axios.post(`${API_BASE_URL}/website/orders`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // Refresh orders list
      await fetchOrders()

      return response.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  // Add product to order
  const addProductToOrder = async (product, quantity = 1) => {
    try {
      const orderData = {
        priority: "medium",
        type: "custom",
        address: {
          stateId: "8345434c-d514-4fbf-8b6c-18c501ea3150",
          cityId: "390578aa-32a4-45ac-80c4-220db3dbb54a",
          street1: "Main Street",
          street2: "Secondary Street",
          postalCode: "12345",
          apartment: "Apt 1",
          complex: "Building A",
        },
        note: `Order for ${product.name?.en || product.name || "Product"}`,
        items: [
          {
            width: product.width || 20,
            height: product.height || 19,
            productId: product.id || "d0f372a4-a8ab-4296-a5a4-3fe71322b95b",
            categoryId: product.categoryId || "5c3062a0-c9a6-44bf-9abe-abaa051adb00",
            materialId: "d9a58760-5094-4f57-bde0-dcfa06bcb7ab",
            stageIds: ["5d11f862-d3b8-4d26-9fb7-604371711435", "fb11eb84-4d7b-463e-a24b-6f5fddc23d85"],
            note: `${quantity} x ${product.name?.en || product.name || "Product"}`,
          },
        ],
      }

      return await createOrder(orderData)
    } catch (error) {
      console.error("Error adding product to order:", error)
      throw error
    }
  }

  // Get order status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "from-amber-500 to-orange-500"
      case "processing":
        return "from-blue-500 to-indigo-500"
      case "completed":
        return "from-emerald-500 to-teal-500"
      case "cancelled":
        return "from-red-500 to-rose-500"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const value = {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    addProductToOrder,
    getStatusColor,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
