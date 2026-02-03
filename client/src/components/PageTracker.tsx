import { useEffect } from "react";
import { useLocation } from "wouter";

export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    const pageSlugMap: Record<string, string> = {
      '/': 'home',
      '/projects': 'projects',
      '/services': 'services',
      '/skills': 'skills',
      '/contact': 'contact'
    };

    const pageSlug = pageSlugMap[location];
    if (pageSlug) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug })
      }).catch(() => {});
    }
  }, [location]);
}

export default function PageTracker() {
  usePageTracking();
  return null;
}
