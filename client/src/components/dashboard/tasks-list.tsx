import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@shared/schema";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in_progress":
      return "In Progress";
    case "pending":
      return "Queued";
    default:
      return status;
  }
};

export default function TasksList() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Default tasks if none exist
  const defaultTasks = [
    {
      id: 1,
      title: "Google Analytics Report Generation",
      description: "Analyzing traffic patterns and conversion data",
      status: "in_progress",
      progress: 75,
      type: "analytics",
    },
    {
      id: 2,
      title: "Social Media Content Creation",
      description: "Created 5 posts for this week's schedule",
      status: "completed",
      progress: 100,
      type: "social",
    },
    {
      id: 3,
      title: "Local Listings Optimization",
      description: "Updating Google Business Profile and Yelp listings",
      status: "pending",
      progress: 25,
      type: "seo",
    },
  ];

  const displayTasks = tasks && tasks.length > 0 ? tasks : defaultTasks;
  const activeTasks = displayTasks.filter(task => task.status !== "completed");

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            Active Tasks
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {activeTasks.length} running
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-2 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No active tasks</p>
            <p className="text-xs text-gray-400 mt-1">
              Dave will create tasks as needed for your HVAC marketing
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-hvac-gray">
                    {task.title}
                  </h4>
                  <Badge variant={getStatusColor(task.status)} className="text-xs">
                    {getStatusText(task.status)}
                  </Badge>
                </div>
                <Progress 
                  value={task.progress || 0} 
                  className="mb-2 h-2"
                />
                <p className="text-xs text-gray-500">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
