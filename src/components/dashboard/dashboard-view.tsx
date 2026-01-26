'use client'

import { useNewsStore } from '@/providers/news-store-provider'
import { IncomingList } from '@/components/dashboard/incoming-list'
import { EscaletaList } from '@/components/dashboard/escaleta-list'
import { exportToDocx } from '@/lib/export-utils' 
import { Download } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

export function DashboardView() {
  const { news, isLoading } = useNewsStore(
    useShallow((state) => ({
      news: state.news,
      isLoading: state.isLoading
    }))
  )

  if (isLoading) return <div>Loading...</div>

  // Filter and sort
  const incomingNews = news
    .filter(n => n.status === 'pending')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const escalationNews = news
    .filter(n => n.status === 'approved')
    // We trust the query/store order for priority, but let's be safe.
    // If priorities are equal (0/null), fallback to created_at
    .sort((a, b) => {
        if (a.priority !== b.priority) {
            return (a.priority || 9999) - (b.priority || 9999)
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Columna de Entrantes */}
      <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Entrants
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {incomingNews.length}
            </span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          <IncomingList items={incomingNews} />
        </div>
      </div>

      {/* Columna de Escaleta */}
      <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Escaleta
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {escalationNews.length}
            </span>
          </h2>
                    <button 
                onClick={() => exportToDocx(escalationNews)}
                className="flex items-center gap-1 text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-md transition-colors font-medium shadow-sm"
            >
                <Download size={14} />
                Exportar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
           <EscaletaList items={escalationNews} />
        </div>
      </div>
    </div>
  )
}
