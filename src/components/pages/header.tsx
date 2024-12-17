'use client'

import { useAuth } from '@/hooks/useAuth'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header = () => {
  const { status, signOut } = useAuth()
  const router = useRouter()
  return (
    <nav className="bg-black py-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">FINANCEMART</Link>
        {/* <div className="space-x-4 hidden lg:flex flex-row">
          <Link href="#herramientas" className="text-gray-300 hover:text-white">Herramientas</Link>
          <Link href="#" className="text-gray-300 hover:text-white">Precios</Link>
          <Link href="#" className="text-gray-300 hover:text-white">Sobre Nosotros</Link>
          <Link href="#contacto" className="text-gray-300 hover:text-white">Contacto</Link>
        </div> */}
        {status === 'authenticated' ? <div className="space-x-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard/cuentas')}>Dashboard</Button>
          <Button variant="ghost" onClick={() => signOut()}>Cerrar Sesión</Button>
        </div>
          :
          <div className="space-x-2">
            <Button variant="ghost" onClick={() => {
              router.push('/login')
            }}>Iniciar Sesión</Button>
            <Button onClick={() => router.push('register')}>Registrarse</Button>
          </div>}
      </div>
    </nav>
  )
}

export default Header