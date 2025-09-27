// Utility Functions
export const getInitials = (name: string | null): string => {
  if (!name) return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getGreeting = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return 'Hello';
  
  const hour = currentTime.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getGreetingEmoji = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return '👋';
  
  const hour = currentTime.getHours();
  if (hour < 12) return '🌅';
  if (hour < 17) return '☀️';
  return '🌙';
};
