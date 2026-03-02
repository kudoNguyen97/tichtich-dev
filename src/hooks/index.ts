import { useState, useEffect, useCallback, useRef } from 'react'
// import { useUIStore } from '@/stores'
// import type { Theme } from '@/types/common.types'

// useDebounce
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

//  useTheme
// export function useTheme() {
//   const { theme, setTheme } = useUIStore()

//   useEffect(() => {
//     const root = document.documentElement
//     if (theme === 'dark') {
//       root.classList.add('dark')
//     } else if (theme === 'light') {
//       root.classList.remove('dark')
//     } else {
//       // system
//       const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//       root.classList.toggle('dark', isDark)
//     }
//   }, [theme])

//   return { theme, setTheme }
// }

// useMediaQuery
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

// useOutsideClick─
export function useOutsideClick<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [callback])

  return ref
}

// useLocalStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      try {
        const newVal = val instanceof Function ? val(value) : val
        setValue(newVal)
        localStorage.setItem(key, JSON.stringify(newVal))
      } catch (err) {
        console.error(err)
      }
    },
    [key, value],
  )

  return [value, setStoredValue] as const
}
