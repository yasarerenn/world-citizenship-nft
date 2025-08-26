'use client'

import { useState, useEffect } from 'react'
import { 
  Vote, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings,
  Home,
  ArrowLeft,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  X,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Send,
  Heart,
  Share2,
  Flag,
  MoreHorizontal,
  Globe,
  Wallet
} from 'lucide-react'
import { 
  makeContractCall, 
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  PostConditionMode
} from '@stacks/transactions'
import { network } from '@/lib/stacks'
import CommentsModal from '@/components/CommentsModal'
import { WalletHeader, WalletModal } from '@/components/WalletManager'
import { useLanguage } from '@/contexts/LanguageContext'

interface Proposal {
  id: number
  creator: string
  title: string
  description: string
  proposalType: string
  options: string[]
  startBlock: number
  endBlock: number
  fee: number
  active: boolean
  executed: boolean
  commentsCount: number
  likesCount: number
  isLiked: boolean
}

interface Comment {
  id: string
  proposalId: number
  author: {
    address: string
    displayName: string
    avatar?: string
    badges: string[]
  }
  content: string
  createdAt: string
  likesCount: number
  isLiked: boolean
  replies: Reply[]
  isEdited: boolean
}

interface Reply {
  id: string
  commentId: string
  author: {
    address: string
    displayName: string
    avatar?: string
  }
  content: string
  createdAt: string
  likesCount: number
  isLiked: boolean
}

interface Vote {
  voter: string
  choice: string
}

export default function DAOPage() {
  const { t } = useLanguage()
  
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'create'>('active')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedProposalForComments, setSelectedProposalForComments] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState('')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [daoParams, setDaoParams] = useState({
    defaultDuration: 259200, // 3 gün
    minProposalFee: 1000000, // 1 STX
    quorumPercentage: 20
  })

  // Blockchain entegrasyonu için state'ler
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

  // Filtreleme ve sıralama state'leri
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'fee' | 'creator'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<'all' | 'yes-no' | 'multiple-choice' | 'numeric'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const showError = (title: string, message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setErrorModal({
      show: true,
      title,
      message,
      type
    })
  }

  // Mock data - gerçek uygulamada blockchain'den gelecek
  useEffect(() => {
    setProposals([
      {
        id: 1,
        creator: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        title: "Küresel Eğitim Fonu Oluşturulması",
        description: "Dünya vatandaşları için ücretsiz online eğitim platformu kurulması için 1 milyon STX fon ayrılması",
        proposalType: "yes-no",
        options: ["Evet", "Hayır"],
        startBlock: 1000,
        endBlock: 1000 + 259200,
        fee: 1000000,
        active: true,
        executed: false,
        commentsCount: 12,
        likesCount: 45,
        isLiked: false
      },
      {
        id: 2,
        creator: "ST2CY5V39NHDPWSXMW3Q3TCVEM9N2T3W5N6K8G5WS",
        title: "Çevre Koruma Projesi Bütçesi",
        description: "Küresel çevre koruma projeleri için ayrılacak bütçe miktarı",
        proposalType: "numeric",
        options: ["5 milyon STX", "10 milyon STX", "15 milyon STX"],
        startBlock: 2000,
        endBlock: 2000 + 259200,
        fee: 1500000,
        active: true,
        executed: false,
        commentsCount: 8,
        likesCount: 32,
        isLiked: true
      },
      {
        id: 3,
        creator: "ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0",
        title: "Yeni DAO Yönetim Kurulu Üyeleri",
        description: "Dünya vatandaşlığı DAO'su için yeni yönetim kurulu üyelerinin seçimi",
        proposalType: "multiple-choice",
        options: ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson"],
        startBlock: 3000,
        endBlock: 3000 + 259200,
        fee: 2000000,
        active: false,
        executed: true,
        commentsCount: 24,
        likesCount: 67,
        isLiked: false
      }
    ])
  }, [])

  const activeProposals = proposals.filter(p => p.active && !p.executed)
  const completedProposals = proposals.filter(p => !p.active || p.executed)

  // Filtreleme ve sıralama fonksiyonları
  const filterAndSortProposals = (proposalList: Proposal[]) => {
    let filtered = proposalList

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(proposal =>
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.creator.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Tip filtresi
    if (filterType !== 'all') {
      filtered = filtered.filter(proposal => proposal.proposalType === filterType)
    }

    // Sıralama
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'fee':
          aValue = a.fee
          bValue = b.fee
          break
        case 'creator':
          aValue = a.creator.toLowerCase()
          bValue = b.creator.toLowerCase()
          break
        case 'date':
        default:
          aValue = a.startBlock
          bValue = b.startBlock
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const getTimeRemaining = (endBlock: number) => {
    const currentBlock = 5000 // Mock current block
    const remainingBlocks = endBlock - currentBlock
    const remainingDays = Math.ceil(remainingBlocks / 86400) // 86400 blocks = 1 day
    if (remainingDays > 1) {
      return `${remainingDays} ${t('timeUnits.days', 'dao')}`
    } else if (remainingDays === 1) {
      return `${remainingDays} ${t('timeUnits.day', 'dao')}`
    } else {
      return t('proposalCard.expired', 'dao')
    }
  }

  const getSortLabel = (field: string) => {
    switch (field) {
      case 'date': return t('controls.sort.date', 'dao')
      case 'title': return t('controls.sort.title', 'dao')
      case 'fee': return t('controls.sort.fee', 'dao')
      case 'creator': return t('controls.sort.creator', 'dao')
      default: return field
    }
  }

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'all': return 'Tümü'
      case 'yes-no': return 'Evet/Hayır'
      case 'multiple-choice': return 'Çok Seçenekli'
      case 'numeric': return 'Sayısal'
      default: return type
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
              <a href="/" className="nav-link">{t('nav.home')}</a>
              <a href="/dao" className="nav-link text-black font-semibold">{t('nav.dao')}</a>
              <a href="/community" className="nav-link">{t('nav.community')}</a>
              <a href="/profile" className="nav-link">{t('nav.profile')}</a>
              <a href="/messages" className="nav-link">{t('nav.messages')}</a>
              <a href="/events" className="nav-link">{t('nav.events')}</a>
              <WalletHeader />
            </nav>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-all duration-300">
                  <Vote className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {activeProposals.length}
              </div>
              <div className="text-gray-300 text-lg font-medium">{t('stats.activeProposals', 'dao')}</div>
            </div>
            
            <div className="group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-all duration-300">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {completedProposals.length}
              </div>
              <div className="text-gray-300 text-lg font-medium">{t('stats.completed', 'dao')}</div>
            </div>
            
            <div className="group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-all duration-300">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                89%
              </div>
              <div className="text-gray-300 text-lg font-medium">{t('stats.participationRate', 'dao')}</div>
            </div>
            
            <div className="group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:bg-white/20 transition-all duration-300">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                1 STX
              </div>
              <div className="text-gray-300 text-lg font-medium">{t('stats.minProposalFee', 'dao')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Title and Create Button */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
                         <div>
               <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title', 'dao')}</h1>
               <p className="text-xl text-gray-600">
                 {t('subtitle', 'dao')}
               </p>
             </div>
             <button
               onClick={() => setShowCreateModal(true)}
               className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-3"
             >
               <Plus className="h-5 w-5" />
               <span>{t('createProposal', 'dao')}</span>
             </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'active' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {t('tabs.active', 'dao')} ({activeProposals.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'completed' 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {t('tabs.completed', 'dao')} ({completedProposals.length})
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search.placeholder', 'dao')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                  showFilters || filterType !== 'all' || searchTerm
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">{t('controls.filter', 'dao')}</span>
                {(filterType !== 'all' || searchTerm) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>

              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                >
                  <option value="date">{t('controls.sort.date', 'dao')}</option>
                  <option value="title">{t('controls.sort.title', 'dao')}</option>
                  <option value="fee">{t('controls.sort.fee', 'dao')}</option>
                  <option value="creator">{t('controls.sort.creator', 'dao')}</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300 bg-white"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-xl shadow-elegant border border-gray-100 animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('filterTypes.label', 'dao')}
                  </label>
                  <div className="space-y-2">
                    {['all', 'yes-no', 'multiple-choice', 'numeric'].map((type) => (
                      <label key={type} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="filterType"
                          value={type}
                          checked={filterType === type}
                          onChange={(e) => setFilterType(e.target.value as any)}
                          className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                        />
                        <span className="text-sm text-gray-700">{t(`filterTypes.${type}`, 'dao')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Durum
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black rounded"
                      />
                      <span className="text-sm text-gray-700">{t('status.active', 'dao')}</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black rounded"
                      />
                      <span className="text-sm text-gray-700">Tamamlanan</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ücret Aralığı
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black rounded"
                      />
                      <span className="text-sm text-gray-700">0-1 STX</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black rounded"
                      />
                      <span className="text-sm text-gray-700">1-5 STX</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black border-gray-300 focus:ring-black rounded"
                      />
                      <span className="text-sm text-gray-700">5+ STX</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hızlı Filtreler
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setFilterType('all')
                        setSearchTerm('')
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Tümünü Göster
                    </button>
                    <button
                      onClick={() => setFilterType('yes-no')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Sadece Evet/Hayır
                    </button>
                    <button
                      onClick={() => setFilterType('numeric')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      Sadece Sayısal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Proposals */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const currentProposals = activeTab === 'active' ? activeProposals : completedProposals
            const filteredProposals = filterAndSortProposals(currentProposals)
            
            return (
              <>
                {/* Results Summary */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {filteredProposals.length} {t('results.proposalsFound', 'dao')}
                    {(searchTerm || filterType !== 'all') && (
                      <span className="ml-2">
                        ({t('results.filtered', 'dao')} {currentProposals.length} {t('results.total', 'dao')})
                      </span>
                    )}
                  </div>
                  {filteredProposals.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {t('results.sortLabel', 'dao')} {getSortLabel(sortBy)} ({sortOrder === 'asc' ? t('results.ascending', 'dao') : t('results.descending', 'dao')})
                    </div>
                  )}
                </div>

                {/* Proposals Grid */}
                <div className="grid gap-8">
                  {filteredProposals.length > 0 ? (
                    filteredProposals.map((proposal) => (
                      <ProposalCard 
                        key={proposal.id} 
                        proposal={proposal} 
                        timeRemaining={getTimeRemaining(proposal.endBlock)}
                        setSelectedProposalForComments={setSelectedProposalForComments}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="p-6 bg-gray-50 rounded-2xl inline-block">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {t('noResults.title', 'dao')}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm 
                            ? `"${searchTerm}" ${t('noResults.searchMessage', 'dao')}`
                            : t('noResults.filterMessage', 'dao')
                          }
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('')
                            setFilterType('all')
                          }}
                          className="btn-secondary"
                        >
                          {t('noResults.clearFilters', 'dao')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      </section>

             {/* Create Proposal Modal */}
       {showCreateModal && (
         <CreateProposalModal 
           onClose={() => setShowCreateModal(false)}
           daoParams={daoParams}
           showError={showError}
         />
       )}

      {/* Error Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md mx-4 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-xl ${
                errorModal.type === 'error' ? 'bg-red-100 text-red-600' :
                errorModal.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {errorModal.type === 'error' ? (
                  <XCircle className="h-6 w-6" />
                ) : errorModal.type === 'warning' ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}
              </div>
              <h3 className="text-xl font-black text-gradient">
                {errorModal.title}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              {errorModal.message}
            </p>
            
            <button
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="w-full btn-primary"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {selectedProposalForComments && (
        <CommentsModal
          proposalId={selectedProposalForComments}
          onClose={() => setSelectedProposalForComments(null)}
          comments={comments}
          setComments={setComments}
          newComment={newComment}
          setNewComment={setNewComment}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newReply={newReply}
          setNewReply={setNewReply}
        />
      )}

      <WalletModal />
    </div>
  )
}

function ProposalCard({ 
  proposal, 
  timeRemaining, 
  setSelectedProposalForComments 
}: { 
  proposal: Proposal, 
  timeRemaining: string,
  setSelectedProposalForComments: (id: number) => void
}) {
  const { t } = useLanguage()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')

  const getProposalTypeIcon = (type: string) => {
    switch (type) {
      case 'yes-no': return <CheckCircle className="h-5 w-5" />
      case 'multiple-choice': return <Users className="h-5 w-5" />
      case 'numeric': return <TrendingUp className="h-5 w-5" />
      default: return <Vote className="h-5 w-5" />
    }
  }

  const getProposalTypeText = (type: string) => {
    switch (type) {
      case 'yes-no': return 'Evet/Hayır'
      case 'multiple-choice': return 'Çok Seçenekli'
      case 'numeric': return 'Sayısal'
      default: return type
    }
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-black rounded-xl text-white">
            {getProposalTypeIcon(proposal.proposalType)}
          </div>
          <div>
            <h3 className="text-2xl font-black text-gradient">{proposal.title}</h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {proposal.creator.slice(0, 6)}...{proposal.creator.slice(-4)}
              </span>
              <span className="flex items-center">
                <Vote className="h-4 w-4 mr-1" />
                {getProposalTypeText(proposal.proposalType)}
              </span>
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {proposal.fee / 1000000} STX
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            proposal.active 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {proposal.active ? t('status.active', 'dao') : t('status.completed', 'dao')}
          </div>
          {proposal.active && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {timeRemaining}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{proposal.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {proposal.options.map((option, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
            >
              {option}
            </span>
          ))}
        </div>
        
        {proposal.active && (
          <button
            onClick={() => setShowVoteModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Vote className="h-4 w-4" />
            <span>{t('proposalCard.vote', 'dao')}</span>
          </button>
        )}
      </div>

      {/* Sosyal Etkileşim Butonları */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            proposal.isLiked ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
          }`}>
            <Heart className={`w-4 h-4 ${proposal.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{proposal.likesCount}</span>
          </button>
          <button 
            onClick={() => setSelectedProposalForComments(proposal.id)}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{proposal.commentsCount}</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{t('proposalCard.share', 'dao')}</span>
          </button>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && (
        <VoteModal
          proposal={proposal}
          onClose={() => setShowVoteModal(false)}
          selectedOption={selectedOption}
          onOptionSelect={setSelectedOption}
        />
      )}
    </div>
  )
}

function VoteModal({ 
  proposal, 
  onClose, 
  selectedOption, 
  onOptionSelect 
}: { 
  proposal: Proposal
  onClose: () => void
  selectedOption: string
  onOptionSelect: (option: string) => void
}) {
  const handleVote = () => {
    if (!selectedOption) return
    // Burada blockchain'e oy gönderilecek
    console.log('Voting for:', selectedOption)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-md mx-4 animate-fade-in">
        <h3 className="text-2xl font-black text-gradient mb-6 text-center">
          Oy Kullan
        </h3>
        
        <p className="text-gray-600 mb-6 text-center">{proposal.title}</p>
        
        <div className="space-y-3 mb-8">
          {proposal.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionSelect(option)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedOption === option
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            İptal
          </button>
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Oy Ver
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateProposalModal({ 
  onClose, 
  daoParams,
  showError
}: { 
  onClose: () => void
  daoParams: any
  showError: (title: string, message: string, type?: 'error' | 'warning' | 'info') => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposalType: 'yes-no',
    options: ['Evet', 'Hayır'],
    duration: daoParams.defaultDuration,
    fee: daoParams.minProposalFee
  })

  const handleSubmit = async () => {
    try {
      // Form validasyonu
      if (!formData.title.trim() || !formData.description.trim()) {
        showError(
          'Eksik Bilgi',
          'Lütfen başlık ve açıklama alanlarını doldurun.',
          'warning'
        )
        return
      }

      if (formData.options.some(opt => !opt.trim())) {
        showError(
          'Eksik Seçenekler',
          'Lütfen tüm seçenek alanlarını doldurun.',
          'warning'
        )
        return
      }

      // Stacks cüzdan bağlantısı kontrolü
      if (!window.StacksProvider) {
        showError(
          'Stacks Cüzdanı Gerekli',
          'Gerçek blockchain işlemi için Hiro Wallet veya Xverse gibi bir Stacks cüzdanı gereklidir.',
          'warning'
        )
        return
      }

      // Gerçek blockchain işlemi
      showError(
        'DAO Teklifi Oluşturuluyor',
        'Teklif blockchain üzerinde oluşturuluyor. Lütfen cüzdanınızdan işlemi onaylayın.',
        'info'
      )

      // Contract call parametrelerini hazırla
      const contractCallParams = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'world-citizenship-dao',
        functionName: 'create-proposal',
        functionArgs: [
          formData.title,
          formData.description,
          formData.proposalType,
          formData.options,
          formData.duration,
          formData.fee
        ],
        network: 'devnet',
        postConditionMode: 1,
        anchorMode: 3
      }

      // Blockchain işlemi başlat
      const response = await window.StacksProvider.request({
        method: 'stx_signTransaction',
        params: contractCallParams
      })

      if (response && response.txId) {
        showError(
          'Teklif Başarıyla Oluşturuldu!',
          `DAO teklifiniz blockchain üzerinde oluşturuldu!\n\nTransaction ID: ${response.txId}\n\nİşlem blockchain üzerinde onaylanması birkaç dakika sürebilir.`,
          'info'
        )
      } else {
        throw new Error('Transaction failed or was cancelled')
      }
      
      // Formu temizle ve modal'ı kapat
      onClose()
    } catch (error) {
      console.error('Teklif oluşturma hatası:', error)
      showError(
        'Teklif Oluşturma Hatası',
        `Teklif oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        'error'
      )
    }
  }

  const updateOptions = (type: string) => {
    setFormData(prev => ({
      ...prev,
      proposalType: type,
      options: type === 'yes-no' ? ['Evet', 'Hayır'] : 
               type === 'numeric' ? ['5', '10', '15'] : 
               ['Seçenek 1', 'Seçenek 2']
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card max-w-2xl mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-black text-gradient mb-6 text-center">
          Yeni Teklif Oluştur
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field"
              placeholder="Teklif başlığı"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input-field"
              rows={4}
              placeholder="Teklif detayları"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Oylama Türü
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { type: 'yes-no', label: 'Evet/Hayır', icon: <CheckCircle className="h-6 w-6" /> },
                { type: 'multiple-choice', label: 'Çok Seçenekli', icon: <Users className="h-6 w-6" /> },
                { type: 'numeric', label: 'Sayısal', icon: <TrendingUp className="h-6 w-6" /> }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => updateOptions(option.type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.proposalType === option.type
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Seçenekler
            </label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...formData.options]
                    newOptions[index] = e.target.value
                    setFormData({...formData, options: newOptions})
                  }}
                  className="input-field"
                  placeholder={`Seçenek ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Süre (Gün)
              </label>
              <input
                type="number"
                value={formData.duration / 86400}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) * 86400})}
                className="input-field"
                min="1"
                max="30"
              />
            </div>
            
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Ücret (STX)
              </label>
              <input
                type="number"
                value={formData.fee / 1000000}
                onChange={(e) => setFormData({...formData, fee: parseInt(e.target.value) * 1000000})}
                className="input-field"
                min={daoParams.minProposalFee / 1000000}
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 btn-primary"
          >
            Teklif Oluştur
          </button>
        </div>
      </div>
    </div>
  )
}
