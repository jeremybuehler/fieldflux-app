import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle, AlertCircle, Info, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function SearchConsoleSetup() {
  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['/api/search-console/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-500" />
          <span>Google Search Console Integration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To get real keyword data, your Google service account needs access to both Google Analytics and Google Search Console.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Google Analytics API - Connected ✓</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {status?.apiEnabled ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>Google Search Console API - {status?.apiEnabled ? 'Enabled ✓' : 'Needs Enabling'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {status?.sitesFound > 0 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
            <span>Website Properties - {status?.sitesFound || 0} found</span>
          </div>

          {status?.serviceAccount && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Service Account:</strong> {status.serviceAccount}
            </div>
          )}

          {status?.sites && status.sites.length > 0 && (
            <div className="text-xs text-gray-600">
              <strong>Connected Sites:</strong>
              <ul className="mt-1 list-disc list-inside ml-2">
                {status.sites.map((site: string) => (
                  <li key={site}>{site}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-gray-900">Setup Steps:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
            <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
              Google Search Console <ExternalLink className="w-3 h-3 ml-1" />
            </a></li>
            <li>Add your website property if not already added</li>
            <li>In Google Cloud Console, add your service account email to Search Console:</li>
            <li className="ml-4 text-xs bg-white p-2 rounded border font-mono break-all">
              Service Account: your-service-account@project.iam.gserviceaccount.com
            </li>
            <li>Grant "Owner" or "Full User" permissions in Search Console Settings → Users and permissions</li>
          </ol>
        </div>

        <div className="flex space-x-3">
          <Button size="sm" variant="outline" asChild>
            <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
              Open Search Console
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer">
              Manage Service Account
            </a>
          </Button>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}