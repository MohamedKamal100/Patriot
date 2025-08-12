import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken")
  const userData = localStorage.getItem("userData")

  console.log("🔒 ProtectedRoute - Checking authentication:", {
    hasToken: !!token,
    hasUserData: !!userData,
    timestamp: new Date().toISOString(),
  })

  if (!token || !userData) {
    console.log("❌ ProtectedRoute - User not authenticated, redirecting to login")
    return <Navigate to="/login" replace />
  }

  console.log("✅ ProtectedRoute - User authenticated, allowing access")
  return children
}

export default ProtectedRoute
