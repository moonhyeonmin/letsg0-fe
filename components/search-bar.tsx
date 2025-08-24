"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"
import { JobFilter, type FilterOptions } from "./job-filter"

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: FilterOptions) => void
  placeholder?: string
  availableOptions?: {
    companies: string[]
    positions: string[]
    locations: string[]
    skills: string[]
  }
}

export function SearchBar({
  onSearch,
  onFilterChange,
  placeholder = "직무, 회사명으로 검색하세요",
  availableOptions = { companies: [], positions: [], locations: [], skills: [] },
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    onSearch?.(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch}>검색</Button>
      {onFilterChange && <JobFilter onFilterChange={onFilterChange} availableOptions={availableOptions} />}
    </div>
  )
}
