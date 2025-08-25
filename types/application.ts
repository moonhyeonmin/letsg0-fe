export interface ApplicationQuestion {
  question: string
  answer: string
}

export interface ApplicationRequest {
  jobPostId: number
  status: ApplicationStatus
  memo: string
  questions: ApplicationQuestion[]
  isResultSuccess: boolean
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
    jobPostId: number
    title: string
    company: string
    location: string
    position: string
    salary: string
    description: string
    requirements: string
    benefits: string
    deadline: string
    createdAt: string
    updatedAt: string
  }
  status: ApplicationStatus
  memo: string
  isResultSuccess: boolean
  application_date: string
  questions: ApplicationQuestion[]
}

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

export const ApplicationStatusLabels = {
  [ApplicationStatus.APPLIED]: "서류 지원",
  [ApplicationStatus.INTERVIEW]: "면접 진행",
  [ApplicationStatus.SUCCESS]: "최종 합격",
  [ApplicationStatus.FAIL]: "불합격",
}
