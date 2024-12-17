'use client'

import { useAuth } from '@/hooks/useAuth'
import React from 'react'

const Footer = () => {
  const { status } = useAuth()
  return (
    <div>Footer: {status}</div>
  )
}

export default Footer