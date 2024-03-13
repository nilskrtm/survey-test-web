import { RefObject, useEffect } from 'react';

const useGroupClickOutside: (refs: RefObject<HTMLElement>[], callback: () => void) => void = (
  refs,
  callback
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;

      let found = 0;

      for (const ref of refs) {
        if (ref.current && ref.current.contains(event.target)) {
          found++;
        }
      }

      if (found === 0) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, refs);
};

export default useGroupClickOutside;
