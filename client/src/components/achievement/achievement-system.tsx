import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trophy,
  Star,
  Target,
  Zap,
  Users,
  MessageSquare,
  BarChart3,
  Calendar,
  CheckCircle,
  Award,
  Sparkles,
  TrendingUp,
  Lock,
  Gift,
  Crown,
  Shield,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  category: "onboarding" | "engagement" | "content" | "analytics" | "social" | "reviews";
  difficulty: "easy" | "medium" | "hard" | "expert";
  requirements: string[];
  progress?: number;
  maxProgress?: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  unlockedAt?: Date;
  completedAt?: Date;
  reward?: string;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  nextLevelPoints: number;
  achievements: Achievement[];
  streak: number;
  lastActivity: Date;
}

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'isUnlocked' | 'isCompleted' | 'progress'>[] = [
  // Onboarding Achievements
  {
    id: "first-login",
    title: "Welcome Aboard!",
    description: "Complete your first login to FieldFlux",
    icon: <Zap className="w-6 h-6" />,
    points: 50,
    category: "onboarding",
    difficulty: "easy",
    requirements: ["Log in to FieldFlux"],
    maxProgress: 1,
    reward: "Unlock personalized dashboard"
  },
  {
    id: "profile-complete",
    title: "Profile Pro",
    description: "Complete your business profile setup",
    icon: <Users className="w-6 h-6" />,
    points: 100,
    category: "onboarding",
    difficulty: "easy",
    requirements: ["Fill out business information", "Add business description", "Set preferences"],
    maxProgress: 3,
    reward: "Unlock advanced features"
  },
  {
    id: "onboarding-wizard",
    title: "Setup Specialist",
    description: "Complete the full onboarding wizard",
    icon: <Target className="w-6 h-6" />,
    points: 200,
    category: "onboarding",
    difficulty: "medium",
    requirements: ["Complete all onboarding steps", "Generate AI recommendations"],
    maxProgress: 5,
    reward: "Unlock AI coaching features"
  },

  // Engagement Achievements
  {
    id: "daily-visitor",
    title: "Daily Explorer",
    description: "Visit FieldFlux for 3 consecutive days",
    icon: <Calendar className="w-6 h-6" />,
    points: 150,
    category: "engagement",
    difficulty: "medium",
    requirements: ["Login 3 days in a row"],
    maxProgress: 3,
    reward: "Unlock streak bonuses"
  },
  {
    id: "feature-explorer",
    title: "Feature Hunter",
    description: "Try 5 different features in FieldFlux",
    icon: <Sparkles className="w-6 h-6" />,
    points: 250,
    category: "engagement",
    difficulty: "medium",
    requirements: ["Use dashboard", "Create content", "Check analytics", "Manage reviews", "Schedule social posts"],
    maxProgress: 5,
    reward: "Unlock power user badge"
  },

  // Content Achievements
  {
    id: "content-creator",
    title: "Content Creator",
    description: "Generate your first AI-powered content",
    icon: <MessageSquare className="w-6 h-6" />,
    points: 100,
    category: "content",
    difficulty: "easy",
    requirements: ["Generate AI content"],
    maxProgress: 1,
    reward: "Unlock advanced content templates"
  },
  {
    id: "content-master",
    title: "Content Master",
    description: "Create 10 pieces of content",
    icon: <Award className="w-6 h-6" />,
    points: 500,
    category: "content",
    difficulty: "hard",
    requirements: ["Create 10 different content pieces"],
    maxProgress: 10,
    reward: "Unlock premium content features"
  },

  // Social Media Achievements
  {
    id: "social-starter",
    title: "Social Starter",
    description: "Schedule your first social media post",
    icon: <Calendar className="w-6 h-6" />,
    points: 75,
    category: "social",
    difficulty: "easy",
    requirements: ["Schedule a social media post"],
    maxProgress: 1,
    reward: "Unlock bulk scheduling"
  },
  {
    id: "social-scheduler",
    title: "Social Scheduler",
    description: "Schedule posts for 7 days ahead",
    icon: <TrendingUp className="w-6 h-6" />,
    points: 300,
    category: "social",
    difficulty: "medium",
    requirements: ["Schedule 7 social posts"],
    maxProgress: 7,
    reward: "Unlock auto-posting features"
  },

  // Analytics Achievements
  {
    id: "data-explorer",
    title: "Data Explorer",
    description: "View your first analytics report",
    icon: <BarChart3 className="w-6 h-6" />,
    points: 100,
    category: "analytics",
    difficulty: "easy",
    requirements: ["View analytics dashboard"],
    maxProgress: 1,
    reward: "Unlock advanced metrics"
  },
  {
    id: "metrics-master",
    title: "Metrics Master",
    description: "Generate 5 different analytics reports",
    icon: <Trophy className="w-6 h-6" />,
    points: 400,
    category: "analytics",
    difficulty: "hard",
    requirements: ["Generate 5 analytics reports"],
    maxProgress: 5,
    reward: "Unlock custom dashboards"
  },

  // Review Achievements
  {
    id: "review-responder",
    title: "Review Responder",
    description: "Respond to your first customer review",
    icon: <Star className="w-6 h-6" />,
    points: 125,
    category: "reviews",
    difficulty: "easy",
    requirements: ["Respond to a review"],
    maxProgress: 1,
    reward: "Unlock AI review responses"
  },
  {
    id: "reputation-guardian",
    title: "Reputation Guardian",
    description: "Respond to 20 customer reviews",
    icon: <Shield className="w-6 h-6" />,
    points: 600,
    category: "reviews",
    difficulty: "expert",
    requirements: ["Respond to 20 reviews"],
    maxProgress: 20,
    reward: "Unlock reputation management tools"
  },

  // Expert Level Achievements
  {
    id: "fieldflux-expert",
    title: "FieldFlux Expert",
    description: "Reach Level 10 and master all features",
    icon: <Crown className="w-6 h-6" />,
    points: 1000,
    category: "engagement",
    difficulty: "expert",
    requirements: ["Reach level 10", "Complete 15 achievements"],
    maxProgress: 25,
    reward: "Unlock expert features & priority support"
  },
  {
    id: "streak-champion",
    title: "Streak Champion",
    description: "Maintain a 30-day activity streak",
    icon: <Flame className="w-6 h-6" />,
    points: 750,
    category: "engagement",
    difficulty: "expert",
    requirements: ["Login for 30 consecutive days"],
    maxProgress: 30,
    reward: "Unlock lifetime streak bonuses"
  }
];

const getDifficultyColor = (difficulty: Achievement['difficulty']) => {
  switch (difficulty) {
    case 'easy': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'hard': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'expert': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getCategoryIcon = (category: Achievement['category']) => {
  switch (category) {
    case 'onboarding': return <Target className="w-4 h-4" />;
    case 'engagement': return <Zap className="w-4 h-4" />;
    case 'content': return <MessageSquare className="w-4 h-4" />;
    case 'analytics': return <BarChart3 className="w-4 h-4" />;
    case 'social': return <Calendar className="w-4 h-4" />;
    case 'reviews': return <Star className="w-4 h-4" />;
    default: return <Trophy className="w-4 h-4" />;
  }
};

interface AchievementSystemProps {
  userProgress: UserProgress;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

export function AchievementSystem({ userProgress, onAchievementUnlock }: AchievementSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);

  const categories = ['all', 'onboarding', 'engagement', 'content', 'analytics', 'social', 'reviews'] as const;

  const filteredAchievements = userProgress.achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (!showCompleted && achievement.isCompleted) return false;
    return true;
  });

  const levelProgress = (userProgress.experiencePoints / userProgress.nextLevelPoints) * 100;

  const completedCount = userProgress.achievements.filter(a => a.isCompleted).length;
  const totalCount = userProgress.achievements.length;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-white to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span>Your Progress</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Level {userProgress.level} • {userProgress.totalPoints} points earned
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{completedCount}/{totalCount}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progress to Level {userProgress.level + 1}</span>
                <span>{userProgress.experiencePoints}/{userProgress.nextLevelPoints} XP</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
            
            {userProgress.streak > 0 && (
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  {userProgress.streak} day streak! Keep it up!
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "capitalize",
              selectedCategory === category && "bg-blue-600 text-white"
            )}
          >
            {category !== 'all' && getCategoryIcon(category as Achievement['category'])}
            <span className="ml-1">{category}</span>
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onUnlock={onAchievementUnlock}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No achievements found</h3>
          <p className="text-gray-500">Try adjusting your filters or start completing tasks!</p>
        </div>
      )}
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  onUnlock?: (achievement: Achievement) => void;
}

export function AchievementCard({ achievement, onUnlock }: AchievementCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const progressPercentage = achievement.maxProgress 
    ? (achievement.progress || 0) / achievement.maxProgress * 100 
    : 0;

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger asChild>
        <Card className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-lg",
          achievement.isCompleted 
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" 
            : achievement.isUnlocked
              ? "bg-white border-gray-200 hover:border-blue-300"
              : "bg-gray-50 border-gray-200 opacity-75"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                achievement.isCompleted
                  ? "bg-green-100 text-green-600"
                  : achievement.isUnlocked
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
              )}>
                {achievement.isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : achievement.isUnlocked ? (
                  achievement.icon
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={cn(
                    "font-semibold text-sm",
                    achievement.isCompleted ? "text-green-800" : "text-gray-900"
                  )}>
                    {achievement.title}
                  </h4>
                  <Badge className={cn("text-xs", getDifficultyColor(achievement.difficulty))}>
                    {achievement.difficulty}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-3 h-3" />
                    <span>{achievement.points} pts</span>
                  </div>
                  
                  {achievement.maxProgress && achievement.maxProgress > 1 && (
                    <div className="text-gray-500">
                      {achievement.progress || 0}/{achievement.maxProgress}
                    </div>
                  )}
                </div>

                {achievement.maxProgress && achievement.maxProgress > 1 && achievement.isUnlocked && (
                  <Progress 
                    value={progressPercentage} 
                    className="h-1.5 mt-2"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              achievement.isCompleted
                ? "bg-green-100 text-green-600"
                : achievement.isUnlocked
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400"
            )}>
              {achievement.isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : achievement.isUnlocked ? (
                achievement.icon
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <span>{achievement.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">{achievement.description}</p>
          
          <div className="flex items-center space-x-4">
            <Badge className={cn("text-xs", getDifficultyColor(achievement.difficulty))}>
              {achievement.difficulty}
            </Badge>
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span className="font-medium">{achievement.points} points</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">Requirements:</h4>
            <ul className="space-y-1">
              {achievement.requirements.map((req, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {achievement.reward && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Reward</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">{achievement.reward}</p>
            </div>
          )}

          {achievement.maxProgress && achievement.maxProgress > 1 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progress</span>
                <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ACHIEVEMENT_DEFINITIONS };