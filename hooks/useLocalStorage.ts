
import { useState, useEffect } from 'react';

function getValue<T,>(key: string, initialValue: T | (() => T)): T {
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(savedValue);
    } catch {
      // If parsing fails, it might be a non-JSON string or corrupted data.
      // Fallback to initialValue or the raw string if it's supposed to be a string.
      // For generic hook, it's safer to return initialValue on parse error.
      if (typeof initialValue === 'function') {
        return (initialValue as () => T)();
      }
      return initialValue;
    }
  }
  if (typeof initialValue === 'function') {
    return (initialValue as () => T)();
  }
  return initialValue;
}

export function useLocalStorage<T,>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
