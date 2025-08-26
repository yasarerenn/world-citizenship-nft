'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Globe, 
  Calendar, 
  Award, 
  MessageCircle, 
  Share2, 
  Edit3,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Trophy,
  Star,
  Users,
  Activity
} from 'lucide-react'
import { WalletHeader, WalletModal, useWallet } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

interface UserProfile {
  address: string
  displayName: string
  bio: string
  joinDate: string
  citizenshipDate?: string
  tokenId?: number
  socialLinks: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  stats: {
    proposalsCreated: number
    votesCount: number
    communityScore: number
    badgesCount: number
  }
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedDate: string
  }>
  recentActivity: Array<{
    id: string
    type: 'proposal' | 'vote' | 'comment' | 'badge'
    title: string
    date: string
    description: string
  }>
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    twitter: '',
    linkedin: '',
    github: '',
    website: ''
  })

  useEffect(() => {
    // Kullanıcı verilerini yükle
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      // Mock profil verisi - gerçek uygulamada API'den gelecek
      const mockProfile: UserProfile = {
        address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        displayName: 'Dünya Vatandaşı',
        bio: 'Evrensel barış ve adalet için çalışan bir dünya vatandaşı. Blockchain teknolojisi ile daha iyi bir gelecek inşa ediyorum.',
        joinDate: '2024-01-15',
        citizenshipDate: '2024-01-20',
        tokenId: 1,
        socialLinks: {
          twitter: 'worldcitizen',
          linkedin: 'world-citizen',
          website: 'https://worldcitizen.example'
        },
        stats: {
          proposalsCreated: 5,
          votesCount: 23,
          communityScore: 850,
          badgesCount: 7
        },
        badges: [
          {
            id: 'founder',
            name: 'Kurucu Vatandaş',
            description: 'İlk 100 vatandaş arasında',
            icon: '🏆',
            earnedDate: '2024-01-20'
          },
          {
            id: 'active-voter',
            name: 'Aktif Oylayıcı',
            description: '20+ teklif için oy kullandı',
            icon: '🗳️',
            earnedDate: '2024-02-15'
          },
          {
            id: 'proposal-creator',
            name: 'Teklif Yaratıcısı',
            description: '5+ teklif oluşturdu',
            icon: '💡',
            earnedDate: '2024-03-01'
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'proposal',
            title: 'Yeni Eğitim Programı Önerisi',
            date: '2024-03-15',
            description: 'Dünya vatandaşları için blockchain eğitim programı önerdi'
          },
          {
            id: '2',
            type: 'vote',
            title: 'Çevre Koruma Projesi',
            date: '2024-03-14',
            description: 'Çevre koruma projesine evet oyu verdi'
          },
          {
            id: '3',
            type: 'badge',
            title: 'Teklif Yaratıcısı',
            date: '2024-03-01',
            description: 'Yeni rozet kazandı'
          }
        ]
      }

      setProfile(mockProfile)
      setEditForm({
        displayName: mockProfile.displayName,
        bio: mockProfile.bio,
        twitter: mockProfile.socialLinks.twitter || '',
        linkedin: mockProfile.socialLinks.linkedin || '',
        github: mockProfile.socialLinks.github || '',
        website: mockProfile.socialLinks.website || ''
      })
    } catch (error) {
      console.error('Profil yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      // Profil güncelleme işlemi - gerçek uygulamada API çağrısı
      if (profile) {
        const updatedProfile = {
          ...profile,
          displayName: editForm.displayName,
          bio: editForm.bio,
          socialLinks: {
            twitter: editForm.twitter,
            linkedin: editForm.linkedin,
            github: editForm.github,
            website: editForm.website
          }
        }
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal': return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'vote': return <Award className="w-4 h-4 text-green-500" />
      case 'badge': return <Trophy className="w-4 h-4 text-yellow-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading', 'profile')}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{t('notFound', 'profile')}</p>
          <Link href="/" className="btn-primary">
            {t('backToHome', 'profile')}
          </Link>
        </div>
      </div>
    )
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
                Dünya Vatandaşlığı NFT
              </h1>
            </div>
            
            <nav className="flex items-center space-x-1">
              <a href="/" className="nav-link">{t('nav.home', 'common')}</a>
              <a href="/dao" className="nav-link">{t('nav.dao', 'common')}</a>
              <a href="/community" className="nav-link">{t('nav.community', 'common')}</a>
              <a href="/profile" className="nav-link text-black font-semibold">{t('nav.profile', 'common')}</a>
              <a href="/messages" className="nav-link">{t('nav.messages', 'common')}</a>
              <a href="/events" className="nav-link">{t('nav.events', 'common')}</a>
              <WalletHeader />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Panel - Profil Bilgileri */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              {/* Profil Fotoğrafı ve Temel Bilgiler */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                      className="input-field text-center text-lg font-semibold"
                      placeholder={t('edit.displayNamePlaceholder', 'profile')}
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="input-field text-center"
                      rows={3}
                      placeholder={t('edit.bioPlaceholder', 'profile')}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>
                    <p className="text-gray-600 text-sm mb-4">{profile.bio}</p>
                  </>
                )}

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{t('joined', 'profile')} {new Date(profile.joinDate).toLocaleDateString('tr-TR')}</span>
                </div>

                {profile.citizenshipDate && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('citizenship.title', 'profile')}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {t('citizenship.tokenId', 'profile')} #{profile.tokenId}
                    </p>
                  </div>
                )}
              </div>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.proposalsCreated}</div>
                  <div className="text-xs text-gray-600">{t('stats.proposals', 'profile')}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.votesCount}</div>
                  <div className="text-xs text-gray-600">{t('stats.votes', 'profile')}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.communityScore}</div>
                  <div className="text-xs text-gray-600">{t('stats.score', 'profile')}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.badgesCount}</div>
                  <div className="text-xs text-gray-600">{t('stats.badges', 'profile')}</div>
                </div>
              </div>

              {/* Sosyal Linkler */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('socialLinks.title', 'profile')}</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.twitter}
                      onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                      className="input-field text-sm"
                      placeholder={t('edit.twitterPlaceholder', 'profile')}
                    />
                    <input
                      type="text"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                      className="input-field text-sm"
                      placeholder={t('edit.linkedinPlaceholder', 'profile')}
                    />
                    <input
                      type="text"
                      value={editForm.github}
                      onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                      className="input-field text-sm"
                      placeholder={t('edit.githubPlaceholder', 'profile')}
                    />
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="input-field text-sm"
                      placeholder={t('edit.websitePlaceholder', 'profile')}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${profile.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Twitter className="w-3 h-3" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a
                        href={`https://github.com/${profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full hover:bg-green-100 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Düzenleme Butonları */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      {t('edit.save', 'profile')}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      {t('edit.cancel', 'profile')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      {t('edit.edit', 'profile')}
                    </button>
                    <button className="flex-1 btn-primary text-sm py-2">
                      <Share2 className="w-4 h-4 mr-1" />
                      {t('edit.share', 'profile')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Rozetler ve Aktiviteler */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rozetler */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                {t('badges.title', 'profile')} ({profile.badges.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.badges.map((badge) => (
                  <div key={badge.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{new Date(badge.earnedDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Son Aktiviteler */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                {t('recentActivity.title', 'profile')}
              </h2>
              <div className="space-y-4">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(activity.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WalletModal />
    </div>
  )
}
