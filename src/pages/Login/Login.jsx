
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import Swal from "sweetalert2"
import { ClipLoader } from "react-spinners"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"

const Login = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate() // Added useNavigate for redirection

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    console.log("Theme initialized:", isDarkMode ? "dark" : "light")
  }, [])

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("🚀 Starting login process...")
    console.log("📧 Login attempt for email:", values.email)

    try {
      const loginData = {
        email: values.email,
        password: values.password,
      }

      console.log("📤 Sending login request to API...")
      console.log("🔗 API Endpoint: https://patriot-backend-api-e8be76603d85.herokuapp.com/v1/auth-sessions/email")
      console.log("📦 Request payload:", { email: loginData.email, password: "***hidden***" })

      const response = await axios.post(
        "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1/auth-sessions/email",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        },
      )

      console.log("✅ Login successful!")
      console.log("📥 Response status:", response.status)
      console.log("👤 User data:", response.data.user)
      console.log("🔑 Access token received:", response.data.accessToken ? "Yes" : "No")
      console.log("🔄 Refresh token received:", response.data.refreshToken ? "Yes" : "No")

      // Store tokens and user data
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken)
        console.log("💾 Access token stored in localStorage")
      }

      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
        console.log("💾 Refresh token stored in localStorage")
      }

      if (response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user))
        console.log("💾 User data stored in localStorage")
        console.log("👑 User role:", response.data.user.role)
      }

      await Swal.fire({
        title: "Welcome Back! 🎉",
        text: `Login successful! Welcome ${response.data.user?.name || response.data.user?.email}`,
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#10b981",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#111827",
      })

      console.log("🎯 Redirecting user to home page...")
      console.log("👑 User role:", response.data.user?.role)
      navigate("/home") // Added navigation to home page after successful login
    } catch (error) {
      console.error("❌ Login failed!")
      console.error("🔍 Error details:", error)

      if (error.response) {
        console.error("📥 Server response status:", error.response.status)
        console.error("📥 Server response data:", error.response.data)
        console.error("📥 Server response headers:", error.response.headers)
      } else if (error.request) {
        console.error("📡 Network error - no response received:", error.request)
      } else {
        console.error("⚙️ Request setup error:", error.message)
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again."

      await Swal.fire({
        title: "Login Failed 😞",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#111827",
      })
    } finally {
      setSubmitting(false)
      console.log("🏁 Login process completed")
    }
  }

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

    console.log("Theme toggled to:", newMode ? "dark" : "light")
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
      {/* Animated Moving Sticks Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="moving-stick stick-1"></div>
        <div className="moving-stick stick-2"></div>
        <div className="moving-stick stick-3"></div>
        <div className="moving-stick stick-4"></div>
        <div className="moving-stick stick-5"></div>
        <div className="moving-stick stick-6"></div>
        <div className="moving-stick stick-7"></div>
        <div className="moving-stick stick-8"></div>
      </div>

      {/* Animated Glass Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glass-orb glass-orb-1"></div>
        <div className="glass-orb glass-orb-2"></div>
        <div className="glass-orb glass-orb-3"></div>
        <div className="glass-orb glass-orb-4"></div>
        <div className="glass-orb glass-orb-5"></div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 rounded-full bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all duration-300 group shadow-lg"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300"
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
            className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:rotate-12 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 xl:p-12 transition-all duration-500 hover:shadow-3xl hover:bg-white/25 dark:hover:bg-slate-800/25">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              {/* Icon Background Gradient */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 shadow-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 000 2h1zm-7 4a1 1 0 100-2H3a1 1 0 000 2h1z"
                  />
                </svg>
              </div>
              {/* Text Gradient */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 lg:mb-3">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
                Sign in to your Patriot account
              </p>
            </div>

            {/* Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-sm lg:text-base bg-white/60 dark:bg-slate-800/60 border ${
                          errors.email && touched.email
                            ? "border-red-400 dark:border-red-500"
                            : "border-white/40 dark:border-slate-600/40"
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm font-medium"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-sm lg:text-base bg-white/60 dark:bg-slate-800/60 border ${
                          errors.password && touched.password
                            ? "border-red-400 dark:border-red-500"
                            : "border-white/40 dark:border-slate-600/40"
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 lg:py-4 px-6 text-sm lg:text-base rounded-xl lg:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[52px] lg:min-h-[60px]"
                  >
                    {isSubmitting ? (
                      <>
                        <ClipLoader size={20} color="#ffffff" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Footer */}
            <div className="mt-6 lg:mt-8 text-center">
              <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
