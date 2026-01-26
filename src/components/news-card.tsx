'use client'

import { NewsItem } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Phone, Clock } from 'lucide-react'
import { useTransition } from 'react'
import { updateNewsStatus } from '@/app/actions'

interface NewsCardProps {
  item: NewsItem
  isOverlay?: boolean
}

export function NewsCard({ item, isOverlay }: NewsCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (status: 'approved' | 'rejected') => {
    startTransition(async () => {
      await updateNewsStatus(item.id, status)
    })
  }

  return (
    <div className={`
      bg-white border rounded-lg p-4 shadow-sm transition-shadow
      ${isOverlay ? 'shadow-xl ring-2 ring-blue-500 rotate-2 cursor-grabbing' : 'hover:shadow-md'}
      ${item.status === 'approved' ? 'border-l-4 border-l-green-500' : ''}
      ${item.status === 'rejected' ? 'border-l-4 border-l-red-500 opacity-60' : ''}
    `}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 leading-tight">
          {item.title}
        </h3>
        {item.estimated_duration && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {item.estimated_duration}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {item.content}
      </p>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{format(new Date(item.created_at), "HH:mm", { locale: es })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone size={12} />
          <span>{item.journalist_phone}</span>
        </div>
      </div>

      {item.status === 'pending' && (
        <div className="flex gap-2 mt-2 pt-2 border-t">
          <button
            onClick={() => handleStatusChange('approved')}
            disabled={isPending}
            className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
          >
            Aceptar
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            disabled={isPending}
            className="flex-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  )
}
