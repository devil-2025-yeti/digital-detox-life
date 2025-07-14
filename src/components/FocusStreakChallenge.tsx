
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Gift, Target, Star, Zap, Trophy, Calendar, Clock } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalSuccessfulDays: number;
  lastSuccessfulDate: string | null;
  unlockedRewards: string[];
  pendingRewards: string[];
}

interface DailyTarget {
  maxScreenTime: number; // 4 hours = 240 minutes
  maxSocialMedia: number; // 1.5 hours = 90 minutes
}

export function FocusStreakChallenge() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalSuccessfulDays: 0,
    lastSuccessfulDate: null,
    unlockedRewards: [],
    pendingRewards: []
  });

  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [newReward, setNewReward] = useState<string | null>(null);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const targets: DailyTarget = {
    maxScreenTime: 240, // 4 hours in minutes
    maxSocialMedia: 90   // 1.5 hours in minutes
  };

  const rewards = [
    { days: 15, title: '50% OFF Premium', description: '1 month discount', icon: Gift },
    { days: 30, title: '1 MONTH FREE', description: 'Premium access', icon: Trophy }
  ];

  // Mock today's usage - in real app, this would come from actual screen time data
  const todayUsage = {
    screenTime: 215, // 3.58 hours - just under 4 hours
    socialMedia: 73  // 1 hr 13 min - under 1.5 hours
  };

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('focusStreak');
    if (savedStreak) {
      const data = JSON.parse(savedStreak);
      setStreakData(data);
    }

    // Check if today qualifies for streak
    checkTodayStatus();
    
    // Initialize streak data if it's the first time
    if (!savedStreak) {
      initializeStreakData();
    }
  }, []);

  const initializeStreakData = () => {
    // Start with a 7-day streak to show progress
    const initialData: StreakData = {
      currentStreak: 7,
      longestStreak: 12,
      totalSuccessfulDays: 19,
      lastSuccessfulDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      unlockedRewards: [],
      pendingRewards: []
    };
    
    setStreakData(initialData);
    localStorage.setItem('focusStreak', JSON.stringify(initialData));
  };

  const checkTodayStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const meetsTargets = todayUsage.screenTime < targets.maxScreenTime && 
                        todayUsage.socialMedia < targets.maxSocialMedia;
    
    setTodayCompleted(meetsTargets);
    
    // Auto-update streak if conditions are met and it's a new day
    const savedStreak = localStorage.getItem('focusStreak');
    if (savedStreak && meetsTargets) {
      const data = JSON.parse(savedStreak);
      if (data.lastSuccessfulDate !== today) {
        updateStreak(true);
      }
    }
  };

  const updateStreak = (success: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStreakData(prev => {
      const newData = { ...prev };
      
      if (success) {
        newData.currentStreak += 1;
        newData.totalSuccessfulDays += 1;
        newData.longestStreak = Math.max(newData.longestStreak, newData.currentStreak);
        newData.lastSuccessfulDate = today;
        
        // Check for new rewards
        rewards.forEach(reward => {
          if (newData.currentStreak === reward.days && 
              !newData.unlockedRewards.includes(reward.title)) {
            newData.unlockedRewards.push(reward.title);
            newData.pendingRewards.push(reward.title);
            setNewReward(reward.title);
            setShowRewardNotification(true);
          }
        });
      } else {
        newData.currentStreak = 0;
      }
      
      localStorage.setItem('focusStreak', JSON.stringify(newData));
      return newData;
    });
  };

  const dismissRewardNotification = () => {
    setShowRewardNotification(false);
    setNewReward(null);
    setStreakData(prev => ({
      ...prev,
      pendingRewards: prev.pendingRewards.filter(r => r !== newReward)
    }));
  };

  const getNextReward = () => {
    return rewards.find(reward => 
      reward.days > streakData.currentStreak && 
      !streakData.unlockedRewards.includes(reward.title)
    );
  };

  const getProgressToNextReward = () => {
    const nextReward = getNextReward();
    if (!nextReward) return 100;
    
    return Math.min((streakData.currentStreak / nextReward.days) * 100, 100);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakMessage = () => {
    if (streakData.currentStreak === 0) {
      return "Start your focus journey today! 🚀";
    } else if (streakData.currentStreak < 7) {
      return "Building momentum! Keep going! 💪";
    } else if (streakData.currentStreak < 15) {
      return "You're on fire! Don't break the chain! 🔥";
    } else if (streakData.currentStreak < 30) {
      return "Incredible focus! You're unstoppable! ⭐";
    } else {
      return "Focus master! You're an inspiration! 👑";
    }
  };

  const nextReward = getNextReward();
  const progressPercentage = getProgressToNextReward();

  return (
    <>
      <Card className="p-6 glass-effect bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Focus Streak Challenge</h3>
                <p className="text-sm text-gray-600">Stay under 4h screen time & 1.5h social media</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              <Target className="w-3 h-3 mr-1" />
              Daily Goal
            </Badge>
          </div>

          {/* Current Streak Display */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-4xl font-bold text-gray-800">{streakData.currentStreak}</span>
              <span className="text-lg text-gray-600">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-gray-600 font-medium">{getStreakMessage()}</p>
          </div>

          {/* Today's Progress */}
          <div className="bg-white/70 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Today's Progress</h4>
              {todayCompleted ? (
                <Badge className="bg-green-100 text-green-700">
                  <Star className="w-3 h-3 mr-1" />
                  Goal Met!
                </Badge>
              ) : (
                <Badge variant="outline">In Progress</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Screen Time</div>
                <div className={`text-lg font-semibold ${
                  todayUsage.screenTime < targets.maxScreenTime ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatTime(todayUsage.screenTime)}
                </div>
                <div className="text-xs text-gray-500">/ {formatTime(targets.maxScreenTime)}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Social Media</div>
                <div className={`text-lg font-semibold ${
                  todayUsage.socialMedia < targets.maxSocialMedia ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatTime(todayUsage.socialMedia)}
                </div>
                <div className="text-xs text-gray-500">/ {formatTime(targets.maxSocialMedia)}</div>
              </div>
            </div>
          </div>

          {/* Next Reward Progress */}
          {nextReward && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Next Reward</span>
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">{nextReward.title}</span>
                </div>
              </div>
              
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{streakData.currentStreak} days</span>
                <span>{nextReward.days - streakData.currentStreak} more days to unlock</span>
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{streakData.longestStreak}</div>
              <div className="text-xs text-gray-600">Longest Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{streakData.totalSuccessfulDays}</div>
              <div className="text-xs text-gray-600">Total Success Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{streakData.unlockedRewards.length}</div>
              <div className="text-xs text-gray-600">Rewards Earned</div>
            </div>
          </div>

          {/* Unlocked Rewards */}
          {streakData.unlockedRewards.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-purple-600" />
                Earned Rewards
              </h4>
              <div className="space-y-2">
                {streakData.unlockedRewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/70 rounded-lg p-3">
                    <span className="font-medium text-gray-800">{reward}</span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Reward Notification */}
      {showRewardNotification && newReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="max-w-sm mx-auto p-6 text-center animate-scale-in">
            <div className="mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Reward Unlocked!</h2>
              <p className="text-lg text-purple-600 font-semibold mb-1">{newReward}</p>
              <p className="text-gray-600">Congratulations on your focus streak!</p>
            </div>

            <div className="space-y-3">
              <Button onClick={dismissRewardNotification} className="w-full bg-purple-600 hover:bg-purple-700">
                <Gift className="w-4 h-4 mr-2" />
                Claim Reward
              </Button>
              <Button variant="outline" onClick={dismissRewardNotification} className="w-full">
                Continue Streak
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
