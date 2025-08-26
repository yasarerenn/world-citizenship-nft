'use client'

import { useState } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export function LanguageSwitcher() {
  const { locale, setLocale, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== locale && !isLoading) {
      await setLocale(langCode)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
                {locale === language.code && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
            
            {isLoading && (
              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                  <span>Loading...</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
