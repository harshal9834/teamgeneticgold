import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Search, 
  BarChart3, 
  Sparkles, 
  Globe, 
  FileText,
  Microscope 
} from "lucide-react";

const Navigation = () => {
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
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-ocean rounded-lg shadow-glow">
              <Microscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BioDiversity AI</h1>
              <p className="text-xs text-muted-foreground">eDNA Analysis Platform</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <Button variant="outline" size="sm" className="hidden lg:flex">
            <Globe className="w-4 h-4 mr-2" />
            Database Status
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;