import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/FISH-removebg-preview.png";

import {
  Upload,
  Search,
  BarChart3,
  Sparkles,
  Globe,
  FileText,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navigation = () => {
  const { user } = useAuth();

  function handleLogout() {
    signOut(auth);
  }

  const navItems = [
    { to: "/", icon: Upload, label: "Upload & QC" },
    { to: "/classification", icon: Search, label: "Classification" },
    { to: "/insights", icon: BarChart3, label: "Ecological Insights" },
    { to: "/novelty", icon: Sparkles, label: "Novelty Detection" },
    { to: "/maps", icon: Globe, label: "Geographic Maps" },
    { to: "/reports", icon: FileText, label: "Reports & Export" },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-bio">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">

          {/* LEFT — LOGO */}
          <div className="flex items-center space-x-3 flex-none pr-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <img src={logo} className="w-8 h-8 object-contain" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-wide">
                <span className="text-cyan-400">GENETIC</span>
                <span className="ml-1 text-amber-400">GOLD</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                eDNA Analysis Platform
              </p>
            </div>
          </div>

          {/* CENTER — SCROLLABLE NAV */}
          {user && (
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-2 w-max">

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition ${isActive
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </NavLink>
                ))}

              </div>
            </div>
          )}

          {/* RIGHT — USER INFO */}
          {/* RIGHT — USER INFO */}
          {user && (
            <div className="flex items-center space-x-4 flex-none pl-4">

              {/* PROFILE BUTTON */}
              <NavLink to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl flex items-center"
                >
                  👤
                  <span className="ml-2 font-medium">Profile</span>
                </Button>
              </NavLink>

              {/* USER NAME */}
              <span className="text-sm whitespace-nowrap max-w-[170px] truncate">
                {user.displayName || user.email}
              </span>

              {/* LOGOUT */}
              <Button
                variant="destructive"
                size="sm"
                className="h-9 rounded-xl"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}


        </div>
      </div>
    </nav>
  );
};

export default Navigation;
