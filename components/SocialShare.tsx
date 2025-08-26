'use client'

import { useState } from 'react'
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Share2, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react'

interface SocialShareProps {
  title: string
  description: string
  url?: string
  hashtags?: string[]
  via?: string
  className?: string
}

export default function SocialShare({ 
  title, 
  description, 
  url, 
  hashtags = [], 
  via = 'WorldCitizenNFT',
  className = ''
}: SocialShareProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `${title}\n\n${description}`
  const hashtagString = hashtags.length > 0 ? hashtags.map(tag => `#${tag}`).join(' ') : ''

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(hashtags.join(','))}&via=${via}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      url: `https://www.instagram.com/` // Instagram doesn't have direct share URL
    }
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Link kopyalama hatası:', error)
    }
  }

  const handleShare = (platform: any) => {
    if (platform.name === 'Instagram') {
      // Instagram için özel mesaj
      alert('Instagram\'da paylaşmak için linki kopyalayıp story\'nizde paylaşabilirsiniz!')
      handleCopyLink()
      return
    }
    
    window.open(platform.url, '_blank', 'width=600,height=400')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl
        })
      } catch (error) {
        console.error('Paylaşım hatası:', error)
      }
    } else {
      setShowModal(true)
    }
  }

  return (
    <>
      <button
        onClick={handleNativeShare}
        className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span>Paylaş</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Paylaş</h3>
              <p className="text-sm text-gray-600">{title}</p>
            </div>

            {/* Social Platform Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShare(platform)}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-all duration-200 ${platform.color}`}
                >
                  {platform.icon}
                  <span className="font-medium">{platform.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1 inline" />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1 inline" />
                      Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hashtags */}
            {hashtagString && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Önerilen etiketler:</p>
                <p className="text-sm text-blue-600">{hashtagString}</p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Sosyal medya profil kartı komponenti
interface SocialProfileCardProps {
  platform: 'twitter' | 'linkedin' | 'github' | 'website'
  username: string
  followers?: number
  verified?: boolean
  className?: string
}

export function SocialProfileCard({ 
  platform, 
  username, 
  followers, 
  verified = false,
  className = '' 
}: SocialProfileCardProps) {
  const getPlatformInfo = () => {
    switch (platform) {
      case 'twitter':
        return {
          name: 'Twitter',
          icon: <Twitter className="w-4 h-4" />,
          color: 'bg-blue-50 text-blue-600 border-blue-200',
          url: `https://twitter.com/${username}`
        }
      case 'linkedin':
        return {
          name: 'LinkedIn',
          icon: <Linkedin className="w-4 h-4" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          url: `https://linkedin.com/in/${username}`
        }
      case 'github':
        return {
          name: 'GitHub',
          icon: <ExternalLink className="w-4 h-4" />,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          url: `https://github.com/${username}`
        }
      case 'website':
        return {
          name: 'Website',
          icon: <ExternalLink className="w-4 h-4" />,
          color: 'bg-green-50 text-green-600 border-green-200',
          url: username.startsWith('http') ? username : `https://${username}`
        }
      default:
        return {
          name: platform,
          icon: <ExternalLink className="w-4 h-4" />,
          color: 'bg-gray-50 text-gray-600 border-gray-200',
          url: '#'
        }
    }
  }

  const platformInfo = getPlatformInfo()

  return (
    <a
      href={platformInfo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200 ${platformInfo.color} ${className}`}
    >
      <div className="flex items-center space-x-2">
        {platformInfo.icon}
        <span className="font-medium">{platformInfo.name}</span>
        {verified && <span className="text-blue-500">✓</span>}
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        {followers !== undefined && (
          <span className="text-gray-600">
            {followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : followers} takipçi
          </span>
        )}
        <ExternalLink className="w-3 h-3" />
      </div>
    </a>
  )
}

// Sosyal medya istatistik kartı
interface SocialStatsCardProps {
  platform: string
  metric: string
  value: number
  change?: number
  icon: React.ReactNode
  className?: string
}

export function SocialStatsCard({ 
  platform, 
  metric, 
  value, 
  change,
  icon,
  className = '' 
}: SocialStatsCardProps) {
  const formatValue = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-600">{platform}</span>
        </div>
        {change !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            change >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {formatValue(value)}
      </div>
      
      <div className="text-sm text-gray-500">
        {metric}
      </div>
    </div>
  )
}
