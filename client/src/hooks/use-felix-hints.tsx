import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

interface HintActivity {
  pageViews: Record<string, number>;
  timeSpent: Record<string, number>;
  lastVisit: Record<string, Date>;
  actionsCompleted: string[];
  dismissedHints: string[];
}

export function useFelixHints() {
  const [location] = useLocation();
  const [activity, setActivity] = useState<HintActivity>({
    pageViews: {},
    timeSpent: {},
    lastVisit: {},
    actionsCompleted: [],
    dismissedHints: []
  });

  // Track page visits
  useEffect(() => {
    const startTime = Date.now();
    
    setActivity(prev => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [location]: (prev.pageViews[location] || 0) + 1
      },
      lastVisit: {
        ...prev.lastVisit,
        [location]: new Date()
      }
    }));

    return () => {
      const timeSpent = Date.now() - startTime;
      setActivity(prev => ({
        ...prev,
        timeSpent: {
          ...prev.timeSpent,
          [location]: (prev.timeSpent[location] || 0) + timeSpent
        }
      }));
    };
  }, [location]);

  // Handle hint actions
  const handleHintAction = useCallback(async (hintId: string, action: string) => {
    setActivity(prev => ({
      ...prev,
      actionsCompleted: [...prev.actionsCompleted, `${hintId}:${action}`]
    }));

    // Specific action handlers
    switch (action) {
      case 'customize':
        // Navigate to dashboard customization
        window.location.href = '/dashboard?customize=true';
        break;
        
      case 'start':
        // Start quick guide
        window.location.href = '/felix?task=quick-start';
        break;
        
      case 'create':
        // Navigate to content creation
        if (hintId === 'content-calendar') {
          window.location.href = '/social?tab=calendar';
        } else if (hintId === 'review-response-template') {
          window.location.href = '/reviews?action=templates';
        }
        break;
        
      case 'connect':
        // Navigate to analytics connection
        window.location.href = '/settings?tab=integrations';
        break;
        
      case 'generate':
        // Generate report
        window.location.href = '/reports?action=generate';
        break;
        
      case 'optimize':
        // Navigate to optimization settings
        window.location.href = '/leads?action=optimize';
        break;
        
      case 'show':
        // Show automation options
        window.location.href = '/felix?task=automation';
        break;
        
      case 'create-post':
        // Navigate to social media posting
        window.location.href = '/social?action=create-post';
        break;
        
      default:
        // Send to Felix chat for general guidance
        window.location.href = `/felix?hint=${hintId}&action=${action}`;
    }

    // Track action completion via API if needed
    try {
      await fetch('/api/felix/hint-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hintId, action, timestamp: new Date() })
      });
    } catch (error) {
      console.log('Hint action tracking failed:', error);
    }
  }, []);

  const dismissHint = useCallback((hintId: string) => {
    setActivity(prev => ({
      ...prev,
      dismissedHints: [...prev.dismissedHints, hintId]
    }));
  }, []);

  return {
    activity,
    handleHintAction,
    dismissHint,
    currentPage: location
  };
}