import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n

  .use(Backend)

  .use(LanguageDetector)

  .use(initReactI18next)
  .init({
    supportedLngs: ['vi', 'en'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'vi',
    debug: false,
    keySeparator: '.',

    // react: {
    //   useSuspense: false
    // },
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
    },
    ns: ['common'],
    detection: {
      caches: ['cookie'],
      order: ['path'],
    },
  })

export default i18n
