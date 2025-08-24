"use client"

import { useState, useEffect, useCallback } from "react"
import type { NotificationRule, Notification } from "@/components/notification-settings"

// 샘플 공고 데이터 타입
interface Job {
  id: string
  title: string
  company: string
  location: string
  deadline: string
  summary: string
  tags: string[]
  createdAt: string
  position: string
}

export function useNotifications() {
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // 로컬 스토리지에서 규칙 로드
  useEffect(() => {
    const savedRules = localStorage.getItem("notification-rules")
    if (savedRules) {
      setRules(JSON.parse(savedRules))
    }
  }, [])

  // 규칙 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("notification-rules", JSON.stringify(rules))
  }, [rules])

  // 새 공고가 알림 규칙과 매치되는지 확인
  const checkJobAgainstRules = useCallback((job: Job, activeRules: NotificationRule[]) => {
    const matchingRules: NotificationRule[] = []

    activeRules.forEach((rule) => {
      let matches = true

      // 키워드 매칭
      if (rule.keywords.length > 0) {
        const hasKeywordMatch = rule.keywords.some(
          (keyword) =>
            job.title.toLowerCase().includes(keyword.toLowerCase()) ||
            job.summary.toLowerCase().includes(keyword.toLowerCase()) ||
            job.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase())),
        )
        if (!hasKeywordMatch) matches = false
      }

      // 회사명 매칭
      if (rule.companies.length > 0 && !rule.companies.includes(job.company)) {
        matches = false
      }

      // 직무 매칭
      if (rule.positions.length > 0 && !rule.positions.includes(job.position)) {
        matches = false
      }

      // 지역 매칭
      if (rule.locations.length > 0 && !rule.locations.includes(job.location)) {
        matches = false
      }

      // 기술 스택 매칭
      if (rule.skills.length > 0) {
        const hasSkillMatch = rule.skills.some((skill) => job.tags.includes(skill))
        if (!hasSkillMatch) matches = false
      }

      if (matches) {
        matchingRules.push(rule)
      }
    })

    return matchingRules
  }, [])

  // 새 공고 확인 및 알림 생성
  const checkForNewJobs = useCallback(
    (newJobs: Job[]) => {
      const activeRules = rules.filter((rule) => rule.isActive)
      if (activeRules.length === 0) return

      const newNotifications: Notification[] = []

      newJobs.forEach((job) => {
        const matchingRules = checkJobAgainstRules(job, activeRules)

        matchingRules.forEach((rule) => {
          const notification: Notification = {
            id: `${job.id}-${rule.id}-${Date.now()}`,
            title: "새 공고 알림",
            message: `'${rule.name}' 조건에 맞는 새 공고가 등록되었습니다.`,
            jobTitle: job.title,
            company: job.company,
            ruleId: rule.id,
            ruleName: rule.name,
            createdAt: new Date().toISOString(),
            isRead: false,
          }
          newNotifications.push(notification)
        })
      })

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...newNotifications, ...prev])

        // 브라우저 알림 (권한이 있는 경우)
        if (Notification.permission === "granted") {
          newNotifications.forEach((notification) => {
            new Notification(notification.title, {
              body: `${notification.jobTitle} - ${notification.company}`,
              icon: "/favicon.ico",
            })
          })
        }
      }
    },
    [rules, checkJobAgainstRules],
  )

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }, [])

  // 알림 읽음 처리
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }, [])

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }, [])

  // 알림 삭제
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }, [])

  // 규칙 업데이트
  const updateRules = useCallback((newRules: NotificationRule[]) => {
    setRules(newRules)
  }, [])

  return {
    rules,
    notifications,
    updateRules,
    checkForNewJobs,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    requestNotificationPermission,
  }
}
