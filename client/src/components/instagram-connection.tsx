import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function InstagramConnection() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/business-profile"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isConnected = profile?.instagramConnected;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Instagram className="h-6 w-6 text-pink-600" />
            <span>Instagram Connection</span>
          </CardTitle>
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="h-4 w-4 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="h-4 w-4 mr-1" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">
                @{profile.instagramUsername}
              </h4>
              <p className="text-gray-600">Business Account</p>
              <p className="text-sm text-gray-500">2,847 followers</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Connect Your Instagram Business Account
            </h3>
            <p className="text-gray-600 mb-4">
              You'll need to connect your Instagram business account to start posting
            </p>
            <Link href="/instagram-setup">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                <Instagram className="h-4 w-4 mr-2" />
                Connect Instagram
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
