
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight, AlertCircle, Clock, Flag } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task, Priority } from '@/types';

interface TaskCustomizationProps {
  selectedTasks: Task[];
  onConfirm: (customizedTasks: Task[]) => void;
}

export function TaskCustomization({ selectedTasks, onConfirm }: TaskCustomizationProps) {
  const [taskCustomizations, setTaskCustomizations] = useState<{
    [taskId: string]: { priority: Priority; dueDate?: string }
  }>({});

  const updateTaskCustomization = (taskId: string, field: 'priority' | 'dueDate', value: string) => {
    setTaskCustomizations(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  const canProceed = () => {
    return selectedTasks.every(task => taskCustomizations[task.id]?.priority);
  };

  const handleConfirm = () => {
    const customizedTasks = selectedTasks.map(task => ({
      ...task,
      priority: taskCustomizations[task.id]?.priority || 'Medium',
      dueDate: taskCustomizations[task.id]?.dueDate || undefined
    }));
    
    onConfirm(customizedTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Customize Your Tasks
          </h2>
          <p className="text-gray-600">
            Set priority levels and optional due dates for your selected tasks
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {selectedTasks.map((task, index) => (
            <Card 
              key={task.id}
              className="p-6 animate-slide-up glass-effect"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <Flag className="w-4 h-4 mr-1" />
                    Priority <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <RadioGroup
                    value={taskCustomizations[task.id]?.priority || ''}
                    onValueChange={(value) => updateTaskCustomization(task.id, 'priority', value)}
                    className="mt-2 flex space-x-4"
                  >
                    {(['High', 'Medium', 'Low'] as Priority[]).map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <RadioGroupItem value={priority} id={`${task.id}-${priority}`} />
                        <Label htmlFor={`${task.id}-${priority}`}>
                          <Badge className={getPriorityColor(priority)}>
                            {priority}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor={`due-${task.id}`} className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due Date (Optional)
                  </Label>
                  <Input
                    id={`due-${task.id}`}
                    type="date"
                    value={taskCustomizations[task.id]?.dueDate || ''}
                    onChange={(e) => updateTaskCustomization(task.id, 'dueDate', e.target.value)}
                    className="mt-2 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="sticky bottom-6">
          <Button
            onClick={handleConfirm}
            disabled={!canProceed()}
            size="lg"
            className="w-full rounded-2xl py-6 text-lg font-medium bg-gradient-to-r from-primary to-tree-600 hover:from-primary/90 hover:to-tree-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300"
          >
            Confirm Tasks ({selectedTasks.length})
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          
          {!canProceed() && (
            <div className="flex items-center justify-center text-sm text-red-600 mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              Please set priority for all tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
