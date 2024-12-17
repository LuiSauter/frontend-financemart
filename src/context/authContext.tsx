/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCreateResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/lib/api.utils'
import { authStatus } from '@/lib/auth.utils'
import { createUser, resetUser } from '@/lib/slices/user.slice'
import { getStorage, removeStorage, setStorage, STORAGE_BRANCH, STORAGE_TOKEN, STORAGE_USER } from '@/lib/storage.utils'
import { redirect, useRouter } from 'next/navigation'
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'


export interface ChildrenProps {
  children: ReactNode | ReactNode[]
}

export interface AuthLogin {
  email: string
  password: string
}

export interface AuthContextState {
  status: authStatus
  error: string[] | string
  signWithEmailPassword: (loginForm: AuthLogin) => Promise<void>
  // recoverPasswordWithEmail: (email: string) => Promise<boolean | undefined>
  // resetPasswordWithEmail: (loginForm: AuthLoginWithToken) => Promise<boolean | undefined>
  signOut: () => void
  isMutating: boolean
}


export const AuthContext = createContext<AuthContextState>({} as AuthContextState)

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [status, setStatus] = useState<authStatus>(authStatus.loading)
  const [error, setError] = useState<string[]>([])

  const { createResource: authLogin, isMutating: authMutating } =
    useCreateResource<AuthLogin>({ endpoint: `${ENDPOINTS.AUTH}` })

  const router = useRouter()

  const { createResource: checkToken } = useCreateResource({ endpoint: `${ENDPOINTS.AUTH}/check-token`, query: new URLSearchParams({ token: getStorage(STORAGE_TOKEN)! }).toString() })

  const dispatch = useDispatch()

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([])
      }, 5000)
      return () => { clearTimeout(timer) }
    }
  }, [error])

  let subscribe = false
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getStorage(STORAGE_TOKEN)
      if (!token) {
        setStatus(authStatus.unauthenticated)
        dispatch(resetUser())
        removeStorage(STORAGE_USER)
        redirect('/')
      }
      try {
        const responseUser = await checkToken({ token })
        dispatch(createUser(responseUser))
        setStatus(authStatus.authenticated)
      } catch (error: any) {
        console.error(error)
        removeStorage(STORAGE_TOKEN)
        removeStorage(STORAGE_USER)
        // removeStorage(STORAGE_BRANCH)
        setStatus(authStatus.unauthenticated)
        dispatch(resetUser())
      }
    }
    if (!subscribe) {
      void checkAuthStatus()
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subscribe = true
    }
  }, [])

  const signOut = () => {
    removeStorage(STORAGE_TOKEN)
    removeStorage(STORAGE_USER)
    removeStorage(STORAGE_BRANCH)
    dispatch(resetUser())
    setStatus(authStatus.unauthenticated)
    redirect('/login')
  }

  const signWithEmailPassword = async (formData: AuthLogin) => {
    try {
      if (formData.password === '') throw new Error('La contraseña es requerida')
      setStatus(authStatus.loading)
      const userResponse: any = await authLogin(formData)
      dispatch(createUser(userResponse.data.user))
      setStorage(STORAGE_TOKEN, userResponse.data.token)
      setStorage(STORAGE_USER, JSON.stringify(userResponse.data.user))
      setStatus(authStatus.authenticated)
      router.replace('/dashboard/cuentas')
    } catch (error: Error | any) {
      if (!error.errorInfo) {
        setError([error.message])
      } else {
        setError([error.errorInfo?.message ?? 'Servicio no disponible, intente más tarde.'])
      }
      setStatus(authStatus.unauthenticated)
    }
  }

  const value = useMemo(() => {
    return { status, error, signOut, signWithEmailPassword, isMutating: authMutating }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error, authMutating])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
