import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  DollarSign
} from "lucide-react";

interface PerformanceChartsProps {
  timeRange: string;
}

export default function PerformanceCharts({ timeRange }: PerformanceChartsProps) {
  const [activeChart, setActiveChart] = useState("traffic");

  // Demo data for different chart types
  const trafficData = [
    { date: 'Jan 1', visitors: 1200, pageviews: 3400, bounce: 45 },
    { date: 'Jan 2', visitors: 1350, pageviews: 3800, bounce: 42 },
    { date: 'Jan 3', visitors: 1100, pageviews: 3200, bounce: 48 },
    { date: 'Jan 4', visitors: 1600, pageviews: 4200, bounce: 38 },
    { date: 'Jan 5', visitors: 1800, pageviews: 4800, bounce: 35 },
    { date: 'Jan 6', visitors: 2100, pageviews: 5400, bounce: 32 },
    { date: 'Jan 7', visitors: 2400, pageviews: 6100, bounce: 28 }
  ];

  const revenueData = [
    { month: 'Jul', revenue: 18500, leads: 45, conversions: 12 },
    { month: 'Aug', revenue: 22100, leads: 52, conversions: 15 },
    { month: 'Sep', revenue: 19800, leads: 48, conversions: 13 },
    { month: 'Oct', revenue: 26300, leads: 61, conversions: 18 },
    { month: 'Nov', revenue: 24700, leads: 58, conversions: 16 },
    { month: 'Dec', revenue: 28450, leads: 67, conversions: 21 }
  ];

  const leadSourceData = [
    { name: 'Google Ads', value: 35, color: '#3B82F6' },
    { name: 'Organic Search', value: 28, color: '#10B981' },
    { name: 'Facebook', value: 18, color: '#8B5CF6' },
    { name: 'Referrals', value: 12, color: '#F59E0B' },
    { name: 'Direct', value: 7, color: '#EF4444' }
  ];

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartTabs = [
    {
      id: 'traffic',
      label: 'Website Traffic',
      icon: Eye,
      description: 'Daily visitors and page views'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: DollarSign,
      description: 'Monthly revenue and conversion metrics'
    },
    {
      id: 'leads',
      label: 'Lead Sources',
      icon: Users,
      description: 'Lead generation by traffic source'
    }
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Performance Analytics
          </CardTitle>
          <Select defaultValue="compare">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compare">Compare Period</SelectItem>
              <SelectItem value="trend">Show Trend</SelectItem>
              <SelectItem value="forecast">Forecast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Comprehensive view of your marketing performance
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            {chartTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="traffic" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pageviewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip content={customTooltip} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#visitorsGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageviews"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#pageviewsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">2.4K</div>
                <div className="text-xs text-muted-foreground">Avg Daily Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">6.1K</div>
                <div className="text-xs text-muted-foreground">Avg Pageviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">28%</div>
                <div className="text-xs text-muted-foreground">Bounce Rate</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip content={customTooltip} />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">$28.5K</div>
                <div className="text-xs text-muted-foreground">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">67</div>
                <div className="text-xs text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">31%</div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-foreground flex-1">{source.name}</span>
                  <span className="text-sm font-medium text-muted-foreground">{source.value}%</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}