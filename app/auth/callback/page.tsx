"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    // Check for errors in URL parameters first
    const urlError = searchParams.get('error')
    const urlErrorCode = searchParams.get('error_code')
    const urlErrorDescription = searchParams.get('error_description')

    if (urlError || urlErrorCode || urlErrorDescription) {
      console.error('Auth Callback URL Error:', { urlError, urlErrorCode, urlErrorDescription })
      const displayError = urlErrorDescription ? decodeURIComponent(urlErrorDescription) : "Authentication failed due to a server or network issue. Please try again."
      setErrorMessage(displayError)
      setIsAuthenticating(false)
      // No need to set up listener or check session if URL already indicates a hard error
      return
    }

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session) {
          // Successfully signed in
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          // Handle sign out, redirect to login
          setErrorMessage('You have been signed out.')
          setIsAuthenticating(false)
          // Consider redirecting to login page after a short delay or immediately
          // router.push('/login?message=signed_out')
        } else if (session === null && event !== 'INITIAL_SESSION') {
          // This block catches cases where the session is null for an event that is NOT 'INITIAL_SESSION'
          // and also NOT 'SIGNED_OUT' (because 'SIGNED_OUT' was handled in the previous 'else if').
          // This could indicate an unexpected session loss or an auth flow that didn't complete.
          console.warn('Auth state: Session is null for event:', event, '(and not INITIAL_SESSION or SIGNED_OUT).')
          // Potentially set an error message if this state persists or is unexpected.
          // For now, we'll let the loading indicator continue, as 'INITIAL_SESSION' might still resolve,
          // or a redirect might occur from other logic.
          // If this state is problematic, you might want to setErrorMessage after a timeout.
        }
        // Other events like TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, MFA_CHALLENGE_VERIFIED
        // are typically handled by Supabase internally or lead to UI changes elsewhere,
        // not usually a redirect from the callback page itself unless they result in a SIGNED_IN.
      }
    )

    // Check initial session if no URL error was found
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting session:', sessionError)
        setErrorMessage(`Error fetching session: ${sessionError.message}. Please try again.`)
        setIsAuthenticating(false)
        return
      }
      if (session) {
        router.push('/dashboard');
      } else {
        // If no session and no URL error, it means the user is likely not logged in,
        // or the SIGNED_IN event hasn't fired yet.
        // The onAuthStateChange listener will handle the SIGNED_IN event.
        // If after a timeout there's still no session, it might be an issue.
        // For now, we let the loading spinner continue.
        // If it's a direct navigation to /auth/callback without an auth flow,
        // it will just show loading until user is redirected or an error is set.
        setIsAuthenticating(true) // Continue showing loading
      }
    };

    if (!urlError && !urlErrorCode && !urlErrorDescription) {
      checkSession();
    }

    return () => {
      authListenerData?.subscription.unsubscribe()
    }
  }, [router, searchParams])

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold text-destructive mb-4">Authentication Error</h1>
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4 text-center">{errorMessage}</p>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        Authenticating, please wait...
      </p>
    </div>
  )
}
