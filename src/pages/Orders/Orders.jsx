
import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import Swal from "sweetalert2"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("userToken")
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

      Swal.fire({
        icon: "error",
        title: "Failed to Load Orders",
        text: "Could not fetch orders from server. Please try again.",
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
    fetchOrders()
  }, [])

  const handleCreateOrder = () => {
    Swal.fire({
      title: "Create New Order",
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Priority</label>
              <select id="priority" class="w-full p-3 border rounded-lg">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Type</label>
              <select id="type" class="w-full p-3 border rounded-lg">
                <option value="custom">Custom</option>
                <option value="standard">Standard</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Order Note</label>
            <textarea id="note" class="w-full p-3 border rounded-lg" rows="3" placeholder="General order notes..."></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Create Order",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3B82F6",
      width: "600px",
      preConfirm: () => {
        const priority = document.getElementById("priority").value
        const type = document.getElementById("type").value
        const note = document.getElementById("note").value
        return { priority, type, note }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        createOrder(result.value)
      }
    })
  }

  const createOrder = async (orderData) => {
    try {
      const token = localStorage.getItem("userToken")
      const userId = localStorage.getItem("userId") || "fd691550-75d1-4f5a-9742-19bc759e42a4"

      const orderPayload = {
        priority: orderData.priority,
        type: orderData.type,
        address: {
          stateId: "8345434c-d514-4fbf-8b6c-18c501ea3150",
          cityId: "390578aa-32a4-45ac-80c4-220db3dbb54a",
          street1: "Main Street",
          street2: "Secondary Street",
          postalCode: "12345",
          apartment: "Apt 123",
          complex: "Building Complex",
        },
        note: orderData.note,
        status: "pending",
        userId: userId,
        items: [
          {
            width: 20,
            height: 19,
            productId: "d0f372a4-a8ab-4296-a5a4-3fe71322b95b",
            categoryId: "5c3062a0-c9a6-44bf-9abe-abaa051adb00",
            materialId: "d9a58760-5094-4f57-bde0-dcfa06bcb7ab",
            stageIds: ["5d11f862-d3b8-4d26-9fb7-604371711435", "fb11eb84-4d7b-463e-a24b-6f5fddc23d85"],
            note: "Sample item",
          },
        ],
      }

      const response = await axios.post(`${API_BASE_URL}/website/orders`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      Swal.fire({
        icon: "success",
        title: "Order Created Successfully",
        text: "Your order has been created successfully.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      })

      fetchOrders()
    } catch (error) {
      console.error("Error creating order:", error)

      Swal.fire({
        icon: "error",
        title: "Failed to Create Order",
        text: error.response?.data?.message || "Could not create order. Please try again.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
      })
    }
  }

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

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const statuses = [...new Set(orders.map((o) => o.status).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            My Orders
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6 mb-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-blue-200 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-indigo-200 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={handleCreateOrder}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                + New Order
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="glass-card p-8 text-center rounded-2xl">
              <ClipLoader color="#3B82F6" size={50} />
              <p className="text-slate-600 dark:text-slate-300 mt-4 text-lg">Loading orders...</p>
            </div>
          </div>
        ) : error && orders.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">X</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Error Loading Orders</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">O</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">No Orders Found</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={handleCreateOrder}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Create First Order
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-card p-6 rounded-2xl hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                          Order #{order.id?.slice(0, 8)}
                        </h3>
                        <span
                          className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(order.status)} text-white rounded-full text-sm font-bold capitalize`}
                        >
                          {order.status || "pending"}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">
                        <span className="font-semibold">Type:</span> {order.type || "N/A"}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mb-2">
                        <span className="font-semibold">Priority:</span> {order.priority || "N/A"}
                      </p>
                      {order.note && (
                        <p className="text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Note:</span> {order.note}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center">
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Items</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white">
                          {order.items?.length || 0}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-3 text-center">
                        <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Created</div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-300">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-300">
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Orders
