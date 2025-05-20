"use client"

import { useState, useEffect } from "react"
import { Clock, Filter, Calendar, Plus, Trash2 } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { formatDistanceToNow, format, isAfter, isBefore } from "date-fns"
import { id } from "date-fns/locale"
import { Reminder, ReminderStatus } from "@/lib/types/notification"

export function RemindersList() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "",
    message: "",
    resource_type: "contract",
    resource_id: "",
    due_date: ""
  })
  const [contracts, setContracts] = useState<any[]>([])
  const [loadingContracts, setLoadingContracts] = useState(false)

  // Fungsi untuk memuat pengingat
  const fetchReminders = async () => {
    try {
      setLoading(true)
      const data = await api.getReminders()
      setReminders(data.reminders || [])
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fungsi untuk memuat kontrak
  const fetchContracts = async () => {
    try {
      setLoadingContracts(true)
      const data = await api.getContracts()
      setContracts(data.contracts || [])
    } catch (error) {
      console.error("Error fetching contracts:", error)
    } finally {
      setLoadingContracts(false)
    }
  }

  // Memuat pengingat dan kontrak saat komponen dimount
  useEffect(() => {
    fetchReminders()
    fetchContracts()
  }, [])

  // Fungsi untuk membuat pengingat baru
  const createReminder = async () => {
    try {
      // Konversi string tanggal ke timestamp
      const dueDate = new Date(newReminder.due_date).getTime()

      await api.createReminder({
        ...newReminder,
        due_date: dueDate
      })

      // Reset form dan tutup dialog
      setNewReminder({
        title: "",
        message: "",
        resource_type: "contract",
        resource_id: "",
        due_date: ""
      })
      setDialogOpen(false)

      // Muat ulang pengingat
      fetchReminders()
    } catch (error) {
      console.error("Error creating reminder:", error)
    }
  }

  // Fungsi untuk menghapus pengingat
  const deleteReminder = async (id: string) => {
    try {
      await api.deleteReminder(id)
      // Hapus pengingat dari state lokal
      setReminders(reminders.filter((r) => r.id !== id))
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  // Filter pengingat berdasarkan status
  const filteredReminders = reminders.filter((reminder) => {
    if (statusFilter === "all") {
      return true
    }
    if (statusFilter === "upcoming") {
      return reminder.status === ReminderStatus.PENDING && isAfter(new Date(reminder.due_date), new Date())
    }
    if (statusFilter === "overdue") {
      return reminder.status === ReminderStatus.PENDING && isBefore(new Date(reminder.due_date), new Date())
    }
    return reminder.status === statusFilter
  })

  // Mendapatkan nama kontrak berdasarkan ID
  const getContractTitle = (id: string) => {
    const contract = contracts.find((c) => c.id === id)
    return contract ? contract.title : "Kontrak tidak ditemukan"
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Pengingat</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="upcoming">Akan Datang</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                  <SelectItem value="sent">Terkirim</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Pengingat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Buat Pengingat Baru</DialogTitle>
                  <DialogDescription>
                    Buat pengingat untuk kontrak atau tugas yang perlu ditindaklanjuti.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="Judul pengingat"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      value={newReminder.message}
                      onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                      placeholder="Deskripsi pengingat"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource_id">Kontrak</Label>
                    <Select
                      value={newReminder.resource_id}
                      onValueChange={(value) => setNewReminder({ ...newReminder, resource_id: value })}
                    >
                      <SelectTrigger id="resource_id">
                        <SelectValue placeholder="Pilih kontrak" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingContracts ? (
                          <SelectItem value="" disabled>
                            Memuat kontrak...
                          </SelectItem>
                        ) : contracts.length === 0 ? (
                          <SelectItem value="" disabled>
                            Tidak ada kontrak
                          </SelectItem>
                        ) : (
                          contracts.map((contract) => (
                            <SelectItem key={contract.id} value={contract.id}>
                              {contract.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
                    <Input
                      id="due_date"
                      type="datetime-local"
                      value={newReminder.due_date}
                      onChange={(e) => setNewReminder({ ...newReminder, due_date: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                    Batal
                  </Button>
                  <Button
                    onClick={createReminder}
                    disabled={!newReminder.title || !newReminder.resource_id || !newReminder.due_date}
                    className="w-full sm:w-auto"
                  >
                    Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredReminders.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Tidak ada pengingat yang sesuai dengan filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex flex-col sm:flex-row items-start p-4 rounded-lg border ${
                    reminder.status === ReminderStatus.PENDING && isBefore(new Date(reminder.due_date), new Date())
                      ? "border-destructive/20 bg-destructive/5"
                      : reminder.status === ReminderStatus.PENDING
                      ? "border-yellow-200 bg-yellow-50"
                      : reminder.status === ReminderStatus.COMPLETED
                      ? "border-green-200 bg-green-50"
                      : "border-muted bg-muted/10"
                  }`}
                >
                  <div className="mr-4 mb-2 sm:mb-0 sm:mt-1">
                    <Clock className={`h-5 w-5 ${
                      reminder.status === ReminderStatus.PENDING && isBefore(new Date(reminder.due_date), new Date())
                        ? "text-destructive"
                        : reminder.status === ReminderStatus.PENDING
                        ? "text-yellow-500"
                        : reminder.status === ReminderStatus.COMPLETED
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-medium">{reminder.title}</h4>
                      <Badge variant="outline" className={`${
                        reminder.status === ReminderStatus.PENDING && isBefore(new Date(reminder.due_date), new Date())
                          ? "bg-destructive text-destructive-foreground"
                          : reminder.status === ReminderStatus.PENDING
                          ? "bg-yellow-500 text-white"
                          : reminder.status === ReminderStatus.COMPLETED
                          ? "bg-green-500 text-white"
                          : "bg-muted-foreground text-muted-foreground-foreground"
                      }`}>
                        {reminder.status === ReminderStatus.PENDING && isBefore(new Date(reminder.due_date), new Date())
                          ? "Terlambat"
                          : reminder.status === ReminderStatus.PENDING
                          ? "Akan Datang"
                          : reminder.status === ReminderStatus.COMPLETED
                          ? "Terkirim"
                          : "Dibatalkan"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{reminder.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span title={format(new Date(reminder.due_date), "PPpp", { locale: id })}>
                          {format(new Date(reminder.due_date), "dd MMM yyyy HH:mm", { locale: id })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block max-w-[200px] truncate">
                          Kontrak: {getContractTitle(reminder.resource_id)}
                        </span>
                      </div>
                      <div className="ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
