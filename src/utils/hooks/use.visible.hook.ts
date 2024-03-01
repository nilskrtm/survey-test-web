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
    observer.observe(ref.current as Element);

    return () => observer.disconnect();
  }, [ref]);
};

export default useVisible;
