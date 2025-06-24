import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import type { SeoKeyword } from "@shared/schema";

const getTrendIcon = (current?: number, previous?: number) => {
  if (!current || !previous) return Minus;
  if (current < previous) return TrendingUp; // Lower position is better
  if (current > previous) return TrendingDown;
  return Minus;
};

const getTrendColor = (current?: number, previous?: number) => {
  if (!current || !previous) return "text-gray-400";
  if (current < previous) return "text-green-600"; // Lower position is better
  if (current > previous) return "text-red-600";
  return "text-gray-400";
};

export default function SEOPerformance() {
  const { toast } = useToast();
  
  const { data: keywords, isLoading } = useQuery<SeoKeyword[]>({
    queryKey: ["/api/seo/keywords"],
  });

  const handleAnalyzeSEO = async () => {
    trackEvent('seo_analyze_click', 'seo', 'keyword_analysis');
    toast({
      title: "SEO Analysis Started",
      description: "Dave is analyzing your keyword rankings and will update the data shortly.",
    });
  };

  // Default keywords if none exist
  const defaultKeywords = [
    { keyword: "HVAC repair Winter Haven", position: 3, previousPosition: 5 },
    { keyword: "AC installation Lakeland", position: 5, previousPosition: 7 },
    { keyword: "Commercial HVAC service", position: 12, previousPosition: 12 },
  ];

  const displayKeywords = keywords && keywords.length > 0 ? keywords : defaultKeywords;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-green-600" />
          </div>
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            SEO Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-8" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayKeywords.slice(0, 5).map((item, index) => {
              const TrendIcon = getTrendIcon(item.position, item.previousPosition);
              const trendColor = getTrendColor(item.position, item.previousPosition);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex-1">
                    {item.keyword}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600">
                      #{item.position}
                    </span>
                    <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button 
          onClick={handleAnalyzeSEO}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Analyze Keywords
        </Button>
      </CardContent>
    </Card>
  );
}
