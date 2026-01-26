'use server'

import { createClient } from '@/lib/supabase/server'
import { NewsStatus } from '@/types'
import { revalidatePath } from 'next/cache'

export async function updateNewsStatus(id: string, status: NewsStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('news')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error('Failed to update news status')
  }

  revalidatePath('/')
}

export async function updateNewsPriority(items: { id: string; priority: number }[]) {
  const supabase = await createClient()
  
  // Upsert allows bulk updates if primary key is present
  const { error } = await supabase
    .from('news')
    .upsert(items, { onConflict: 'id' })

  if (error) {
    throw new Error('Failed to reorder news')
  }
  
  revalidatePath('/')
}
