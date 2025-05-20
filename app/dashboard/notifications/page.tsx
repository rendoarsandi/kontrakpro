import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { RemindersList } from "@/components/notifications/reminders-list"

export default function NotificationsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto pb-16 md:pb-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Notifikasi & Pengingat</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Kelola notifikasi dan pengingat untuk kontrak dan tugas Anda.
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="w-full md:w-auto mb-4 grid grid-cols-2 md:flex">
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="reminders">Pengingat</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications" className="mt-2 md:mt-4">
          <NotificationsList />
        </TabsContent>
        <TabsContent value="reminders" className="mt-2 md:mt-4">
          <RemindersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
