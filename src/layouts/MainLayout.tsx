import React from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa6';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  sidebarOpen,
  onToggleSidebar
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md hover:bg-gray-50 mr-4"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-primary">Ad Campaign Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};