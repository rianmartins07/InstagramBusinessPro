import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Home, 
  Plus, 
  Calendar, 
  BarChart3, 
  Instagram, 
  Crown, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Create Posts", href: "/create-post", icon: Plus },
  { name: "Schedule", href: "#", icon: Calendar },
  { name: "Analytics", href: "#", icon: BarChart3 },
  { name: "Instagram Setup", href: "/instagram-setup", icon: Instagram },
  { name: "Subscription", href: "/subscription", icon: Crown },
  { name: "Business Profile", href: "/business-profile", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">SocialBoost</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors",
                  isActive && "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="ml-3 font-medium">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
