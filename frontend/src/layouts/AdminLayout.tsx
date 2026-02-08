import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

import eatenLogo from "@/assets/eaten-logo.png";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-eaten-charcoal text-white flex-shrink-0">
        <div className="p-6 border-b border-white/10 flex justify-center">
          <img src={eatenLogo} alt="Eaten" className="h-12 w-auto brightness-0 invert" />
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="block p-3 rounded hover:bg-white/10 transition">
            Dashboard
          </Link>
          <Link to="/admin/services" className="block p-3 rounded hover:bg-white/10 transition">
            Services
          </Link>
          <Link to="/admin/zones" className="block p-3 rounded hover:bg-white/10 transition">
            Zones
          </Link>
          <Link to="/admin/bookings" className="block p-3 rounded hover:bg-white/10 transition">
            Bookings
          </Link>
          <Link to="/admin/chats" className="block p-3 rounded hover:bg-white/10 transition">
            Chats
          </Link>
        </nav>
        <div className="p-4 absolute bottom-0 w-64 border-t border-white/10">
          <Button variant="ghost" className="w-full text-white hover:text-white/80 hover:bg-white/10 justify-start" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
