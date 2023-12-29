import React from 'react';
import ProtectedRoute from '../../components/navigation/ProtectedRoute';

const protectRoute: (element: React.ReactNode, requiresAdmin: boolean) => React.JSX.Element = (
  element,
  requiresAdmin
) => {
  return (
    <ProtectedRoute redirectPath={'/login'} requiresAdmin={requiresAdmin}>
      {element}
    </ProtectedRoute>
  );
};

export { protectRoute };
