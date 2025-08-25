"use client"

import { useState, useEffect } from "react"
import { apiClient, ApiError } from "@/lib/api"
import type { UserProfile, ProfileUpdateRequest, ProfileStats } from "@/types/profile"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchProfile = async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const [profileData, statsData] = await Promise.all([apiClient.getUserProfile(), apiClient.getProfileStats()])
      setProfile(profileData)
      setStats(statsData)
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "프로필 로드 실패",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: ProfileUpdateRequest) => {
    try {
      setIsUpdating(true)
      const updatedProfile = await apiClient.updateUserProfile(data)
      setProfile(updatedProfile)
      toast({
        title: "프로필 업데이트 성공",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      })
      return updatedProfile
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "프로필 업데이트 실패",
          description: error.message,
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [isAuthenticated])

  return {
    profile,
    stats,
    isLoading,
    isUpdating,
    updateProfile,
    refetchProfile: fetchProfile,
  }
}
