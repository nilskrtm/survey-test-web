import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const protectRoute: (
  element: React.ReactNode,
  redirectPath: string,
  requiresAdmin: boolean
) => React.JSX.Element = (element, redirectPath, requiresAdmin) => {
  return (
    <ProtectedRoute redirectPath={redirectPath} requiresAdmin={requiresAdmin}>
      {element}
    </ProtectedRoute>
  );
};

export { protectRoute };
