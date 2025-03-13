import { Typography, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

const { Option } = Select

function Dashboard() {
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(localStorage.getItem('i18next') || 'vi')

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [lang, i18n])

  // Hàm handle đổi ngôn ngữ
  const handleChangeLanguage = (value: string) => {
    setLang(value)
    i18n.changeLanguage(value)
    localStorage.setItem('i18next', value)
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Dropdown đổi ngôn ngữ */}
      <Select
        value={lang}
        onChange={handleChangeLanguage}
        style={{ width: 150, marginBottom: 20 }}
      >
        <Option value="vi">🇻🇳 Tiếng Việt</Option>
        <Option value="en">🇺🇸 English</Option>
      </Select>

      {/* Nội dung hiển thị theo ngôn ngữ */}
      <Typography.Text>{t('hello')}</Typography.Text>
    </div>
  )
}

export default Dashboard
