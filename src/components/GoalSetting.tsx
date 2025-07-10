
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Brain, Users, Target, Dumbbell, Book } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const goalOptions = [
  { id: 'health', label: 'Health & Fitness', icon: Dumbbell, color: 'bg-green-100 text-green-600' },
  { id: 'learning', label: 'Learning & Growth', icon: Book, color: 'bg-blue-100 text-blue-600' },
  { id: 'relationships', label: 'Relationships', icon: Users, color: 'bg-pink-100 text-pink-600' },
  { id: 'mindfulness', label: 'Mindfulness & Peace', icon: Heart, color: 'bg-purple-100 text-purple-600' },
  { id: 'creativity', label: 'Creativity & Projects', icon: Brain, color: 'bg-orange-100 text-orange-600' },
  { id: 'career', label: 'Career & Goals', icon: Target, color: 'bg-indigo-100 text-indigo-600' },
];

export function GoalSetting() {
  const { dispatch } = useApp();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = () => {
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...onboardingData,
      goals: selectedGoals
    }));
    
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'task-generation' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-lg w-full p-8 animate-slide-up glass-effect">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What matters most to you?
          </h2>
          
          <p className="text-gray-600">
            Select the areas where you'd like to focus your energy
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isSelected 
                    ? 'border-purple-400 bg-purple-50 transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm">
                  {goal.label}
                </h3>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className="w-full rounded-xl py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
        >
          Continue ({selectedGoals.length} selected)
        </Button>
      </Card>
    </div>
  );
}
