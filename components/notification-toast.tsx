"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  jobTitle: string
  company: string
  ruleId: string
  ruleName: string
  createdAt: string
  isRead: boolean
}

interface NotificationToastProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
}

export function NotificationToast({ notifications, onMarkAsRead, onMarkAllAsRead, onDismiss }: NotificationToastProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    if (unreadCount > 0) {
      setIsOpen(true)
    }
  }, [unreadCount])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {isOpen && (
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />새 공고 알림
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{notification.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">알림 규칙: {notification.ruleName}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs"
                        >
                          읽음
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDismiss(notification.id)}
                        className="w-6 h-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">+{notifications.length - 5}개 더 있습니다</p>
            )}

            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={onMarkAllAsRead} className="flex-1">
                모두 읽음
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="w-3 h-3 mr-1" />
                전체 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
