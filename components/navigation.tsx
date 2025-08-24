"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, BarChart3, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "전체 공고", href: "/", icon: Home },
  { name: "내 지원", href: "/applications", icon: FileText },
  { name: "지원 분석", href: "/analytics", icon: BarChart3 },
  { name: "마이페이지", href: "/profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  // 로그인/회원가입 페이지에서는 네비게이션 숨김
  if (pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              JobPortal
            </Link>
          </div>

          {isAuthenticated ? (
            <>
              <div className="flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors",
                        pathname === item.href
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.nickname?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user?.nickname}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/signup">
                <Button>회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
