"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackClient() {
  const router = useRouter()
  // useSearchParams should be used inside a component wrapped with Suspense
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    const urlError = searchParams.get('error')
    const urlErrorCode = searchParams.get('error_code')
    const urlErrorDescription = searchParams.get('error_description')

    if (urlError || urlErrorCode || urlErrorDescription) {
      console.error('Auth Callback URL Error:', { urlError, urlErrorCode, urlErrorDescription })
      const displayError = urlErrorDescription ? decodeURIComponent(urlErrorDescription) : "Authentication failed due to a server or network issue. Please try again."
      setErrorMessage(displayError)
      setIsAuthenticating(false)
      return
    }

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          setErrorMessage('You have been signed out.')
          setIsAuthenticating(false)
        } else if (session === null && event !== 'INITIAL_SESSION') {
          console.warn('Auth state: Session is null for event:', event, '(and not INITIAL_SESSION or SIGNED_OUT).')
        }
      }
    )

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
        setIsAuthenticating(true) 
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

  if (isAuthenticating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          Authenticating, please wait...
        </p>
      </div>
    )
  }

  // Fallback if not authenticating and no error, though this state should ideally not be reached
  // if logic is correct, as it should either redirect, show error, or show loading.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg text-muted-foreground">
        Verifying authentication status...
      </p>
    </div>
  );
}