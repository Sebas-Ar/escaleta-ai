import { createClient } from '@/lib/supabase/server'
import { NewsStoreProvider } from '@/providers/news-store-provider'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { UserProfile } from '@/components/user-profile'
import { NewsItem } from '@/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  // Handle null data safely
  const news = (data || []) as NewsItem[]

  return (
    <NewsStoreProvider initialNews={news}>
      <main className="min-h-screen p-6 bg-slate-100">
        <header className="mb-6 flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Escaleta.ai</h1>
                <p className="text-slate-500">Panel de Control de Noticias</p>
             </div>
             <UserProfile />
        </header>
        <DashboardView />
      </main>
    </NewsStoreProvider>
  )
}
