import { useState } from 'react';

const useCollapse: (initialCollapsed?: boolean) => [boolean, () => void] = (initialCollapsed) => {
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed ? initialCollapsed : false);

  const clickHandler = () => {
    setCollapsed(!collapsed);
  };

  return [collapsed, clickHandler];
};
export default useCollapse;
