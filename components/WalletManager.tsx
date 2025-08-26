'use client'

import { Wallet, Globe, X } from 'lucide-react'
import { useWalletContext } from '@/contexts/WalletContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'



export function WalletHeader({ onDisconnect }: { onDisconnect?: () => void } = {}) {
  const { isConnected, userData, handleConnect, handleDisconnect } = useWalletContext()
  const { t } = useLanguage()
  
  const handleDisconnectClick = onDisconnect || handleDisconnect
  
  return (
    <>
      {/* Language Switcher */}
      <LanguageSwitcher />
      
      {isConnected ? (
        <>
          <div className="h-6 w-px bg-gray-300 mx-3"></div>
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            {userData?.address?.slice(0, 6)}...{userData?.address?.slice(-4)}
          </div>
          <button
            onClick={handleDisconnectClick}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('wallet.disconnect')}
          </button>
        </>
      ) : (
        <>
          <div className="h-6 w-px bg-gray-300 mx-3"></div>
          <button
            onClick={handleConnect}
            className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>{t('wallet.connect')}</span>
          </button>
        </>
      )}
    </>
  )
}

export function WalletModal() {
  const { showWalletModal, setShowWalletModal, connectToWallet } = useWalletContext()
  const { t } = useLanguage()
  
  if (!showWalletModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gradient">{t('wallet.selectWallet')}</h3>
          <button
            onClick={() => setShowWalletModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => connectToWallet('hiro')}
            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{t('wallet.hiro')}</div>
              <div className="text-sm text-gray-600">{t('wallet.hiroDesc')}</div>
            </div>
          </button>

          <button
            onClick={() => connectToWallet('xverse')}
            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{t('wallet.xverse')}</div>
              <div className="text-sm text-gray-600">{t('wallet.xverseDesc')}</div>
            </div>
          </button>

          <button
            onClick={() => connectToWallet('demo')}
            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all duration-300 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{t('wallet.demo')}</div>
              <div className="text-sm text-gray-600">{t('wallet.demoDesc')}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Global Wallet Manager Hook
export function useWallet() {
  return useWalletContext()
}
