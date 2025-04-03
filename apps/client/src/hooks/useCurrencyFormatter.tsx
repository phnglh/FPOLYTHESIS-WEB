import { useMemo } from 'react'

const useCurrencyFormatter = (
  locale: string = 'vi-VN',
  currency: string = 'VND',
) => {
  const formatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    })
  }, [locale, currency])

  const formatCurrency = (amount: number) => {
    return formatter.format(amount)
  }

  return { formatCurrency }
}

export default useCurrencyFormatter
