import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  Eye,
  Users,
  MousePointer,
  DollarSign,
  Calendar
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'ppc' | 'seo';
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  progress: number;
}

export default function ActiveCampaigns() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Winter HVAC Emergency Services',
      type: 'ppc',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      budget: 2500,
      spent: 1847,
      impressions: 45280,
      clicks: 1456,
      leads: 47,
      progress: 74
    },
    {
      id: '2',
      name: 'Preventive Maintenance Email Series',
      type: 'email',
      status: 'active',
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      budget: 800,
      spent: 324,
      impressions: 12500,
      clicks: 875,
      leads: 23,
      progress: 41
    },
    {
      id: '3',
      name: 'Local SEO Content Push',
      type: 'seo',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      budget: 1500,
      spent: 650,
      impressions: 23400,
      clicks: 1240,
      leads: 31,
      progress: 43
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ppc': return '🎯';
      case 'email': return '📧';
      case 'seo': return '🔍';
      case 'social': return '📱';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ppc': return 'bg-red-50 text-red-700 border-red-200';
      case 'email': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'seo': return 'bg-green-50 text-green-700 border-green-200';
      case 'social': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'draft': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const calculateROI = (leads: number, spent: number) => {
    // Assuming average lead value of $150
    const revenue = leads * 150;
    const roi = spent > 0 ? ((revenue - spent) / spent) * 100 : 0;
    return roi;
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Active Campaigns
          </CardTitle>
          <Button size="sm" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor your ongoing marketing campaigns
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              {/* Campaign Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getTypeIcon(campaign.type)}</span>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs px-2 py-1 ${getTypeColor(campaign.type)} border`}>
                        {campaign.type.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(campaign.status)} border`}>
                        {campaign.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="font-medium text-foreground">
                    ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={campaign.progress} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {campaign.progress}% used
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {(campaign.impressions / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-muted-foreground">Impressions</div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <MousePointer className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {campaign.clicks.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Clicks</div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {campaign.leads}
                  </div>
                  <div className="text-xs text-muted-foreground">Leads</div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {calculateROI(campaign.leads, campaign.spent).toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
              </div>

              {/* Campaign Dates */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">$2.8K</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">101</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}