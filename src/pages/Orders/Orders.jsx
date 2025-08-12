"use client"

import { useState } from "react"
import "./Orders.css"

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { id: "all", label: "All Orders", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "completed", label: "Completed", icon: "✅" },
    { id: "cancelled", label: "Cancelled", icon: "❌" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="orders-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Orders</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Track and manage your orders</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">No Orders Yet</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
