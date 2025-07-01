import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  CalendarPlus, 
  BarChart3, 
  ArrowRight,
  Instagram,
  Settings
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Generate AI Post",
      description: "Create content with AI assistance",
      icon: <Sparkles className="h-5 w-5" />,
      href: "/create-post",
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      iconBg: "bg-purple-100"
    },
    {
      title: "Bulk Schedule",
      description: "Schedule multiple posts at once",
      icon: <CalendarPlus className="h-5 w-5" />,
      href: "/create-post",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      iconBg: "bg-blue-100"
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "#",
      color: "bg-green-50 text-green-700 hover:bg-green-100",
      iconBg: "bg-green-100"
    },
    {
      title: "Instagram Setup",
      description: "Connect your business account",
      icon: <Instagram className="h-5 w-5" />,
      href: "/instagram-setup",
      color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      iconBg: "bg-pink-100"
    },
    {
      title: "Business Profile",
      description: "Update your business information",
      icon: <Settings className="h-5 w-5" />,
      href: "/business-profile",
      color: "bg-gray-50 text-gray-700 hover:bg-gray-100",
      iconBg: "bg-gray-100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full justify-between p-4 h-auto ${action.color} transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${action.iconBg} rounded-lg flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>

        {/* Featured Action */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">Need help getting started?</h4>
                <p className="text-sm opacity-90">Check out our step-by-step guide</p>
              </div>
              <Button size="sm" variant="secondary" className="text-gray-800 hover:text-gray-900">
                Guide
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
