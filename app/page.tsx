"use client"

import { SearchBar } from "@/components/search-bar"
import { JobCard } from "@/components/job-card"
import { JobSort, type SortOption } from "@/components/job-sort"
import type { FilterOptions } from "@/components/job-filter"
import { useState, useMemo, useEffect } from "react"
import { NotificationSettings } from "@/components/notification-settings"
import { NotificationToast } from "@/components/notification-toast"
import { useNotifications } from "@/hooks/use-notifications"
import { useJobPosts } from "@/hooks/use-job-posts"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { Loader2 } from "lucide-react"

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    companies: [],
    positions: [],
    locations: [],
    skills: [],
  })
  const [sortOption, setSortOption] = useState<SortOption>("latest")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([])

  const { jobPosts, loading, error, searchJobPosts, filterJobPosts } = useJobPosts()

  const {
    rules,
    notifications,
    updateRules,
    checkForNewJobs,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    requestNotificationPermission,
  } = useNotifications()

  useEffect(() => {
    requestNotificationPermission()
  }, [requestNotificationPermission])

  // 필터 옵션 생성 (실제 데이터에서)
  const availableOptions = useMemo(() => {
    const companies = [...new Set(jobPosts.map((job) => job.company))]
    const positions = [...new Set(jobPosts.map((job) => job.position))]
    const locations = [...new Set(jobPosts.map((job) => job.location))]
    const skills = [...new Set(jobPosts.flatMap((job) => job.tags))]

    return { companies, positions, locations, skills }
  }, [jobPosts])

  // 필터링 및 정렬된 공고 목록
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobPosts

    // 클라이언트 사이드 필터링 (API 필터링과 추가로)
    if (filters.companies.length > 0) {
      filtered = filtered.filter((job) => filters.companies.includes(job.company))
    }
    if (filters.positions.length > 0) {
      filtered = filtered.filter((job) => filters.positions.includes(job.position))
    }
    if (filters.locations.length > 0) {
      filtered = filtered.filter((job) => filters.locations.includes(job.location))
    }
    if (filters.skills.length > 0) {
      filtered = filtered.filter((job) => job.tags.some((tag) => filters.skills.includes(tag)))
    }

    // 정렬 적용
    const sorted = [...filtered].sort((a, b) => {
      const aBookmarked = bookmarkedJobs.includes(a.id.toString())
      const bBookmarked = bookmarkedJobs.includes(b.id.toString())

      switch (sortOption) {
        case "latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "bookmark-latest":
          if (aBookmarked && !bBookmarked) return -1
          if (!aBookmarked && bBookmarked) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "bookmark-deadline":
          if (aBookmarked && !bBookmarked) return -1
          if (!aBookmarked && bBookmarked) return 1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [jobPosts, filters, sortOption, bookmarkedJobs])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    await searchJobPosts(query)
  }

  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters)
    await filterJobPosts({
      companies: newFilters.companies,
      positions: newFilters.positions,
      locations: newFilters.locations,
    })
  }

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleApply = (jobId: string) => {
    console.log("지원:", jobId)
    // TODO: 실제 지원 API 호출
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>공고를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">최고의 취업 기회를 찾아보세요</h1>
        <div className="w-full flex justify-center gap-2">
          <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} availableOptions={availableOptions} />
          <NotificationSettings rules={rules} onRulesChange={updateRules} availableOptions={availableOptions} />
        </div>
      </div>

      <div className="text-center mb-4">
        <Button
          variant="outline"
          onClick={() => {
            // 새 공고 시뮬레이션
            const newJob = {
              id: Date.now().toString(),
              title: "신규 React 개발자 모집",
              company: "신규회사",
              location: "서울 강남구",
              deadline: "2024-02-15",
              summary: "React 전문 개발자를 찾습니다.",
              tags: ["React", "TypeScript"],
              createdAt: new Date().toISOString(),
              position: "프론트엔드 개발자",
            }
            checkForNewJobs([newJob])
          }}
        >
          새 공고 시뮬레이션
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">전체 공고 ({filteredAndSortedJobs.length}개)</h2>
            {searchQuery && <p className="text-sm text-gray-600 mt-1">'{searchQuery}' 검색 결과</p>}
          </div>
          <JobSort value={sortOption} onValueChange={setSortOption} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isBookmarked={bookmarkedJobs.includes(job.id.toString())}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">조건에 맞는 공고가 없습니다.</p>
        </div>
      )}

      <NotificationToast
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDismiss={dismissNotification}
      />
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  )
}
