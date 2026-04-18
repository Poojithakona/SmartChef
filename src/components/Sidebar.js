import React from "react";
import { Home, PlusCircle, ChefHat, Heart, LogOut, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Add Recipe", icon: PlusCircle, path: "/add" },
  { label: "Manage Recipes", icon: ChefHat, path: "/manage" },
  { label: "Favorites", icon: Heart, path: "/favorites" },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNav = (path) => { navigate(path); onClose(); };
  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r shadow transition-transform duration-300 flex-shrink-0 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-500" />
            <span className="font-bold text-lg">SmartChef</span>
          </div>
          <button onClick={onClose} className="md:hidden"><X /></button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col flex-1 p-4 gap-2">
          {/* User info */}
          {user && (
            <div className="px-3 py-3 mb-2 bg-orange-50 rounded-xl">
              <p className="text-xs font-bold text-orange-600 truncate">{user.displayName || "Chef"}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}

          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  active ? "bg-orange-100 text-orange-600 font-semibold" : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}

          <div className="flex-1" />

          <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-100 rounded-lg transition">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
