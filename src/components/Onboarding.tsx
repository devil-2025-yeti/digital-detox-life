
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronRight, User, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { OnboardingData } from '@/types';

export function Onboarding() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    bedtime: '23:00',
    wakeTime: '07:00',
    goals: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1 && formData.name && formData.email) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'goal-setting' });
      // Store user data for later use
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim() && formData.email.trim();
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 animate-slide-up glass-effect">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            {currentStep === 1 ? (
              <User className="w-8 h-8 text-white" />
            ) : (
              <Clock className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentStep === 1 ? "Let's get to know you" : "Your daily rhythm"}
          </h2>
          
          <div className="flex justify-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 1 ? 'bg-purple-500' : 'bg-gray-200'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`} />
          </div>
        </div>

        {currentStep === 1 ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                What should we call you?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your first name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label htmlFor="bedtime" className="text-sm font-medium text-gray-700">
                What time do you usually go to bed?
              </Label>
              <Input
                id="bedtime"
                type="time"
                value={formData.bedtime}
                onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="wakeTime" className="text-sm font-medium text-gray-700">
                What time do you wake up?
              </Label>
              <Input
                id="wakeTime"
                type="time"
                value={formData.wakeTime}
                onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full mt-8 rounded-xl py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
        >
          {currentStep === 2 ? 'Continue' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </Card>
    </div>
  );
}
