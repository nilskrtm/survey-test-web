import { RefObject, useEffect, useMemo } from 'react';

const useVisible: (ref: RefObject<HTMLElement>, callback: (visible: boolean) => void) => void = (
  ref: RefObject<HTMLElement>,
  callback: (visible: boolean) => void
) => {
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        callback(entry.isIntersecting);
      }),
    [ref]
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);
};

export default useVisible;
