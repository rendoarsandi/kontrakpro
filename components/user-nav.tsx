"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
// import { api } from "@/lib/api" // api.logout() will be replaced
// import { supabase } from "@/lib/supabaseClient" // Supabase removed
// import { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js" // Supabase types removed

interface AppUserData { // Renamed to avoid conflict with Lucide User icon
  id: string
  name: string
  email: string
  role?: string // Role might not be directly on user object, often in metadata or separate table
}

export function UserNav() {
  const router = useRouter()
  // Since Supabase is removed, use dummy user data or a different auth system.
  // For now, let's use a static user for display purposes.
  const appUser: AppUserData | null = {
    id: "dummy-user-id",
    name: "Demo User",
    email: "demo@example.com",
    role: "User"
  };
  const [loading, setLoading] = useState(false); // No longer loading from Supabase

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name: string | undefined) => {
    if (!name) return "DU"; // Default initials for Demo User
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // useEffect for fetching user data is removed as Supabase is not used.

  // Fungsi untuk logout
  const handleLogout = async () => {
    // Placeholder for logout logic if not using Supabase
    // For now, just redirect to login
    console.log("Logout initiated. Redirecting to login.");
    // If you have a different auth system, integrate its logout here.
    router.push("/login");
  };

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(appUser?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{appUser?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {appUser?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
