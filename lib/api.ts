import type { LoginRequest, LoginResponse, SignupRequest, User } from "@/types/auth"
import type { JobPost, JobPostCreateRequest } from "@/types/job"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        let errorData = null

        try {
          errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
        }

        throw new ApiError(errorMessage, response.status, errorData)
      }

      // 204 No Content인 경우 빈 객체 반환
      if (response.status === 204 || response.status === 201) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Network error occurred", 0)
    }
  }

  // 인증 관련 API
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async signup(data: SignupRequest): Promise<void> {
    return this.request<void>("/api/users/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/api/users/me")
  }

  // JobPost 관련 API
  async getJobPosts(): Promise<JobPost[]> {
    return this.request<JobPost[]>("/api/jobs")
  }

  async getJobPostById(id: number): Promise<JobPost> {
    return this.request<JobPost>(`/api/jobs/${id}`)
  }

  async getJobPostsByCompany(company: string): Promise<JobPost[]> {
    return this.request<JobPost[]>(`/api/jobs/company/${encodeURIComponent(company)}`)
  }

  async getJobPostsByTitle(title: string): Promise<JobPost[]> {
    return this.request<JobPost[]>(`/api/jobs/title/${encodeURIComponent(title)}`)
  }

  async getJobPostsByLocation(location: string): Promise<JobPost[]> {
    return this.request<JobPost[]>(`/api/jobs/location/${encodeURIComponent(location)}`)
  }

  async getJobPostsByPosition(position: string): Promise<JobPost[]> {
    return this.request<JobPost[]>(`/api/jobs/position/${encodeURIComponent(position)}`)
  }

  async createJobPost(data: JobPostCreateRequest): Promise<JobPost> {
    return this.request<JobPost>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export { ApiError }
