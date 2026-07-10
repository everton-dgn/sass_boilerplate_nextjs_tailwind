export const formatPrice = (value: number, locale: string) => {
  const parts = value.toFixed(2).split('.')
  const currency = locale === 'pt' ? 'R$' : '$'
  return `${currency} ${parts[0]},${parts[1]}`
}
