import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { Package, ShoppingBag, Image, LogOut } from 'lucide-react';

// Check if admin is authenticated by looking for token
const isAdminAuthenticated = () => !!localStorage.getItem('adminToken');

// Remove token and log out
const adminLogout = () => localStorage.removeItem('adminToken');

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/'); // Redirect to home page after logout
  };

  const navItems = [
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/banners', label: 'Banners', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */ }
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */  }
      <main className="ml-64 p-8 flex-1">
        <Outlet />
      </main>
    </div>
  );
}


/*
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, adminLogout } from '@/lib/adminUtils';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { Package, ShoppingBag, Image, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/banners', label: 'Banners', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-3 right-3">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
*/