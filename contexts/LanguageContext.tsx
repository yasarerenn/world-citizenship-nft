'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, namespace?: string) => string
  isLoading: boolean
  isInitialized: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation function - will be enhanced with actual i18n
const translations: Record<string, Record<string, any>> = {
  en: {},
  tr: {}
}

// Load translations dynamically
const loadTranslations = async (locale: string) => {
  try {
    const response = await fetch(`/locales/${locale}/common.json`)
    const common = await response.json()
    
    const homeResponse = await fetch(`/locales/${locale}/home.json`)
    const home = await homeResponse.json()
    
    const daoResponse = await fetch(`/locales/${locale}/dao.json`)
    const dao = await daoResponse.json()
    
    const communityResponse = await fetch(`/locales/${locale}/community.json`)
    const community = await communityResponse.json()
    
    const profileResponse = await fetch(`/locales/${locale}/profile.json`)
    const profile = await profileResponse.json()
    
    const messagesResponse = await fetch(`/locales/${locale}/messages.json`)
    const messages = await messagesResponse.json()
    
    const eventsResponse = await fetch(`/locales/${locale}/events.json`)
    const events = await eventsResponse.json()
    
    translations[locale] = {
      common,
      home,
      dao,
      community,
      profile,
      messages,
      events
    }
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error)
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocaleState] = useState<string>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Client-side only
    if (typeof window === 'undefined') return
    
    const initializeLanguage = async () => {
      // Get initial locale from localStorage (since App Router doesn't have router.locale)
      const initialLocale = localStorage.getItem('preferred-language') || 'en'
      setLocaleState(initialLocale)
      
      // Load translations for initial locale
      await loadTranslations(initialLocale)
      
      setIsLoading(false)
      setIsInitialized(true)
    }
    
    initializeLanguage()
  }, [])

  const setLocale = async (newLocale: string) => {
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    
    // Save to localStorage
    localStorage.setItem('preferred-language', newLocale)
    
    // Load translations for new locale if not already loaded
    if (!translations[newLocale] || Object.keys(translations[newLocale]).length === 0) {
      await loadTranslations(newLocale)
    }
    
    // For App Router, we'll just update the state
    // URL-based locale switching can be implemented later if needed
    setLocaleState(newLocale)
    setIsLoading(false)
  }

  const t = (key: string, namespace: string = 'common'): string => {
    try {
      const keys = key.split('.')
      let value = translations[locale]?.[namespace]
      
      for (const k of keys) {
        value = value?.[k]
      }
      
      return value || key
    } catch (error) {
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{
      locale,
      setLocale,
      t,
      isLoading,
      isInitialized
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
