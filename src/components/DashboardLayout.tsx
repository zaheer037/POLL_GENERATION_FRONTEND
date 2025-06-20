import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;