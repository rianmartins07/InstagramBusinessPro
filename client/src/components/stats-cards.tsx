import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Heart, Users, Clock } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const postsThisMonth = stats?.postsThisMonth || 0;
  const monthlyLimit = stats?.monthlyLimit || 5;
  const engagementRate = stats?.engagementRate || "0%";
  const followersGrowth = stats?.followersGrowth || 0;
  const scheduledPosts = stats?.scheduledPosts || 0;

  const progressPercentage = monthlyLimit === -1 ? 0 : Math.min((postsThisMonth / monthlyLimit) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Posts This Month</p>
              <p className="text-2xl font-bold text-gray-800">{postsThisMonth}</p>
              <p className="text-sm text-gray-500">
                of {monthlyLimit === -1 ? '∞' : monthlyLimit} limit
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {monthlyLimit !== -1 && (
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-800">{engagementRate}</p>
              <p className="text-sm text-green-600">+0.8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Followers Growth</p>
              <p className="text-2xl font-bold text-gray-800">+{followersGrowth}</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Posts</p>
              <p className="text-2xl font-bold text-gray-800">{scheduledPosts}</p>
              <p className="text-sm text-gray-500">Next in 2 hours</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
