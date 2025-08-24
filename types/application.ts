export enum ApplicationStatus {
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

export interface ApplicationQuestionDto {
  question: string
  answer: string
}

export interface ApplicationRequest {
  jobPostId: number
  status: ApplicationStatus
  memo: string
  questions: ApplicationQuestionDto[]
  isResulSuccess: boolean
}

export interface ApplicationResponse {
  id: number
  jobPostId: number
  status: ApplicationStatus
  memo: string
  isResultSuccess: boolean
}

export interface Application {
  application_id: number
  user: {
    user_id: number
    email: string
    nickname: string
  }
  jobPost: {
    id: number
    title: string
    company: string
    location: string
    position: string
  }
  status: ApplicationStatus
  memo: string
  isResulSuccess: boolean
  application_date: string
  questions: ApplicationQuestion[]
}

export interface ApplicationQuestion {
  id: number
  question: string
  answer: string
}
