"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, ApiError } from "@/lib/api"
import type { JobPost, JobPostExtended } from "@/types/job"
import { useToast } from "@/hooks/use-toast"

// JobPost를 JobPostExtended로 변환하는 유틸리티 함수
function transformJobPost(jobPost: JobPost): JobPostExtended {
  // content에서 요약 생성 (첫 100자)
  const summary = jobPost.content.length > 100 ? jobPost.content.substring(0, 100) + "..." : jobPost.content

  // position과 location에서 태그 생성
  const tags = [
    jobPost.position,
    jobPost.location.split(" ")[0], // 지역의 첫 번째 단어만
    "정규직", // 기본 태그
  ].filter(Boolean)

  return {
    ...jobPost,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30일 후
    summary,
    tags,
    createdAt: new Date().toISOString(),
  }
}

export function useJobPosts() {
  const [jobPosts, setJobPosts] = useState<JobPostExtended[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchJobPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const posts = await apiClient.getJobPosts()
      const transformedPosts = posts.map(transformJobPost)
      setJobPosts(transformedPosts)
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "공고를 불러오는 중 오류가 발생했습니다."

      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const searchJobPosts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        await fetchJobPosts()
        return
      }

      try {
        setLoading(true)
        setError(null)

        // 제목으로 검색 (실제로는 여러 조건으로 검색할 수 있지만 일단 제목으로)
        const posts = await apiClient.getJobPostsByTitle(query)
        const transformedPosts = posts.map(transformJobPost)
        setJobPosts(transformedPosts)
      } catch (err) {
        // 검색 결과가 없는 경우 빈 배열로 설정
        if (err instanceof ApiError && err.status === 404) {
          setJobPosts([])
        } else {
          const errorMessage = err instanceof ApiError ? err.message : "검색 중 오류가 발생했습니다."

          setError(errorMessage)
          toast({
            title: "검색 오류",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [toast, fetchJobPosts],
  )

  const filterJobPosts = useCallback(
    async (filters: {
      companies?: string[]
      positions?: string[]
      locations?: string[]
    }) => {
      try {
        setLoading(true)
        setError(null)

        let allPosts: JobPost[] = []

        // 필터가 없으면 전체 조회
        if (!filters.companies?.length && !filters.positions?.length && !filters.locations?.length) {
          allPosts = await apiClient.getJobPosts()
        } else {
          // 각 필터 조건으로 검색하고 결과를 합침
          const promises: Promise<JobPost[]>[] = []

          if (filters.companies?.length) {
            filters.companies.forEach((company) => {
              promises.push(apiClient.getJobPostsByCompany(company))
            })
          }

          if (filters.positions?.length) {
            filters.positions.forEach((position) => {
              promises.push(apiClient.getJobPostsByPosition(position))
            })
          }

          if (filters.locations?.length) {
            filters.locations.forEach((location) => {
              promises.push(apiClient.getJobPostsByLocation(location))
            })
          }

          const results = await Promise.allSettled(promises)
          const successResults = results
            .filter((result): result is PromiseFulfilledResult<JobPost[]> => result.status === "fulfilled")
            .flatMap((result) => result.value)

          // 중복 제거
          const uniquePosts = successResults.reduce((acc, post) => {
            if (!acc.find((p) => p.id === post.id)) {
              acc.push(post)
            }
            return acc
          }, [] as JobPost[])

          allPosts = uniquePosts
        }

        const transformedPosts = allPosts.map(transformJobPost)
        setJobPosts(transformedPosts)
      } catch (err) {
        const errorMessage = err instanceof ApiError ? err.message : "필터링 중 오류가 발생했습니다."

        setError(errorMessage)
        toast({
          title: "필터링 오류",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchJobPosts()
  }, [fetchJobPosts])

  return {
    jobPosts,
    loading,
    error,
    refetch: fetchJobPosts,
    searchJobPosts,
    filterJobPosts,
  }
}
