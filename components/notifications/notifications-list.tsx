"use client"

import { useState, useEffect } from "react"
import { Check, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"
import { formatDistanceToNow, format } from "date-fns"
import { id } from "date-fns/locale"
import { Notification, NotificationStatus } from "@/lib/types/notification"
import { getNotificationIconWithSize } from "@/lib/utils/notification-utils"

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Fungsi untuk memuat notifikasi
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await api.getNotifications()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
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
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Filter notifikasi berdasarkan status dan tipe
  const filteredNotifications = notifications.filter((notification) => {
    if (statusFilter !== "all" && notification.status !== statusFilter) {
      return false
    }
    if (typeFilter !== "all" && notification.type !== typeFilter) {
      return false
    }
    return true
  })

  // Mendapatkan tipe notifikasi unik untuk filter
  const uniqueTypes = Array.from(new Set(notifications.map((n) => n.type)))

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle>Notifikasi</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="unread">Belum Dibaca</SelectItem>
                  <SelectItem value="read">Sudah Dibaca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={markAllAsRead}
            disabled={!notifications.some((n) => n.status === NotificationStatus.UNREAD)}
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Tidak ada notifikasi yang sesuai dengan filter
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col sm:flex-row items-start p-4 rounded-lg border ${
                  notification.status === NotificationStatus.UNREAD ? "bg-muted/50" : ""
                }`}
              >
                <div className="mr-4 mb-2 sm:mb-0 sm:mt-1">
                  {getNotificationIconWithSize(notification.type, notification.priority, 5)}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-medium">{notification.title}</h4>
                    {notification.status === NotificationStatus.UNREAD && (
                      <Badge variant="outline" className="bg-primary text-primary-foreground">
                        Baru
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div>
                      <span title={format(new Date(notification.created_at), "PPpp", { locale: id })}>
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Tandai Dibaca
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
