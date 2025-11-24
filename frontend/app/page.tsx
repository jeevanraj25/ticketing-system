'use client'

import AuthLayout from "./(component)/auth/auth";
import { useState } from "react";
import { AdminDashboard } from "./(component)/dashboard/admin";
import { UserDashboard } from "./(component)/dashboard/user";


type UserRole = 'moderator' | 'user' | 'admin'

interface CurrentUser {
  id: string
  email: string
  role: UserRole
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <AuthLayout onLogin={handleLogin} />
  }

  if (currentUser.role === 'user') {
    return <UserDashboard user={currentUser} onLogout={handleLogout} />
  }

  if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />
  }

  return <UserDashboard user={currentUser} onLogout={handleLogout} />
}
