export interface JobPost {
  id: number
  title: string
  company: string
  location: string
  position: string
  content: string
}

export interface JobPostCreateRequest {
  companyId: number
  title: string
  content: string
  location: string
  position: string
  salary: string
  deadline: string // "yyyy-MM-dd HH:mm:ss" format
  requirements: string
  source_url: string
}

export interface JobPostFilters {
  company?: string
  title?: string
  location?: string
  position?: string
}

// 프론트엔드에서 사용할 확장된 JobPost 인터페이스
export interface JobPostExtended extends JobPost {
  deadline: string
  summary: string
  tags: string[]
  createdAt: string
  salary?: string
  requirements?: string
  source_url?: string
}
