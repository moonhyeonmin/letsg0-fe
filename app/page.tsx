"use client"

import { SearchBar } from "@/components/search-bar"
import { JobCard } from "@/components/job-card"
import { JobSort, type SortOption } from "@/components/job-sort"
import type { FilterOptions } from "@/components/job-filter"
import { useState, useMemo, useEffect } from "react"
import { NotificationSettings } from "@/components/notification-settings"
import { NotificationToast } from "@/components/notification-toast"
import { useNotifications } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"

// 샘플 데이터 (날짜 정보 추가)
const sampleJobs = [
  {
    id: "1",
    title: "프론트엔드 개발자 (React/Next.js)",
    company: "테크스타트업",
    location: "서울 강남구",
    deadline: "2024-01-15",
    summary: "React, Next.js를 활용한 웹 서비스 개발 및 유지보수를 담당하실 프론트엔드 개발자를 모집합니다.",
    tags: ["React", "Next.js", "TypeScript", "신입가능"],
    createdAt: "2024-01-10",
    position: "프론트엔드 개발자",
  },
  {
    id: "2",
    title: "백엔드 개발자 (Node.js/Python)",
    company: "글로벌IT",
    location: "서울 서초구",
    deadline: "2024-01-20",
    summary: "대규모 트래픽을 처리하는 백엔드 시스템 설계 및 개발 업무를 담당하실 개발자를 찾습니다.",
    tags: ["Node.js", "Python", "AWS", "경력3년+"],
    createdAt: "2024-01-08",
    position: "백엔드 개발자",
  },
  {
    id: "3",
    title: "풀스택 개발자",
    company: "이커머스컴퍼니",
    location: "서울 마포구",
    deadline: "2024-01-25",
    summary: "프론트엔드부터 백엔드까지 전체 개발 스택을 다룰 수 있는 풀스택 개발자를 모집합니다.",
    tags: ["React", "Node.js", "MongoDB", "경력무관"],
    createdAt: "2024-01-12",
    position: "풀스택 개발자",
  },
  {
    id: "4",
    title: "데이터 사이언티스트",
    company: "AI솔루션",
    location: "서울 송파구",
    deadline: "2024-01-30",
    summary: "머신러닝 모델 개발 및 데이터 분석을 통한 비즈니스 인사이트 도출 업무를 담당합니다.",
    tags: ["Python", "ML", "TensorFlow", "경력2년+"],
    createdAt: "2024-01-09",
    position: "데이터 사이언티스트",
  },
  {
    id: "5",
    title: "모바일 앱 개발자 (Flutter)",
    company: "모바일스튜디오",
    location: "서울 용산구",
    deadline: "2024-02-05",
    summary: "Flutter를 활용한 크로스플랫폼 모바일 앱 개발 및 유지보수 업무를 담당합니다.",
    tags: ["Flutter", "Dart", "Firebase", "신입가능"],
    createdAt: "2024-01-11",
    position: "모바일 개발자",
  },
  {
    id: "6",
    title: "DevOps 엔지니어",
    company: "클라우드테크",
    location: "서울 영등포구",
    deadline: "2024-02-10",
    summary: "클라우드 인프라 구축 및 CI/CD 파이프라인 관리를 담당하실 DevOps 엔지니어를 모집합니다.",
    tags: ["AWS", "Docker", "Kubernetes", "경력3년+"],
    createdAt: "2024-01-07",
    position: "DevOps 엔지니어",
  },
]

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

  // 필터 옵션 생성
  const availableOptions = useMemo(() => {
    const companies = [...new Set(sampleJobs.map((job) => job.company))]
    const positions = [...new Set(sampleJobs.map((job) => job.position))]
    const locations = [...new Set(sampleJobs.map((job) => job.location))]
    const skills = [...new Set(sampleJobs.flatMap((job) => job.tags))]

    return { companies, positions, locations, skills }
  }, [])

  // 필터링 및 정렬된 공고 목록
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = sampleJobs

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
      const aBookmarked = bookmarkedJobs.includes(a.id)
      const bBookmarked = bookmarkedJobs.includes(b.id)

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
  }, [searchQuery, filters, sortOption, bookmarkedJobs])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const handleBookmark = (jobId: string) => {
    setBookmarkedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleApply = (jobId: string) => {
    console.log("지원:", jobId)
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
            {...job}
            isBookmarked={bookmarkedJobs.includes(job.id)}
            onBookmark={handleBookmark}
            onApply={handleApply}
          />
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && (
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
