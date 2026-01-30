import { createClient } from '@/lib/supabase/server'
import { NewsStoreProvider } from '@/providers/news-store-provider'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { UserProfile } from '@/components/user-profile'
import { NewsItem } from '@/types'
import Link from 'next/link'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch news
  const { data: newsData } = await supabase
    .from('news')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  // Fetch journalists
  const { data: journalistsData } = await supabase
    .from('journalists')
    .select('phone, name')

  // Create a map of phone -> name for quick lookup
  const journalistMap = new Map(
    (journalistsData || []).map(j => [j.phone, j.name])
  )

  // Map news items with journalist names
  const news = (newsData || []).map((item: any) => ({
    ...item,
    journalist_name: journalistMap.get(item.journalist_phone) || null,
  })) as NewsItem[]

  return (
    <NewsStoreProvider initialNews={news}>
      <main className="min-h-screen p-6 bg-slate-100">
        <header className="mb-6 flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Escaleta.ai</h1>
                <p className="text-slate-500">Panel de Control de Noticias</p>
             </div>
             <div className="flex items-center gap-4">
               <Link
                 href="/journalists"
                 className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
               >
                 <Users className="w-5 h-5" />
                 <span>Periodistas</span>
               </Link>
               <UserProfile />
             </div>
        </header>
        <DashboardView />
      </main>
    </NewsStoreProvider>
  )
}
