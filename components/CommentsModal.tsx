'use client'

import { useState, useEffect } from 'react'
import { 
  X,
  MessageCircle,
  ThumbsUp,
  Reply,
  Send,
  Flag,
  MoreHorizontal
} from 'lucide-react'

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

interface CommentsModalProps {
  proposalId: number
  onClose: () => void
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  newComment: string
  setNewComment: (comment: string) => void
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
  newReply: string
  setNewReply: (reply: string) => void
}

export default function CommentsModal({ 
  proposalId, 
  onClose, 
  comments, 
  setComments, 
  newComment, 
  setNewComment, 
  replyingTo, 
  setReplyingTo, 
  newReply, 
  setNewReply 
}: CommentsModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [proposalId])

  const loadComments = async () => {
    setIsLoading(true)
    try {
      // Mock comments data
      const mockComments: Comment[] = [
        {
          id: '1',
          proposalId,
          author: {
            address: 'ST1ABC...',
            displayName: 'Dünya Gezgini',
            badges: ['founder', 'active-voter']
          },
          content: 'Bu teklif gerçekten çok önemli! Eğitim fonunun kurulması dünya vatandaşları için büyük bir adım olacak.',
          createdAt: '2024-03-15T10:30:00Z',
          likesCount: 5,
          isLiked: false,
          replies: [
            {
              id: 'r1',
              commentId: '1',
              author: {
                address: 'ST2DEF...',
                displayName: 'Blockchain Guru'
              },
              content: 'Kesinlikle katılıyorum! Bu projenin teknik altyapısını da destekleyebiliriz.',
              createdAt: '2024-03-15T11:00:00Z',
              likesCount: 2,
              isLiked: true
            }
          ],
          isEdited: false
        },
        {
          id: '2',
          proposalId,
          author: {
            address: 'ST3GHI...',
            displayName: 'Etkinlik Organizatörü',
            badges: ['event-organizer']
          },
          content: 'Fon miktarı yeterli mi? Belki daha detaylı bir bütçe planı hazırlanabilir.',
          createdAt: '2024-03-15T12:15:00Z',
          likesCount: 3,
          isLiked: true,
          replies: [],
          isEdited: false
        }
      ]

      const proposalComments = mockComments.filter(c => c.proposalId === proposalId)
      setComments(proposalComments)
    } catch (error) {
      console.error('Yorum yükleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      proposalId,
      author: {
        address: 'current-user',
        displayName: 'Sen',
        badges: []
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      isEdited: false
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const handleAddReply = async (commentId: string) => {
    if (!newReply.trim()) return

    const reply: Reply = {
      id: Date.now().toString(),
      commentId,
      author: {
        address: 'current-user',
        displayName: 'Sen'
      },
      content: newReply,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false
    }

    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    setNewReply('')
    setReplyingTo(null)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} saat önce`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Teklif Tartışması</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Yorumlar yükleniyor...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz yorum yok</h3>
              <p className="text-gray-600">Bu teklif hakkında ilk yorumu siz yapın!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.author.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{comment.author.displayName}</h4>
                          {comment.author.badges.includes('founder') && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              🏆 Kurucu
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{formatTime(comment.createdAt)}</p>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Comment Content */}
                  <p className="text-gray-700 mb-3">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors ${
                      comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                    }`}>
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likesCount}</span>
                    </button>
                    <button 
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 px-2 py-1 rounded transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Yanıtla</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors">
                      <Flag className="w-4 h-4" />
                      <span>Bildir</span>
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-white rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {reply.author.displayName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{reply.author.displayName}</h5>
                                <p className="text-xs text-gray-500">{formatTime(reply.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                          <button className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                            reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}>
                            <ThumbsUp className="w-3 h-3" />
                            <span>{reply.likesCount}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 pl-6 border-l-2 border-blue-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Yanıtınızı yazın..."
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddReply(comment.id)
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!newReply.trim()}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Comment Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Teklife yorum yapın..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500">
                  {newComment.length}/500 karakter
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || newComment.length > 500}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Yorum Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
