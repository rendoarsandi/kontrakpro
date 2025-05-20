"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Notification, NotificationStatus } from "@/lib/types/notification"
import { getNotificationIcon } from "@/lib/utils/notification-utils"

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Fungsi untuk memuat notifikasi
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await api.getNotifications()
      if (data.error) {
        console.error("API Error:", data.error)
        setNotifications([])
        setUnreadCount(0)
        return
      }
      setNotifications(data.notifications || [])
      setUnreadCount(
        (data.notifications || []).filter((n: Notification) => n.status === NotificationStatus.UNREAD).length
      )
    } catch (error) {
      console.error("Error fetching notifications:", error)
      // Tambahkan notifikasi dummy jika fetch gagal
      setNotifications([
        {
          id: 'dummy-1',
          title: 'Welcome!',
          message: 'Anda login dengan mode demo. Notifikasi backend tidak tersedia.',
          status: NotificationStatus.UNREAD,
          created_at: Date.now(), // gunakan timestamp number
          type: 'info',
        }
      ])
      setUnreadCount(1)
    } finally {
      setLoading(false)
    }
  }

  // Memuat notifikasi saat komponen dimount
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Fungsi untuk menandai notifikasi sebagai dibaca
  const markAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id)
      // Update status notifikasi di state lokal
      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, status: NotificationStatus.READ, read_at: Date.now() } : n
        )
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Fungsi untuk menandai semua notifikasi sebagai dibaca
  const markAllAsRead = async () => {
    try {
      // Tandai semua notifikasi yang belum dibaca
      const unreadNotifications = notifications.filter((n) => n.status === NotificationStatus.UNREAD)
      await Promise.all(unreadNotifications.map((n) => api.markNotificationAsRead(n.id)))

      // Update status notifikasi di state lokal
      setNotifications(
        notifications.map((n) =>
          n.status === NotificationStatus.UNREAD ? { ...n, status: NotificationStatus.READ, read_at: Date.now() } : n
        )
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[90vw] sm:w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Tandai semua dibaca
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[50vh] sm:h-[300px]">
          <DropdownMenuGroup>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
                <div className="mt-2">Memuat notifikasi...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex justify-center">
                  <Bell className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="mt-2">Tidak ada notifikasi</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 ${
                    notification.status === NotificationStatus.UNREAD ? "bg-muted/50" : ""
                  }`}
                  onClick={() => {
                    if (notification.status === NotificationStatus.UNREAD) {
                      markAsRead(notification.id)
                    }
                    // Navigasi ke resource jika ada
                    if (notification.resource_type && notification.resource_id) {
                      // Implementasi navigasi
                    }
                    setOpen(false)
                  }}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <span className="font-medium">{notification.title}</span>
                    </div>
                    {notification.status === NotificationStatus.UNREAD && (
                      <Badge variant="outline" className="h-2 w-2 rounded-full bg-primary p-0" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                  <div className="mt-2 flex w-full justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center"
          onClick={() => {
            // Navigasi ke halaman notifikasi
            window.location.href = "/dashboard/notifications"
            setOpen(false)
          }}
        >
          Lihat semua notifikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
