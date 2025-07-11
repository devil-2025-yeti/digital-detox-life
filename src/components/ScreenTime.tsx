
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Clock, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface ScreenTimeData {
  date: string;
  totalUsage: number; // minutes
  socialMediaUsage: number; // minutes
}

export function ScreenTime() {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');

  // Generate mock screen time data
  useEffect(() => {
    const generateScreenTimeData = () => {
      const data: ScreenTimeData[] = [];
      const currentDate = new Date();
      
      // Generate data for current week and previous week (14 days total)
      for (let i = 13; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        // Simulate realistic usage patterns
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const totalUsage = Math.floor(Math.random() * 120) + (isWeekend ? 180 : 240); // 3-6 hours
        const socialMediaUsage = Math.floor(totalUsage * (0.4 + Math.random() * 0.4)); // 40-80% of total
        
        data.push({
          date: date.toISOString().split('T')[0],
          totalUsage,
          socialMediaUsage
        });
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
    return today || { date: '', totalUsage: 0, socialMediaUsage: 0 };
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
    </div>
  );
}
