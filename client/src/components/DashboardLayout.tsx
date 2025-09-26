import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  User, 
  Settings, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import pmAjayLogo from '@/assets/pm-ajay logo.png';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  navItems?: Array<{
    label: string;
    icon: ReactNode;
    path: string;
    active?: boolean;
  }>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  navItems = []
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      super_admin: 'Super Administrator',
      central_admin: 'Central Administrator',
      state_nodal_admin: 'State Nodal Administrator',
      state_sc_corporation_admin: 'State SC Corporation Administrator',
      district_collector: 'District Collector',
      district_pacc_admin: 'District PACC Administrator',
      implementing_agency_user: 'Implementing Agency User',
      gram_panchayat_user: 'Gram Panchayat User',
      contractor_vendor: 'Contractor/Vendor',
      auditor_oversight: 'Auditor/Oversight',
      technical_support_group: 'Technical Support'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getJurisdictionDisplay = () => {
    if (!user?.jurisdiction) return null;
    
    const parts = [];
    if (user.jurisdiction.village) parts.push(`Village: ${user.jurisdiction.village}`);
    if (user.jurisdiction.block) parts.push(`Block: ${user.jurisdiction.block}`);
    if (user.jurisdiction.district) parts.push(`District: ${user.jurisdiction.district}`);
    if (user.jurisdiction.state) parts.push(`State: ${user.jurisdiction.state}`);
    
    return parts.length > 0 ? parts.join(' | ') : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-blue-800 lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-3">
              <img 
                src={pmAjayLogo} 
                alt="PM-AJAY" 
                className="h-10 w-10 bg-white rounded-full p-1"
              />
              <div>
                <h1 className="text-lg font-bold">PM-AJAY Portal</h1>
                <p className="text-xs text-blue-200">Government of India</p>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-800"
            >
              <Bell className="w-4 h-4" />
            </Button>
            
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-blue-200">{getRoleDisplayName(user?.role || '')}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-blue-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Jurisdiction info bar */}
        {getJurisdictionDisplay() && (
          <div className="bg-blue-800 px-4 py-2 text-xs text-blue-100">
            {getJurisdictionDisplay()}
            {user?.department && ` | Department: ${user.department}`}
            {user?.agency && ` | Agency: ${user.agency}`}
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          flex flex-col
        `}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${item.active 
                    ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;