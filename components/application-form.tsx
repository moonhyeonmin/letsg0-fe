"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, FileText } from "lucide-react"
import type { JobPostExtended } from "@/types/job"
import type { ApplicationQuestion, ApplicationRequest } from "@/types/application"
import { ApplicationStatus } from "@/types/application"

interface ApplicationFormProps {
  job: JobPostExtended
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (application: ApplicationRequest) => void
  isLoading: boolean
}

export function ApplicationForm({ job, open, onOpenChange, onSubmit, isLoading }: ApplicationFormProps) {
  const [memo, setMemo] = useState("")
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([
    { question: "지원 동기를 작성해주세요.", answer: "" },
    { question: "본인의 강점과 경험을 소개해주세요.", answer: "" },
  ])

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }])
  }

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const handleQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const handleSubmit = () => {
    // 유효성 검증
    if (!memo.trim()) {
      alert("메모를 입력해주세요.")
      return
    }

    if (questions.some((q) => !q.question.trim() || !q.answer.trim())) {
      alert("모든 질문과 답변을 입력해주세요.")
      return
    }

    const applicationData: ApplicationRequest = {
      jobPostId: job.id,
      status: ApplicationStatus.APPLIED,
      memo: memo.trim(),
      questions: questions.filter((q) => q.question.trim() && q.answer.trim()),
    }

    onSubmit(applicationData)
  }

  const handleClose = () => {
    setMemo("")
    setQuestions([
      { question: "지원 동기를 작성해주세요.", answer: "" },
      { question: "본인의 강점과 경험을 소개해주세요.", answer: "" },
    ])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            지원하기 - {job.title}
          </DialogTitle>
          <DialogDescription>
            {job.company} · {job.location} · {job.position}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* 메모 섹션 */}
            <div>
              <Label htmlFor="memo" className="text-base font-medium">
                지원 메모 <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                이 공고에 대한 개인적인 메모나 준비 사항을 작성하세요.
              </p>
              <Textarea
                id="memo"
                placeholder="예: 이 회사에 관심을 갖게 된 이유, 준비한 내용, 면접 준비 사항 등"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* 자기소개서 질문 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-medium">
                  자기소개서 질문 <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  질문 추가
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">질문 {index + 1}</CardTitle>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveQuestion(index)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`question-${index}`} className="text-sm">
                          질문 내용
                        </Label>
                        <Input
                          id={`question-${index}`}
                          placeholder="질문을 입력하세요"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`answer-${index}`} className="text-sm">
                          답변
                        </Label>
                        <Textarea
                          id={`answer-${index}`}
                          placeholder="답변을 입력하세요"
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "지원 중..." : "지원하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
