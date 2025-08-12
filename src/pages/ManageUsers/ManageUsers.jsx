"use client"

import { useState } from "react"
import "./ManageUsers.css"

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const roles = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="manage-users-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Manage Users</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Administer user accounts and permissions</p>
        </div>

        <div className="glass-card p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <button className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add User
            </button>
          </div>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl text-white">👥</span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">User Management</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              User management functionality will be implemented here. You'll be able to view, edit, and manage all user
              accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers
