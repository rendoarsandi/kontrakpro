"use client"

import { useState } from "react"
import { addDays, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, FileText, Plus, Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Contoh data acara
const events = [
  {
    id: 1,
    title: "Vendor Agreement Renewal",
    date: "2025-05-20",
    type: "renewal",
    priority: "high",
    description: "Renewal of vendor agreement with Supplier Inc.",
    assignee: "Sarah Johnson",
  },
  {
    id: 2,
    title: "Client Contract Review",
    date: "2025-05-25",
    type: "review",
    priority: "medium",
    description: "Review of client contract before final approval.",
    assignee: "Michael Chen",
  },
  {
    id: 3,
    title: "Partnership Agreement Deadline",
    date: "2025-06-02",
    type: "deadline",
    priority: "medium",
    description: "Deadline for finalizing partnership agreement terms.",
    assignee: "Robert Lee",
  },
  {
    id: 4,
    title: "Office Lease Renewal",
    date: "2025-06-15",
    type: "renewal",
    priority: "low",
    description: "Renewal of office space lease agreement.",
    assignee: "Jennifer Wong",
  },
  {
    id: 5,
    title: "NDA Expiration - XYZ Corp",
    date: "2025-05-18",
    type: "expiration",
    priority: "medium",
    description: "Non-disclosure agreement with XYZ Corp expires.",
    assignee: "You",
  },
  {
    id: 6,
    title: "Software License Review",
    date: "2025-05-22",
    type: "review",
    priority: "high",
    description: "Review of software licensing terms before renewal.",
    assignee: "IT Department",
  },
  {
    id: 7,
    title: "Employment Contract - New Hire",
    date: "2025-05-28",
    type: "deadline",
    priority: "high",
    description: "Finalize employment contract for new marketing director.",
    assignee: "HR Department",
  },
  {
    id: 8,
    title: "Quarterly Contract Audit",
    date: "2025-06-30",
    type: "audit",
    priority: "medium",
    description: "Regular quarterly audit of all active contracts.",
    assignee: "Legal Team",
  },
]

// Fungsi untuk mendapatkan warna berdasarkan tipe acara
const getEventColor = (type: string) => {
  switch (type) {
    case "renewal":
      return "bg-blue-500"
    case "review":
      return "bg-amber-500"
    case "deadline":
      return "bg-red-500"
    case "expiration":
      return "bg-purple-500"
    case "audit":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

// Fungsi untuk mendapatkan warna badge berdasarkan prioritas
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "outline"
    default:
      return "secondary"
  }
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [filterType, setFilterType] = useState<string>("all")

  // Filter acara berdasarkan pencarian dan tipe
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || event.type === filterType
    return matchesSearch && matchesType
  })

  // Acara untuk tanggal yang dipilih
  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => isSameDay(parseISO(event.date), selectedDate))
    : []

  // Acara yang akan datang (diurutkan berdasarkan tanggal)
  const upcomingEvents = [...filteredEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((event) => new Date(event.date) >= new Date())
    .slice(0, 5)

  // Fungsi untuk membuat array hari dalam sebulan untuk tampilan kalender
  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date))
    const days = []
    for (let i = 0; i < 42; i++) {
      const day = addDays(start, i)
      days.push(day)
    }
    return days
  }

  // Mendapatkan acara untuk tanggal tertentu
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.date), date))
  }

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="renewal">Renewals</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="expiration">Expirations</SelectItem>
                <SelectItem value="audit">Audits</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Calendar Event</DialogTitle>
                  <DialogDescription>Create a new event related to a contract</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="event-date"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select>
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="renewal">Renewal</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="expiration">Expiration</SelectItem>
                          <SelectItem value="audit">Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event-priority">Priority</Label>
                      <Select>
                        <SelectTrigger id="event-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-assignee">Assignee</Label>
                      <Select>
                        <SelectTrigger id="event-assignee">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="you">You</SelectItem>
                          <SelectItem value="legal">Legal Team</SelectItem>
                          <SelectItem value="finance">Finance Team</SelectItem>
                          <SelectItem value="hr">HR Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Input id="event-description" placeholder="Enter event description" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-contract">Related Contract</Label>
                    <Select>
                      <SelectTrigger id="event-contract">
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service-agreement">Service Agreement - Acme Inc</SelectItem>
                        <SelectItem value="nda">NDA - XYZ Corp</SelectItem>
                        <SelectItem value="employment">Employment Contract - Jane Smith</SelectItem>
                        <SelectItem value="software">Software License - TechCorp</SelectItem>
                        <SelectItem value="vendor">Vendor Agreement - Supplier Inc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -30))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{format(date, "MMMM yyyy")}</h2>
              <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 30))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="month" className="mt-6">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>

            <TabsContent value="month" className="mt-6">
              <div className="grid grid-cols-7 gap-px rounded-lg border bg-muted text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="bg-background p-2 font-medium">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(date).map((day, i) => {
                  const dayEvents = getEventsForDate(day)
                  const isToday = isSameDay(day, new Date())
                  const isCurrentMonth = isSameMonth(day, date)
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false

                  return (
                    <div
                      key={i}
                      className={`min-h-[100px] bg-background p-1 ${
                        isCurrentMonth ? "" : "text-muted-foreground"
                      } ${isToday ? "font-bold" : ""} ${
                        isSelected ? "ring-2 ring-primary ring-inset" : ""
                      } hover:bg-muted/50 cursor-pointer`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="p-1 text-right">{format(day, "d")}</div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`truncate rounded px-1 py-0.5 text-xs text-white ${getEventColor(event.type)}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEvent(event)
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-center text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="week" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Week View</CardTitle>
                  <CardDescription>Week of {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">Week view will be implemented in a future update.</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="day" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Day View</CardTitle>
                  <CardDescription>{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">Day view will be implemented in a future update.</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event List</CardTitle>
                  <CardDescription>All upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No events found</div>
                    ) : (
                      filteredEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-4 rounded-md border p-3">
                          <div
                            className={`h-10 w-1 rounded-full ${getEventColor(event.type)}`}
                            aria-hidden="true"
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge variant={getPriorityBadge(event.priority)}>
                                {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Selected Date"}</CardTitle>
                  <CardDescription>
                    {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No events for this date</h3>
                      <p className="text-sm text-muted-foreground">Select a different date or add a new event</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-4 gap-1">
                            <Plus className="h-4 w-4" />
                            Add Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Calendar Event</DialogTitle>
                            <DialogDescription>Create a new event related to a contract</DialogDescription>
                          </DialogHeader>
                          {/* Dialog content would be the same as above */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {eventsForSelectedDate.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 rounded-md border p-4">
                          <div
                            className={`mt-1 h-3 w-3 rounded-full ${getEventColor(event.type)}`}
                            aria-hidden="true"
                          ></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge variant={getPriorityBadge(event.priority)}>
                                {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm">{event.description}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                              </div>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder.svg" alt={event.assignee} />
                                <AvatarFallback>{event.assignee[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{event.assignee}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button size="sm">View Contract</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Next 5 events on your calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
                    ) : (
                      upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${getEventColor(event.type)}`} aria-hidden="true"></div>
                          <div className="flex-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              <span>{format(parseISO(event.date), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                          <Badge variant={getPriorityBadge(event.priority)} className="ml-auto">
                            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Event Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Renewal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Deadline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span>Expiration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Audit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
