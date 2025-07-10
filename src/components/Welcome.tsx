
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function Welcome() {
  const { dispatch } = useApp();

  const handleGetStarted = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'onboarding' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full focus-gradient flex items-center justify-center animate-gentle-bounce">
            <Sparkles className="w-10 h-10 text-purple-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            FocusFlow
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Your AI-powered companion for mindful living and digital wellness
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Smart Goal Setting</h3>
              <p className="text-sm text-gray-600">AI helps you focus on what truly matters</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Digital Wellness</h3>
              <p className="text-sm text-gray-600">Gentle reminders for mindful screen time</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="w-full rounded-2xl py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
        >
          Begin Your Journey
        </Button>

        <p className="text-sm text-gray-500 mt-6">
          Takes just 2 minutes to personalize your experience
        </p>
      </div>
    </div>
  );
}
