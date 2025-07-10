
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Check, Edit, Trash2, Calendar, Quote } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getMotivationalQuote } from '@/utils/aiTaskGenerator';
import { AddTaskDialog } from './AddTaskDialog';

export function Dashboard() {
  const { state } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [quote, setQuote] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    // Show celebration animation on first load
    setShowCelebration(true);
    setQuote(getMotivationalQuote());
    
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const completedTasks = state.tasks.filter(task => task.completed);
  const pendingTasks = state.tasks.filter(task => !task.completed);
  const progressPercentage = state.tasks.length > 0 
    ? Math.round((completedTasks.length / state.tasks.length) * 100) 
    : 0;

  const sortedPendingTasks = pendingTasks.sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="text-center text-white animate-fade-in">
          <div className="mb-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">🎉 Wonderful!</h1>
          <p className="text-xl mb-2">Your personalized plan is ready</p>
          <p className="text-lg opacity-90">Time to begin your focused journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {state.user?.name} ✨
          </h1>
          <p className="text-gray-600">
            Let's make today meaningful and focused
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-6 animate-slide-up glass-effect">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
            <span className="text-2xl font-bold text-purple-600">
              {progressPercentage}%
            </span>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>{completedTasks.length} completed</span>
            <span>{pendingTasks.length} remaining</span>
          </div>
        </Card>

        {/* Motivational Quote */}
        <Card className="p-6 mb-6 animate-slide-up glass-effect">
          <div className="flex items-start space-x-3">
            <Quote className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <p className="text-gray-700 italic leading-relaxed">
              "{quote}"
            </p>
          </div>
        </Card>

        {/* Add Task Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddTask(true)}
            className="w-full rounded-2xl py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </Button>
        </div>

        {/* Pending Tasks */}
        {sortedPendingTasks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Focus Areas ({sortedPendingTasks.length})
            </h3>
            
            <div className="space-y-4">
              {sortedPendingTasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={index}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Completed ({completedTasks.length})
            </h3>
            
            <div className="space-y-4">
              {completedTasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={index}
                  getPriorityColor={getPriorityColor}
                  isCompleted
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask} 
      />
    </div>
  );
}

function TaskCard({ task, index, getPriorityColor, isCompleted = false }: any) {
  const { dispatch } = useApp();

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: task.id });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  return (
    <Card 
      className={`task-card p-6 animate-slide-up ${
        isCompleted ? 'opacity-70' : ''
      } priority-${task.priority.toLowerCase()}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={handleToggleComplete}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted 
              ? 'bg-green-600 border-green-600' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 ${
              isCompleted ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
