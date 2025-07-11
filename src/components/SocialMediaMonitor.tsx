
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Smartphone, Clock, Target, AlertTriangle } from 'lucide-react';

interface SocialMediaMonitorProps {
  onGoToTasks: () => void;
}

export function SocialMediaMonitor({ onGoToTasks }: SocialMediaMonitorProps) {
  const [dailyUsage, setDailyUsage] = useState(0); // in minutes
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);
  const [showLimitReached, setShowLimitReached] = useState(false);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [lastDismissTime, setLastDismissTime] = useState<Date | null>(null);

  // Social media apps to monitor
  const socialMediaApps = [
    'instagram', 'youtube', 'facebook', 'twitter', 'tiktok', 
    'snapchat', 'linkedin', 'pinterest', 'reddit', 'whatsapp'
  ];

  const isOnSocialMedia = () => {
    const currentUrl = window.location.href.toLowerCase();
    return socialMediaApps.some(app => 
      currentUrl.includes(app) || document.title.toLowerCase().includes(app)
    );
  };

  useEffect(() => {
    // Simulate social media usage tracking
    const simulateUsageTracking = () => {
      const onSocialMedia = isOnSocialMedia();

      if (onSocialMedia && !currentSessionStart) {
        setCurrentSessionStart(new Date());
        console.log('Started social media session');
      } else if (!onSocialMedia && currentSessionStart) {
        // Session ended
        const sessionDuration = Math.floor((new Date().getTime() - currentSessionStart.getTime()) / (1000 * 60));
        setDailyUsage(prev => prev + sessionDuration);
        setCurrentSessionStart(null);
        console.log(`Social media session ended: ${sessionDuration} minutes`);
      }
    };

    // Check usage every 30 seconds
    const usageInterval = setInterval(simulateUsageTracking, 30000);

    // Check for break reminders every minute during active sessions
    const breakInterval = setInterval(() => {
      if (currentSessionStart) {
        const sessionDuration = Math.floor((new Date().getTime() - currentSessionStart.getTime()) / (1000 * 60));
        
        if (sessionDuration >= 10 && !showBreakReminder) {
          setShowBreakReminder(true);
          setShowButtons(false);
          setTimeout(() => setShowButtons(true), 5000);
        }
      }
    }, 60000);

    // Reset daily usage at midnight
    const resetAtMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const timeToMidnight = midnight.getTime() - now.getTime();

      setTimeout(() => {
        setDailyUsage(0);
        localStorage.removeItem('dailySocialUsage');
        resetAtMidnight();
      }, timeToMidnight);
    };

    // Load saved usage data
    const savedUsage = localStorage.getItem('dailySocialUsage');
    if (savedUsage) {
      setDailyUsage(parseInt(savedUsage));
    }

    resetAtMidnight();

    return () => {
      clearInterval(usageInterval);
      clearInterval(breakInterval);
    };
  }, [currentSessionStart, showBreakReminder]);

  useEffect(() => {
    // Save usage data
    localStorage.setItem('dailySocialUsage', dailyUsage.toString());

    // Check if daily limit (120 minutes = 2 hours) is reached
    if (dailyUsage >= 120 && !showLimitReached) {
      // Check if we should show the limit again (only after 10 minutes and if still on social media)
      const canShowAgain = !lastDismissTime || 
        (new Date().getTime() - lastDismissTime.getTime()) >= 10 * 60 * 1000;
      
      if (canShowAgain && isOnSocialMedia()) {
        setShowLimitReached(true);
        setShowButtons(false);
        setTimeout(() => setShowButtons(true), 5000);
      }
    }
  }, [dailyUsage, showLimitReached, lastDismissTime]);

  const handleDismiss = () => {
    if (showLimitReached) {
      setShowLimitReached(false);
      setLastDismissTime(new Date());
    }
    if (showBreakReminder) {
      setShowBreakReminder(false);
      setCurrentSessionStart(new Date()); // Reset session timer
    }
    setShowButtons(false);
  };

  const handleGoToTasks = () => {
    setShowLimitReached(false);
    setShowBreakReminder(false);
    setShowButtons(false);
    if (showLimitReached) {
      setLastDismissTime(new Date());
    }
    onGoToTasks();
  };

  // For demo purposes, add buttons to simulate usage
  const addUsageForDemo = (minutes: number) => {
    setDailyUsage(prev => prev + minutes);
  };

  if (!showLimitReached && !showBreakReminder) {
    // Show demo controls in development
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <p className="text-sm text-gray-600 mb-2">
            Daily Usage: {Math.floor(dailyUsage / 60)}h {dailyUsage % 60}m / 2h
          </p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => addUsageForDemo(30)}>
              +30min
            </Button>
            <Button size="sm" variant="outline" onClick={() => addUsageForDemo(60)}>
              +1h
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDailyUsage(0)}>
              Reset
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="max-w-md mx-4 p-8 text-center animate-scale-in">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              {showLimitReached ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <Clock className="w-8 h-8 text-orange-600" />
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {showLimitReached && "You've reached your daily limit"}
            {showBreakReminder && "Take a Break"}
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {showLimitReached && "It's time to disconnect and refocus."}
            {showBreakReminder && "You've been on social media for 10 minutes straight. Time to take a break and refocus."}
          </p>
        </div>

        {showButtons && (
          <div className="flex flex-col space-y-3 animate-fade-in">
            <Button
              onClick={handleGoToTasks}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Target className="w-4 h-4 mr-2" />
              Go to Task List
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="w-full"
            >
              Dismiss
            </Button>
          </div>
        )}

        {!showButtons && (
          <div className="flex items-center justify-center text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">This message will show options in a few seconds...</span>
          </div>
        )}
      </Card>
    </div>
  );
}
