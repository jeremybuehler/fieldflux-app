import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Eye,
  ExternalLink,
  Copy,
  Download,
  Monitor
} from "lucide-react";
import { ResponsivePreview } from './responsive-preview';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  landingPageData?: {
    html: string;
    css: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
}

interface LandingPageChatProps {
  onLandingPageGenerated?: (data: any) => void;
}

export default function LandingPageChat({ onLandingPageGenerated }: LandingPageChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI landing page assistant. I can help you create high-converting landing pages for your field service business. Just describe what kind of landing page you need, your target audience, and your goals!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);
  const [previewPage, setPreviewPage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/generate-landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userPrompt: inputMessage
        })
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "I've created a landing page based on your requirements!",
        timestamp: new Date(),
        landingPageData: data.landingPage ? {
          html: data.landingPage.html,
          css: data.landingPage.css,
          title: data.landingPage.title,
          description: data.landingPage.description,
          thumbnail: data.landingPage.thumbnail
        } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.landingPage) {
        const newPage = {
          id: Date.now().toString(),
          ...data.landingPage,
          createdAt: new Date(),
          messages: [...messages, userMessage]
        };
        setGeneratedPages(prev => [...prev, newPage]);
        onLandingPageGenerated?.(newPage);
      }

      toast({
        title: "Landing Page Generated",
        description: "Your AI-powered landing page is ready for review!"
      });

    } catch (error) {
      console.error('Error generating landing page:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error while generating your landing page. Please try again with a different approach or check your connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Generation Error",
        description: "Failed to generate landing page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openLandingPage = (pageData: any) => {
    // Create a new window with the generated landing page
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageData.title || 'Generated Landing Page'}</title>
          <style>${pageData.css}</style>
        </head>
        <body>
          ${pageData.html}
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const copyPageCode = (pageData: any) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title || 'Generated Landing Page'}</title>
  <style>${pageData.css}</style>
</head>
<body>
  ${pageData.html}
</body>
</html>`;

    navigator.clipboard.writeText(fullHtml).then(() => {
      toast({
        title: "Code Copied",
        description: "Landing page HTML copied to clipboard!"
      });
    });
  };

  return (
    <div className="flex flex-col h-[600px] glass-morphism rounded-xl overflow-hidden shadow-fieldflux">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold gradient-text">AI Landing Page Generator</h3>
            <p className="text-sm text-fieldflux-secondary">Create high-converting pages with AI</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-xl p-3 ${
                  message.role === 'user' 
                    ? 'bg-teal-600 text-white ml-auto' 
                    : 'glass-morphism border border-white/20'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* Landing Page Preview */}
                {message.landingPageData && (
                  <div className="mt-3 p-4 glass-morphism rounded-xl border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium gradient-text">{message.landingPageData.title}</h4>
                        <p className="text-xs text-fieldflux-secondary">{message.landingPageData.description}</p>
                      </div>
                      <Badge className="status-modern-online">
                        Generated
                      </Badge>
                    </div>
                    
                    {/* Thumbnail Preview */}
                    <div className="relative bg-white rounded-lg border border-gray-200 p-4 mb-3 hover-lift cursor-pointer"
                         onClick={() => openLandingPage(message.landingPageData)}>
                      <div className="text-center">
                        <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center mb-2">
                          <Eye className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-xs text-gray-600">Click to preview full page</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-teal-600 text-white rounded-full p-1">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => openLandingPage(message.landingPageData)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewPage(message.landingPageData)}
                        className="glass-morphism border-white/20"
                        title="Responsive Preview"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyPageCode(message.landingPageData)}
                        className="glass-morphism border-white/20"
                        title="Copy Code"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-fieldflux-secondary mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass-morphism rounded-xl p-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <p className="text-sm text-fieldflux-secondary">Generating your landing page...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the landing page you want to create..."
            className="flex-1 glass-morphism border-white/20"
            disabled={isGenerating}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isGenerating || !inputMessage.trim()}
            className="gradient-accent hover-glow"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Create a plumber service page",
            "HVAC emergency landing page",
            "Electrical services homepage",
            "Landscaping business page"
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setInputMessage(suggestion)}
              disabled={isGenerating}
              className="text-xs glass-morphism border-white/20 hover-lift"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Responsive Preview Modal */}
      {previewPage && (
        <ResponsivePreview 
          landingPage={previewPage}
          onClose={() => setPreviewPage(null)}
        />
      )}
    </div>
  );
}