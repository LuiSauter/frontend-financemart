'use client'
import { Provider } from 'react-redux'
import { store } from '../lib/store'
import { AuthProvider } from '@/context/authContext'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  // const storeRef = useRef<AppStore>()
  // if (!storeRef.current) {
  //   // Create the store instance the first time this renders
  //   storeRef.current = makeStore()
  // }

  return <Provider store={store}>
    <AuthProvider>{children}</AuthProvider>
  </Provider>
}