
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader, Sparkles, Brain } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { generatePersonalizedTasks } from '@/utils/aiTaskGenerator';

export function TaskGeneration() {
  const { dispatch } = useApp();
  const [loadingText, setLoadingText] = useState("Analyzing your goals...");

  useEffect(() => {
    const loadingSteps = [
      "Analyzing your goals...",
      "Understanding your preferences...",
      "Creating personalized tasks...",
      "Prioritizing for maximum impact...",
      "Almost ready..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[stepIndex]);
      }
    }, 800);

    // Simulate AI processing time
    const timer = setTimeout(() => {
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      const generatedTasks = generatePersonalizedTasks(onboardingData.goals || []);
      
      dispatch({ type: 'SET_AI_SUGGESTED_TASKS', payload: generatedTasks });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'task-selection' });
      
      clearInterval(interval);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center animate-slide-up glass-effect">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-gentle-bounce">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AI is crafting your personal plan
          </h2>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Loader className="w-5 h-5 text-purple-600 animate-spin" />
            <span className="text-gray-600 animate-pulse">
              {loadingText}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-700">
              Personalizing based on your goals and schedule
            </span>
          </div>
          
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">
              Balancing priorities for sustainable progress
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
