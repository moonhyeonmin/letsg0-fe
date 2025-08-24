"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SortOption = "latest" | "deadline" | "bookmark-latest" | "bookmark-deadline"

interface JobSortProps {
  value: SortOption
  onValueChange: (value: SortOption) => void
}

export function JobSort({ value, onValueChange }: JobSortProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="정렬 기준 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">최신순</SelectItem>
        <SelectItem value="deadline">마감임박순</SelectItem>
        <SelectItem value="bookmark-latest">즐겨찾기 우선 - 최신순</SelectItem>
        <SelectItem value="bookmark-deadline">즐겨찾기 우선 - 마감임박순</SelectItem>
      </SelectContent>
    </Select>
  )
}
