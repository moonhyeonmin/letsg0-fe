"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, ApiError } from "@/lib/api"
import type { Application, ApplicationRequest, ApplicationResponse } from "@/types/application"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const userApplications = await apiClient.getUserApplications(user.user_id)
      setApplications(userApplications)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "지원 내역을 불러오는 중 오류가 발생했습니다."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchApplicationsByStatus = useCallback(
    async (status: string) => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)
        const userApplications = await apiClient.getUserApplicationsByStatus(user.user_id, status)
        setApplications(userApplications)
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : "지원 내역을 불러오는 중 오류가 발생했습니다."
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const applyToJob = useCallback(
    async (applicationData: ApplicationRequest): Promise<ApplicationResponse> => {
      try {
        const response = await apiClient.applyToJobPost(applicationData)

        toast({
          title: "지원 완료",
          description: "성공적으로 지원이 완료되었습니다.",
        })

        // 지원 후 목록 새로고침
        await fetchApplications()

        return response
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : "지원 중 오류가 발생했습니다."

        toast({
          title: "지원 실패",
          description: errorMessage,
          variant: "destructive",
        })

        throw err
      }
    },
    [fetchApplications, toast],
  )

  const isJobApplied = useCallback(
    (jobPostId: number): boolean => {
      return applications.some((app) => app.jobPost.id === jobPostId)
    },
    [applications],
  )

  const getApplicationByJobPost = useCallback(
    (jobPostId: number): Application | undefined => {
      return applications.find((app) => app.jobPost.id === jobPostId)
    },
    [applications],
  )

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    error,
    fetchApplications,
    fetchApplicationsByStatus,
    applyToJob,
    isJobApplied,
    getApplicationByJobPost,
  }
}
