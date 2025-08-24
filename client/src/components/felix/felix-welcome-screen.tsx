import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Calendar,
  ArrowRight,
  Play
} from "lucide-react";

interface WelcomeScreenProps {
  onTaskSelect: (taskId: string) => void;
}

export default function FelixWelcomeScreen({ onTaskSelect }: WelcomeScreenProps) {
  const popularTasks = [
    {
      id: "create-post",
      title: "Create Social Media Post",
      description: "Generate engaging content for your field service business",
      icon: MessageSquare,
      category: "Content",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "analyze-performance",
      title: "Analyze Performance",
      description: "Review your marketing metrics and get actionable insights",
      icon: BarChart3,
      category: "Analytics",
      color: "from-green-500 to-green-600"
    },
    {
      id: "generate-leads",
      title: "Generate Leads",
      description: "Develop strategies to attract new customers",
      icon: Target,
      category: "Marketing",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "schedule-campaign",
      title: "Schedule Campaign",
      description: "Plan and organize your marketing activities",
      icon: Calendar,
      category: "Planning",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Welcome to Felix AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your intelligent marketing assistant for field service professionals. I'll help you create content, analyze performance, and grow your business.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            AI Powered
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            Field Service Optimized
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
            Ready to Help
          </Badge>
        </div>
      </div>

      {/* Popular Tasks */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">What would you like to do today?</h2>
          <p className="text-gray-600">Choose a task below or ask me anything in the chat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularTasks.map((task) => (
            <Card
              key={task.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 overflow-hidden"
              onClick={() => onTaskSelect(task.id)}
            >
              <CardContent className="p-0">
                <div className={`h-2 bg-gradient-to-r ${task.color}`}></div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${task.color} group-hover:scale-110 transition-transform shadow-lg`}>
                      <task.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      {task.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">New to Felix?</h3>
            <p className="text-gray-600 mb-4">
              Take a quick 2-minute tour to see how I can transform your field service marketing
            </p>
            <Button 
              onClick={() => onTaskSelect("quick-start")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Quick Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}