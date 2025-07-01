import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, User, Briefcase, Target } from "lucide-react";

export default function BusinessProfileCard() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/business-profile"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Business Profile</span>
          </CardTitle>
          <Link href="/business-profile">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {profile?.businessName ? (
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-600">Business Name</label>
              </div>
              <p className="text-gray-800 font-medium">{profile.businessName}</p>
            </div>

            {/* Industry */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Building2 className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-600">Industry</label>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {profile.industry}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="h-4 w-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-600">Description</label>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">
                {profile.description}
              </p>
            </div>

            {/* Target Audience */}
            {profile.targetAudience && (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-600">Target Audience</label>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {profile.targetAudience}
                </p>
              </div>
            )}

            {/* Edit Button */}
            <div className="pt-2 border-t border-gray-200">
              <Link href="/business-profile">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Complete Your Profile</h3>
            <p className="text-sm text-gray-600 mb-4">
              Tell us about your business to get better content suggestions
            </p>
            <Link href="/business-profile">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                Set Up Profile
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
