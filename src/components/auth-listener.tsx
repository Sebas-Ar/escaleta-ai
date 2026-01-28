'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AuthListener() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    console.log("AuthListener mounted. Checking session...")

    // Manual Hash Parser for Implicit Grant Flow (Invite Links / Magic Links)
    // Sometimes createBrowserClient misses the hash on initial load in Next.js App Router
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1) // Remove the #
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      
      if (accessToken && refreshToken) {
        console.log("AuthListener: Detected hash with tokens. Manually setting session...")
        setIsProcessing(true)
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }).then(({ data, error }) => {
          if (error) {
            console.error("AuthListener: Error setting session manually:", error)
            setIsProcessing(false) // Stop loading state if it fails
          } else {
            console.log("AuthListener: Session manually set successfully:", data)
            // Redirect will be handled by onAuthStateChange or manually below
            router.refresh()
            router.push('/')
          }
        })
      }
    }

    // Check if we already have a session on mount (covers the hash fragment case)
    supabase.auth.getSession().then(({ data, error }) => {
        console.log("Initial getSession:", data, error)
        if (data.session) {
             console.log("Session found! Redirecting...")
             setIsProcessing(true)
             router.refresh()
             router.push('/')
        }
    })
    
    // Listen for auth state changes (e.g., when the hash fragments are processed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth State Change:", event, session)
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || session) {
        setIsProcessing(true)
        // Session is set, refresh server components and push to dashboard
        router.refresh()
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isProcessing) {
      return (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
              <div className="text-slate-900">Finalizando registro...</div>
          </div>
      )
  }

  return null
}
