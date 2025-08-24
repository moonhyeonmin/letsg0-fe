"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, X } from "lucide-react"
import { useState } from "react"

export interface FilterOptions {
  companies: string[]
  positions: string[]
  locations: string[]
  skills: string[]
}

interface JobFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  availableOptions: {
    companies: string[]
    positions: string[]
    locations: string[]
    skills: string[]
  }
}

export function JobFilter({ onFilterChange, availableOptions }: JobFilterProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    companies: [],
    positions: [],
    locations: [],
    skills: [],
  })

  const handleFilterChange = (category: keyof FilterOptions, value: string, checked: boolean) => {
    const newFilters = { ...filters }
    if (checked) {
      newFilters[category] = [...newFilters[category], value]
    } else {
      newFilters[category] = newFilters[category].filter((item) => item !== value)
    }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setOpen(false)
  }

  const clearFilters = () => {
    const emptyFilters = {
      companies: [],
      positions: [],
      locations: [],
      skills: [],
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="w-4 h-4" />
          {hasActiveFilters && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>필터 설정</DialogTitle>
          <DialogDescription>원하는 조건으로 공고를 필터링하세요</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 회사명 필터 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">회사명</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableOptions.companies.map((company) => (
                <div key={company} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-${company}`}
                    checked={filters.companies.includes(company)}
                    onCheckedChange={(checked) => handleFilterChange("companies", company, checked as boolean)}
                  />
                  <Label htmlFor={`company-${company}`} className="text-sm">
                    {company}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 직무 필터 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">직무</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableOptions.positions.map((position) => (
                <div key={position} className="flex items-center space-x-2">
                  <Checkbox
                    id={`position-${position}`}
                    checked={filters.positions.includes(position)}
                    onCheckedChange={(checked) => handleFilterChange("positions", position, checked as boolean)}
                  />
                  <Label htmlFor={`position-${position}`} className="text-sm">
                    {position}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">지역</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableOptions.locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={(checked) => handleFilterChange("locations", location, checked as boolean)}
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 기술 스택 필터 */}
          <div>
            <Label className="text-sm font-medium mb-3 block">기술 스택</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableOptions.skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={filters.skills.includes(skill)}
                    onCheckedChange={(checked) => handleFilterChange("skills", skill, checked as boolean)}
                  />
                  <Label htmlFor={`skill-${skill}`} className="text-sm">
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button onClick={applyFilters}>필터 적용</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
