"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient' // Assuming your client is here
import { AuthChangeEvent, Session } from '@supabase/supabase-js' // Import types
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => { // Added types
        if (event === 'SIGNED_IN' && session) {
          // You might want to store user data or token here if needed
          // For example, if your app uses a separate user context or localStorage beyond Supabase's session
          // localStorage.setItem('user', JSON.stringify(session.user));
          
          // Redirect to dashboard or intended page
          router.push('/dashboard')
        } else if (event === 'SIGN_IN_ERROR' || event === 'USER_DELETED' || event === 'USER_UPDATED_ERROR') {
          // Handle errors or unexpected states by redirecting to login
          console.error('Auth event error:', event)
          router.push('/login')
        }
        // Other events like TOKEN_REFRESHED, USER_UPDATED can be handled if needed
      }
    )

    // Check initial session, in case the event was missed or page reloaded
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
      // If no session, the listener above will handle the SIGNED_IN event when it occurs.
      // Or, if it's a direct navigation without an active auth flow, it might stay here or redirect to login.
    };
    checkSession();

    return () => {
      authListener?.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        Authenticating, please wait...
      </p>
    </div>
  )
}
