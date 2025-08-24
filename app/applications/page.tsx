"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard } from "@/components/job-card"
import { JobSort, type SortOption } from "@/components/job-sort"
import { SearchBar } from "@/components/search-bar"
import type { FilterOptions } from "@/components/job-filter"
import { AuthGuard } from "@/components/auth-guard"
import { useJobPosts } from "@/hooks/use-job-posts"
import { useApplications } from "@/hooks/use-applications"
import type { ApplicationStatus } from "@/types/application"
import { Loader2 } from "lucide-react"

function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("applied")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    companies: [],
    positions: [],
    locations: [],
    skills: [],
  })
  const [sortOption, setSortOption] = useState<SortOption>("latest")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([])

  const { applications, loading, error, fetchApplicationsByStatus } = useApplications()
  const { jobPosts } = useJobPosts()

  // 지원한 공고들을 JobPostExtended 형태로 변환
  const appliedJobsList = useMemo(() => {
    return applications.map((app) => {
      // jobPosts에서 해당 공고 찾기 또는 application의 jobPost 정보 사용
      const jobPost = jobPosts.find((job) => job.id === app.jobPost.id) || {
        id: app.jobPost.id,
        title: app.jobPost.title,
        company: app.jobPost.company,
        location: app.jobPost.location,
        position: app.jobPost.position,
        content: app.memo || "지원한 공고입니다.",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        summary: app.memo || "지원한 공고입니다.",
        tags: [app.jobPost.position, app.jobPost.location.split(" ")[0], "지원완료"],
        createdAt: app.application_date,
      }
      return jobPost
    })
  }, [applications, jobPosts])

  // 즐겨찾기한 공고들 (기존 로직 유지 - 실제로는 별도 API가 필요)
  const bookmarkedJobsList = useMemo(() => {
    return jobPosts.filter((job) => bookmarkedJobs.includes(job.id.toString()))
  }, [jobPosts, bookmarkedJobs])

  // 현재 탭에 따른 공고 목록
  const currentJobs = activeTab === "applied" ? appliedJobsList : bookmarkedJobsList

  // 필터 옵션 생성
  const availableOptions = useMemo(() => {
    const companies = [...new Set(jobPosts.map((job) => job.company))]
    const positions = [...new Set(jobPosts.map((job) => job.position))]
    const locations = [...new Set(jobPosts.map((job) => job.location))]
    const skills = [...new Set(jobPosts.flatMap((job) => job.tags))]

    return { companies, positions, locations, skills }
  }, [jobPosts])

  // 필터링 및 정렬된 공고 목록
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = currentJobs

    // 검색 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // 필터 적용
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
  }, [currentJobs, searchQuery, filters, sortOption, bookmarkedJobs])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleApply = (jobId: string) => {
    console.log("지원:", jobId)
  }

  const handleStatusFilter = async (status?: ApplicationStatus) => {
    if (status) {
      await fetchApplicationsByStatus(status)
    }
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
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">내 지원 현황</h1>
        <div className="w-full flex justify-center">
          <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} availableOptions={availableOptions} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="applied" className="text-base">
            지원한 공고 ({appliedJobsList.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="text-base">
            즐겨찾기 ({bookmarkedJobsList.length})
          </TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === "applied" ? "지원한 공고" : "즐겨찾기한 공고"} ({filteredAndSortedJobs.length}개)
              </h2>
              {searchQuery && <p className="text-sm text-gray-600 mt-1">'{searchQuery}' 검색 결과</p>}
            </div>
            <JobSort value={sortOption} onValueChange={setSortOption} />
          </div>
        </div>

        <TabsContent value="applied" className="mt-0">
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
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedJobs.map((job) => (
              <JobCard key={job.id} job={job} isBookmarked={true} onBookmark={handleBookmark} />
            ))}
          </div>
        </TabsContent>

        {filteredAndSortedJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {activeTab === "applied" ? "지원한 공고가 없습니다." : "즐겨찾기한 공고가 없습니다."}
            </p>
          </div>
        )}
      </Tabs>
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <ApplicationsPage />
    </AuthGuard>
  )
}
