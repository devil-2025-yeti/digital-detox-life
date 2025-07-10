
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, User, Clock, MapPin, Globe, Heart, Briefcase } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { OnboardingData } from '@/types';

export function Onboarding() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    bedtime: '23:00',
    wakeTime: '07:00',
    location: '',
    nationality: '',
    hobbies: '',
    occupation: 'Work',
    goals: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'goal-setting' });
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.email.trim();
      case 2:
        return true; // Sleep schedule has defaults
      case 3:
        return formData.location.trim() && formData.nationality.trim();
      case 4:
        return formData.hobbies.trim() && formData.occupation;
      default:
        return false;
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return User;
      case 2: return Clock;
      case 3: return MapPin;
      case 4: return Heart;
      default: return User;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's get to know you";
      case 2: return "Your daily rhythm";
      case 3: return "Tell us about yourself";
      case 4: return "Your interests and work";
      default: return "Getting started";
    }
  };

  const StepIcon = getStepIcon();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 animate-slide-up glass-effect">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-tree-600 flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getStepTitle()}
          </h2>
          
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentStep >= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
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
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
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
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
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
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
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
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Where do you live?
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                What is your nationality?
              </Label>
              <Input
                id="nationality"
                type="text"
                placeholder="Your nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="hobbies" className="text-sm font-medium text-gray-700">
                What are your hobbies?
              </Label>
              <Input
                id="hobbies"
                type="text"
                placeholder="Reading, cooking, sports..."
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                What do you do?
              </Label>
              <RadioGroup
                value={formData.occupation}
                onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Work" id="work" />
                  <Label htmlFor="work">Work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Study" id="study" />
                  <Label htmlFor="study">Study</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full mt-8 rounded-xl py-6 bg-gradient-to-r from-primary to-tree-600 hover:from-primary/90 hover:to-tree-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
        >
          {currentStep === 4 ? 'Continue' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </Card>
    </div>
  );
}
