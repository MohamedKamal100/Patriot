"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"

const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    const userDataString = localStorage.getItem("userData")
    if (userDataString) {
      setUserData(JSON.parse(userDataString))
    }

    // Mock stats - replace with real API calls
    setStats({
      totalUsers: 1250,
      totalOrders: 3420,
      totalProducts: 156,
      totalRevenue: 125000,
    })
  }, [])

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥", color: "from-blue-600 to-indigo-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: "📋", color: "from-emerald-600 to-teal-600" },
    { title: "Total Products", value: stats.totalProducts, icon: "📦", color: "from-purple-600 to-pink-600" },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "from-amber-600 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="dashboard-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Dashboard</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Welcome back, {userData?.name || userData?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <div key={index} className="glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-xl text-white">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">New order received</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">New user registered</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">15 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <span className="block text-2xl mb-2">📊</span>
                View Reports
              </button>
              <button className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                <span className="block text-2xl mb-2">👥</span>
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
