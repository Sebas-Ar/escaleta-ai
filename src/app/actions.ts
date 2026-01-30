'use server'

import { createClient } from '@/lib/supabase/server'
import { NewsStatus } from '@/types'
import { revalidatePath } from 'next/cache'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function updateNewsStatus(id: string, status: NewsStatus) {
  const supabase = await createClient()

  // Fetch news details for notification
  const { data: newsItem } = await supabase
    .from('news')
    .select('title, journalist_phone')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('news')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error('Failed to update news status')
  }

  // Send WhatsApp notification
  if (newsItem?.journalist_phone) {
    const message = status === 'approved'
      ? `Hola, tu noticia "${newsItem.title}" ha sido aceptada.`
      : status === 'rejected'
        ? `Hola, tu noticia "${newsItem.title}" ha sido rechazada.`
        : null
    
    if (message) {
      await sendWhatsAppMessage(newsItem.journalist_phone, message)
    }
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
