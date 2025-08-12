import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Copy, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResponsivePreviewProps {
  landingPage: {
    title: string;
    description: string;
    html: string;
    css: string;
    thumbnail?: string;
  };
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceSizes = {
  desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', height: '1024px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', height: '667px', label: 'Mobile', icon: Smartphone },
};

export function ResponsivePreview({ landingPage, onClose }: ResponsivePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const { toast } = useToast();

  const handleCopyCode = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.title}</title>
  <style>
${landingPage.css}
  </style>
</head>
<body>
${landingPage.html}
</body>
</html>`;
    
    navigator.clipboard.writeText(fullHTML);
    toast({
      title: "Code copied!",
      description: "Landing page HTML has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.title}</title>
  <style>
${landingPage.css}
  </style>
</head>
<body>
${landingPage.html}
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${landingPage.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Landing page has been downloaded as HTML file",
    });
  };

  const handleOpenInNewTab = () => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.title}</title>
  <style>
${landingPage.css}
  </style>
</head>
<body>
${landingPage.html}
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const currentDevice = deviceSizes[selectedDevice];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl h-full max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {landingPage.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {landingPage.description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            {/* Device Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {Object.entries(deviceSizes).map(([key, device]) => {
                const IconComponent = device.icon;
                return (
                  <Button
                    key={key}
                    variant={selectedDevice === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDevice(key as DeviceType)}
                    className={`flex items-center gap-2 ${
                      selectedDevice === key 
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{device.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {/* Preview Container */}
            <div 
              className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                selectedDevice === 'desktop' 
                  ? 'w-full h-full' 
                  : 'border border-gray-300 dark:border-gray-600'
              }`}
              style={{
                width: selectedDevice === 'desktop' ? '100%' : currentDevice.width,
                height: selectedDevice === 'desktop' ? '100%' : currentDevice.height,
                maxHeight: selectedDevice === 'desktop' ? '100%' : '80vh',
              }}
            >
              <iframe
                srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.title}</title>
  <style>
${landingPage.css}
  </style>
</head>
<body>
${landingPage.html}
</body>
</html>`}
                className="w-full h-full border-none"
                title="Landing Page Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              {selectedDevice === 'desktop' 
                ? 'Desktop Preview (Full Size)' 
                : `${currentDevice.label} Preview (${currentDevice.width} × ${currentDevice.height})`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}