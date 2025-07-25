import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Clock, TrendingUp, Calendar, BarChart3, TrendingDown } from 'lucide-react';

interface ScreenTimeData {
  date: string;
  totalUsage: number; // minutes
  socialMediaUsage: number; // minutes
}

export function ScreenTime() {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');

  // Generate more realistic screen time data
  useEffect(() => {
    const generateScreenTimeData = () => {
      const data: ScreenTimeData[] = [];
      const currentDate = new Date();
      
      // More realistic patterns for previous week (higher usage with natural variations)
      const previousWeekPatterns = [
        { total: 420, social: 165 }, // Monday - moderate start
        { total: 465, social: 185 }, // Tuesday - busy day
        { total: 490, social: 195 }, // Wednesday - peak usage
        { total: 445, social: 175 }, // Thursday - slightly lower
        { total: 510, social: 220 }, // Friday - high social usage
        { total: 525, social: 205 }, // Saturday - weekend high
        { total: 480, social: 190 }  // Sunday - still high but reducing
      ];
      
      // More realistic patterns for current week (improved but with natural variations)
      const currentWeekPatterns = [
        { total: 190, social: 70 },  // Monday - good start
        { total: 220, social: 85 },  // Tuesday - slight increase
        { total: 205, social: 78 },  // Wednesday - maintaining
        { total: 235, social: 95 },  // Thursday - challenging day
        { total: 195, social: 72 },  // Friday - good control
        { total: 210, social: 80 },  // Saturday - weekend but controlled
        { total: 215, social: 73 }   // Sunday (today) - current
      ];
      
      // Generate data for 14 days total
      for (let i = 13; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        // Determine if this is previous week (first 7 days) or current week (last 7 days)
        const isPreviousWeek = i >= 7;
        
        if (isPreviousWeek) {
          const patternIndex = 13 - i; // 0-6 for previous week
          const pattern = previousWeekPatterns[patternIndex];
          
          // Add realistic random variation (±15 minutes for total, ±8 for social)
          const totalVariation = Math.floor(Math.random() * 31) - 15; // -15 to +15
          const socialVariation = Math.floor(Math.random() * 17) - 8; // -8 to +8
          
          const totalUsage = Math.max(360, pattern.total + totalVariation); // Min 6 hours
          const socialMediaUsage = Math.max(120, Math.min(totalUsage * 0.45, pattern.social + socialVariation));
          
          data.push({
            date: date.toISOString().split('T')[0],
            totalUsage,
            socialMediaUsage
          });
        } else {
          const patternIndex = 6 - i; // 0-6 for current week
          const pattern = currentWeekPatterns[patternIndex];
          
          // Add smaller realistic variation (±10 minutes for total, ±5 for social)
          const totalVariation = Math.floor(Math.random() * 21) - 10; // -10 to +10
          const socialVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5
          
          const totalUsage = Math.max(150, pattern.total + totalVariation); // Min 2.5 hours
          const socialMediaUsage = Math.max(45, Math.min(totalUsage * 0.45, pattern.social + socialVariation));
          
          data.push({
            date: date.toISOString().split('T')[0],
            totalUsage,
            socialMediaUsage
          });
        }
      }
      
      setScreenTimeData(data);
    };

    generateScreenTimeData();
  }, []);

  const getCurrentWeekData = () => {
    return screenTimeData.slice(-7); // Last 7 days
  };

  const getPreviousWeekData = () => {
    return screenTimeData.slice(0, 7); // First 7 days
  };

  const getDisplayData = () => {
    return selectedPeriod === 'current' ? getCurrentWeekData() : getPreviousWeekData();
  };

  const getTodayData = () => {
    const today = getCurrentWeekData()[6]; // Last item is today
    // Today's realistic usage - meeting targets
    return today ? { ...today, totalUsage: 215, socialMediaUsage: 73 } : { date: '', totalUsage: 215, socialMediaUsage: 73 };
  };

  const getWeeklyAverage = (data: ScreenTimeData[]) => {
    if (data.length === 0) return { totalUsage: 0, socialMediaUsage: 0 };
    
    const totals = data.reduce(
      (acc, day) => ({
        totalUsage: acc.totalUsage + day.totalUsage,
        socialMediaUsage: acc.socialMediaUsage + day.socialMediaUsage
      }),
      { totalUsage: 0, socialMediaUsage: 0 }
    );

    return {
      totalUsage: Math.round(totals.totalUsage / data.length),
      socialMediaUsage: Math.round(totals.socialMediaUsage / data.length)
    };
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getMaxUsage = (data: ScreenTimeData[]) => {
    return Math.max(...data.map(d => d.totalUsage), 100);
  };

  const todayData = getTodayData();
  const displayData = getDisplayData();
  const weeklyAverage = getWeeklyAverage(displayData);
  const maxUsage = getMaxUsage(displayData);
  
  // Calculate improvement percentages
  const currentWeekAverage = getWeeklyAverage(getCurrentWeekData());
  const previousWeekAverage = getWeeklyAverage(getPreviousWeekData());
  const totalReduction = Math.round(((previousWeekAverage.totalUsage - currentWeekAverage.totalUsage) / previousWeekAverage.totalUsage) * 100);
  const socialReduction = Math.round(((previousWeekAverage.socialMediaUsage - currentWeekAverage.socialMediaUsage) / previousWeekAverage.socialMediaUsage) * 100);

  return (
    <div className="space-y-6">
      {/* Today's Usage */}
      <Card className="p-6 glass-effect">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-primary" />
            Today's Screen Time
          </h3>
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-1">
              {formatTime(todayData.totalUsage)}
            </div>
            <p className="text-gray-600">Total Mobile Usage</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {formatTime(todayData.socialMediaUsage)}
            </div>
            <p className="text-gray-600">Social Media Usage</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-center">
            You used your mobile for <span className="font-semibold">{formatTime(todayData.totalUsage)}</span> today, 
            and <span className="font-semibold text-orange-600">{formatTime(todayData.socialMediaUsage)}</span> were 
            spent on social media.
          </p>
        </div>
      </Card>

      {/* Weekly History */}
      <Card className="p-6 glass-effect">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Weekly Screen Time History
          </h3>
        </div>

        {/* Period Selection */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={selectedPeriod === 'current' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('current')}
            size="sm"
          >
            Current Week
          </Button>
          <Button
            variant={selectedPeriod === 'previous' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('previous')}
            size="sm"
          >
            Previous Week
          </Button>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <div className="flex justify-between items-end h-48 bg-gray-50 rounded-lg p-4">
            {displayData.map((day, index) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en', { weekday: 'short' });
              const totalHeight = (day.totalUsage / maxUsage) * 100;
              const socialHeight = (day.socialMediaUsage / maxUsage) * 100;

              return (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div className="flex flex-col justify-end h-32 w-8 relative">
                    {/* Total usage bar (background) */}
                    <div
                      className="w-full bg-primary/30 rounded-t-sm"
                      style={{ height: `${totalHeight}%` }}
                    />
                    {/* Social media usage bar (overlay) */}
                    <div
                      className="w-full bg-orange-500 rounded-t-sm absolute bottom-0"
                      style={{ height: `${socialHeight}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-2 text-center">
                    <div className="font-medium">{dayName}</div>
                    <div>{date.getDate()}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary/30 rounded"></div>
              <span className="text-sm text-gray-600">Total Usage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Social Media</span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800">
              {formatTime(weeklyAverage.totalUsage)}
            </div>
            <p className="text-sm text-gray-600">Daily Average</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-orange-600">
              {formatTime(weeklyAverage.socialMediaUsage)}
            </div>
            <p className="text-sm text-gray-600">Social Media Average</p>
          </div>
        </div>
      </Card>

      {/* Progress Comparison & Encouraging Message */}
      <Card className="p-6 glass-effect bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingDown className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">Amazing Progress! 🎉</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">-{totalReduction}%</div>
              <p className="text-sm text-gray-600">Total Screen Time Reduced</p>
              <p className="text-xs text-gray-500 mt-1">
                From {formatTime(previousWeekAverage.totalUsage)} to {formatTime(currentWeekAverage.totalUsage)} daily
              </p>
            </div>
            <div className="bg-white/50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">-{socialReduction}%</div>
              <p className="text-sm text-gray-600">Social Media Time Reduced</p>
              <p className="text-xs text-gray-500 mt-1">
                From {formatTime(previousWeekAverage.socialMediaUsage)} to {formatTime(currentWeekAverage.socialMediaUsage)} daily
              </p>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Keep it up! 🚀</h4>
            <p className="text-gray-700 leading-relaxed">
              You're focusing more on your goals. Your discipline is paying off! 💪✨
            </p>
            <p className="text-sm text-gray-600 mt-3 italic">
              "Small efforts daily lead to success." 🌟
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
