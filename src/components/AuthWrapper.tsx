import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  // Simply render children - auth is handled by the AuthContext provider
  return <>{children}</>;
};