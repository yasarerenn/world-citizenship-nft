'use client'

import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    // Get preferred language from localStorage
    if (typeof window !== 'undefined') {
      const preferredLanguage = localStorage.getItem('preferred-language') || 'en'
      setLocale(preferredLanguage)
    }
  }, [])

  const loadingText = locale === 'tr' ? 'Yükleniyor...' : 'Loading...'
  const siteTitle = locale === 'tr' ? 'Dünya Vatandaşlığı NFT' : 'World Citizenship NFT'

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center animate-slide-up">
        {/* Logo and Title */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="p-3 bg-black rounded-xl animate-pulse">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">
            {siteTitle}
          </h1>
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 font-medium">{loadingText}</p>
      </div>
    </div>
  )
}
