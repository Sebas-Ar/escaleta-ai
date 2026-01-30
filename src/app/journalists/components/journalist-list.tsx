'use client'

import { useState, useTransition } from 'react'
import { Journalist } from '@/types'
import { JournalistForm } from './journalist-form'
import { deleteJournalist, toggleJournalistStatus } from '../actions'
import { Pencil, Trash2, Phone, Mail } from 'lucide-react'

interface JournalistListProps {
  journalists: Journalist[]
}

export function JournalistList({ journalists }: JournalistListProps) {
  const [editingJournalist, setEditingJournalist] = useState<Journalist | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      startTransition(async () => {
        await deleteJournalist(id)
      })
    }
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleJournalistStatus(id, !currentStatus)
    })
  }

  if (journalists.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">No hay periodistas registrados</p>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
        >
          Agregar Primer Periodista
        </button>
        {isCreating && (
          <JournalistForm onClose={() => setIsCreating(false)} />
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-slate-600">
          {journalists.length} periodista{journalists.length !== 1 ? 's' : ''} registrado{journalists.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
        >
          + Agregar Periodista
        </button>
      </div>

      <div className="grid gap-4">
        {journalists.map((journalist) => (
          <div
            key={journalist.id}
            className={`bg-white rounded-lg border shadow-sm p-4 ${
              !journalist.active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {journalist.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      journalist.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {journalist.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{journalist.phone}</span>
                  </div>
                  {journalist.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{journalist.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(journalist.id, journalist.active)}
                  disabled={isPending}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
                >
                  {journalist.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => setEditingJournalist(journalist)}
                  disabled={isPending}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(journalist.id, journalist.name)}
                  disabled={isPending}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isCreating || editingJournalist) && (
        <JournalistForm
          journalist={editingJournalist || undefined}
          onClose={() => {
            setIsCreating(false)
            setEditingJournalist(null)
          }}
        />
      )}
    </>
  )
}
