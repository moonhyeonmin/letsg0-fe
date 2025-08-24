"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, ApiError } from "@/lib/api"
import type { User, AuthContextType } from "@/types/auth"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 초기 로드 시 토큰 확인
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      apiClient.setToken(savedToken)
      // TODO: 토큰으로 사용자 정보 조회
      // getCurrentUser()
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login({ email, password })

      setToken(response.token)
      apiClient.setToken(response.token)

      // TODO: 토큰으로 사용자 정보 조회
      // const userData = await apiClient.getCurrentUser()
      // setUser(userData)

      // 임시로 토큰에서 이메일 추출 (실제로는 사용자 정보 API 호출)
      setUser({
        user_id: 1,
        email,
        nickname: email.split("@")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })

      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "로그인 실패",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "로그인 실패",
          description: "알 수 없는 오류가 발생했습니다.",
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
        description: "로그인해주세요.",
      })

      router.push("/login")
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "회원가입 실패",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "회원가입 실패",
          description: "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    apiClient.setToken(null)

    toast({
      title: "로그아웃",
      description: "안전하게 로그아웃되었습니다.",
    })

    router.push("/login")
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
