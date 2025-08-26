'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Globe, 
  Clock, 
  MapPin, 
  Users, 
  Plus,
  Search,
  Filter,
  Bell,
  BellRing,
  Video,
  Mic,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  User,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { WalletHeader, WalletModal, useWallet } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

interface Event {
  id: string
  title: string
  description: string
  organizer: {
    address: string
    displayName: string
    avatar?: string
    verified: boolean
  }
  date: string
  time: string
  endTime?: string
  timezone: string
  type: 'online' | 'offline' | 'hybrid'
  location?: string
  meetingUrl?: string
  category: 'education' | 'governance' | 'social' | 'technical' | 'community'
  attendees: number
  maxAttendees?: number
  price: number // 0 for free
  tags: string[]
  image?: string
  isAttending: boolean
  isBookmarked: boolean
  requiresApproval: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface Announcement {
  id: string
  title: string
  content: string
  author: {
    address: string
    displayName: string
    role: string
  }
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  expiresAt?: string
  tags: string[]
  isRead: boolean
  isPinned: boolean
  attachments?: Array<{
    name: string
    url: string
    type: string
  }>
}

export default function EventsPage() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    loadEventsAndAnnouncements()
  }, [])

  const loadEventsAndAnnouncements = async () => {
    setIsLoading(true)
    try {
      // Mock events data
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Dünya Vatandaşları Haftalık Buluşması',
          description: 'Haftalık topluluk buluşmamızda yeni özellikler, teklif güncellemeleri ve Q&A oturumu yapacağız. Tüm dünya vatandaşları davetlidir!',
          organizer: {
            address: 'ST1ABC...',
            displayName: 'Etkinlik Organizatörü',
            verified: true
          },
          date: '2024-03-20',
          time: '20:00',
          endTime: '21:30',
          timezone: 'Europe/Istanbul',
          type: 'online',
          meetingUrl: 'https://meet.worldcitizen.org/weekly',
          category: 'community',
          attendees: 45,
          maxAttendees: 100,
          price: 0,
          tags: ['topluluk', 'haftalık', 'q&a'],
          isAttending: true,
          isBookmarked: false,
          requiresApproval: false,
          status: 'upcoming'
        },
        {
          id: '2',
          title: 'Blockchain ve Sosyal Etki Workshop\'u',
          description: 'Blockchain teknolojisinin sosyal etkileri üzerine interaktif workshop. Uzmanlardan öğrenin, projelerinizi paylaşın.',
          organizer: {
            address: 'ST2DEF...',
            displayName: 'Blockchain Guru',
            verified: true
          },
          date: '2024-03-25',
          time: '19:00',
          endTime: '22:00',
          timezone: 'Europe/Istanbul',
          type: 'hybrid',
          location: 'İstanbul Blockchain Hub',
          meetingUrl: 'https://meet.worldcitizen.org/blockchain-workshop',
          category: 'technical',
          attendees: 28,
          maxAttendees: 50,
          price: 0,
          tags: ['blockchain', 'workshop', 'sosyal-etki'],
          isAttending: false,
          isBookmarked: true,
          requiresApproval: true,
          status: 'upcoming'
        },
        {
          id: '3',
          title: 'DAO Yönetişimi Eğitimi',
          description: 'Decentralized Autonomous Organization (DAO) yönetişimi hakkında kapsamlı eğitim. Oy verme, teklif oluşturma ve topluluk yönetimi.',
          organizer: {
            address: 'ST3GHI...',
            displayName: 'DAO Uzmanı',
            verified: true
          },
          date: '2024-03-30',
          time: '18:00',
          endTime: '20:00',
          timezone: 'Europe/Istanbul',
          type: 'online',
          meetingUrl: 'https://meet.worldcitizen.org/dao-education',
          category: 'education',
          attendees: 67,
          maxAttendees: 200,
          price: 0,
          tags: ['dao', 'eğitim', 'yönetişim'],
          isAttending: false,
          isBookmarked: false,
          requiresApproval: false,
          status: 'upcoming'
        }
      ]

      // Mock announcements data
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Yeni DAO Voting Sistemi Aktif!',
          content: 'Dünya Vatandaşlığı DAO\'su için yeni voting sistemi artık aktif. Gelişmiş özellikler: çoklu seçim, zamanlı oylamalar ve otomatik bildirimler. Hemen deneyin!',
          author: {
            address: 'ST1ABC...',
            displayName: 'Sistem Yöneticisi',
            role: 'Admin'
          },
          type: 'success',
          priority: 'high',
          createdAt: '2024-03-15T09:00:00Z',
          tags: ['dao', 'voting', 'güncelleme'],
          isRead: false,
          isPinned: true
        },
        {
          id: '2',
          title: 'Güvenlik Güncellemesi - Cüzdan Bağlantısı',
          content: 'Güvenlik iyileştirmeleri için cüzdan bağlantı protokolü güncellendi. Lütfen cüzdanınızı yeniden bağlayın. Detaylar için dokümantasyonu inceleyin.',
          author: {
            address: 'ST2DEF...',
            displayName: 'Güvenlik Ekibi',
            role: 'Security'
          },
          type: 'warning',
          priority: 'urgent',
          createdAt: '2024-03-14T16:30:00Z',
          expiresAt: '2024-03-21T16:30:00Z',
          tags: ['güvenlik', 'cüzdan', 'güncelleme'],
          isRead: true,
          isPinned: true
        },
        {
          id: '3',
          title: 'Topluluk Rozetleri Sistemi Başladı!',
          content: 'Artık aktivitelerinizle rozet kazanabilirsiniz! Oy verme, teklif oluşturma, topluluk katılımı ve daha fazlası için özel rozetler. Profilinizi kontrol edin.',
          author: {
            address: 'ST3GHI...',
            displayName: 'Topluluk Yöneticisi',
            role: 'Community'
          },
          type: 'info',
          priority: 'medium',
          createdAt: '2024-03-13T12:00:00Z',
          tags: ['rozet', 'gamification', 'topluluk'],
          isRead: false,
          isPinned: false
        }
      ]

      setEvents(mockEvents)
      setAnnouncements(mockAnnouncements)
    } catch (error) {
      console.error('Etkinlik ve duyuru yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttendEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isAttending: !event.isAttending,
            attendees: event.isAttending ? event.attendees - 1 : event.attendees + 1
          }
        : event
    ))
  }

  const handleBookmarkEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ))
  }

  const markAnnouncementAsRead = (announcementId: string) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === announcementId 
        ? { ...announcement, isRead: true }
        : announcement
    ))
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="w-4 h-4" />
      case 'offline': return <MapPin className="w-4 h-4" />
      case 'hybrid': return <Globe className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return t('eventTypes.online', 'events')
      case 'offline': return t('eventTypes.offline', 'events')
      case 'hybrid': return t('eventTypes.hybrid', 'events')
      default: return type
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return 'bg-blue-100 text-blue-800'
      case 'governance': return 'bg-purple-100 text-purple-800'
      case 'social': return 'bg-green-100 text-green-800'
      case 'technical': return 'bg-orange-100 text-orange-800'
      case 'community': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'education': return t('filters.education', 'events')
      case 'governance': return t('filters.governance', 'events')
      case 'social': return t('filters.social', 'events')
      case 'technical': return t('filters.technical', 'events')
      case 'community': return t('filters.community', 'events')
      default: return category
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-orange-500 bg-orange-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      default: return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatDateTime = (date: string, time: string, timezone: string) => {
    const eventDate = new Date(`${date}T${time}:00`)
    const locale = t('locale', 'common') === 'Turkish' ? 'tr-TR' : 'en-US'
    return {
      date: eventDate.toLocaleDateString(locale, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: eventDate.toLocaleTimeString(locale, { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const unreadAnnouncements = announcements.filter(a => !a.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading', 'events')}</p>
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
              <a href="/profile" className="nav-link">{t('nav.profile', 'common')}</a>
              <a href="/messages" className="nav-link">{t('nav.messages', 'common')}</a>
              <a href="/events" className="nav-link text-black font-semibold">{t('nav.events', 'common')}</a>
              <WalletHeader />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title', 'events')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle', 'events')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2 inline" />
              {t('tabs.events', 'events')}
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`relative px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'announcements'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="w-4 h-4 mr-2 inline" />
              {t('tabs.announcements', 'events')}
              {unreadAnnouncements > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadAnnouncements}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">{t('filters.title', 'events')}</h3>
                
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('filters.search', 'events')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filters.category', 'events')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">{t('filters.all', 'events')}</option>
                    <option value="education">{t('filters.education', 'events')}</option>
                    <option value="governance">{t('filters.governance', 'events')}</option>
                    <option value="social">{t('filters.social', 'events')}</option>
                    <option value="technical">{t('filters.technical', 'events')}</option>
                    <option value="community">{t('filters.community', 'events')}</option>
                  </select>
                </div>

                {/* Notification Settings */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{t('filters.notifications', 'events')}</span>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications ? 'bg-black' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('events.upcoming', 'events')} ({filteredEvents.length})
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('events.create', 'events')}</span>
                </button>
              </div>

              <div className="space-y-6">
                {filteredEvents.map((event) => {
                  const dateTime = formatDateTime(event.date, event.time, event.timezone)
                  
                  return (
                    <div key={event.id} className="card p-6">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                              {getCategoryName(event.category)}
                            </span>
                            <span className="flex items-center space-x-1 text-xs text-gray-500">
                              {getEventTypeIcon(event.type)}
                              <span>{getEventTypeLabel(event.type)}</span>
                            </span>
                            {event.price === 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {t('events.free', 'events')}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">{event.description}</p>
                        </div>
                        
                        <button
                          onClick={() => handleBookmarkEvent(event.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            event.isBookmarked ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${event.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{dateTime.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {dateTime.time}
                            {event.endTime && ` - ${event.endTime}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {event.attendees} {t('events.participants', 'events')}
                            {event.maxAttendees && ` / ${event.maxAttendees}`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{event.organizer.displayName}</span>
                          {event.organizer.verified && (
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>

                      {/* Location/Meeting URL */}
                      {(event.location || event.meetingUrl) && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          {event.location && (
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                          {event.meetingUrl && (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <Video className="w-4 h-4" />
                              <a 
                                href={event.meetingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                              >
                                {t('events.joinMeeting', 'events')}
                                <ExternalLink className="w-3 h-3 ml-1 inline" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAttendEvent(event.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              event.isAttending
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                          >
                            {event.isAttending ? t('events.attending', 'events') : t('events.join', 'events')}
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Share2 className="w-4 h-4 mr-1 inline" />
                            {t('events.share', 'events')}
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {event.requiresApproval && (
                            <span className="text-yellow-600">{t('events.approvalRequired', 'events')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('announcements.title', 'events')} ({announcements.length})
              </h2>
              {unreadAnnouncements > 0 && (
                <button
                  onClick={() => {
                    setAnnouncements(announcements.map(a => ({ ...a, isRead: true })))
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {t('announcements.markAllRead', 'events')}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`card p-6 border-l-4 ${getPriorityColor(announcement.priority)} ${
                    !announcement.isRead ? 'ring-2 ring-blue-100' : ''
                  }`}
                  onClick={() => markAnnouncementAsRead(announcement.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getAnnouncementIcon(announcement.type)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {announcement.title}
                          {!announcement.isRead && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{announcement.author.displayName}</span>
                          <span>•</span>
                          <span>{announcement.author.role}</span>
                          <span>•</span>
                          <span>{new Date(announcement.createdAt).toLocaleDateString(t('locale', 'common') === 'Turkish' ? 'tr-TR' : 'en-US')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {announcement.isPinned && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          📌 {t('announcements.pinned', 'events')}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {announcement.priority === 'urgent' ? t('announcements.priorities.urgent', 'events') :
                         announcement.priority === 'high' ? t('announcements.priorities.high', 'events') :
                         announcement.priority === 'medium' ? t('announcements.priorities.medium', 'events') : t('announcements.priorities.low', 'events')}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {announcement.content}
                  </p>

                  {announcement.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {announcement.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {announcement.expiresAt && (
                    <div className="text-sm text-gray-500 border-t pt-3">
                      {t('announcements.expiresAt', 'events')} {new Date(announcement.expiresAt).toLocaleDateString(t('locale', 'common') === 'Turkish' ? 'tr-TR' : 'en-US')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('createModal.title', 'events')}</h2>
            
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('createModal.comingSoon', 'events')}</h3>
              <p className="text-gray-600 mb-6">
                {t('createModal.description', 'events')}
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-primary"
              >
                {t('createModal.ok', 'events')}
              </button>
            </div>
          </div>
        </div>
      )}

      <WalletModal />
    </div>
  )
}
