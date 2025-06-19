"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

interface User {
  id: string
  name: string
  email: string
  roleId: number
  permissions: string[]
  roleName?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, roleId?: number) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const [roleText, setRoleText] = useState<string>("")

  useEffect(() => {
    // ตรวจสอบ token จาก cookies เมื่อ component โหลด
    const token = Cookies.get("token")

    if (token) {
      try {
        const userData = parseJwt(token)

        // ตรวจสอบว่า token ยังไม่หมดอายุ
        if (userData.exp * 1000 > Date.now()) {
          setUser({
            id: userData.userId,
            name: userData.name || '',
            email: userData.userEmail,
            roleId: userData.roleId,
            permissions: userData.permissions || [] // ดึง permissions จาก token
          })
        } else {
          // Token หมดอายุ ลบออก
          Cookies.remove("token")
        }
      } catch (error) {
        console.error('Error parsing token:', error)
        Cookies.remove("token")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // กำหนดข้อความ role ตาม roleId
    if (user) {
      switch (user.roleId) {
        case 1:
          setRoleText("Admin")
          break
        case 2:
          setRoleText("User")
          break
        default:
          setRoleText("Unknown Role")
      }
    } else {
      setRoleText("")
    }
  }, [user])

  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/login", "/register"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        router.push("/login")
      } else if (user && isPublicPath) {
        router.push("/dashboard")
      }
    }
  }, [user, pathname, router, isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token

        if (token) {
          // บันทึก token ใน cookies (อายุ 1 ชั่วโมง)
          Cookies.set("token", token, { expires: 1 / 24 })

          const userData = parseJwt(token)
          setUser({
            id: userData.userId,
            name: userData.name || '',
            email: userData.userEmail,
            roleId: userData.roleId,
            roleName: userData.roleName,
            permissions: userData.permissions || [] // ดึง permissions จาก token
          })

          console.log('Login successful:', data.message)
          return true
        }
      }

      const errorData = await response.json()
      console.error('Login failed:', errorData.message)
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    roleId: number = 2
  ): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, roleId })
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token

        if (token) {
          // บันทึก token ใน cookies
          Cookies.set("token", token, { expires: 1 / 24 })

          const userData = parseJwt(token)
          setUser({
            id: userData.userId,
            name: userData.name || name,
            email: userData.userEmail || email,
            roleId: userData.roleId || roleId,
            roleName: userData.roleName,
            permissions: userData.permissions || [] // ดึง permissions จาก token
          })

          console.log('Registration successful:', data.message)
          return true
        }
      }

      const errorData = await response.json()
      console.error('Registration failed:', errorData.message)
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    // ลบ token จาก cookies
    Cookies.remove("token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )
    return JSON.parse(base64)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    throw error
  }
}
