import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

import eatenLogo from "@/assets/eaten-logo.png";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen flex bg-slate-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="w-64 bg-eaten-charcoal text-white flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="p-6 border-b border-white/10 flex justify-center">
          <img src={eatenLogo} alt="Eaten" className="h-12 w-auto brightness-0 invert" />
        </div>
        <nav className="p-4 space-y-2 flex-grow">
          <Link to="/admin/dashboard" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.dashboard')}
          </Link>
          <Link to="/admin/services" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.services')}
          </Link>
          <Link to="/admin/zones" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.zones')}
          </Link>
          <Link to="/admin/bookings" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.bookings')}
          </Link>
          <Link to="/admin/chats" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.chats')}
          </Link>
          <Link to="/admin/reports" className="block p-3 rounded hover:bg-white/10 transition">
            {t('sidebar.reports')}
          </Link>
          <div className="pt-4 border-t border-white/10">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Systems</p>
            <Link to="/admin/users" className="block p-3 rounded hover:bg-white/10 transition">
              {t('sidebar.users')}
            </Link>
            <Link to="/admin/permissions" className="block p-3 rounded hover:bg-white/10 transition">
              {t('sidebar.permissions')}
            </Link>
            <Link to="/admin/logs" className="block p-3 rounded hover:bg-white/10 transition">
              {t('sidebar.logs')}
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full text-white hover:text-white/80 hover:bg-white/10 justify-start gap-2" 
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            {i18n.language === "en" ? "العربية" : "English"}
          </Button>
          <Button variant="ghost" className="w-full text-white hover:text-white/80 hover:bg-white/10 justify-start" onClick={handleLogout}>
            {t('sidebar.logout')}
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
