"use client"

import { useState, useEffect } from "react"
import { ClipLoader } from "react-spinners"
import "./Profile.css"

const Profile = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("userData")
    if (userDataString) {
      setUserData(JSON.parse(userDataString))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="profile-background"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl text-white">👤</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Profile</h1>
            <p className="text-slate-600 dark:text-slate-300">Manage your account information</p>
          </div>

          {userData && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {userData.name || "Not provided"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {userData.email}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="capitalize">{userData.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Member Since
                  </label>
                  <div className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
