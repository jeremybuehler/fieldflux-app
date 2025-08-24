import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

interface HintTrigger {
  type: 'idle' | 'struggle' | 'opportunity' | 'achievement';
  context: any;
  timestamp: Date;
}

export function useSmartHints() {
  const [location] = useLocation();
  const [triggers, setTriggers] = useState<HintTrigger[]>([]);
  const [pageStartTime, setPageStartTime] = useState(Date.now());
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [clickCount, setClickCount] = useState(0);
  const [formInteractions, setFormInteractions] = useState(0);

  // Reset tracking when page changes
  useEffect(() => {
    setPageStartTime(Date.now());
    setLastActivity(Date.now());
    setClickCount(0);
    setFormInteractions(0);
    setTriggers([]);
  }, [location]);

  // Track user activity
  useEffect(() => {
    const trackActivity = () => {
      setLastActivity(Date.now());
    };

    const trackClicks = () => {
      setClickCount(prev => prev + 1);
      trackActivity();
    };

    const trackFormInteraction = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA' ||
          (e.target as HTMLElement).tagName === 'SELECT') {
        setFormInteractions(prev => prev + 1);
        trackActivity();
      }
    };

    // Add event listeners
    document.addEventListener('click', trackClicks);
    document.addEventListener('keydown', trackActivity);
    document.addEventListener('scroll', trackActivity);
    document.addEventListener('focus', trackFormInteraction, true);
    document.addEventListener('input', trackFormInteraction, true);

    return () => {
      document.removeEventListener('click', trackClicks);
      document.removeEventListener('keydown', trackActivity);
      document.removeEventListener('scroll', trackActivity);
      document.removeEventListener('focus', trackFormInteraction, true);
      document.removeEventListener('input', trackFormInteraction, true);
    };
  }, []);

  // Smart hint detection
  useEffect(() => {
    const checkForHints = () => {
      const now = Date.now();
      const timeOnPage = now - pageStartTime;
      const timeSinceActivity = now - lastActivity;

      // Idle detection (user inactive for 30 seconds)
      if (timeSinceActivity > 30000 && timeOnPage > 60000) {
        addTrigger('idle', { timeSinceActivity, timeOnPage });
      }

      // Struggle detection (many clicks, little progress)
      if (clickCount > 20 && formInteractions === 0 && timeOnPage > 120000) {
        addTrigger('struggle', { clickCount, formInteractions, timeOnPage });
      }

      // Opportunity detection (specific page patterns)
      if (location.includes('/social') && timeOnPage > 60000 && formInteractions === 0) {
        addTrigger('opportunity', { 
          suggestion: 'create-content',
          timeOnPage,
          page: 'social'
        });
      }

      if (location.includes('/analytics') && timeOnPage > 30000) {
        addTrigger('opportunity', {
          suggestion: 'connect-analytics',
          timeOnPage,
          page: 'analytics'
        });
      }

      // Achievement detection (successful form completion)
      if (formInteractions > 3 && clickCount > 5) {
        addTrigger('achievement', { 
          formInteractions, 
          clickCount,
          completionType: 'form'
        });
      }
    };

    // Check every 15 seconds
    const interval = setInterval(checkForHints, 15000);
    return () => clearInterval(interval);
  }, [location, pageStartTime, lastActivity, clickCount, formInteractions]);

  const addTrigger = useCallback((type: HintTrigger['type'], context: any) => {
    setTriggers(prev => {
      // Avoid duplicate triggers
      const exists = prev.some(t => 
        t.type === type && 
        Date.now() - t.timestamp.getTime() < 300000 // 5 minutes
      );
      
      if (exists) return prev;
      
      return [...prev, {
        type,
        context,
        timestamp: new Date()
      }];
    });
  }, []);

  const dismissTrigger = useCallback((type: HintTrigger['type']) => {
    setTriggers(prev => prev.filter(t => t.type !== type));
  }, []);

  const handleHintAction = useCallback(async (action: string) => {
    // Track hint action engagement
    try {
      await fetch('/api/felix/hint-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          page: location,
          timestamp: new Date(),
          context: { clickCount, formInteractions, timeOnPage: Date.now() - pageStartTime }
        })
      });
    } catch (error) {
      console.log('Hint engagement tracking failed:', error);
    }

    // Handle specific actions
    switch (action) {
      case 'show-suggestions':
        window.location.href = '/felix?context=suggestions';
        break;
      case 'quick-tutorial':
        window.location.href = '/felix?task=tutorial';
        break;
      case 'get-help':
        window.location.href = '/felix?context=help';
        break;
      case 'watch-tutorial':
        window.location.href = '/felix?task=video-tutorial';
        break;
      case 'show-optimization':
        window.location.href = '/felix?context=optimization';
        break;
      case 'learn-more':
        window.location.href = '/felix?context=learn-more';
        break;
      case 'next-steps':
        window.location.href = '/felix?context=next-steps';
        break;
      case 'advanced-features':
        window.location.href = '/felix?context=advanced';
        break;
      default:
        window.location.href = `/felix?action=${action}`;
    }
  }, [location, clickCount, formInteractions, pageStartTime]);

  return {
    triggers,
    dismissTrigger,
    handleHintAction,
    userActivity: {
      timeOnPage: Date.now() - pageStartTime,
      timeSinceActivity: Date.now() - lastActivity,
      clickCount,
      formInteractions
    }
  };
}