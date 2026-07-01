import { useState, useEffect, useRef, useCallback } from 'react'

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const handlerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    handlerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (handlerRef.current) clearTimeout(handlerRef.current)
    }
  }, [value, delay])

  const cancel = useCallback(() => {
    if (handlerRef.current) clearTimeout(handlerRef.current)
  }, [])

  return [debouncedValue, cancel] as const
}

export default useDebounce
