"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Swal from "sweetalert2"

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
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

    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setIsDarkMode(true)
        document.documentElement.classList.add("dark")
      }
      console.log("🎨 Theme initialized:", isDarkMode ? "dark" : "light")
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }

    checkAuth()
    checkTheme()
    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userData")

      setIsAuthenticated(false)
      setUserData(null)
      setIsMobileMenuOpen(false)
      setIsUserDropdownOpen(false)

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

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const isActivePage = (path) => {
    return location.pathname === path
  }

  const getNavLinksForRole = (userRole) => {
    console.log("🔍 Getting navigation links for role:", userRole)

    const allNavLinks = {
      user: [
        { path: "/home", label: "Home" },
        { path: "/materials", label: "Materials" },
        { path: "/categories", label: "Categories" },
        { path: "/products", label: "Products" },
        { path: "/orders", label: "Orders" },
      ],
      admin: [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/manage-users", label: "Users" },
        { path: "/manage-products", label: "Products" },
        { path: "/materials", label: "Materials" },
        { path: "/reports", label: "Reports" },
      ],
      manager: [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/orders", label: "Orders" },
        { path: "/materials", label: "Materials" },
        { path: "/reports", label: "Reports" },
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

  const navLinks = isAuthenticated && userData ? getNavLinksForRole(userData.role) : []

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 shadow-lg shadow-blue-500/10"
          : "backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
      } border-b border-blue-100/50 dark:border-blue-900/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-90 transition-all duration-500 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <svg
                  className="w-6 h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all duration-500">
                Patriot
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                Management System
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative px-4 py-2.5 rounded-xl text-sm lg:text-base font-medium transition-all duration-500 group overflow-hidden ${
                        isActivePage(link.path)
                          ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/30 transform scale-105"
                          : "text-gray-600 dark:text-gray-300 hover:text-white hover:scale-105"
                      }`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      {!isActivePage(link.path) && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100"></div>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="relative ml-6 pl-6 border-l border-gray-200 dark:border-gray-700" ref={dropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-800 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 transition-all duration-300">
                      <span className="text-white text-sm font-bold drop-shadow">
                        {(userData?.name || userData?.email)?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                        isUserDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold drop-shadow">
                              {(userData?.name || userData?.email)?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {userData?.name || userData?.email}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">
                              {userData?.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {isDarkMode ? (
                          <>
                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                            <span>Dark Mode</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-6 py-2.5 text-sm lg:text-base font-medium rounded-xl transition-all duration-500 transform hover:scale-105 ${
                    isActivePage("/login")
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/30"
                      : "text-blue-600 dark:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2.5 text-sm lg:text-base font-medium rounded-xl transition-all duration-500 transform hover:scale-105 ${
                    isActivePage("/register")
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40"
                  }`}
                >
                  Register
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-500 group ml-2 shadow-lg hover:shadow-xl transform hover:scale-110"
                aria-label="Toggle dark mode"
              >
                <div className="relative w-5 h-5 lg:w-6 lg:h-6">
                  {isDarkMode ? (
                    <svg
                      className="w-full h-full text-amber-500 group-hover:rotate-180 group-hover:text-amber-400 transition-all duration-700 drop-shadow-lg"
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
                      className="w-full h-full text-gray-600 group-hover:-rotate-12 group-hover:text-indigo-600 transition-all duration-700 drop-shadow-lg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </div>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-500"
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
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 mt-1 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 mt-1 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100 pb-6" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl mx-2 mb-4 border border-blue-100 dark:border-blue-800">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                    <span className="text-white font-bold drop-shadow">
                      {(userData?.name || userData?.email)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userData?.name || userData?.email}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">
                      {userData?.role}
                    </div>
                  </div>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 text-base font-medium rounded-xl transition-all duration-500 transform hover:scale-105 ${
                      isActivePage(link.path)
                        ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl"
                        : "text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500"
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 mx-2 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 border border-red-200 dark:border-red-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 mx-2 text-base font-medium rounded-xl transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 text-center ${
                    isActivePage("/login")
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/30"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 mx-2 text-base font-medium rounded-xl transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-center ${
                    isActivePage("/register")
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30"
                      : ""
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
