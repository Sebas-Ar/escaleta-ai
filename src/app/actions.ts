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
  
  const results = await Promise.all(
    items.map(({ id, priority }) =>
      supabase
        .from('news')
        .update({ priority })
        .eq('id', id)
        .select('id')
        .single()
    )
  )

  const failed = results.find(result => result.error)

  if (failed?.error) {
    throw new Error(failed.error.message || 'Failed to reorder news')
  }
  
  revalidatePath('/')
}
