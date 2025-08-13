
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import axios from "axios"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"
import "./Home.css"

const Home = () => {
  const [userData, setUserData] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const API_BASE_URL = "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1"

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUserData(parsedUserData)
      console.log("🏠 Home - User data loaded:", parsedUserData)
    }

    // Fetch categories from API
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      console.log("🔄 Fetching categories from API...")

      const response = await axios.get(`${API_BASE_URL}/categories`)
      console.log("✅ Categories API Response:", response.data)

      let categoriesData = []
      if (response.data && Array.isArray(response.data.results)) {
        categoriesData = response.data.results
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data
      } else {
        console.warn("⚠️ Unexpected API response structure:", response.data)
        categoriesData = []
      }

      console.log("📦 Final categories data:", categoriesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("❌ Error fetching categories:", error)
      // Fallback to empty array if API fails
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  const features = [
    {
      icon: "🏭",
      title: "Manufacturing Excellence",
      description: "State-of-the-art glass manufacturing with precision cutting and quality control",
      details:
        "Our advanced manufacturing facility uses cutting-edge technology to produce glass products that meet international standards.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and secure delivery to your location with professional handling",
      details:
        "We ensure safe transportation of all glass products with specialized vehicles and experienced delivery teams.",
    },
    {
      icon: "🔧",
      title: "Custom Solutions",
      description: "Tailored glass solutions for your specific requirements and projects",
      details:
        "Our expert team works with you to create custom glass solutions that perfectly match your project needs.",
    },
    {
      icon: "🛡️",
      title: "Quality Assurance",
      description: "Rigorous testing and quality control for all our glass products",
      details:
        "Every product undergoes comprehensive quality testing to ensure durability, safety, and performance standards.",
    },
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: "👥" },
    { number: "500+", label: "Projects Completed", icon: "🏗️" },
    { number: "15+", label: "Years Experience", icon: "⭐" },
    { number: "99%", label: "Customer Satisfaction", icon: "💯" },
  ]

  const showDetails = (section, data) => {
    setActiveSection({ section, data })
    console.log(`🔍 Showing details for ${section}:`, data)
  }

  const closeDetails = () => {
    setActiveSection(null)
    console.log("❌ Closing details modal")
  }

  return (
    <div className="home-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="moving-sticks">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`stick stick-${i + 1} absolute bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-blue-500/30 dark:to-indigo-500/30`}
          />
        ))}
      </div>

      {/* Enhanced Glass Orbs */}
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>
      <div className="glass-orb glass-orb-3"></div>
      <div className="glass-orb glass-orb-4"></div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-7xl mx-auto p-8 lg:p-16 text-center">
          <div className="mb-12">
            <h1 className="text-5xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6 animate-pulse">
              Welcome to Patriot
            </h1>
            <p className="text-2xl lg:text-4xl text-slate-600 dark:text-slate-300 mb-8 font-light">
              Your Premium Glass Management System
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="px-6 py-3 bg-blue-500/20 dark:bg-blue-400/20 rounded-full text-blue-700 dark:text-blue-300 font-semibold">
                🏭 Manufacturing
              </span>
              <span className="px-6 py-3 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full text-emerald-700 dark:text-emerald-300 font-semibold">
                🚚 Distribution
              </span>
              <span className="px-6 py-3 bg-purple-500/20 dark:bg-purple-400/20 rounded-full text-purple-700 dark:text-purple-300 font-semibold">
                🔧 Custom Solutions
              </span>
            </div>
          </div>

          {userData && (
            <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-white/30 dark:border-slate-700/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
                Welcome back, {userData.name}! 👋
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-400/20 dark:to-blue-500/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">👤</div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Role:</span>
                  <p className="font-bold text-xl text-slate-800 dark:text-white capitalize">{userData.role}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-emerald-400/20 dark:to-emerald-500/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">📧</div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Email:</span>
                  <p className="font-bold text-lg text-slate-800 dark:text-white">{userData.email}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 dark:from-purple-400/20 dark:to-purple-500/20 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl mb-2">✅</div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Status:</span>
                  <p className="font-bold text-xl text-emerald-600 dark:text-emerald-400">Active</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Carousel Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">Our Categories</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore our comprehensive range of premium products designed for every application
            </p>
          </div>

          <div className="relative">
            {loadingCategories ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : categories.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={30}
                slidesPerView={1}
                centeredSlides={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
                className="categories-swiper"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id}>
                    <div className="glass-card p-6 h-96 flex flex-col transform hover:scale-105 transition-all duration-500 group">
                      <div className="relative overflow-hidden rounded-2xl mb-4 flex-1">
                        <img
                          src={category.imageUrl || "/placeholder.svg?height=300&width=300&query=glass category"}
                          alt={category.name?.en || category.name || "Category"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/glass-category.png"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {category.name?.en || category.name || "Category"}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 flex-1">
                        {category.description?.en || category.description || "Premium quality products"}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">Available Now</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-600 dark:text-slate-300 text-xl">No categories available at the moment</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">Why Choose Patriot?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We deliver excellence in every aspect of manufacturing and distribution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{feature.description}</p>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6">Our Achievements</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Numbers that speak for our excellence and commitment
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-all duration-300 group">
                  <div className="text-5xl mb-4 group-hover:animate-bounce">{stat.icon}</div>
                  <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {activeSection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                {activeSection.section === "category" ? activeSection.data.name : activeSection.data.title}
              </h3>
              <button
                onClick={closeDetails}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {activeSection.section === "feature" && (
              <div>
                <div className="text-6xl text-center mb-6">{activeSection.data.icon}</div>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">{activeSection.data.description}</p>
                <div className="bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg p-4">
                  <p className="text-emerald-700 dark:text-emerald-300">{activeSection.data.details}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
