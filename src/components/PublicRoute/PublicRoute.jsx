import { Navigate } from "react-router-dom"

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken")
  const userData = localStorage.getItem("userData")

  console.log("🌐 PublicRoute - Checking authentication:", {
    hasToken: !!token,
    hasUserData: !!userData,
    timestamp: new Date().toISOString(),
  })

  if (token && userData) {
    console.log("✅ PublicRoute - User already authenticated, redirecting to home")
    return <Navigate to="/home" replace />
  }

  console.log("🔓 PublicRoute - User not authenticated, showing public page")
  return children
}

export default PublicRoute
