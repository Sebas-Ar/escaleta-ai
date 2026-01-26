'use client'

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { type NewsStore, createNewsStore } from '@/store/news-store'
import { NewsItem } from '@/types'
import { createClient } from '@/lib/supabase/client'

export type NewsStoreApi = ReturnType<typeof createNewsStore>

export const NewsStoreContext = createContext<NewsStoreApi | undefined>(
  undefined,
)

export interface NewsStoreProviderProps {
  children: ReactNode
  initialNews: NewsItem[]
}

export const NewsStoreProvider = ({
  children,
  initialNews,
}: NewsStoreProviderProps) => {
  const storeRef = useRef<NewsStoreApi>(null)
  
  if (!storeRef.current) {
    storeRef.current = createNewsStore({
      news: initialNews,
      isLoading: false
    })
  }

  useEffect(() => {
    const supabase = createClient()
    const store = storeRef.current

    const channel = supabase
      .channel('news-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          console.log('Realtime update:', payload)
          
          if (!store) return

          if (payload.eventType === 'INSERT') {
            store.getState().addNews(payload.new as NewsItem)
          } else if (payload.eventType === 'UPDATE') {
             // We can do a full replace or partial update. 
             // For status/priority, local state might be ahead if optimistic.
             // But simple approach: update the item.
             const updated = payload.new as NewsItem
             // Using the specific status updater or broad update? 
             // Our store has updateNewsStatus, let's just manually replace property in array for generic update
             // Or better, let's add a generic update action to store later if needed.
             // For now, let's just map it.
             const currentNews = store.getState().news
             const newNews = currentNews.map(item => item.id === updated.id ? updated : item)
             store.getState().setNews(newNews)
          }
           // Handle DELETE if needed
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <NewsStoreContext.Provider value={storeRef.current}>
      {children}
    </NewsStoreContext.Provider>
  )
}

export const useNewsStore = <T,>(
  selector: (store: NewsStore) => T,
): T => {
  const newsStoreContext = useContext(NewsStoreContext)

  if (!newsStoreContext) {
    throw new Error(`useNewsStore must be used within NewsStoreProvider`)
  }

  return useStore(newsStoreContext, selector)
}
