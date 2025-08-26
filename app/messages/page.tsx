'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  MessageCircle, 
  Globe, 
  Send, 
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  User,
  Users,
  Circle,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react'
import { WalletHeader, WalletModal, useWallet } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'image' | 'file'
  reactions?: Array<{
    emoji: string
    users: string[]
  }>
}

interface Conversation {
  id: string
  type: 'direct' | 'group'
  name: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    isOnline: boolean
    lastSeen?: string
  }>
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  avatar?: string
}

export default function MessagesPage() {
  const { t } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewChat, setShowNewChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          type: 'direct',
          name: 'Dünya Gezgini',
          participants: [
            {
              id: 'user1',
              name: 'Dünya Gezgini',
              isOnline: true
            }
          ],
          lastMessage: {
            id: 'msg1',
            senderId: 'user1',
            senderName: 'Dünya Gezgini',
            content: 'Merhaba! DAO teklifin hakkında konuşmak istiyorum.',
            timestamp: '2024-03-15T14:30:00Z',
            isRead: false,
            type: 'text'
          },
          unreadCount: 2,
          isPinned: false,
          isMuted: false
        },
        {
          id: '2',
          type: 'group',
          name: 'DAO Yönetim Grubu',
          participants: [
            { id: 'user2', name: 'Blockchain Guru', isOnline: true },
            { id: 'user3', name: 'Topluluk Lideri', isOnline: false, lastSeen: '2024-03-15T12:00:00Z' },
            { id: 'user4', name: 'Teknik Uzman', isOnline: true }
          ],
          lastMessage: {
            id: 'msg2',
            senderId: 'user2',
            senderName: 'Blockchain Guru',
            content: 'Yeni voting sistemi için toplantı ayarlayalım.',
            timestamp: '2024-03-15T13:45:00Z',
            isRead: true,
            type: 'text'
          },
          unreadCount: 0,
          isPinned: true,
          isMuted: false,
          avatar: '👥'
        },
        {
          id: '3',
          type: 'direct',
          name: 'Etkinlik Organizatörü',
          participants: [
            {
              id: 'user5',
              name: 'Etkinlik Organizatörü',
              isOnline: false,
              lastSeen: '2024-03-15T10:30:00Z'
            }
          ],
          lastMessage: {
            id: 'msg3',
            senderId: 'user5',
            senderName: 'Etkinlik Organizatörü',
            content: 'Bu hafta sonu etkinlik için hazırlıklar nasıl gidiyor?',
            timestamp: '2024-03-14T16:20:00Z',
            isRead: true,
            type: 'text'
          },
          unreadCount: 0,
          isPinned: false,
          isMuted: false
        }
      ]

      setConversations(mockConversations)
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0])
      }
    } catch (error) {
      console.error('Konuşma yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'user1',
          senderName: 'Dünya Gezgini',
          content: 'Merhaba! DAO teklifin hakkında konuşmak istiyorum.',
          timestamp: '2024-03-15T14:30:00Z',
          isRead: true,
          type: 'text'
        },
        {
          id: '2',
          senderId: 'current-user',
          senderName: 'Sen',
          content: 'Merhaba! Tabii ki, hangi konuları konuşmak istiyorsun?',
          timestamp: '2024-03-15T14:32:00Z',
          isRead: true,
          type: 'text'
        },
        {
          id: '3',
          senderId: 'user1',
          senderName: 'Dünya Gezgini',
          content: 'Özellikle voting mekanizması ve topluluk katılımı konularında fikirlerini almak istiyorum.',
          timestamp: '2024-03-15T14:35:00Z',
          isRead: false,
          type: 'text'
        }
      ]

      setMessages(mockMessages)
    } catch (error) {
      console.error('Mesaj yükleme hatası:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'Sen',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update last message in conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id
        ? { ...conv, lastMessage: message }
        : conv
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('tr-TR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading', 'messages')}</p>
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
              <a href="/messages" className="nav-link text-black font-semibold">{t('nav.messages', 'common')}</a>
              <a href="/events" className="nav-link">{t('nav.events', 'common')}</a>
              <WalletHeader />
            </nav>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">{t('title', 'messages')}</h1>
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', 'messages')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                      {conversation.avatar || conversation.name.charAt(0).toUpperCase()}
                    </div>
                    {conversation.type === 'direct' && conversation.participants[0]?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-1">
                        {conversation.isPinned && (
                          <span className="text-gray-400">📌</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || t('noMessages', 'messages')}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                      {activeConversation.avatar || activeConversation.name.charAt(0).toUpperCase()}
                    </div>
                    {activeConversation.type === 'direct' && activeConversation.participants[0]?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeConversation.name}</h2>
                    <p className="text-sm text-gray-500">
                      {activeConversation.type === 'direct' 
                        ? activeConversation.participants[0]?.isOnline 
                          ? t('online', 'messages') 
                          : `${t('lastSeen', 'messages')} ${activeConversation.participants[0]?.lastSeen ? formatTime(activeConversation.participants[0].lastSeen) : t('unknown', 'messages')}`
                        : `${activeConversation.participants.length} ${t('members', 'messages')}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.senderId !== 'current-user' && activeConversation.type === 'group' && (
                        <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.senderId === 'current-user' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === 'current-user' && (
                          <span className="text-gray-300">
                            {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('messageInput', 'messages')}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      newMessage.trim()
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title', 'messages')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('empty.subtitle', 'messages')}
                </p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="btn-primary"
                >
                  {t('empty.startChat', 'messages')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('newChat.title', 'messages')}</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t('newChat.searchPlaceholder', 'messages')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {/* Mock users */}
                {['Blockchain Guru', 'Topluluk Lideri', 'Teknik Uzman', 'Yeni Vatandaş'].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-900">{user}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 btn-secondary"
              >
                {t('newChat.cancel', 'messages')}
              </button>
              <button
                onClick={() => setShowNewChat(false)}
                className="flex-1 btn-primary"
              >
                {t('newChat.start', 'messages')}
              </button>
            </div>
          </div>
        </div>
      )}

      <WalletModal />
    </div>
  )
}
