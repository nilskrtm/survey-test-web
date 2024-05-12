import { useState } from 'react';

const useCollapse: () => [boolean, () => void] = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const clickHandler = () => {
    setCollapsed(!collapsed);
  };

  return [collapsed, clickHandler];
};
export default useCollapse;
