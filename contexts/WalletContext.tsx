'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface WalletState {
  isConnected: boolean
  userData: any
  showWalletModal: boolean
}

interface WalletContextType {
  isConnected: boolean
  userData: any
  showWalletModal: boolean
  setShowWalletModal: (show: boolean) => void
  handleConnect: () => void
  handleDisconnect: () => void
  connectToWallet: (type: 'hiro' | 'xverse' | 'demo') => Promise<void>
  showError: (title: string, message: string, type?: 'error' | 'warning' | 'info') => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Local Storage'dan cüzdan durumunu yükle
  useEffect(() => {
    const savedWalletData = localStorage.getItem('walletData')
    if (savedWalletData) {
      try {
        const walletData = JSON.parse(savedWalletData)
        setUserData(walletData.userData)
        setIsConnected(walletData.isConnected)
      } catch (error) {
        console.error('Cüzdan verisi yüklenirken hata:', error)
        localStorage.removeItem('walletData')
      }
    }
  }, [])

  // Cüzdan durumu değiştiğinde Local Storage'a kaydet
  useEffect(() => {
    if (isConnected && userData) {
      localStorage.setItem('walletData', JSON.stringify({
        isConnected,
        userData
      }))
    } else {
      localStorage.removeItem('walletData')
    }
  }, [isConnected, userData])

  const showError = (title: string, message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    // Bu fonksiyon her sayfada kendi error handler'ını kullanacak
    console.error(`${title}: ${message}`)
    alert(`${title}: ${message}`) // Geçici olarak alert kullanıyoruz
  }

  const handleConnect = () => {
    setShowWalletModal(true)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setUserData(null)
    localStorage.removeItem('walletData')
    
    // Eğer ana sayfada değilsek ana sayfaya yönlendir
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push('/')
    }
  }

  const connectToWallet = async (walletType: 'hiro' | 'xverse' | 'demo') => {
    setShowWalletModal(false)
    
    try {
      if (walletType === 'demo') {
        // Demo mode
        const demoUserData = {
          address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.demo',
          displayName: 'Demo Kullanıcı',
          walletType: 'demo'
        }
        setUserData(demoUserData)
        setIsConnected(true)
        return
      }

      // Real wallet connection
      if (!window.StacksProvider) {
        showError(
          'Cüzdan Bulunamadı',
          'Lütfen Hiro Wallet veya Xverse cüzdan uygulamasını yükleyin.',
          'warning'
        )
        return
      }

      const response = await window.StacksProvider.request({
        method: 'stx_requestAccounts',
      })

      if (response && response.addresses && response.addresses.length > 0) {
        const realUserData = {
          address: response.addresses[0],
          displayName: response.addresses[0].slice(0, 6) + '...' + response.addresses[0].slice(-4),
          walletType: walletType
        }
        setUserData(realUserData)
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Cüzdan bağlantı hatası:', error)
      showError(
        'Bağlantı Hatası',
        'Cüzdan bağlantısı sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        'error'
      )
    }
  }

  const value: WalletContextType = {
    isConnected,
    userData,
    showWalletModal,
    setShowWalletModal,
    handleConnect,
    handleDisconnect,
    connectToWallet,
    showError
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}
