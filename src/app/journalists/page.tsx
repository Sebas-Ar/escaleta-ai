import { getJournalists } from './actions'
import { JournalistList } from './components/journalist-list'
import { UserProfile } from '@/components/user-profile'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function JournalistsPage() {
  const journalists = await getJournalists()

  return (
    <main className="min-h-screen p-6 bg-slate-100">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="p-2 hover:bg-slate-200 rounded-md transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Periodistas</h1>
          </div>
          <p className="text-slate-500 ml-14">Gestión de periodistas registrados</p>
        </div>
        <UserProfile />
      </header>

      <div className="max-w-4xl">
        <JournalistList journalists={journalists} />
      </div>
    </main>
  )
}
