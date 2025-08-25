"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  Edit,
  Save,
  X,
  Plus,
  Calendar,
  Target,
  Award,
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import type { ProfileUpdateRequest } from "@/types/profile"

const EXPERIENCE_OPTIONS = [
  { value: "신입", label: "신입 (0년)" },
  { value: "1-3년", label: "1-3년" },
  { value: "4-6년", label: "4-6년" },
  { value: "7-10년", label: "7-10년" },
  { value: "10년+", label: "10년 이상" },
]

const POSITION_OPTIONS = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "모바일 개발자",
  "데이터 사이언티스트",
  "DevOps 엔지니어",
  "UI/UX 디자이너",
  "프로덕트 매니저",
  "기타",
]

export default function ProfilePage() {
  const { profile, stats, isLoading, isUpdating, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [editData, setEditData] = useState<ProfileUpdateRequest>({})

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프로필을 불러올 수 없습니다</h2>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setEditData({
      nickname: profile.nickname,
      name: profile.name || "",
      phone: profile.phone || "",
      location: profile.location || "",
      experience: profile.experience || "",
      position: profile.position || "",
      bio: profile.bio || "",
      skills: profile.skills || [],
      education: profile.education || "",
      company: profile.company || "",
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({})
    setNewSkill("")
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      await updateProfile(editData)
      setIsEditing(false)
      setEditData({})
    } catch (error) {
      // 에러는 useProfile 훅에서 처리됨
    }
  }

  const handleInputChange = (field: keyof ProfileUpdateRequest, value: string | string[]) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && editData.skills && !editData.skills.includes(newSkill.trim())) {
      setEditData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill !== skillToRemove),
    }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-gray-600 mt-2">프로필 정보를 관리하고 활동 현황을 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>프로필 정보</CardTitle>
                  <CardDescription>개인 정보와 경력 사항을 관리하세요</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    편집
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={isUpdating}>
                      <Save className="w-4 h-4 mr-2" />
                      {isUpdating ? "저장 중..." : "저장"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 프로필 이미지 및 기본 정보 */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder-user.jpg" alt={profile.name || profile.nickname} />
                    <AvatarFallback className="text-lg">{getInitials(profile.name || profile.nickname)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="nickname">닉네임</Label>
                          <Input
                            id="nickname"
                            value={editData.nickname || ""}
                            onChange={(e) => handleInputChange("nickname", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">이름</Label>
                          <Input
                            id="name"
                            value={editData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold">{profile.name || profile.nickname}</h3>
                        <p className="text-gray-600">@{profile.nickname}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Mail className="w-4 h-4 mr-1" />
                          {profile.email}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* 연락처 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2" />
                      전화번호
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="전화번호를 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone || "등록된 전화번호가 없습니다"}</p>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      지역
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.location || ""}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="지역을 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.location || "등록된 지역이 없습니다"}</p>
                    )}
                  </div>
                </div>

                {/* 경력 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      경력
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData.experience || ""}
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="경력을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{profile.experience || "등록된 경력이 없습니다"}</p>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Target className="w-4 h-4 mr-2" />
                      포지션
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editData.position || ""}
                        onValueChange={(value) => handleInputChange("position", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="포지션을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITION_OPTIONS.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900">{profile.position || "등록된 포지션이 없습니다"}</p>
                    )}
                  </div>
                </div>

                {/* 회사 및 학력 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      현재 회사
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.company || ""}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="현재 회사를 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.company || "등록된 회사가 없습니다"}</p>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      학력
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.education || ""}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                        placeholder="학력을 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.education || "등록된 학력이 없습니다"}</p>
                    )}
                  </div>
                </div>

                {/* 자기소개 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">자기소개</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="자기소개를 입력하세요"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{profile.bio || "등록된 자기소개가 없습니다"}</p>
                  )}
                </div>

                {/* 스킬 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">보유 스킬</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="스킬을 입력하고 추가 버튼을 눌러주세요"
                          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                        />
                        <Button type="button" onClick={handleAddSkill} size="icon">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {editData.skills && editData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500"
                                onClick={() => handleRemoveSkill(skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">등록된 스킬이 없습니다</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 활동 통계 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  활동 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">총 지원 수</span>
                  <span className="text-2xl font-bold text-blue-600">{stats?.totalApplications || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">서류 통과</span>
                  <span className="text-2xl font-bold text-green-600">{stats?.documentsPassedCount || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">면접 진행</span>
                  <span className="text-2xl font-bold text-orange-600">{stats?.interviewsInProgressCount || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">북마크</span>
                  <span className="text-2xl font-bold text-purple-600">{stats?.bookmarksCount || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  계정 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">가입일: </span>
                  <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">최근 업데이트: </span>
                  <span className="font-medium">{new Date(profile.updatedAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
