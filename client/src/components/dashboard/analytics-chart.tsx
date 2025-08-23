import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState } from "react";

// Sample data - in a real app, this would come from Google Analytics API
const generateTrafficData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    traffic: Math.floor(Math.random() * 300) + 300,
  }));
};

export default function AnalyticsChart() {
  const [period, setPeriod] = useState("7days");
  const [data] = useState(generateTrafficData());

  return (
    <div className="bg-white shadow-sm border rounded-xl fx-grain" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)'}}>
      <div className="border-b p-6" style={{borderColor: 'var(--border)'}}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{color: 'var(--fx-navy-900)'}}>
            Website Traffic
          </h3>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="traffic" 
                stroke="var(--fx-orange-600)"
                strokeWidth={2}
                dot={{ fill: "var(--fx-orange-600)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
