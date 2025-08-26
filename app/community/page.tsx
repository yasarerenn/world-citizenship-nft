'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Search,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  User,
  Award,
  TrendingUp,
  Bell,
  Star
} from 'lucide-react'
import { WalletHeader, WalletModal } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

interface CommunityPost {
  id: string
  author: {
    address: string
    displayName: string
    avatar?: string
    badges: string[]
  }
  title: string
  content: string
  category: 'general' | 'proposal' | 'event' | 'help' | 'showcase'
  createdAt: string
  likes: number
  comments: number
  views: number
  isLiked: boolean
  isPinned: boolean
  tags: string[]
}

interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: 'online' | 'offline' | 'hybrid'
  attendees: number
  maxAttendees?: number
  organizer: string
}

export default function CommunityPage() {
  const { t } = useLanguage()
  
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'members'>('feed')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    setIsLoading(true)
    try {
      // Mock veri - gerçek uygulamada API'den gelecek
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          author: {
            address: 'ST1ABC...',
            displayName: 'Dünya Gezgini',
            badges: ['founder', 'active-voter']
          },
          title: 'Dünya Vatandaşlığı Vizyonumuz Hakkında',
          content: 'Merhaba arkadaşlar! Dünya vatandaşlığı projemizin vizyonu hakkında düşüncelerinizi paylaşmak istiyorum. Bu projeyle sadece bir NFT koleksiyonu değil, gerçek bir küresel topluluk oluşturmayı hedefliyoruz...',
          category: 'general',
          createdAt: '2024-03-15T10:30:00Z',
          likes: 24,
          comments: 8,
          views: 156,
          isLiked: false,
          isPinned: true,
          tags: ['vizyon', 'topluluk', 'gelecek']
        },
        {
          id: '2',
          author: {
            address: 'ST2DEF...',
            displayName: 'Blockchain Guru',
            badges: ['tech-expert']
          },
          title: 'DAO Voting Sistemi Teknik İncelemesi',
          content: 'Yeni voting sistemimizin teknik detaylarını inceledim. Özellikle gas optimizasyonu ve güvenlik açısından çok başarılı buldum. Detaylı analiz için blog yazımı okuyabilirsiniz...',
          category: 'proposal',
          createdAt: '2024-03-14T15:45:00Z',
          likes: 18,
          comments: 12,
          views: 89,
          isLiked: true,
          isPinned: false,
          tags: ['teknik', 'dao', 'analiz']
        },
        {
          id: '3',
          author: {
            address: 'ST3GHI...',
            displayName: 'Etkinlik Organizatörü',
            badges: ['event-organizer']
          },
          title: 'Bu Hafta Sonu: Dünya Vatandaşları Buluşması',
          content: 'Bu hafta sonu online buluşmamızda neler konuşacağız? Gündem: 1) Yeni özellikler 2) Topluluk önerileri 3) Q&A oturumu. Katılım için link yorumlarda!',
          category: 'event',
          createdAt: '2024-03-13T09:15:00Z',
          likes: 31,
          comments: 15,
          views: 203,
          isLiked: false,
          isPinned: false,
          tags: ['etkinlik', 'buluşma', 'online']
        }
      ]

      const mockEvents: CommunityEvent[] = [
        {
          id: '1',
          title: 'Dünya Vatandaşları Haftalık Buluşması',
          description: 'Haftalık topluluk buluşmamızda projemizin geleceğini konuşacağız.',
          date: '2024-03-20',
          time: '20:00',
          type: 'online',
          attendees: 45,
          maxAttendees: 100,
          organizer: 'Etkinlik Organizatörü'
        },
        {
          id: '2',
          title: 'Blockchain ve Sosyal Etki Workshop\'u',
          description: 'Blockchain teknolojisinin sosyal etkileri üzerine interaktif workshop.',
          date: '2024-03-25',
          time: '19:00',
          type: 'hybrid',
          attendees: 28,
          maxAttendees: 50,
          organizer: 'Blockchain Guru'
        }
      ]

      setPosts(mockPosts)
      setEvents(mockEvents)
    } catch (error) {
      console.error('Topluluk verisi yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'proposal': return 'bg-purple-100 text-purple-800'
      case 'event': return 'bg-green-100 text-green-800'
      case 'help': return 'bg-yellow-100 text-yellow-800'
      case 'showcase': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'general': return t('filters.general', 'community')
      case 'proposal': return t('filters.proposal', 'community')
      case 'event': return t('filters.event', 'community')
      case 'help': return t('filters.help', 'community')
      case 'showcase': return t('filters.showcase', 'community')
      default: return category
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('post.loading', 'community')}</p>
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
              <a href="/community" className="nav-link text-black font-semibold">{t('nav.community', 'common')}</a>
              <a href="/profile" className="nav-link">{t('nav.profile', 'common')}</a>
              <a href="/messages" className="nav-link">{t('nav.messages', 'common')}</a>
              <a href="/events" className="nav-link">{t('nav.events', 'common')}</a>
              <WalletHeader />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Sayfa Başlığı */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title', 'community')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle', 'community')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              {t('tabs.feed', 'community')}
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2 inline" />
              {t('tabs.events', 'community')}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'members'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 mr-2 inline" />
              {t('tabs.members', 'community')}
            </button>
          </div>
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sol Sidebar - Filtreler */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">{t('filters.title', 'community')}</h3>
                
                {/* Arama */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('filters.search', 'community')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Kategori Filtresi */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filters.category', 'community')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">{t('filters.all', 'community')}</option>
                    <option value="general">{t('filters.general', 'community')}</option>
                    <option value="proposal">{t('filters.proposal', 'community')}</option>
                    <option value="event">{t('filters.event', 'community')}</option>
                    <option value="help">{t('filters.help', 'community')}</option>
                    <option value="showcase">{t('filters.showcase', 'community')}</option>
                  </select>
                </div>

                {/* Yeni Gönderi Butonu */}
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('filters.newPost', 'community')}
                </button>
              </div>
            </div>

            {/* Ana İçerik */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="card p-6">
                    {/* Gönderi Başlığı */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {post.author.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{post.author.displayName}</h3>
                            {post.author.badges.includes('founder') && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                🏆 {t('post.founder', 'community')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span>•</span>
                            <Eye className="w-3 h-3" />
                            <span>{post.views} {t('post.views', 'community')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                          {getCategoryName(post.category)}
                        </span>
                        {post.isPinned && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            📌 {t('post.pinned', 'community')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Gönderi İçeriği */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                    {/* Etiketler */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Etkileşim Butonları */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                            post.isLiked
                              ? 'bg-red-50 text-red-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{t('post.share', 'community')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'online' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'offline' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type === 'online' ? `💻 ${t('events.online', 'community')}` : 
                       event.type === 'offline' ? `📍 ${t('events.offline', 'community')}` : `🔄 ${t('events.hybrid', 'community')}`}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.attendees} {t('events.attendees', 'community')} {event.maxAttendees && `/ ${event.maxAttendees}`}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{t('events.organizer', 'community')} {event.organizer}</span>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary">
                    {t('events.joinEvent', 'community')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('members.title', 'community')}</h3>
            <p className="text-gray-600 mb-6">
              {t('members.subtitle', 'community')}
            </p>
            <Link href="/profile" className="btn-primary">
              {t('members.viewProfile', 'community')}
            </Link>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('createPost.title', 'community')}</h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('createPost.titlePlaceholder', 'community')}
                  className="input-field"
                />
                <textarea
                  placeholder={t('createPost.contentPlaceholder', 'community')}
                  rows={6}
                  className="input-field"
                />
                <select className="input-field">
                  <option value="general">{t('filters.general', 'community')}</option>
                  <option value="proposal">{t('filters.proposal', 'community')}</option>
                  <option value="event">{t('filters.event', 'community')}</option>
                  <option value="help">{t('filters.help', 'community')}</option>
                  <option value="showcase">{t('filters.showcase', 'community')}</option>
                </select>
                <input
                  type="text"
                  placeholder={t('createPost.tagsPlaceholder', 'community')}
                  className="input-field"
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 btn-secondary"
                >
                  {t('createPost.cancel', 'community')}
                </button>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 btn-primary"
                >
                  {t('createPost.submit', 'community')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <WalletModal />
    </div>
  )
}
