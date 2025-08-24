"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Clock, Award } from "lucide-react"

export default function AnalyticsPage() {
  const stats = {
    totalApplications: 12,
    responseRate: 25,
    interviewRate: 16.7,
    averageResponseTime: 7,
  }

  const applicationsByMonth = [
    { month: "11월", count: 4 },
    { month: "12월", count: 5 },
    { month: "1월", count: 3 },
  ]

  const topSkills = [
    { skill: "React", count: 8, percentage: 67 },
    { skill: "Node.js", count: 6, percentage: 50 },
    { skill: "TypeScript", count: 5, percentage: 42 },
    { skill: "Python", count: 4, percentage: 33 },
    { skill: "AWS", count: 3, percentage: 25 },
  ]

  const applicationStatus = [
    { status: "지원완료", count: 7, color: "bg-blue-500" },
    { status: "서류통과", count: 3, color: "bg-green-500" },
    { status: "면접진행", count: 2, color: "bg-yellow-500" },
    { status: "최종합격", count: 0, color: "bg-purple-500" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">지원 분석</h1>
        <p className="text-gray-600">나의 취업 활동을 분석하고 개선점을 찾아보세요</p>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 지원 수</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}개</div>
            <p className="text-xs text-muted-foreground">이번 달 +3개</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">응답률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">업계 평균 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">면접 진행률</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviewRate}%</div>
            <p className="text-xs text-muted-foreground">2개 회사 면접 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 응답 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime}일</div>
            <p className="text-xs text-muted-foreground">최근 3개월 기준</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 월별 지원 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>월별 지원 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationsByMonth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(item.count / 5) * 100}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.count}개</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 지원 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>지원 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <Badge variant="secondary">{item.count}개</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주요 스킬 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 스킬 분석</CardTitle>
          <p className="text-sm text-muted-foreground">지원한 공고에서 요구하는 스킬 분석</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSkills.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.skill}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.count}개 공고 ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
