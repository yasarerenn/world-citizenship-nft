'use client'

import { useState } from 'react'
import { 
  Globe, 
  Shield, 
  Users, 
  Vote, 
  CheckCircle, 
  Wallet,
  ArrowRight,
  Star,
  User,
  MessageCircle,
  Calendar
} from 'lucide-react'
import { checkCitizenshipStatus, prepareMintParams, prepareMintContractCall, network } from '@/lib/stacks'
import { 
  makeContractCall, 
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  PostConditionMode
} from '@stacks/transactions'
import { useWallet, WalletHeader, WalletModal } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const {
    isConnected,
    userData,
    showWalletModal,
    setShowWalletModal,
    handleConnect,
    handleDisconnect,
    connectToWallet
  } = useWallet()
  
  const { t } = useLanguage()
  
  const [citizenshipStatus, setCitizenshipStatus] = useState<any>({
    hasCitizenship: false,
    tokenId: null,
    metadata: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorModal, setErrorModal] = useState<{
    show: boolean
    title: string
    message: string
    type: 'error' | 'warning' | 'info'
  }>({
    show: false,
    title: '',
    message: '',
    type: 'error'
  })



  const showError = (title: string, message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setErrorModal({
      show: true,
      title,
      message,
      type
    })
  }

    const handleWalletConnect = async (walletType: 'hiro' | 'xverse' | 'demo') => {
    await connectToWallet(walletType)
    
    // Cüzdan bağlandıktan sonra vatandaşlık durumunu kontrol et
    if (userData?.address) {
      await checkCitizenship(userData.address)
    }
  }

  const handleLocalDisconnect = () => {
    // Citizenship status'unu sıfırla
    setCitizenshipStatus({
      hasCitizenship: false,
      tokenId: null,
      metadata: null
    })
    
    // Global disconnect (ana sayfada olduğumuz için yönlendirme yapmaz)
    handleDisconnect()
  }

  const checkCitizenship = async (address: string) => {
    try {
      setIsLoading(true)
      const status = await checkCitizenshipStatus(address)
      setCitizenshipStatus(status)
    } catch (error) {
      console.error('Vatandaşlık durumu kontrol edilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Clean Header Navigation */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-black">
                {t('site.title')}
              </h1>
            </div>
            
                        <nav className="flex items-center space-x-1">
              {isConnected && (
                <>
                  <a href="/dao" className="nav-link">{t('nav.dao')}</a>
                  <a href="/community" className="nav-link">{t('nav.community')}</a>
                  <a href="/profile" className="nav-link">{t('nav.profile')}</a>
                  <a href="/messages" className="nav-link">{t('nav.messages')}</a>
                  <a href="/events" className="nav-link">{t('nav.events')}</a>
                </>
              )}
              <WalletHeader onDisconnect={handleLocalDisconnect} />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-7xl font-black text-white mb-8 animate-fade-in">
            {t('site.subtitle')}
          </h2>
          <p className="text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            {t('hero.description', 'home')}
          </p>
          
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="btn-secondary text-xl px-12 py-4 flex items-center space-x-3 mx-auto animate-slide-up"
            >
              <Wallet className="h-6 w-6" />
              <span>{t('buttons.mint')}</span>
              <ArrowRight className="h-6 w-6" />
            </button>
                     ) : (
                          <CitizenshipActions 
                citizenshipStatus={citizenshipStatus}
                setCitizenshipStatus={setCitizenshipStatus}
                userData={userData}
                showError={showError}
              />
           )}
        </div>
      </section>

      {/* Features */}
      <section className="section-gradient py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-black text-gradient mb-6">
              {t('features.title', 'home')}
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle', 'home')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Vote className="h-10 w-10" />}
              title={t('features.universalDAOVoting.title', 'home')}
              description={t('features.universalDAOVoting.description', 'home')}
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title={t('features.globalSocialProjects.title', 'home')}
              description={t('features.globalSocialProjects.description', 'home')}
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title={t('features.universalIdentityVerification.title', 'home')}
              description={t('features.universalIdentityVerification.description', 'home')}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <StatCard
              number="1,234"
              label={t('stats.totalCitizens', 'home')}
              icon={<Globe className="h-8 w-8" />}
            />
            <StatCard
              number="56"
              label={t('stats.countries', 'home')}
              icon={<Star className="h-8 w-8" />}
            />
            <StatCard
              number="89"
              label={t('stats.daoVotingRights', 'home')}
              icon={<CheckCircle className="h-8 w-8" />}
            />
          </div>
                 </div>
       </section>

       {/* Cüzdan Seçim Modal */}
       {showWalletModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="card max-w-md mx-4">
                         <h3 className="text-2xl font-black text-gradient mb-6 text-center">
              {t('modals.selectWallet')}
            </h3>
             
             <div className="space-y-4">
               <button
                 onClick={() => handleWalletConnect('hiro')}
                 className="w-full btn-secondary flex items-center justify-center space-x-3 py-4"
               >
                 <Wallet className="h-6 w-6" />
                 <span>Hiro Wallet</span>
               </button>
               
               <button
                 onClick={() => handleWalletConnect('xverse')}
                 className="w-full btn-secondary flex items-center justify-center space-x-3 py-4"
               >
                 <Wallet className="h-6 w-6" />
                 <span>Xverse</span>
               </button>
               
               <div className="border-t border-gray-200 pt-4">
                 <button
                   onClick={() => handleWalletConnect('demo')}
                   className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                 >
                   Demo Modu (Test)
                 </button>
               </div>
               
               <button
                 onClick={() => setShowWalletModal(false)}
                 className="w-full text-gray-500 hover:text-gray-700 font-medium py-2"
               >
                 İptal
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Hata Modal */}
       {errorModal.show && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="card max-w-md mx-4 animate-fade-in">
             <div className="text-center">
               {/* İkon */}
               <div className={`p-4 rounded-2xl inline-block mb-6 ${
                 errorModal.type === 'error' ? 'bg-red-100' :
                 errorModal.type === 'warning' ? 'bg-yellow-100' :
                 'bg-green-100'
               }`}>
                 {errorModal.type === 'error' ? (
                   <div className="h-12 w-12 text-red-600 text-2xl font-bold">⚠️</div>
                 ) : errorModal.type === 'warning' ? (
                   <div className="h-12 w-12 text-yellow-600 text-2xl font-bold">⚠️</div>
                 ) : (
                   <CheckCircle className="h-12 w-12 text-green-600" />
                 )}
               </div>
               
               {/* Başlık */}
               <h3 className={`text-2xl font-black mb-4 ${
                 errorModal.type === 'error' ? 'text-red-600' :
                 errorModal.type === 'warning' ? 'text-yellow-600' :
                 'text-green-600'
               }`}>
                 {errorModal.title}
               </h3>
               
               {/* Mesaj */}
               <p className="text-gray-600 mb-8 text-lg leading-relaxed whitespace-pre-line">
                 {errorModal.message}
               </p>
               
               {/* Buton */}
               <button
                 onClick={() => setErrorModal({ ...errorModal, show: false })}
                 className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                   errorModal.type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' :
                   errorModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                   'bg-green-600 hover:bg-green-700 text-white'
                 }`}
               >
                 {t('buttons.ok')}
               </button>
             </div>
           </div>
         </div>
             )}

      <WalletModal />
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="card text-center hover:scale-105 transition-transform duration-300">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-black rounded-2xl text-white shadow-premium">
          {icon}
        </div>
      </div>
      <h4 className="text-2xl font-black text-gradient mb-4">{title}</h4>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ number, label, icon }: {
  number: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <div className="text-center group">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-all duration-300">
          {icon}
        </div>
      </div>
      <div className="text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">{number}</div>
      <div className="text-gray-300 text-xl font-medium">{label}</div>
    </div>
  )
}

function CitizenshipActions({ citizenshipStatus, setCitizenshipStatus, userData, showError }: {
  citizenshipStatus: any
  setCitizenshipStatus: (status: any) => void
  userData: any
  showError: (title: string, message: string, type?: 'error' | 'warning' | 'info') => void
}) {
  const { t } = useLanguage()
  const [isMinting, setIsMinting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUri: ''
  })

    const handleMint = async () => {
    if (!formData.name || !formData.description) {
      showError(
        t('modals.missingInfo'),
        t('modals.fillRequiredFields'),
        'warning'
      )
      return
    }

    if (!userData?.address) {
      showError(
        t('modals.walletConnectionRequired'),
        t('modals.walletConnectionRequiredMessage'),
        'warning'
      )
      return
    }

    setIsMinting(true)
    try {
      // Demo modu için mock işlem
      if (userData.address.includes('Demo')) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // 2 saniye bekle
        
        showError(
          t('modals.nftMintedDemo'),
          `${t('modals.nftMintedSuccess')}\n\nToken ID: DEMO-${Date.now()}\nAddress: ${userData.address}\n\nNote: No real blockchain transaction was made in demo mode.`,
          'info'
        )
        
        // Formu temizle
        setFormData({
          name: '',
          description: '',
          imageUri: ''
        })
        
        // Vatandaşlık durumunu güncelle
        setCitizenshipStatus({
          hasCitizenship: true,
          tokenId: `DEMO-${Date.now()}`,
          metadata: {
            name: formData.name,
            description: formData.description,
            imageUri: formData.imageUri
          }
        })
        return
      }

      // Gerçek blockchain işlemi - şimdilik mock
      // Gerçek blockchain entegrasyonu için Stacks cüzdan bağlantısı kontrolü
      if (!window.StacksProvider) {
        showError(
          'Stacks Cüzdanı Gerekli',
          'Gerçek blockchain işlemi için Hiro Wallet veya Xverse gibi bir Stacks cüzdanı gereklidir.',
          'warning'
        )
        return
      }

      // Gerçek blockchain mint işlemi
      showError(
        'Blockchain İşlemi Başlatılıyor',
        'NFT mint işlemi blockchain üzerinde gerçekleştiriliyor. Lütfen cüzdanınızdan işlemi onaylayın.',
        'info'
      )

      // Contract call parametrelerini hazırla
      const contractCallParams = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'world-citizenship-nft',
        functionName: 'mint-citizenship',
        functionArgs: [
          formData.name,
          formData.description,
          formData.imageUri || 'https://via.placeholder.com/200x200/000000/FFFFFF?text=🌍'
        ],
        network: 'devnet',
        postConditionMode: 1,
        anchorMode: 3
      }

      // Blockchain işlemi başlat
      const response = await window.StacksProvider.request({
        method: 'stx_signTransaction',
        params: {
          ...contractCallParams,
          senderAddress: userData.address
        }
      })

      if (response && response.txId) {
        showError(
          'NFT Başarıyla Mint Edildi!',
          `Dünya Vatandaşlığı NFT'niz blockchain üzerinde oluşturuldu!\n\nTransaction ID: ${response.txId}\nAdres: ${userData.address}\n\nİşlem blockchain üzerinde onaylanması birkaç dakika sürebilir.`,
          'info'
        )
        
        // Formu temizle
        setFormData({
          name: '',
          description: '',
          imageUri: ''
        })
        
        // Citizenship status'u güncelle
        setCitizenshipStatus({
          hasCitizenship: true,
          tokenId: Date.now(),
          metadata: {
            name: formData.name,
            description: formData.description,
            imageUri: formData.imageUri || 'https://via.placeholder.com/200x200/000000/FFFFFF?text=🌍',
            attributes: [
              { key: 'Vatandaşlık Türü', value: 'Dünya Vatandaşı' },
              { key: 'Oluşturulma Tarihi', value: new Date().toLocaleDateString('tr-TR') },
              { key: 'Transaction ID', value: response.txId }
            ],
            citizenshipDate: Date.now(),
            citizenId: `WC-${Date.now()}`
          }
        })
      } else {
        throw new Error('Transaction failed or was cancelled')
      }
      
      // Formu temizle
      setFormData({
        name: '',
        description: '',
        imageUri: ''
      })
      
      // Vatandaşlık durumunu güncelle
      setCitizenshipStatus({
        hasCitizenship: true,
        tokenId: `DEMO-${Date.now()}`,
        metadata: {
          name: formData.name,
          description: formData.description,
          imageUri: formData.imageUri
        }
      })
    } catch (error) {
      console.error('NFT mint hatası:', error)
      showError(
        'Mint Hatası',
        `NFT mint edilirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}\n\nLütfen:\n• Cüzdanınızda yeterli STX olduğundan emin olun\n• Ağ bağlantınızı kontrol edin\n• Tekrar deneyin`,
        'error'
      )
    } finally {
      setIsMinting(false)
    }
  }

  if (citizenshipStatus?.hasCitizenship) {
    return (
      <div className="card max-w-lg mx-auto animate-fade-in">
        <div className="text-center">
          <div className="p-4 bg-green-100 rounded-2xl inline-block mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h3 className="text-3xl font-black text-gradient mb-4">
            {t('citizenshipForm.alreadyCitizen', 'home')}
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            {t('citizenshipForm.tokenIdLabel', 'home')}: <span className="font-bold">{citizenshipStatus.tokenId}</span>
          </p>
          <button className="btn-secondary">
            {t('citizenshipForm.viewNFTButton', 'home')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-lg mx-auto animate-slide-up">
      <h3 className="text-3xl font-black text-gradient mb-8 text-center">
        {t('citizenshipForm.title', 'home')}
      </h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">
            {t('citizenshipForm.nameLabel', 'home')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input-field"
            placeholder={t('citizenshipForm.namePlaceholder', 'home')}
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">
            {t('citizenshipForm.descriptionLabel', 'home')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="input-field"
            rows={4}
            placeholder={t('citizenshipForm.descriptionPlaceholder', 'home')}
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">
            {t('citizenshipForm.profileImageLabel', 'home')}
          </label>
          <input
            type="url"
            value={formData.imageUri}
            onChange={(e) => setFormData({...formData, imageUri: e.target.value})}
            className="input-field"
            placeholder={t('citizenshipForm.profileImagePlaceholder', 'home')}
          />
        </div>
        
        <button
          onClick={handleMint}
          disabled={isMinting}
          className="btn-primary w-full flex items-center justify-center space-x-3 py-4 text-lg"
        >
          {isMinting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{t('buttons.minting')}</span>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              <span>{t('citizenshipForm.createNFTButton', 'home')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
