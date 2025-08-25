"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient, ApiError } from "@/lib/api"
import type { User } from "@/types/auth"
import { toast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        apiClient.setToken(token)
        try {
          const userData = await apiClient.getCurrentUser()
          setUser(userData)
        } catch (error) {
          localStorage.removeItem("auth_token")
          apiClient.setToken(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login({ email, password })

      apiClient.setToken(response.token)
      setUser(response.user)

      toast({
        title: "로그인 성공",
        description: `환영합니다, ${response.user.nickname}님!`,
      })

      // 온보딩 상태 확인
      try {
        const onboardingStatus = await apiClient.checkOnboardingStatus()
        if (!onboardingStatus.completed) {
          router.push("/onboarding")
        } else {
          router.push("/")
        }
      } catch (error) {
        // 온보딩 상태 확인 실패 시 메인 페이지로 이동
        router.push("/")
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "로그인 실패",
          description: error.message,
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setIsLoading(true)
      await apiClient.signup({ email, password, nickname })

      toast({
        title: "회원가입 성공",
        description: "로그인 후 프로필을 설정해주세요.",
      })

      // 회원가입 후 자동 로그인
      await login(email, password)
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "회원가입 실패",
          description: error.message,
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    apiClient.setToken(null)
    setUser(null)
    toast({
      title: "로그아웃",
      description: "성공적으로 로그아웃되었습니다.",
    })
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
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
