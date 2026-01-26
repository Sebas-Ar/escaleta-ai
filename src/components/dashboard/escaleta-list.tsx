'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { NewsItem } from '@/types'
import { SortableNewsCard } from './sortable-news-card'
import { useNewsStore } from '@/providers/news-store-provider'
import { updateNewsPriority } from '@/app/actions'
import { startTransition, useId } from 'react'

interface EscaletaListProps {
  items: NewsItem[]
}

export function EscaletaList({ items }: EscaletaListProps) {
  const reorderNews = useNewsStore((state) => state.reorderNews)
  const dndContextId = useId()

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      
      const updates = newItems.map((item, index) => ({
        id: item.id,
        priority: index + 1
      }))

       const newItemsWithPriority = newItems.map((item, index) => ({
           ...item,
           priority: index + 1
       }))

       reorderNews(newItemsWithPriority)

       startTransition(async () => {
          await updateNewsPriority(updates)
       })
    }
  }

  if (items.length === 0) {
    return (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-300">
            <p className="mb-2">Escaleta vacía</p>
            <p className="text-sm">Aprueba noticias para agregarlas aquí</p>
        </div>
    )
  }

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
            {items.map((item) => (
            <SortableNewsCard key={item.id} item={item} />
            ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
