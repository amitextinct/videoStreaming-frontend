import { useRef, useEffect, useCallback } from 'react';

function useInfiniteScroll(callback) {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [callback]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { observerRef: lastElementRef };
}

export default useInfiniteScroll;
