// Gamification sistemi - Rozetler, Puanlar ve Başarımlar

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'citizenship' | 'dao' | 'community' | 'social' | 'special'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  requirements: {
    type: 'count' | 'date' | 'special'
    target?: number
    description: string
  }
  points: number
  earnedDate?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  isCompleted: boolean
  reward: {
    points: number
    badge?: string
  }
}

export interface UserStats {
  totalPoints: number
  level: number
  nextLevelPoints: number
  rank: string
  badges: Badge[]
  achievements: Achievement[]
  streaks: {
    voting: number
    dailyVisit: number
    proposalCreation: number
  }
}

// Rozet tanımları
export const AVAILABLE_BADGES: Badge[] = [
  // Vatandaşlık Rozetleri
  {
    id: 'first-citizen',
    name: 'İlk Vatandaş',
    description: 'İlk 10 vatandaş arasında',
    icon: '🥇',
    category: 'citizenship',
    rarity: 'legendary',
    requirements: {
      type: 'special',
      description: 'İlk 10 NFT mint eden kullanıcı'
    },
    points: 1000
  },
  {
    id: 'early-adopter',
    name: 'Erken Benimseyici',
    description: 'İlk 100 vatandaş arasında',
    icon: '🏆',
    category: 'citizenship',
    rarity: 'epic',
    requirements: {
      type: 'special',
      description: 'İlk 100 NFT mint eden kullanıcı'
    },
    points: 500
  },
  {
    id: 'world-citizen',
    name: 'Dünya Vatandaşı',
    description: 'Dünya Vatandaşlığı NFT\'sine sahip',
    icon: '🌍',
    category: 'citizenship',
    rarity: 'common',
    requirements: {
      type: 'special',
      description: 'NFT mint etmiş olmak'
    },
    points: 100
  },

  // DAO Rozetleri
  {
    id: 'active-voter',
    name: 'Aktif Oylayıcı',
    description: '10+ teklif için oy kullandı',
    icon: '🗳️',
    category: 'dao',
    rarity: 'uncommon',
    requirements: {
      type: 'count',
      target: 10,
      description: '10 teklif için oy kullan'
    },
    points: 200
  },
  {
    id: 'super-voter',
    name: 'Süper Oylayıcı',
    description: '50+ teklif için oy kullandı',
    icon: '🏅',
    category: 'dao',
    rarity: 'rare',
    requirements: {
      type: 'count',
      target: 50,
      description: '50 teklif için oy kullan'
    },
    points: 750
  },
  {
    id: 'proposal-creator',
    name: 'Teklif Yaratıcısı',
    description: '5+ teklif oluşturdu',
    icon: '💡',
    category: 'dao',
    rarity: 'uncommon',
    requirements: {
      type: 'count',
      target: 5,
      description: '5 teklif oluştur'
    },
    points: 300
  },
  {
    id: 'dao-leader',
    name: 'DAO Lideri',
    description: '20+ teklif oluşturdu',
    icon: '👑',
    category: 'dao',
    rarity: 'epic',
    requirements: {
      type: 'count',
      target: 20,
      description: '20 teklif oluştur'
    },
    points: 1200
  },

  // Topluluk Rozetleri
  {
    id: 'social-butterfly',
    name: 'Sosyal Kelebek',
    description: '25+ gönderi paylaştı',
    icon: '🦋',
    category: 'community',
    rarity: 'uncommon',
    requirements: {
      type: 'count',
      target: 25,
      description: '25 topluluk gönderisi paylaş'
    },
    points: 250
  },
  {
    id: 'helpful-citizen',
    name: 'Yardımsever Vatandaş',
    description: '100+ yardımcı yorum yaptı',
    icon: '🤝',
    category: 'community',
    rarity: 'rare',
    requirements: {
      type: 'count',
      target: 100,
      description: '100 yardımcı yorum yap'
    },
    points: 400
  },
  {
    id: 'event-organizer',
    name: 'Etkinlik Organizatörü',
    description: '5+ etkinlik düzenledi',
    icon: '🎯',
    category: 'community',
    rarity: 'rare',
    requirements: {
      type: 'count',
      target: 5,
      description: '5 etkinlik düzenle'
    },
    points: 600
  },

  // Sosyal Rozetleri
  {
    id: 'influencer',
    name: 'Etkileyici',
    description: '1000+ takipçisi var',
    icon: '⭐',
    category: 'social',
    rarity: 'epic',
    requirements: {
      type: 'count',
      target: 1000,
      description: '1000 takipçi kazan'
    },
    points: 800
  },
  {
    id: 'connector',
    name: 'Bağlayıcı',
    description: '50+ kişiyi davet etti',
    icon: '🔗',
    category: 'social',
    rarity: 'rare',
    requirements: {
      type: 'count',
      target: 50,
      description: '50 kişiyi davet et'
    },
    points: 500
  },

  // Özel Rozetler
  {
    id: 'anniversary',
    name: 'Yıldönümü',
    description: '1 yıl boyunca aktif',
    icon: '🎂',
    category: 'special',
    rarity: 'epic',
    requirements: {
      type: 'date',
      description: '1 yıl boyunca aktif kal'
    },
    points: 1000
  },
  {
    id: 'beta-tester',
    name: 'Beta Test Kullanıcısı',
    description: 'Beta döneminde katıldı',
    icon: '🧪',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'special',
      description: 'Beta döneminde platforma katıl'
    },
    points: 300
  }
]

// Seviye hesaplama
export function calculateLevel(points: number): { level: number; nextLevelPoints: number } {
  // Her seviye için gereken puan: level^2 * 100
  let level = 1
  let totalPointsNeeded = 0
  
  while (totalPointsNeeded <= points) {
    level++
    totalPointsNeeded += level * level * 100
  }
  
  level-- // Son geçilen seviye
  const currentLevelStart = (level - 1) * (level - 1) * 100
  const nextLevelPoints = level * level * 100
  
  return {
    level,
    nextLevelPoints: nextLevelPoints - (points - currentLevelStart)
  }
}

// Rütbe hesaplama
export function calculateRank(level: number): string {
  if (level >= 50) return 'Efsanevi Vatandaş'
  if (level >= 40) return 'Büyük Lider'
  if (level >= 30) return 'Topluluk Lideri'
  if (level >= 25) return 'Kıdemli Vatandaş'
  if (level >= 20) return 'Deneyimli Vatandaş'
  if (level >= 15) return 'Aktif Vatandaş'
  if (level >= 10) return 'Gelişen Vatandaş'
  if (level >= 5) return 'Yeni Vatandaş'
  return 'Aday Vatandaş'
}

// Rozet kazanma kontrolü
export function checkBadgeEligibility(
  userStats: any,
  badge: Badge
): boolean {
  switch (badge.requirements.type) {
    case 'count':
      // Belirli bir sayıya ulaşma kontrolü
      switch (badge.id) {
        case 'active-voter':
        case 'super-voter':
          return userStats.votesCount >= (badge.requirements.target || 0)
        case 'proposal-creator':
        case 'dao-leader':
          return userStats.proposalsCreated >= (badge.requirements.target || 0)
        case 'social-butterfly':
          return userStats.postsCount >= (badge.requirements.target || 0)
        case 'helpful-citizen':
          return userStats.helpfulComments >= (badge.requirements.target || 0)
        case 'event-organizer':
          return userStats.eventsOrganized >= (badge.requirements.target || 0)
        case 'influencer':
          return userStats.followers >= (badge.requirements.target || 0)
        case 'connector':
          return userStats.referrals >= (badge.requirements.target || 0)
        default:
          return false
      }
    
    case 'date':
      // Tarih bazlı kontroller
      const accountAge = Date.now() - new Date(userStats.joinDate).getTime()
      const oneYear = 365 * 24 * 60 * 60 * 1000
      return accountAge >= oneYear
    
    case 'special':
      // Özel durumlar
      switch (badge.id) {
        case 'world-citizen':
          return userStats.hasCitizenship
        case 'first-citizen':
          return userStats.tokenId <= 10
        case 'early-adopter':
          return userStats.tokenId <= 100
        case 'beta-tester':
          return new Date(userStats.joinDate) < new Date('2024-04-01')
        default:
          return false
      }
    
    default:
      return false
  }
}

// Kullanıcı istatistiklerini güncelle
export function updateUserStats(
  currentStats: UserStats,
  action: 'vote' | 'proposal' | 'post' | 'comment' | 'event' | 'referral',
  data?: any
): UserStats {
  const newStats = { ...currentStats }
  
  // Aksiyon bazlı puan kazanımı
  let pointsEarned = 0
  
  switch (action) {
    case 'vote':
      pointsEarned = 10
      newStats.streaks.voting++
      break
    case 'proposal':
      pointsEarned = 50
      newStats.streaks.proposalCreation++
      break
    case 'post':
      pointsEarned = 20
      break
    case 'comment':
      pointsEarned = 5
      break
    case 'event':
      pointsEarned = 100
      break
    case 'referral':
      pointsEarned = 30
      break
  }
  
  // Streak bonusları
  if (newStats.streaks.voting >= 7) pointsEarned *= 1.5 // Haftalık oy verme bonusu
  if (newStats.streaks.dailyVisit >= 30) pointsEarned *= 1.2 // Aylık ziyaret bonusu
  
  newStats.totalPoints += Math.floor(pointsEarned)
  
  // Seviye güncelle
  const levelInfo = calculateLevel(newStats.totalPoints)
  newStats.level = levelInfo.level
  newStats.nextLevelPoints = levelInfo.nextLevelPoints
  newStats.rank = calculateRank(newStats.level)
  
  // Yeni rozet kontrolü
  AVAILABLE_BADGES.forEach(badge => {
    const alreadyHas = newStats.badges.some(b => b.id === badge.id)
    if (!alreadyHas && checkBadgeEligibility(data || {}, badge)) {
      newStats.badges.push({
        ...badge,
        earnedDate: new Date().toISOString()
      })
      newStats.totalPoints += badge.points
    }
  })
  
  return newStats
}

// Rozet rarity renkleri
export function getBadgeRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'uncommon': return 'bg-green-100 text-green-800 border-green-200'
    case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Liderboard için sıralama
export function calculateLeaderboard(users: any[]): any[] {
  return users
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
    }))
}
