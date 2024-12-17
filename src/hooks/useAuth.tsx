import { useContext } from 'react'
import { AuthContext, AuthContextState } from '../context/authContext'

const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { useAuth }
