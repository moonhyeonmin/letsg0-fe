


export interface OnboardingData {
  name: string
  phone: string
  location: string
  experience: string
  position: string
  bio: string
  skills: string[]
  education: string
  company: string
}

export interface OnboardingRequest extends OnboardingData {}

export interface OnboardingStatus {
  completed: boolean
}
