import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ProductProvider } from "./contexts/ProductContext"
import { OrderProvider } from "./contexts/OrderContext"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import Categories from "./pages/Categories/Categories"
import CategoryDetails from "./pages/CategoryDetails/CategoryDetails"
import Products from "./pages/Products/Products"
import Materials from "./pages/Materials/Materials"
import Orders from "./pages/Orders/Orders"
import Dashboard from "./pages/Dashboard/Dashboard"
import ManageUsers from "./pages/ManageUsers/ManageUsers"
import ManageProducts from "./pages/ManageProducts/ManageProducts"
import Reports from "./pages/Reports/Reports"
import ProductDetails from "./pages/ProductDetails/ProductDetails"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import PublicRoute from "./components/PublicRoute/PublicRoute"
import Navbar from "./components/Navbar/Navbar"
import "./App.css"

function App() {
  return (
    <OrderProvider>
    <ProductProvider>
      <Router>
        <div className="App">
          <Navbar />

          <div className="pt-16 lg:pt-20">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/:id"
                element={
                  <ProtectedRoute>
                    <CategoryDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/materials"
                element={
                  <ProtectedRoute>
                    <Materials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-users"
                element={
                  <ProtectedRoute>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-products"
                element={
                  <ProtectedRoute>
                    <ManageProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ProductProvider>
    </OrderProvider>
  )
}

export default App
