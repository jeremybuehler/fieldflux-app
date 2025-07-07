import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import TopNavigation from "@/components/layout/top-navigation";
import { UserPlus, Mail, Phone, Calendar, Filter, Search, MoreVertical, MessageSquare, CheckCircle, Clock, AlertCircle, TrendingUp, Star, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, type Lead, type InsertLead } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";

const leadStatuses = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { value: "qualified", label: "Qualified", color: "bg-green-100 text-green-800" },
  { value: "converted", label: "Converted", color: "bg-purple-100 text-purple-800" },
  { value: "lost", label: "Lost", color: "bg-red-100 text-red-800" },
];

const leadPriorities = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const addLeadMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Lead Added",
        description: "New lead has been added successfully.",
      });
      trackEvent('lead_added', 'leads', 'manual_entry');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Lead> }) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Lead Updated",
        description: "Lead has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const qualifyLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/leads/${id}/qualify`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Lead Qualified",
        description: "Lead has been automatically qualified based on criteria.",
      });
      trackEvent('lead_qualified', 'leads', 'auto_qualification');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to qualify lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      location: "",
      priority: "medium",
      status: "new",
    },
  });

  const onSubmit = (data: InsertLead) => {
    addLeadMutation.mutate(data);
  };

  const filteredLeads = leads?.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const getStatusColor = (status: string) => {
    return leadStatuses.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    return leadPriorities.find(p => p.value === priority)?.color || "bg-gray-100 text-gray-800";
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getLeadStats = () => {
    const total = leads?.length || 0;
    const newLeads = leads?.filter(l => l.status === "new").length || 0;
    const qualified = leads?.filter(l => l.status === "qualified").length || 0;
    const converted = leads?.filter(l => l.status === "converted").length || 0;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return { total, newLeads, qualified, converted, conversionRate };
  };

  const stats = getLeadStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <TopNavigation title="Lead Management" />

      {/* Main Content */}
      <div className="p-4 lg:p-8 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Leads</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <UserPlus className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">New Leads</p>
                  <p className="text-2xl font-bold">{stats.newLeads}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Qualified</p>
                  <p className="text-2xl font-bold">{stats.qualified}</p>
                </div>
                <Target className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {leadStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {leadPriorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter lead name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Needed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter service type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {leadPriorities.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addLeadMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {addLeadMutation.isPending ? "Adding..." : "Add Lead"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leads List */}
        <Card>
          <CardHeader>
            <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            <CardDescription>
              Manage and track your business leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No leads found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Add your first lead to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {leadStatuses.find(s => s.value === lead.status)?.label}
                          </Badge>
                          <Badge className={getPriorityColor(lead.priority)}>
                            {leadPriorities.find(p => p.value === lead.priority)?.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {lead.service} • {lead.location}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(lead.createdAt!)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {lead.status === "new" && (
                          <Button
                            size="sm"
                            onClick={() => qualifyLeadMutation.mutate(lead.id)}
                            disabled={qualifyLeadMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Target className="w-4 h-4 mr-1" />
                            Qualify
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeadMutation.mutate({ 
                            id: lead.id, 
                            updates: { status: lead.status === "contacted" ? "new" : "contacted" } 
                          })}
                          disabled={updateLeadMutation.isPending}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {lead.status === "contacted" ? "Mark New" : "Contact"}
                        </Button>
                        
                        {lead.status !== "converted" && (
                          <Button
                            size="sm"
                            onClick={() => updateLeadMutation.mutate({ 
                              id: lead.id, 
                              updates: { status: "converted" } 
                            })}
                            disabled={updateLeadMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Convert
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
      </div>
    </div>
  );
}