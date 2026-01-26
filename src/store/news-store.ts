// src/store/news-store.ts
import { createStore } from 'zustand/vanilla'
import { NewsItem, NewsStore, NewsState, NewsStatus } from '@/types'

const defaultInitState: NewsState = {
  news: [],
  isLoading: true,
}

export const createNewsStore = (initState: NewsState = defaultInitState) => {
  return createStore<NewsStore>()((set) => ({
    ...initState,
    setNews: (news: NewsItem[]) => set({ news, isLoading: false }),
    addNews: (item: NewsItem) =>
      set((state) => ({ news: [item, ...state.news] })),
    updateNewsStatus: (id: string, status: NewsStatus) =>
      set((state) => ({
        news: state.news.map((item) =>
          item.id === id ? { ...item, status } : item
        ),
      })),
    reorderNews: (orderedItems: NewsItem[]) => set((state) => {
       const orderedIds = new Set(orderedItems.map(i => i.id));
       const others = state.news.filter(item => !orderedIds.has(item.id));
       return { news: [...others, ...orderedItems] };
    }),
  }))
}
