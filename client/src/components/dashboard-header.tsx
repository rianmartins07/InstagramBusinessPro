import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your Instagram marketing.</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-600 hover:text-gray-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Profile */}
          <div className="flex items-center space-x-3">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </span>
              </div>
            )}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email
                }
              </p>
              <p className="text-xs text-gray-500">
                {(user?.subscriptionTier || 'free').charAt(0).toUpperCase() + (user?.subscriptionTier || 'free').slice(1)} Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
