"use client"

import { useEffect, useState } from 'react' // Suspense removed as it's not used with useSearchParams directly here anymore
import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabaseClient' // Supabase removed
// import { AuthChangeEvent, Session } from '@supabase/supabase-js' // Supabase types removed
import { Loader2, AlertTriangle } from 'lucide-react' // AlertTriangle added
import { Button } from '@/components/ui/button' // Button for navigation

export default function AuthCallbackClient() {
  const router = useRouter()
  // const searchParams = useSearchParams() // Not used anymore
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // This page is likely not needed if Supabase or another OAuth provider is not used.
    // For now, display a message.
    setMessage("This authentication callback page is currently not in active use. If you landed here by mistake, please navigate to a valid page.")
    
    // Optionally, redirect after a delay
    const timer = setTimeout(() => {
      // router.push('/'); // Redirect to home or login
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-semibold mb-4">Authentication Callback</h1>
      {message ? (
        <p className="text-lg text-muted-foreground mb-8 max-w-md">{message}</p>
      ) : (
        <div className="flex items-center text-lg text-muted-foreground mb-8">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </div>
      )}
      <div className="space-x-4">
        <Button onClick={() => router.push('/')} variant="outline">
          Go to Homepage
        </Button>
        <Button onClick={() => router.push('/login')}>
          Go to Login
        </Button>
      </div>
    </div>
  )
}