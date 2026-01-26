export type NewsStatus = 'pending' | 'approved' | 'rejected';

export interface NewsItem {
  id: string;
  created_at: string;
  content: string;
  title: string;
  status: NewsStatus;
  priority: number;
  journalist_phone: string;
  estimated_duration: string | null;
}

export type NewsState = {
  news: NewsItem[];
  isLoading: boolean;
};

export type NewsActions = {
  setNews: (news: NewsItem[]) => void;
  addNews: (item: NewsItem) => void;
  updateNewsStatus: (id: string, status: NewsStatus) => void;
  reorderNews: (items: NewsItem[]) => void;
};

export type NewsStore = NewsState & NewsActions;
