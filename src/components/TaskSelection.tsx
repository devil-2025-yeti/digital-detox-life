
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { TaskCustomization } from './TaskCustomization';

export function TaskSelection() {
  const { state, dispatch } = useApp();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleNext = () => {
    setShowCustomization(true);
  };

  const handleTasksConfirmed = (customizedTasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: customizedTasks });
    
    // Create user profile
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    const user = {
      id: 'user_1',
      name: onboardingData.name,
      email: onboardingData.email,
      bedtime: onboardingData.bedtime,
      wakeTime: onboardingData.wakeTime,
      location: onboardingData.location,
      nationality: onboardingData.nationality,
      hobbies: onboardingData.hobbies,
      occupation: onboardingData.occupation,
      goals: onboardingData.goals,
      onboardingComplete: true
    };
    
    dispatch({ type: 'SET_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tasks', JSON.stringify(customizedTasks));
    
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (showCustomization) {
    const tasksToCustomize = state.aiSuggestedTasks.filter(task => 
      selectedTasks.includes(task.id)
    );
    
    return (
      <TaskCustomization 
        selectedTasks={tasksToCustomize}
        onConfirm={handleTasksConfirmed}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Personalized Action Plan
          </h2>
          <p className="text-gray-600">
            Select the tasks that resonate with you most (recommended: 3-5 tasks)
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {state.aiSuggestedTasks.map((task, index) => {
            const isSelected = selectedTasks.includes(task.id);
            
            return (
              <Card 
                key={task.id}
                className={`p-6 transition-all duration-300 cursor-pointer hover:shadow-lg animate-slide-up ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5 transform scale-[1.02]' 
                    : 'hover:bg-gray-50/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => toggleTaskSelection(task.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="sticky bottom-6">
          <Button
            onClick={handleNext}
            disabled={selectedTasks.length === 0}
            size="lg"
            className="w-full rounded-2xl py-6 text-lg font-medium bg-gradient-to-r from-primary to-tree-600 hover:from-primary/90 hover:to-tree-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
          >
            Next: Customize Tasks ({selectedTasks.length} selected)
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
