"use client"

import { useState } from "react"
import "./Reports.css"

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("sales")

  const periods = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ]

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: "💰" },
    { value: "users", label: "User Report", icon: "👥" },
    { value: "products", label: "Product Report", icon: "📦" },
    { value: "orders", label: "Order Report", icon: "📋" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="reports-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Reports</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Analytics and business insights</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
            <button className="px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportTypes.map((report) => (
              <button
                key={report.value}
                onClick={() => setSelectedReport(report.value)}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  selectedReport === report.value
                    ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500"
                    : "bg-white/30 dark:bg-slate-800/30 border-2 border-transparent hover:bg-white/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="text-center">
                  <span className="text-3xl mb-3 block">{report.icon}</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{report.label}</h3>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">📊</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Advanced Analytics</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Comprehensive reporting system will be implemented here. You'll be able to generate detailed reports and
              analytics for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
