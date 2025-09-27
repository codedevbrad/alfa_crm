import { useEffect, useState } from "react"

interface GreetingState {
  currentTime: Date | null;
  isClient: boolean;
}


// Hook for managing time state
export const useCurrentTime = (): GreetingState => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return { currentTime, isClient };
};
