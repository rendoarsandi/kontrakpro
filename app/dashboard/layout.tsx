import type React from "react"
import { FileSignature } from "lucide-react" // Added FileSignature import

import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { UserNav } from "@/components/user-nav"

export const runtime = 'edge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="md:hidden sticky top-0 z-30 w-full border-b bg-background">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            <FileSignature className="h-6 w-6 text-primary" />
            <span className="text-lg animate-pulse">KontrakPro</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <NotificationDropdown />
            <UserNav />
          </div>
        </div>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 hidden md:flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex flex-1 items-center justify-end space-x-4">
            <NotificationDropdown />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
