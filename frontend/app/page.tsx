'use client'

import AuthLayout from "./(component)/auth/auth";
import { useEffect, useState } from "react";
import { AdminDashboard } from "./(component)/dashboard/admin";
import { UserDashboard } from "./(component)/dashboard/user";
import axios from "axios";


type UserRole = 'moderator' | 'user' | 'admin'

interface CurrentUser {
  id: string
  email: string
  role: UserRole
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/v1/user/me', {
          withCredentials: true
        });
        if (res.status === 200) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        console.log("No active session");
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
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
