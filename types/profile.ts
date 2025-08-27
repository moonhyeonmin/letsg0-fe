export interface UserProfile {
  user_id: number
  email: string
  nickname: string
  name?: string
  phone?: string
  location?: string
  experience?: string
  position?: string
  bio?: string
  skills: string[]
  education?: string
  company?: string
  createdAt: string
  updatedAt: string
}

export interface ProfileUpdateRequest {
  nickname?: string
  name?: string
  phone?: string
  location?: string
  experience?: string
  position?: string
  bio?: string
  skills?: string[]
  education?: string
  company?: string
}

export interface ProfileStats {
  totalApplications: number
  documentsPassedCount: number
  interviewsInProgressCount: number
  bookmarksCount: number
}
