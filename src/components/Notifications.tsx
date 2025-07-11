
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Target, Quote, Menu } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { AppSidebar } from './AppSidebar';

interface Notification {
  id: string;
  time: string;
  quote: string;
  task: string;
  sent: boolean;
}

export function Notifications() {
  const { state } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [triggeredNotification, setTriggeredNotification] = useState<Notification | null>(null);

  // Generate motivational quotes based on focus area
  const getMotivationalQuotes = () => {
    const focusArea = state.user?.focusArea?.toLowerCase() || 'general';
    
    const quotes = {
      study: [
        "Education is the most powerful weapon which you can use to change the world.",
        "The expert in anything was once a beginner.",
        "Learning never exhausts the mind.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The beautiful thing about learning is that no one can take it away from you."
      ],
      work: [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The way to get started is to quit talking and begin doing.",
        "Innovation distinguishes between a leader and a follower.",
        "Don't be afraid to give up the good to go for the great.",
        "The future depends on what you do today."
      ],
      fitness: [
        "Your body can do it. It's your mind you need to convince.",
        "The groundwork for all happiness is good health.",
        "Take care of your body. It's the only place you have to live.",
        "Fitness is not about being better than someone else. It's about being better than you used to be.",
        "A healthy outside starts from the inside."
      ],
      general: [
        "The only way to do great work is to love what you do.",
        "Believe you can and you're halfway there.",
        "It always seems impossible until it's done.",
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you."
      ]
    };

    return quotes[focusArea as keyof typeof quotes] || quotes.general;
  };

  useEffect(() => {
    // Only generate notifications if user has tasks
    if (state.tasks.length === 0) {
      setNotifications([]);
      return;
    }

    // Generate daily notifications based on actual tasks
    const generateDailyNotifications = () => {
      const quotes = getMotivationalQuotes();
      const pendingTasks = state.tasks.filter(task => !task.completed);
      
      // Sort tasks by priority to get the highest priority task
      const sortedTasks = pendingTasks.sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      const times = ['09:00', '12:00', '15:00', '18:00', '21:00'];
      const currentTime = new Date();
      
      const dailyNotifications: Notification[] = times.map((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);
        
        const isSent = notificationTime < currentTime;
        
        // Use actual task names from the user's task list
        let taskText = 'Complete your most important task';
        if (sortedTasks.length > 0) {
          // Cycle through actual tasks, prioritizing high priority ones
          const taskIndex = index % sortedTasks.length;
          taskText = sortedTasks[taskIndex].title;
        }
        
        return {
          id: `notification-${index}`,
          time,
          quote: quotes[index % quotes.length],
          task: taskText,
          sent: isSent
        };
      });

      setNotifications(dailyNotifications);
    };

    generateDailyNotifications();
  }, [state.tasks, state.user?.focusArea]);

  const handleNotificationClick = (notification: Notification) => {
    setTriggeredNotification(notification);
  };

  const handleDismissTriggeredNotification = () => {
    setTriggeredNotification(null);
  };

  const upcomingNotifications = notifications.filter(n => !n.sent);
  const sentNotifications = notifications.filter(n => n.sent);

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-tree-600/5">
        <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-white/20 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Notifications</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Your daily motivational reminders</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-3 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Show message if no tasks */}
              {state.tasks.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="mb-4">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Notifications Yet</h2>
                    <p className="text-gray-600">
                      Notifications will appear here once you have tasks in your dashboard.
                    </p>
                  </div>
                </Card>
              ) : (
                <>
                  {/* Upcoming Notifications */}
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-primary" />
                      Upcoming Today ({upcomingNotifications.length})
                    </h2>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {upcomingNotifications.map((notification) => (
                        <Card 
                          key={notification.id} 
                          className="p-4 sm:p-6 glass-effect border-l-4 border-l-primary cursor-pointer hover:bg-gray-50/50 transition-colors"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                            <div className="flex items-center space-x-2">
                              <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                              <span className="font-medium text-gray-800 text-sm sm:text-base">{notification.time}</span>
                              <Badge variant="secondary" className="text-xs">Scheduled</Badge>
                            </div>
                            <p className="text-xs text-gray-500">Click to preview</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <Quote className="w-3 sm:w-4 h-3 sm:h-4 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm sm:text-base text-gray-700 italic">"{notification.quote}"</p>
                            </div>
                            
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <Target className="w-3 sm:w-4 h-3 sm:h-4 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm sm:text-base text-gray-700">
                                <span className="font-medium">Priority task:</span> {notification.task}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Sent Notifications */}
                  {sentNotifications.length > 0 && (
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Bell className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                        Earlier Today ({sentNotifications.length})
                      </h2>
                      
                      <div className="space-y-3 sm:space-y-4">
                        {sentNotifications.map((notification) => (
                          <Card 
                            key={notification.id} 
                            className="p-4 sm:p-6 glass-effect opacity-70 border-l-4 border-l-gray-300 cursor-pointer hover:bg-gray-50/50 transition-colors"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                              <div className="flex items-center space-x-2">
                                <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                                <span className="font-medium text-gray-600 text-sm sm:text-base">{notification.time}</span>
                                <Badge variant="outline" className="text-xs">Sent</Badge>
                              </div>
                              <p className="text-xs text-gray-400">Click to preview</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-start space-x-2 sm:space-x-3">
                                <Quote className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500 mt-1 flex-shrink-0" />
                                <p className="text-sm sm:text-base text-gray-600 italic">"{notification.quote}"</p>
                              </div>
                              
                              <div className="flex items-start space-x-2 sm:space-x-3">
                                <Target className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500 mt-1 flex-shrink-0" />
                                <p className="text-sm sm:text-base text-gray-600">
                                  <span className="font-medium">Priority task:</span> {notification.task}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Triggered Notification Modal */}
      {triggeredNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="max-w-md mx-4 p-8 text-center animate-scale-in">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Focus Time!</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-lg">
                  <Quote className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700 italic text-left">"{triggeredNotification.quote}"</p>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg">
                  <Target className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600 mb-1">Priority task:</p>
                    <p className="font-medium text-gray-800">{triggeredNotification.task}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleDismissTriggeredNotification}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Target className="w-4 h-4 mr-2" />
                Got it!
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleDismissTriggeredNotification}
                className="w-full"
              >
                Dismiss
              </Button> */}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
