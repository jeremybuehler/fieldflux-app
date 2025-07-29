import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface EngagementSession {
  sessionId: string;
  startTime: Date;
  pagesVisited: string[];
  actionsPerformed: string[];
  clicksCount: number;
  scrollDepth: number;
  deviceType: string;
  userAgent: string;
}

export const useEngagementTracking = () => {
  const sessionRef = useRef<EngagementSession | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Track session mutation
  const trackSessionMutation = useMutation({
    mutationFn: async (sessionData: Omit<EngagementSession, 'startTime'> & { duration: number }) => {
      const response = await fetch('/api/ai-coach/track-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) throw new Error('Failed to track session');
      return response.json();
    },
  });

  // Initialize session
  const startTracking = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 
                      /Tablet|iPad/i.test(navigator.userAgent) ? 'tablet' : 'desktop';

    sessionRef.current = {
      sessionId,
      startTime: new Date(),
      pagesVisited: [window.location.pathname],
      actionsPerformed: [],
      clicksCount: 0,
      scrollDepth: 0,
      deviceType,
      userAgent: navigator.userAgent,
    };

    setIsTracking(true);
  };

  // Track page visit
  const trackPageVisit = (path: string) => {
    if (sessionRef.current && !sessionRef.current.pagesVisited.includes(path)) {
      sessionRef.current.pagesVisited.push(path);
    }
  };

  // Track action
  const trackAction = (action: string) => {
    if (sessionRef.current) {
      sessionRef.current.actionsPerformed.push(`${action}_${Date.now()}`);
    }
  };

  // Track click
  const trackClick = () => {
    if (sessionRef.current) {
      sessionRef.current.clicksCount += 1;
    }
  };

  // Track scroll depth
  const trackScrollDepth = () => {
    if (sessionRef.current) {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      sessionRef.current.scrollDepth = Math.max(sessionRef.current.scrollDepth, scrollPercent || 0);
    }
  };

  // End session and send data
  const endTracking = () => {
    if (sessionRef.current && isTracking) {
      const duration = Math.round((new Date().getTime() - sessionRef.current.startTime.getTime()) / 1000);
      
      const sessionData = {
        sessionId: sessionRef.current.sessionId,
        pagesVisited: sessionRef.current.pagesVisited,
        actionsPerformed: sessionRef.current.actionsPerformed,
        clicksCount: sessionRef.current.clicksCount,
        scrollDepth: sessionRef.current.scrollDepth,
        deviceType: sessionRef.current.deviceType,
        userAgent: sessionRef.current.userAgent,
        duration,
      };

      trackSessionMutation.mutate(sessionData);
      sessionRef.current = null;
      setIsTracking(false);
    }
  };

  // Auto-track scroll and clicks
  useEffect(() => {
    if (!isTracking) return;

    const handleScroll = () => trackScrollDepth();
    const handleClick = () => trackClick();

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, [isTracking]);

  // Auto-start tracking and cleanup on unmount
  useEffect(() => {
    startTracking();

    return () => {
      endTracking();
    };
  }, []);

  // Track page changes
  useEffect(() => {
    trackPageVisit(window.location.pathname);
  }, [window.location.pathname]);

  return {
    isTracking,
    trackAction,
    trackPageVisit,
    trackClick,
    trackScrollDepth,
    startTracking,
    endTracking,
  };
};