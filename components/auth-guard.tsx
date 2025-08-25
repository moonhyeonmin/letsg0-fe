"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  // 인증이 필요하지 않은 페이지들
  const publicRoutes = ["/login", "/signup", "/onboarding"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated && !isPublicRoute) {
        try {
          const status = await apiClient.checkOnboardingStatus()
          setOnboardingCompleted(status.completed)

          if (!status.completed && pathname !== "/onboarding") {
            router.push("/onboarding")
          }
        } catch (error) {
          // 온보딩 상태 확인 실패 시 온보딩 완료로 간주
          setOnboardingCompleted(true)
        }
      } else {
        setOnboardingCompleted(true)
      }
    }

    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login")
      } else {
        checkOnboardingStatus()
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, isPublicRoute])

  // 로딩 중이거나 온보딩 상태 확인 중
  if (isLoading || onboardingCompleted === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 인증되지 않은 사용자가 보호된 페이지에 접근하려는 경우
  if (!isAuthenticated && !isPublicRoute) {
    return null
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하려는 경우
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    router.push("/")
    return null
  }

  return <>{children}</>
}
