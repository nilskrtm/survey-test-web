import { RefObject, useEffect } from 'react';

const useGroupClickOutside: (refs: RefObject<HTMLElement>[], callback: () => void) => void = (
  refs,
  callback
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !refs.some((ref) => {
          return ref.current && ref.current.contains(event.target as Node);
        })
      )
        callback();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, refs);
};

export default useGroupClickOutside;
