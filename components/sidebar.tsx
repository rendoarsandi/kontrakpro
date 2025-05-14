"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  ClipboardSignature,
  FileText,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  Workflow,
  History,
  Brain,
  ExternalLink,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  href: string
  title: string
  icon: React.ReactNode
  external?: boolean
  disabled?: boolean
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: SidebarItem[]
}

export function Sidebar({ className, items = sidebarItems, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const [isHovering, setIsHovering] = useState(false)

  // Handle mouse enter/leave events
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div
      className="flex h-screen border-r bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn("flex flex-col transition-all duration-300 ease-in-out", isHovering ? "w-64" : "w-16")}>
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <FileText className="h-6 w-6" />
            {isHovering && <span className="transition-opacity duration-300">KontrakPro</span>}
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm">
            {items.map((item, index) => {
              const isActive = item.href === pathname || pathname.startsWith(item.href + "/")

              // Render disabled item with the same styling structure as Button
              if (item.disabled) {
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex h-9 items-center rounded-md px-3 text-sm font-medium ring-offset-background transition-colors",
                      "justify-start gap-2 transition-all duration-200 text-muted-foreground opacity-50 cursor-not-allowed",
                      !isHovering && "px-2 justify-center",
                    )}
                  >
                    {item.icon}
                    {isHovering && <span>{item.title}</span>}
                  </div>
                )
              }

              // Render normal item
              return (
                <Button
                  key={index}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start gap-2 transition-all duration-200",
                    isActive && "bg-muted font-medium",
                    !isHovering && "px-2",
                  )}
                >
                  <Link href={item.href} target={item.external ? "_blank" : undefined}>
                    {item.icon}
                    {isHovering && <span className="transition-opacity duration-300">{item.title}</span>}
                    {isHovering && item.external && <ExternalLink className="ml-auto h-3 w-3" />}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            asChild
            variant="outline"
            className={cn("transition-all duration-200", isHovering ? "w-full justify-start gap-2" : "w-8 h-8 p-0")}
          >
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              {isHovering && <span className="transition-opacity duration-300">Settings</span>}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const sidebarItems: SidebarItem[] = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/dashboard/contracts",
    title: "Contracts",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    href: "/dashboard/repository",
    title: "Repository",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    href: "/dashboard/calendar",
    title: "Calendar",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    href: "/dashboard/workflows",
    title: "Workflows",
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    href: "/dashboard/e-signature",
    title: "E-Signature",
    icon: <ClipboardSignature className="h-4 w-4" />,
  },
  {
    href: "/dashboard/ai-analysis",
    title: "AI Analysis",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    href: "/dashboard/analytics",
    title: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    href: "/dashboard/audit-trail",
    title: "Audit Trail",
    icon: <History className="h-4 w-4" />,
  },
  {
    href: "/dashboard/integrations",
    title: "Integrations",
    icon: <ExternalLink className="h-4 w-4" />,
  },
  {
    href: "/dashboard/users",
    title: "Users",
    icon: <Users className="h-4 w-4" />,
    disabled: true, // Disabled item
  },
]
