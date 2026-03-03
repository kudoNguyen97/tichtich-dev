import { useCallback, useState } from "react";

export const useSplash = () => {
    if (import.meta.env.MODE === 'development') {
          localStorage.removeItem('app_splash_shown');
      }

    const [showSplash] = useState(() => {
      const seen = localStorage.getItem('app_splash_shown');
      if (seen) return false;
      localStorage.setItem('app_splash_shown', '1');
      return true;
    });
  
    const [visible, setVisible] = useState(showSplash);
  
    const dismiss = useCallback(() => setVisible(false), []);
  
    return { visible, dismiss };
  };