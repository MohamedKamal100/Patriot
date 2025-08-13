
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import Swal from "sweetalert2"
import { ClipLoader } from "react-spinners"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Register.css"

const Register = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

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

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("🚀 Starting registration process...")
    console.log("📧 Registration attempt for email:", values.email)
    console.log("👤 User name:", values.name)

    try {
      const registerData = {
        name: values.name,
        email: values.email,
        password: values.password,
      }

      console.log("📤 Sending registration request to API...")
      console.log("🔗 API Endpoint: https://patriot-backend-api-e8be76603d85.herokuapp.com/v1/users")
      console.log("📦 Request payload:", {
        name: registerData.name,
        email: registerData.email,
        password: "***hidden***",
      })

      const response = await axios.post(
        "https://patriot-backend-api-e8be76603d85.herokuapp.com/v1/users",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        },
      )

      console.log("✅ Registration successful!")
      console.log("📥 Response status:", response.status)
      console.log("👤 User data:", response.data.user || response.data)

      await Swal.fire({
        title: "Welcome to Patriot! 🎉",
        text: `Registration successful! Welcome ${values.name}`,
        icon: "success",
        confirmButtonText: "Continue to Login",
        confirmButtonColor: "#10b981",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#111827",
      })

      console.log("🎯 Registration completed successfully")
      navigate("/login")
    } catch (error) {
      console.error("❌ Registration failed!")
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
        "Registration failed. Please try again."

      await Swal.fire({
        title: "Registration Failed 😞",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#111827",
      })
    } finally {
      setSubmitting(false)
      console.log("🏁 Registration process completed")
    }
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

   
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          {/* Register Card */}
          <div className="backdrop-blur-xl bg-white/20 dark:bg-slate-800/20 border border-white/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 xl:p-12 transition-all duration-500 hover:shadow-3xl hover:bg-white/25 dark:hover:bg-slate-800/25">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              {/* Icon Background Gradient */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl mb-4 lg:mb-6 shadow-lg">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              {/* Text Gradient */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2 lg:mb-3">
                Join Patriot
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
                Create your account to get started
              </p>
            </div>

            {/* Form */}
            <Formik
              initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Full Name
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your full name"
                        className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-sm lg:text-base bg-white/60 dark:bg-slate-800/60 border ${
                          errors.name && touched.name
                            ? "border-red-400 dark:border-red-500"
                            : "border-white/40 dark:border-slate-600/40"
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm font-medium"
                    />
                  </div>

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
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
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
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm font-medium"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm lg:text-base font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Confirm Password
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 text-sm lg:text-base bg-white/60 dark:bg-slate-800/60 border ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-400 dark:border-red-500"
                            : "border-white/40 dark:border-slate-600/40"
                        } rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 dark:text-red-400 text-sm font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 lg:py-4 px-6 text-sm lg:text-base rounded-xl lg:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-h-[52px] lg:min-h-[60px]"
                  >
                    {isSubmitting ? (
                      <>
                        <ClipLoader size={20} color="#ffffff" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
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
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
