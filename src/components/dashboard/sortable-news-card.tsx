'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { NewsItem } from '@/types'
import { NewsCard } from '../news-card'

interface SortableNewsCardProps {
  item: NewsItem
}

export function SortableNewsCard({ item }: SortableNewsCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <NewsCard item={item} isOverlay={isDragging} />
    </div>
  )
}
