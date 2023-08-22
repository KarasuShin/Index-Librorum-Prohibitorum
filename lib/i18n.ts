export async function getMessages(locale: string) {
  const { default: messages } = await import(`~/messages/${locale}.json`)
  return messages
}
