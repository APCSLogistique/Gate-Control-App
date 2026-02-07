import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AIFloatingWidget from '../components/AIFloatingWidget';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>

      {/* AI Floating Widget */}
      <AIFloatingWidget />
    </div>
  );
};

export default MainLayout;
