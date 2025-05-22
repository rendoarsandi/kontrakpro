// app/auth/callback/page.tsx
import { Suspense } from 'react'
import AuthCallbackClient from './auth-callback-client'
import { Loader2 } from 'lucide-react'

// This is the Server Component part of the page.
// It will wrap the Client Component with Suspense.
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuthCallbackClient />
    </Suspense>
  )
}

// Define a loading component to be used as fallback for Suspense
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        Loading authentication callback...
      </p>
    </div>
  )
}
