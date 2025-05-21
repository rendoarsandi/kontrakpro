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
import { supabase } from "@/lib/supabaseClient" // Import Supabase client
import { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js" // Import Supabase User type, AuthChangeEvent, Session

interface AppUserData { // Renamed to avoid conflict with Lucide User icon
  id: string
  name: string
  email: string
  role?: string // Role might not be directly on user object, often in metadata or separate table
}

export function UserNav() {
  const router = useRouter()
  const [appUser, setAppUser] = useState<AppUserData | null>(null) // Changed state variable name
  const [loading, setLoading] = useState(true)

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name: string | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setAppUser({
          id: session.user.id,
          email: session.user.email || "",
          // Name and role might be in user_metadata, adjust as per your Supabase setup
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || "User",
          role: session.user.user_metadata?.role || "User", 
        });
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => { // Added types
      if (event === "SIGNED_IN" && session?.user) {
        setAppUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || "User",
          role: session.user.user_metadata?.role || "User",
        });
      } else if (event === "SIGNED_OUT") {
        setAppUser(null)
        router.push("/login") // Redirect to login on sign out
      }
      // No need to setLoading(false) here again as initial load handles it
    });

    return () => {
      authListener?.unsubscribe()
    }
  }, [router])

  // Fungsi untuk logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error logging out:", error.message)
      }
      // onAuthStateChange listener will handle redirect via setAppUser(null)
      // router.push("/login") // Can be redundant if onAuthStateChange handles it
    } catch (error: any) {
      console.error("Error logging out:", error.message)
    }
  }

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
              {appUser?.email || "user@example.com"}
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
