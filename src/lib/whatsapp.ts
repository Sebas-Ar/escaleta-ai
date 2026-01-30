export async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    console.error('WhatsApp credentials are not configured (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID)')
    return
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error sending WhatsApp message:', JSON.stringify(errorData, null, 2))
      // Don't throw to avoid blocking the UI flow
    } else {
      console.log(`WhatsApp message sent to ${to}`)
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
  }
}
