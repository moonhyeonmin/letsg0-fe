"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Clock, Building2 } from "lucide-react"
import { useState } from "react"

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  deadline: string
  summary: string
  tags: string[]
  isBookmarked?: boolean
  isApplied?: boolean
  onBookmark?: (id: string) => void
  onApply?: (id: string) => void
}

export function JobCard({
  id,
  title,
  company,
  location,
  deadline,
  summary,
  tags,
  isBookmarked = false,
  isApplied = false,
  onBookmark,
  onApply,
}: JobCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [applied, setApplied] = useState(isApplied)

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    onBookmark?.(id)
  }

  const handleApply = () => {
    setApplied(true)
    onApply?.(id)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-80 flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1" title={title}>
              {title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 min-w-0">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{company}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleBookmark} className="shrink-0 ml-2">
            <Heart className={`w-4 h-4 ${bookmarked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-1" title={summary}>
          {summary}
        </p>
        <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 4}
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">마감: {deadline}</span>
          </div>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={applied}
            variant={applied ? "secondary" : "default"}
            className="flex-shrink-0"
          >
            {applied ? "지원완료" : "지원하기"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
