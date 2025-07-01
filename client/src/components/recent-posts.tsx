import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Calendar,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Send
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RecentPosts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts/recent"],
  });

  const publishMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", "/api/instagram/publish", { postId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Published",
        description: "Your post has been published to Instagram successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, "h:mm a");
    } else if (diffInHours < 168) {
      return format(date, "EEE h:mm a");
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Posts</CardTitle>
          <Link href="/create-post">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Create your first Instagram post to get started!</p>
            <Link href="/create-post">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post: any) => (
              <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Image */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative group">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">📷</span>
                      </div>
                      <p className="text-sm">No Image</p>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(post.status)}
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {post.status === "draft" && (
                          <DropdownMenuItem onClick={() => publishMutation.mutate(post.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Publish Now
                          </DropdownMenuItem>
                        )}
                        {post.instagramPostId && (
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Instagram
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="p-4">
                  <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                    {post.caption}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      {post.status === "scheduled" && post.scheduledFor ? (
                        <>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.scheduledFor)}</span>
                        </>
                      ) : post.publishedAt ? (
                        <>
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </>
                      )}
                    </div>
                    
                    {post.status === "published" && (
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{post.likes || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span>{post.comments || 0}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
