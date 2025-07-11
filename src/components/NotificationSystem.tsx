
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, Clock, Target } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';

interface NotificationSystemProps {
  onGoToTasks: () => void;
}

export function NotificationSystem({ onGoToTasks }: NotificationSystemProps) {
  const { state } = useApp();
  const [currentNotification, setCurrentNotification] = useState<{
    type: 'daily-reminder' | 'social-limit' | 'social-break';
    task?: Task;
    message: string;
  } | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [dailyNotificationCount, setDailyNotificationCount] = useState(0);

  useEffect(() => {
    // Check for daily notifications based on user's wake time
    const checkDailyNotifications = () => {
      if (!state.user || dailyNotificationCount >= 5) return;

      const now = new Date();
      const wakeTime = state.user.wakeTime;
      
      if (wakeTime) {
        const [hours, minutes] = wakeTime.split(':').map(Number);
        const wakeDateTime = new Date();
        wakeDateTime.setHours(hours, minutes, 0, 0);

        // Check if it's time for a notification (every 2 hours after wake time)
        const timeSinceWake = now.getTime() - wakeDateTime.getTime();
        const hoursAwake = Math.floor(timeSinceWake / (1000 * 60 * 60));

        if (hoursAwake >= 0 && hoursAwake % 2 === 0 && hoursAwake <= 10) {
          const lastNotification = localStorage.getItem('lastDailyNotification');
          const lastNotificationTime = lastNotification ? new Date(lastNotification) : null;
          
          if (!lastNotificationTime || now.getTime() - lastNotificationTime.getTime() > 2 * 60 * 60 * 1000) {
            showDailyReminder();
            localStorage.setItem('lastDailyNotification', now.toISOString());
          }
        }
      }
    };

    const showDailyReminder = () => {
      // Get actual tasks from state, prioritize incomplete tasks
      const pendingTasks = state.tasks.filter(task => !task.completed);
      
      // Sort by priority: High -> Medium -> Low
      const sortedTasks = pendingTasks.sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      const topTask = sortedTasks[0];

      if (topTask && dailyNotificationCount < 5) {
        setCurrentNotification({
          type: 'daily-reminder',
          task: topTask,
          message: `Time to focus on your priority: "${topTask.title}"`
        });
        setShowButtons(false);
        setDailyNotificationCount(prev => prev + 1);

        // Show buttons after 5 seconds
        setTimeout(() => setShowButtons(true), 5000);
      } else if (pendingTasks.length === 0 && dailyNotificationCount < 5) {
        // If no pending tasks, show a general motivation message
        setCurrentNotification({
          type: 'daily-reminder',
          message: "Great work! All tasks are complete. Time to set new goals!"
        });
        setShowButtons(false);
        setDailyNotificationCount(prev => prev + 1);
        setTimeout(() => setShowButtons(true), 5000);
      }
    };

    // Check daily notifications every 30 minutes
    const interval = setInterval(checkDailyNotifications, 30 * 60 * 1000);
    checkDailyNotifications(); // Check immediately

    // Reset daily count at midnight
    const resetAtMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const timeToMidnight = midnight.getTime() - now.getTime();

      setTimeout(() => {
        setDailyNotificationCount(0);
        localStorage.removeItem('lastDailyNotification');
        resetAtMidnight(); // Schedule next reset
      }, timeToMidnight);
    };

    resetAtMidnight();

    return () => clearInterval(interval);
  }, [state.user, state.tasks, dailyNotificationCount]);

  const handleDismiss = () => {
    setCurrentNotification(null);
    setShowButtons(false);
  };

  const handleGoToTasks = () => {
    setCurrentNotification(null);
    setShowButtons(false);
    onGoToTasks();
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="max-w-md mx-4 p-8 text-center animate-scale-in">
        <div className="mb-6">
          {currentNotification.type === 'daily-reminder' && (
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentNotification.type === 'daily-reminder' && "Focus Time!"}
            {currentNotification.type === 'social-limit' && "Daily Limit Reached"}
            {currentNotification.type === 'social-break' && "Take a Break"}
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {currentNotification.message}
          </p>
        </div>

        {showButtons && (
          <div className="flex flex-col space-y-3 animate-fade-in">
            <Button
              onClick={handleGoToTasks}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Target className="w-4 h-4 mr-2" />
              See Task List
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
