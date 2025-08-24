"use client"

import { JobCard } from "@/components/job-card"
import { SearchBar } from "@/components/search-bar"
import { JobSort, type SortOption } from "@/components/job-sort"
import type { FilterOptions } from "@/components/job-filter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import { NotificationSettings } from "@/components/notification-settings"
import { useNotifications } from "@/hooks/use-notifications"

// 샘플 데이터 (날짜 정보 추가)
const appliedJobs = [
  {
    id: "1",
    title: "프론트엔드 개발자 (React/Next.js)",
    company: "테크스타트업",
    location: "서울 강남구",
    deadline: "2024-01-15",
    summary: "React, Next.js를 활용한 웹 서비스 개발 및 유지보수를 담당하실 프론트엔드 개발자를 모집합니다.",
    tags: ["React", "Next.js", "TypeScript", "신입가능"],
    isApplied: true,
    appliedDate: "2024-01-05",
    createdAt: "2024-01-10",
    position: "프론트엔드 개발자",
  },
  {
    id: "3",
    title: "풀스택 개발자",
    company: "이커머스컴퍼니",
    location: "서울 마포구",
    deadline: "2024-01-25",
    summary: "프론트엔드부터 백엔드까지 전체 개발 스택을 다룰 수 있는 풀스택 개발자를 모집합니다.",
    tags: ["React", "Node.js", "MongoDB", "경력무관"],
    isApplied: true,
    appliedDate: "2024-01-08",
    createdAt: "2024-01-12",
    position: "풀스택 개발자",
  },
]

const bookmarkedJobs = [
  {
    id: "2",
    title: "백엔드 개발자 (Node.js/Python)",
    company: "글로벌IT",
    location: "서울 서초구",
    deadline: "2024-01-20",
    summary: "대규모 트래픽을 처리하는 백엔드 시스템 설계 및 개발 업무를 담당하실 개발자를 찾습니다.",
    tags: ["Node.js", "Python", "AWS", "경력3년+"],
    isBookmarked: true,
    createdAt: "2024-01-08",
    position: "백엔드 개발자",
  },
  {
    id: "4",
    title: "데이터 사이언티스트",
    company: "AI솔루션",
    location: "서울 송파구",
    deadline: "2024-01-30",
    summary: "머신러닝 모델 개발 및 데이터 분석을 통한 비즈니스 인사이트 도출 업무를 담당합니다.",
    tags: ["Python", "ML", "TensorFlow", "경력2년+"],
    isBookmarked: true,
    createdAt: "2024-01-09",
    position: "데이터 사이언티스트",
  },
]

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    companies: [],
    positions: [],
    locations: [],
    skills: [],
  })
  const [sortOption, setSortOption] = useState<SortOption>("latest")

  const { rules, updateRules } = useNotifications()

  // 필터 옵션 생성
  const availableOptions = useMemo(() => {
    const allJobs = [...appliedJobs, ...bookmarkedJobs]
    const companies = [...new Set(allJobs.map((job) => job.company))]
    const positions = [...new Set(allJobs.map((job) => job.position))]
    const locations = [...new Set(allJobs.map((job) => job.location))]
    const skills = [...new Set(allJobs.flatMap((job) => job.tags))]

    return { companies, positions, locations, skills }
  }, [])

  // 필터링 및 정렬 함수
  const filterAndSortJobs = (jobs: any[]) => {
    let filtered = jobs

    // 검색 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
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
      filtered = filtered.filter((job) => job.tags.some((tag: string) => filters.skills.includes(tag)))
    }

    // 정렬 적용
    const sorted = [...filtered].sort((a, b) => {
      const aBookmarked = a.isBookmarked || false
      const bBookmarked = b.isBookmarked || false

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
  }

  const filteredAppliedJobs = useMemo(() => filterAndSortJobs(appliedJobs), [searchQuery, filters, sortOption])
  const filteredBookmarkedJobs = useMemo(() => filterAndSortJobs(bookmarkedJobs), [searchQuery, filters, sortOption])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 지원 관리</h1>
        <p className="text-gray-600 mb-4">지원한 공고와 관심 있는 공고를 관리하세요</p>
        <div className="w-full flex gap-2">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            availableOptions={availableOptions}
            placeholder="내 지원 공고에서 검색..."
          />
          <NotificationSettings rules={rules} onRulesChange={updateRules} availableOptions={availableOptions} />
        </div>
      </div>

      <Tabs defaultValue="applied" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applied" className="flex items-center gap-2">
            지원한 공고
            <Badge variant="secondary">{filteredAppliedJobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center gap-2">
            즐겨찾기
            <Badge variant="secondary">{filteredBookmarkedJobs.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applied" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">지원한 공고 ({filteredAppliedJobs.length}개)</h2>
              {searchQuery && <p className="text-sm text-gray-600 mt-1">'{searchQuery}' 검색 결과</p>}
            </div>
            <JobSort value={sortOption} onValueChange={setSortOption} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliedJobs.map((job) => (
              <div key={job.id} className="relative">
                <JobCard {...job} />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-100 text-green-800">{job.appliedDate} 지원</Badge>
                </div>
              </div>
            ))}
          </div>
          {filteredAppliedJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">조건에 맞는 지원 공고가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarked" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">즐겨찾기 ({filteredBookmarkedJobs.length}개)</h2>
              {searchQuery && <p className="text-sm text-gray-600 mt-1">'{searchQuery}' 검색 결과</p>}
            </div>
            <JobSort value={sortOption} onValueChange={setSortOption} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarkedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
          {filteredBookmarkedJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">조건에 맞는 즐겨찾기 공고가 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
