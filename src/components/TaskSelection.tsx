
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';

export function TaskSelection() {
  const { state, dispatch } = useApp();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleConfirm = () => {
    const tasksToKeep = state.aiSuggestedTasks.filter(task => 
      selectedTasks.includes(task.id)
    );
    
    dispatch({ type: 'SET_TASKS', payload: tasksToKeep });
    
    // Create user profile
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    const user = {
      id: 'user_1',
      name: onboardingData.name,
      email: onboardingData.email,
      bedtime: onboardingData.bedtime,
      wakeTime: onboardingData.wakeTime,
      goals: onboardingData.goals,
      onboardingComplete: true
    };
    
    dispatch({ type: 'SET_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tasks', JSON.stringify(tasksToKeep));
    
    // Show celebration before going to dashboard
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
                    ? 'ring-2 ring-purple-400 bg-purple-50/50 transform scale-[1.02]' 
                    : 'hover:bg-gray-50/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => toggleTaskSelection(task.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-purple-600 border-purple-600' 
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
            onClick={handleConfirm}
            disabled={selectedTasks.length === 0}
            size="lg"
            className="w-full rounded-2xl py-6 text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
          >
            Confirm Selection ({selectedTasks.length} tasks)
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
