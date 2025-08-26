'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { LoadingScreen } from './LoadingScreen'
import { ReactNode, useState, useEffect } from 'react'

interface LoadingWrapperProps {
  children: ReactNode
}

export function LoadingWrapper({ children }: LoadingWrapperProps) {
  const { isInitialized } = useLanguage()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isInitialized])

  // Show loading screen until translations are loaded
  if (!isInitialized || !showContent) {
    return <LoadingScreen />
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  )
}
