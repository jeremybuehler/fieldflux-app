import { useRef, useState, useEffect } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  initialValue?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0,
  rootMargin = '0px',
  initialValue = false,
}: UseIntersectionObserverOptions = {}) {
  const [inView, setInView] = useState<boolean>(initialValue);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return { ref, inView };
}