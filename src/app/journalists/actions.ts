'use server'

import { createClient } from '@/lib/supabase/server'
import { Journalist } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getJournalists(): Promise<Journalist[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('journalists')
    .select('*')
    .order('name', { ascending: true })
  
  if (error) {
    console.error('Error fetching journalists:', error)
    return []
  }
  
  return data as Journalist[]
}

export async function createJournalist(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  
  if (!name || !phone) {
    return { error: 'Nombre y teléfono son requeridos' }
  }
  
  const { error } = await supabase
    .from('journalists')
    .insert({
      name,
      phone,
      email: email || null,
      active: true,
    })
  
  if (error) {
    if (error.code === '23505') {
      return { error: 'Este número de teléfono ya existe' }
    }
    return { error: 'Error al crear periodista' }
  }
  
  revalidatePath('/journalists')
  return { success: true }
}

export async function updateJournalist(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  
  if (!name || !phone) {
    return { error: 'Nombre y teléfono son requeridos' }
  }
  
  const { error } = await supabase
    .from('journalists')
    .update({
      name,
      phone,
      email: email || null,
    })
    .eq('id', id)
  
  if (error) {
    if (error.code === '23505') {
      return { error: 'Este número de teléfono ya existe' }
    }
    return { error: 'Error al actualizar periodista' }
  }
  
  revalidatePath('/journalists')
  revalidatePath('/')
  return { success: true }
}

export async function deleteJournalist(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('journalists')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: 'Error al eliminar periodista' }
  }
  
  revalidatePath('/journalists')
  revalidatePath('/')
  return { success: true }
}

export async function toggleJournalistStatus(id: string, active: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('journalists')
    .update({ active })
    .eq('id', id)
  
  if (error) {
    return { error: 'Error al actualizar estado' }
  }
  
  revalidatePath('/journalists')
  return { success: true }
}
