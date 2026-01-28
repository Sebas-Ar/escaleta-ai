'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleUpdatePassword = async (formData: FormData) => {
    setIsUpdating(true)
    setMessage('')
    const password = formData.get('password') as string
    
    if (!password || password.length < 6) {
        setMessage('La contraseña debe tener al menos 6 caracteres')
        setIsUpdating(false)
        return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        setMessage('Error updating password: ' + error.message)
    } else {
        setMessage('Contraseña actualizada con éxito')
        setTimeout(() => setIsOpen(false), 1500)
    }
    setIsUpdating(false)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold hover:bg-slate-700"
      >
        E
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50">
            <h3 className="font-semibold text-gray-900 mb-4">Mi Cuenta</h3>
            
            <form action={handleUpdatePassword} className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Nueva Contraseña</label>
                <div className="flex gap-2">
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="******" 
                        className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                    <button 
                        disabled={isUpdating}
                        className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isUpdating ? '...' : 'OK'}
                    </button>
                </div>
                {message && <p className="text-xs mt-2 text-green-600">{message}</p>}
            </form>

            <button 
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-600 hover:bg-red-50 p-2 rounded"
            >
                Cerrar Sesión
            </button>
        </div>
      )}
    </div>
  )
}
