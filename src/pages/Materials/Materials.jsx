
import { useState, useEffect } from "react"

const Materials = () => {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://patriot-backend-api-e8be76603d85.herokuapp.com/v1/materials")
      const data = await response.json()
      setMaterials(data.results || [])
    } catch (err) {
      setError("Failed to load materials")
      setMaterials([
        { id: 1, name: { en: "Steel Sheets" }, imageUrl: "/steel-material.png", quantity: 500, type: "Metal" },
        { id: 2, name: { en: "Oak Wood" }, imageUrl: "/oak-wood-material.png", quantity: 200, type: "Wood" },
        { id: 3, name: { en: "Aluminum" }, imageUrl: "/aluminum-sheets.png", quantity: 300, type: "Metal" },
        { id: 4, name: { en: "Plastic Sheets" }, imageUrl: "/plastic-material.png", quantity: 150, type: "Plastic" },
        { id: 5, name: { en: "Glass Panels" }, imageUrl: "/glass-material.png", quantity: 80, type: "Glass" },
        {
          id: 6,
          name: { en: "Ceramic Tiles" },
          imageUrl: "/ceramic-tiles-collection.png",
          quantity: 400,
          type: "Ceramic",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading materials...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Materials</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{materials.length} items available</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <img
                  src={material.imageUrl || "/abstract-material.png"}
                  alt={material.name?.en || material.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/abstract-material.png"
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                  {material.name?.en || material.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{material.type || "Material"}</p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{material.quantity || 0} units</p>
              </div>
            </div>
          ))}
        </div>

        {materials.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No materials found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Materials
