import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Facebook, TrendingUp, Star } from "lucide-react";
import type { Activity } from "@shared/schema";

const getActivityIcon = (type: string) => {
  switch (type) {
    case "wordpress":
      return Edit;
    case "social":
      return Facebook;
    case "seo":
      return TrendingUp;
    case "review":
      return Star;
    default:
      return Edit;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "wordpress":
      return "bg-primary/10 text-primary";
    case "social":
      return "bg-hvac-orange/10 text-hvac-orange";
    case "seo":
      return "bg-green-100 text-green-600";
    case "review":
      return "bg-yellow-100 text-yellow-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            Dave's Activity
          </CardTitle>
          <span className="text-sm text-gray-500">
            {activities && activities.length > 0 
              ? `Last updated ${formatTimeAgo(new Date(activities[0].createdAt!))}`
              : "No recent activity"
            }
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No recent activity to display</p>
            <p className="text-gray-400 text-xs mt-1">
              Dave will start logging activities as tasks are completed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-hvac-gray">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.description}
                      </p>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(new Date(activity.createdAt!))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
