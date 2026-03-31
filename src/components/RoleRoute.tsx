import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUserRole, type UserRole } from '../hooks/useUserRole'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useAuth()
  const { role, loadingRole } = useUserRole()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default RoleRoute
