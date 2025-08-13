"use client"

import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import axios from "axios"
import Swal from "sweetalert2"
import "./Materials.css"

const Materials = () => {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [materialsPerPage] = useState(12)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Fetching materials from API...")

      const response = await axios.get(`${API_BASE_URL}/materials`)
      console.log("✅ Materials API Response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        setMaterials(response.data)
        console.log("🎯 Materials loaded:", response.data.length)
      } else {
        throw new Error("Invalid materials data format")
      }
    } catch (error) {
      console.error("❌ Error fetching materials:", error)
      setError(error.message)

      // Fallback materials data
      const fallbackMaterials = [
        {
          id: 1,
          name: { en: "Float Glass", ar: "زجاج مسطح" },
          description: {
            en: "High-quality float glass for various applications",
            ar: "زجاج مسطح عالي الجودة للتطبيقات المختلفة",
          },
          type: "raw",
          thickness: "4mm",
          dimensions: "3000x2000mm",
          color: "Clear",
          price: 25,
          imageUrl: "/float-glass.png",
          inStock: true,
          properties: { transparency: "90%", strength: "Standard" },
        },
        {
          id: 2,
          name: { en: "Aluminum Frame", ar: "إطار ألومنيوم" },
          description: {
            en: "Durable aluminum framing for glass installations",
            ar: "إطار ألومنيوم متين لتركيبات الزجاج",
          },
          type: "frame",
          dimensions: "6000mm length",
          color: "Silver",
          price: 45,
          imageUrl: "/aluminum-frame.png",
          inStock: true,
          properties: { weight: "2.5kg/m", finish: "Anodized" },
        },
        {
          id: 3,
          name: { en: "Glass Sealant", ar: "مانع تسرب الزجاج" },
          description: {
            en: "Professional grade sealant for glass applications",
            ar: "مانع تسرب درجة مهنية لتطبيقات الزجاج",
          },
          type: "sealant",
          volume: "300ml",
          color: "Clear",
          price: 15,
          imageUrl: "/placeholder-wtxvw.png",
          inStock: false,
          properties: { cureTime: "24 hours", temperature: "-40°C to +150°C" },
        },
      ]

      setMaterials(fallbackMaterials)
      console.log("🔄 Using fallback materials:", fallbackMaterials)

      Swal.fire({
        icon: "warning",
        title: "Materials Loading Issue",
        text: "Using sample materials. Please check your connection.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  // Filter and sort materials
  const filteredMaterials = materials.filter((material) => {
    const name = material.name?.en || material.name || ""
    const description = material.description?.en || material.description || ""
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || material.type === filterType
    return matchesSearch && matchesType
  })

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name?.en || a.name || "").localeCompare(b.name?.en || b.name || "")
      case "price":
        return (a.price || 0) - (b.price || 0)
      case "type":
        return (a.type || "").localeCompare(b.type || "")
      default:
        return 0
    }
  })

  // Pagination
  const indexOfLastMaterial = currentPage * materialsPerPage
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage
  const currentMaterials = sortedMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial)
  const totalPages = Math.ceil(sortedMaterials.length / materialsPerPage)

  const types = [...new Set(materials.map((m) => m.type).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-teal-900/20 py-8">
      <div className="materials-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
            Raw Materials
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Premium quality materials for all your glass manufacturing needs
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass-card p-6 mb-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-teal-200 dark:border-teal-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-4 bg-white/70 dark:bg-slate-800/70 border border-cyan-200 dark:border-cyan-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="glass-card p-8 text-center rounded-2xl">
              <ClipLoader color="#10B981" size={50} />
              <p className="text-slate-600 dark:text-slate-300 mt-4 text-lg">Loading materials...</p>
            </div>
          </div>
        ) : error && materials.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">❌</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Error Loading Materials</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={fetchMaterials}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentMaterials.map((material) => (
                <div
                  key={material.id}
                  className="glass-card p-6 rounded-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={material.imageUrl || "/placeholder.svg?height=250&width=250&query=glass+material"}
                      alt={material.name?.en || material.name || "Material"}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/glass-material.png"
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          material.inStock ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
                        }`}
                      >
                        {material.inStock ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white rounded-full text-xs font-semibold capitalize">
                        {material.type}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {material.name?.en || material.name || "Glass Material"}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {material.description?.en || material.description || "Premium glass material"}
                  </p>

                  <div className="mb-4 space-y-2">
                    {material.dimensions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Dimensions:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{material.dimensions}</span>
                      </div>
                    )}
                    {material.thickness && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Thickness:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{material.thickness}</span>
                      </div>
                    )}
                    {material.color && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Color:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{material.color}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      {material.price && (
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                          ${material.price}
                        </span>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
                      View Details
                    </button>
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
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === index + 1
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                            : "bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg font-semibold transition-all duration-300"
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
                Showing {indexOfFirstMaterial + 1}-{Math.min(indexOfLastMaterial, sortedMaterials.length)} of{" "}
                {sortedMaterials.length} materials
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Materials
