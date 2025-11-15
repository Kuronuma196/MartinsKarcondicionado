
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(lumi.auth.isAuthenticated)
  const [user, setUser] = useState(lumi.auth.user)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = lumi.auth.onAuthChange(({ isAuthenticated, user }) => {
      setIsAuthenticated(isAuthenticated)
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    setLoading(true)
    try {
      await lumi.auth.signIn()
    } catch (error) {
      console.error('Login failed:', error)
      setLoading(false)
    }
  }

  const signOut = () => {
    lumi.auth.signOut()
  }

  return { user, isAuthenticated, loading, signIn, signOut }
}
