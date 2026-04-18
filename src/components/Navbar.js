import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, User, Eye, EyeOff, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ query, onQueryChange, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => { await logout(); navigate("/"); };

  // Get saved email/password from localStorage (set during login)
  const savedEmail = localStorage.getItem("sc_email") || user?.email || "";
  const savedPassword = localStorage.getItem("sc_password") || "••••••••";

  return (
    <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 px-4 md:px-8">

        {/* Menu Button */}
        <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search recipes..."
            className="w-full rounded-full border py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Right Icons */}
        <div className="ml-auto flex items-center gap-2">
          <button className="relative hidden rounded-full p-2 hover:bg-gray-100 sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile Button */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white hover:scale-105 transition font-bold text-sm"
            >
              {user?.displayName ? user.displayName[0].toUpperCase() : <User className="h-5 w-5" />}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {/* Header */}
                <div className="bg-orange-500 px-4 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                      {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-bold text-base">{user?.displayName || "Chef"}</p>
                      <p className="text-xs text-orange-100">SmartChef Member</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  {/* Email */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{savedEmail}</p>
                  </div>

                  {/* Password */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Password</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 tracking-widest">
                        {showPass ? savedPassword : "••••••••"}
                      </p>
                      <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-orange-500 transition">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
