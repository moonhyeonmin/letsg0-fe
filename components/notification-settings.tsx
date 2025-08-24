"\"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, X, Trash2 } from "lucide-react"
import { useState } from "react"

export interface NotificationRule {
  id: string
  name: string
  keywords: string[]
  companies: string[]
  positions: string[]
  locations: string[]
  skills: string[]
  isActive: boolean
  frequency: "instant" | "daily" | "weekly"
  createdAt: string
}

interface NotificationSettingsProps {
  rules: NotificationRule[]
  onRulesChange: (rules: NotificationRule[]) => void
  availableOptions: {
    companies: string[]
    positions: string[]
    locations: string[]
    skills: string[]
  }
}

export function NotificationSettings({ rules, onRulesChange, availableOptions }: NotificationSettingsProps) {
  const [open, setOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    name: "",
    keywords: [],
    companies: [],
    positions: [],
    locations: [],
    skills: [],
    frequency: "instant",
    isActive: true,
  })

  const handleCreateRule = () => {
    if (!newRule.name?.trim()) return

    const rule: NotificationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      keywords: newRule.keywords || [],
      companies: newRule.companies || [],
      positions: newRule.positions || [],
      locations: newRule.locations || [],
      skills: newRule.skills || [],
      isActive: newRule.isActive || true,
      frequency: newRule.frequency || "instant",
      createdAt: new Date().toISOString(),
    }

    onRulesChange([...rules, rule])
    setNewRule({
      name: "",
      keywords: [],
      companies: [],
      positions: [],
      locations: [],
      skills: [],
      frequency: "instant",
      isActive: true,
    })
    setOpen(false)
  }

  const handleDeleteRule = (ruleId: string) => {
    onRulesChange(rules.filter((rule) => rule.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    onRulesChange(rules.map((rule) => (rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule)))
  }

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !newRule.keywords?.includes(keyword.trim())) {
      setNewRule({
        ...newRule,
        keywords: [...(newRule.keywords || []), keyword.trim()],
      })
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setNewRule({
      ...newRule,
      keywords: newRule.keywords?.filter((k) => k !== keyword) || [],
    })
  }

  const handleFilterChange = (category: keyof NotificationRule, value: string, checked: boolean) => {
    const currentValues = (newRule[category] as string[]) || []
    const newValues = checked ? [...currentValues, value] : currentValues.filter((item) => item !== value)

    setNewRule({
      ...newRule,
      [category]: newValues,
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림 설정
            {rules.filter((r) => r.isActive).length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {rules.filter((r) => r.isActive).length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>알림 설정</DialogTitle>
            <DialogDescription>관심 있는 조건의 새 공고가 올라올 때 알림을 받아보세요</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 기존 알림 규칙 목록 */}
            {rules.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">설정된 알림 규칙</h3>
                <div className="space-y-3">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "활성" : "비활성"}
                          </Badge>
                          <Badge variant="outline">
                            {rule.frequency === "instant" ? "즉시" : rule.frequency === "daily" ? "일일" : "주간"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rule.keywords.length > 0 && <span>키워드: {rule.keywords.join(", ")} </span>}
                          {rule.companies.length > 0 && <span>회사: {rule.companies.join(", ")} </span>}
                          {rule.positions.length > 0 && <span>직무: {rule.positions.join(", ")} </span>}
                          {rule.locations.length > 0 && <span>지역: {rule.locations.join(", ")} </span>}
                          {rule.skills.length > 0 && <span>기술: {rule.skills.join(", ")}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.isActive} onCheckedChange={() => handleToggleRule(rule.id)} />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 알림 규칙 생성 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-3">새 알림 규칙 추가</h3>

              <div className="space-y-4">
                {/* 규칙 이름 */}
                <div>
                  <Label htmlFor="rule-name">규칙 이름</Label>
                  <Input
                    id="rule-name"
                    placeholder="예: React 프론트엔드 공고"
                    value={newRule.name || ""}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                {/* 키워드 */}
                <div>
                  <Label>키워드</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="키워드 입력 후 Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleKeywordAdd(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {newRule.keywords?.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleKeywordRemove(keyword)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 필터 조건들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 회사명 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">회사명</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                      {availableOptions.companies.map((company) => (
                        <div key={company} className="flex items-center space-x-2">
                          <Checkbox
                            id={`new-company-${company}`}
                            checked={newRule.companies?.includes(company) || false}
                            onCheckedChange={(checked) => handleFilterChange("companies", company, checked as boolean)}
                          />
                          <Label htmlFor={`new-company-${company}`} className="text-sm">
                            {company}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 직무 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">직무</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                      {availableOptions.positions.map((position) => (
                        <div key={position} className="flex items-center space-x-2">
                          <Checkbox
                            id={`new-position-${position}`}
                            checked={newRule.positions?.includes(position) || false}
                            onCheckedChange={(checked) => handleFilterChange("positions", position, checked as boolean)}
                          />
                          <Label htmlFor={`new-position-${position}`} className="text-sm">
                            {position}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 지역 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">지역</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                      {availableOptions.locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`new-location-${location}`}
                            checked={newRule.locations?.includes(location) || false}
                            onCheckedChange={(checked) => handleFilterChange("locations", location, checked as boolean)}
                          />
                          <Label htmlFor={`new-location-${location}`} className="text-sm">
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">기술 스택</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                      {availableOptions.skills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`new-skill-${skill}`}
                            checked={newRule.skills?.includes(skill) || false}
                            onCheckedChange={(checked) => handleFilterChange("skills", skill, checked as boolean)}
                          />
                          <Label htmlFor={`new-skill-${skill}`} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 알림 빈도 */}
                <div>
                  <Label>알림 빈도</Label>
                  <Select
                    value={newRule.frequency || "instant"}
                    onValueChange={(value: "instant" | "daily" | "weekly") =>
                      setNewRule({ ...newRule, frequency: value })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">즉시 알림</SelectItem>
                      <SelectItem value="daily">일일 요약</SelectItem>
                      <SelectItem value="weekly">주간 요약</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateRule} disabled={!newRule.name?.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              규칙 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
