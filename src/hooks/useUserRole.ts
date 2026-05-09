import { useEffect, useState } from 'react'
import { lumi } from '../lib/lumi'
import { useAuth } from './useAuth'

export type UserRole = 'visitor' | 'client' | 'technician' | 'supplier' | 'admin' | 'founder'

const getRoleFromEmail = (email?: string): UserRole | null => {
  if (!email) return null
  if (email === 'kuronumadeal@gmail.com') return 'founder'
  if (email === 'martinskarcondicionado@gmail.com') return 'admin'
  return null
}

export function useUserRole() {
  const { user, isAuthenticated } = useAuth()
  const [role, setRole] = useState<UserRole>('visitor')
  const [loadingRole, setLoadingRole] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) {
      setRole('visitor')
      return
    }

    const emailRole = getRoleFromEmail(user.email)
    if (emailRole) {
      setRole(emailRole)
      return
    }

    const loadRole = async () => {
      try {
        setLoadingRole(true)
        const { list } = await lumi.entities.user_profiles.list({
          where: { user_id: user.sub },
          limit: 1
        })
        const profileRole = list?.[0]?.role as UserRole | undefined
        setRole(profileRole || 'client')
      } catch (error) {
        console.error('Erro ao carregar role do usuário:', error)
        setRole('client')
      } finally {
        setLoadingRole(false)
      }
    }

    loadRole()
  }, [isAuthenticated, user?.sub, user?.email])

  return { role, loadingRole }
}
