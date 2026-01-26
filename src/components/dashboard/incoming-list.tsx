import { NewsItem } from '@/types'
import { NewsCard } from '../news-card'

interface IncomingListProps {
  items: NewsItem[]
}

export function IncomingList({ items }: IncomingListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No hay noticias pendientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
