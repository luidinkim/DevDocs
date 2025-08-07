import { useRouter } from 'next/router'
import ko from '../../locales/ko/common.json'
import en from '../../locales/en/common.json'

const translations = {
  ko,
  en
}

export function useTranslation() {
  const router = useRouter()
  const locale = router.locale || 'ko'
  
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
  
  return { t, locale }
}