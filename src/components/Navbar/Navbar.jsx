"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import "./Navbar.css"

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken")
      const userDataString = localStorage.getItem("userData")

      console.log("🔍 Checking authentication status...")
      console.log("🔑 Access token exists:", !!accessToken)
      console.log("👤 User data exists:", !!userDataString)

      if (accessToken && userDataString) {
        try {
          const parsedUserData = JSON.parse(userDataString)
          setIsAuthenticated(true)
          setUserData(parsedUserData)
          console.log("✅ User is authenticated")
          console.log("👑 User role:", parsedUserData.role)
          console.log("📧 User email:", parsedUserData.email)
        } catch (error) {
          console.error("❌ Error parsing user data:", error)
          setIsAuthenticated(false)
          setUserData(null)
        }
      } else {
        setIsAuthenticated(false)
        setUserData(null)
        console.log("❌ User is not authenticated")
      }
    }

    // Check theme
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setIsDarkMode(true)
        document.documentElement.classList.add("dark")
      }
      console.log("🎨 Theme initialized:", isDarkMode ? "dark" : "light")
    }

    checkAuth()
    checkTheme()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    if (newMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

    console.log("🎨 Theme toggled to:", newMode ? "dark" : "light")
  }

  const handleLogout = async () => {
    console.log("🚪 Logout initiated...")

    const result = await Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#111827",
    })

    if (result.isConfirmed) {
      // Clear all auth data
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userData")

      setIsAuthenticated(false)
      setUserData(null)
      setIsMobileMenuOpen(false)

      console.log("✅ User logged out successfully")
      console.log("🧹 Auth data cleared from localStorage")

      await Swal.fire({
        title: "Signed Out",
        text: "You have been signed out successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#111827",
      })

      navigate("/login")
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    console.log("📱 Mobile menu toggled:", !isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActivePage = (path) => {
    return location.pathname === path
  }

  const getNavLinksForRole = (userRole) => {
    console.log("🔍 Getting navigation links for role:", userRole)

    const allNavLinks = {
      user: [
        { path: "/profile", label: "Profile", icon: "👤" },
        { path: "/categories", label: "Categories", icon: "📂" },
        { path: "/products", label: "Products", icon: "📦" },
        { path: "/orders", label: "Orders", icon: "📋" },
      ],
      admin: [
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/manage-users", label: "Manage Users", icon: "👥" },
        { path: "/manage-products", label: "Manage Products", icon: "📦" },
        { path: "/reports", label: "Reports", icon: "📊" },
      ],
      manager: [
        { path: "/dashboard", label: "Dashboard", icon: "🏠" },
        { path: "/orders", label: "Orders", icon: "📋" },
        { path: "/reports", label: "Reports", icon: "📊" },
      ],
    }

    const links = allNavLinks[userRole] || allNavLinks.user
    console.log(
      "📋 Navigation links for",
      userRole + ":",
      links.map((link) => link.label),
    )
    return links
  }

  // Get navigation links based on user role
  const navLinks = isAuthenticated && userData ? getNavLinksForRole(userData.role) : []

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Patriot
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 ${
                        isActivePage(link.path)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* User Info & Logout */}
                <div className="flex items-center space-x-4">
                  <div className="text-sm lg:text-base text-slate-600 dark:text-slate-300">
                    Welcome, <span className="font-semibold">{userData?.name || userData?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium text-sm lg:text-base hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login & Register Buttons */}
                <Link
                  to="/login"
                  className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium rounded-lg transition-all duration-300 ${
                    isActivePage("/login")
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium rounded-lg transition-all duration-300 ${
                    isActivePage("/register")
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 lg:p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 group-hover:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-slate-600 group-hover:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 text-slate-600 dark:text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-slate-700/20 py-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  Welcome, <span className="font-semibold">{userData?.name || userData?.email}</span>
                </div>

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-base font-medium rounded-lg mx-2 transition-all duration-300 ${
                      isActivePage(link.path)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 mx-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 mx-2 text-base font-medium rounded-lg transition-all duration-300 ${
                    isActivePage("/login")
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 mx-2 text-base font-medium rounded-lg transition-all duration-300 ${
                    isActivePage("/register")
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
