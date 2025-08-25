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
}

export interface ApplicationResponse {
  id: number
  jobPostId: number
  status: ApplicationStatus
  memo: string
  applicationDate: string
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
    content: string
    deadline: string
  }
  status: ApplicationStatus
  memo: string
  applicationDate: string
  questions: ApplicationQuestion[]
}

export interface ApplicationQuestion {
  id: number
  question: string
  answer: string
  application_id: number
}
