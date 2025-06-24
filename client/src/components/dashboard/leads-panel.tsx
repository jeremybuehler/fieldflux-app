import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { Lead } from "@shared/schema";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "high":
      return "Hot Lead";
    case "medium":
      return "Medium";
    case "low":
      return "Low Priority";
    default:
      return priority;
  }
};

const getServiceTypeColor = (service: string) => {
  if (service.toLowerCase().includes("commercial")) return "default";
  if (service.toLowerCase().includes("install")) return "secondary";
  return "outline";
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Less than an hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export default function LeadsPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Lead> }) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  const handleContactLead = (lead: Lead) => {
    trackEvent('lead_contact_attempt', 'leads', 'contact_button');
    toast({
      title: "Contacting Lead",
      description: `Initiating contact with ${lead.name}`,
    });
    
    updateLeadMutation.mutate({
      id: lead.id,
      updates: { status: "contacted" }
    });
  };

  const handleScheduleEstimate = (lead: Lead) => {
    trackEvent('lead_schedule_estimate', 'leads', 'schedule_button');
    toast({
      title: "Scheduling Estimate",
      description: `Estimate scheduled for ${lead.name}`,
    });
    
    updateLeadMutation.mutate({
      id: lead.id,
      updates: { status: "scheduled" }
    });
  };

  const handleFollowUp = (lead: Lead) => {
    trackEvent('lead_follow_up', 'leads', 'follow_up_button');
    toast({
      title: "Follow-up Scheduled",
      description: `Follow-up reminder set for ${lead.name}`,
    });
    
    updateLeadMutation.mutate({
      id: lead.id,
      updates: { status: "follow_up" }
    });
  };

  // Default leads if none exist
  const defaultLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "(863) 555-0123",
      service: "AC repair",
      location: "Winter Haven",
      priority: "high",
      status: "new",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      name: "Mike's Restaurant",
      email: "mike@restaurant.com",
      phone: "(863) 555-0456",
      service: "Commercial HVAC maintenance",
      location: "Lakeland",
      priority: "medium",
      status: "new",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: 3,
      name: "David Wilson",
      email: "david@email.com",
      phone: "(863) 555-0789",
      service: "New HVAC installation",
      location: "Lakeland, FL",
      priority: "medium",
      status: "new",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  const displayLeads = leads && leads.length > 0 ? leads : defaultLeads;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-hvac-gray">
            Recent Leads
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : displayLeads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No leads yet</p>
            <p className="text-xs text-gray-400 mt-1">
              New leads will appear here as they come in
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-hvac-gray">
                        {lead.name}
                      </h4>
                      <Badge variant={getPriorityColor(lead.priority)} className="text-xs">
                        {getPriorityText(lead.priority)}
                      </Badge>
                      <Badge variant={getServiceTypeColor(lead.service)} className="text-xs">
                        {lead.service.includes("Commercial") ? "Commercial" : 
                         lead.service.includes("install") ? "New Install" : "Service"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {lead.service} - {lead.location}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {lead.phone && (
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {lead.email}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(new Date(lead.createdAt!))}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {lead.priority === "high" ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleContactLead(lead)}
                        className="bg-primary hover:bg-primary/90 text-white text-xs px-3 py-1"
                      >
                        Contact
                      </Button>
                    ) : lead.service.toLowerCase().includes("commercial") ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleScheduleEstimate(lead)}
                        className="bg-hvac-orange hover:bg-hvac-orange/90 text-white text-xs px-3 py-1"
                      >
                        Schedule
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleFollowUp(lead)}
                        className="text-xs px-3 py-1"
                      >
                        Follow Up
                      </Button>
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
