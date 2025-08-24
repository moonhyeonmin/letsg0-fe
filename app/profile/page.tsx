"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Edit, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "김개발",
    email: "kim.developer@email.com",
    phone: "010-1234-5678",
    location: "서울시 강남구",
    experience: "3년",
    position: "프론트엔드 개발자",
    bio: "React와 Next.js를 주로 사용하는 프론트엔드 개발자입니다. 사용자 경험을 중시하며, 깔끔하고 효율적인 코드 작성을 지향합니다.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "Git"],
    education: "컴퓨터공학과 학사",
    company: "현재 스타트업 재직 중",
  })

  const handleSave = () => {
    setIsEditing(false)
    // 여기서 실제로는 서버에 데이터를 저장
    console.log("프로필 저장:", profile)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // 원래 데이터로 복원하는 로직
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
        <p className="text-gray-600">프로필 정보를 관리하고 업데이트하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 프로필 카드 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder-user.jpg" alt={profile.name} />
                <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground">{profile.position}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>경력 {profile.experience}</span>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">보유 스킬</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상세 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>기본 정보</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "취소" : "편집"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">직무</Label>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">전화번호</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">자기소개</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>저장</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      취소
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-medium mb-2">자기소개</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">학력</h4>
                      <p className="text-sm text-muted-foreground">{profile.education}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">현재 상태</h4>
                      <p className="text-sm text-muted-foreground">{profile.company}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 활동 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">총 지원</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-sm text-muted-foreground">서류 통과</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-muted-foreground">면접 진행</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-muted-foreground">즐겨찾기</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
