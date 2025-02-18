import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

export default function Home() {
  const { t } = useTranslation()
  const [value, setValue] = useState(false)

  useEffect(() => {
    console.log('value', value)
  }, [value])
  return (
    <>
      <h1 className="text-2xl text-amber-300">{t('hello')}</h1>
      <Button onClick={() => setValue(!value)}>Click me</Button>
    </>
  )
}
