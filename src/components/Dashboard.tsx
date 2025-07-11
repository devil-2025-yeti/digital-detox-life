
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Check, Edit, Trash2, Calendar, Quote, Menu } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getMotivationalQuote } from '@/utils/aiTaskGenerator';
import { AddTaskDialog } from './AddTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { NotificationSystem } from './NotificationSystem';
import { SocialMediaMonitor } from './SocialMediaMonitor';
import { AppSidebar } from './AppSidebar';
import { ScreenTime } from './ScreenTime';
import { Task } from '@/types';

export function Dashboard() {
  const { state } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [quote, setQuote] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedUser && !state.user) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_USER', payload: user });
    }
    
    if (savedTasks && state.tasks.length === 0) {
      const tasks = JSON.parse(savedTasks);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }

    // Show celebration animation on first load
    setShowCelebration(true);
    setQuote(getMotivationalQuote());
    
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const { dispatch } = useApp();
  const completedTasks = state.tasks.filter(task => task.completed);
  const pendingTasks = state.tasks.filter(task => !task.completed);
  const progressPercentage = state.tasks.length > 0 
    ? Math.round((completedTasks.length / state.tasks.length) * 100) 
    : 0;

  // Sort pending tasks by priority: High -> Medium -> Low
  const sortedPendingTasks = pendingTasks.sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Sort completed tasks by priority as well
  const sortedCompletedTasks = completedTasks.sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditTask(true);
  };

  const handleGoToTasks = () => {
    // Scroll to tasks section or focus on task list
    const tasksSection = document.getElementById('tasks-section');
    if (tasksSection) {
      tasksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary to-tree-600">
        <div className="text-center text-white animate-fade-in max-w-sm">
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
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">🎉 Wonderful!</h1>
          <p className="text-lg sm:text-xl mb-2">Your personalized plan is ready</p>
          <p className="text-base sm:text-lg opacity-90">Time to begin your focused journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-tree-600/5">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-white/20 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                  Welcome back, {state.user?.name || 'User'} ✨
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Let's make today meaningful and focused</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 pb-20">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Progress Overview */}
            <Card className="p-4 sm:p-6 glass-effect">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Progress</h2>
                <span className="text-xl sm:text-2xl font-bold text-primary">
                  {progressPercentage}%
                </span>
              </div>
              
              <Progress value={progressPercentage} className="mb-4" />
              
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>{completedTasks.length} completed</span>
                <span>{pendingTasks.length} remaining</span>
              </div>
            </Card>

            {/* Motivational Quote */}
            <Card className="p-4 sm:p-6 glass-effect">
              <div className="flex items-start space-x-3">
                <Quote className="w-5 sm:w-6 h-5 sm:h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                  "{quote}"
                </p>
              </div>
            </Card>

            {/* Add Task Button */}
            <div>
              <Button
                onClick={() => setShowAddTask(true)}
                className="w-full rounded-2xl py-4 sm:py-6 bg-gradient-to-r from-primary to-tree-600 hover:from-primary/90 hover:to-tree-700 transition-all duration-300 text-sm sm:text-base"
              >
                <Plus className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Add New Task
              </Button>
            </div>

            <div id="tasks-section">
              {/* Pending Tasks */}
              {sortedPendingTasks.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Focus Areas ({sortedPendingTasks.length})
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {sortedPendingTasks.map((task, index) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        index={index}
                        getPriorityColor={getPriorityColor}
                        onEdit={handleEditTask}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {sortedCompletedTasks.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Completed ({sortedCompletedTasks.length})
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {sortedCompletedTasks.map((task, index) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        index={index}
                        getPriorityColor={getPriorityColor}
                        onEdit={handleEditTask}
                        isCompleted
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Screen Time Section - moved below completed tasks */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Screen Time</h2>
                <ScreenTime />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddTaskDialog 
        open={showAddTask} 
        onOpenChange={setShowAddTask} 
      />

      <EditTaskDialog
        open={showEditTask}
        onOpenChange={setShowEditTask}
        task={taskToEdit}
      />

      <NotificationSystem onGoToTasks={handleGoToTasks} />
      <SocialMediaMonitor onGoToTasks={handleGoToTasks} />
    </div>
  );
}

function TaskCard({ task, index, getPriorityColor, onEdit, isCompleted = false }: any) {
  const { dispatch } = useApp();

  const handleToggleComplete = () => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: task.id });
    
    // Update localStorage
    const currentTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = currentTasks.map((t: any) => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
      
      // Update localStorage
      const currentTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = currentTasks.filter((t: any) => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  return (
    <Card 
      className={`task-card p-4 sm:p-6 animate-slide-up ${
        isCompleted ? 'opacity-70' : ''
      } priority-${task.priority.toLowerCase()}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <button
          onClick={handleToggleComplete}
          className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            isCompleted 
              ? 'bg-green-600 border-green-600' 
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {isCompleted && <Check className="w-3 sm:w-4 h-3 sm:h-4 text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className={`font-semibold text-sm sm:text-base ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
            } break-words`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                {task.priority}
              </Badge>
              
              {!isCompleted && (
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 text-gray-400 hover:text-primary transition-colors"
                >
                  <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-xs sm:text-sm mb-3 ${
              isCompleted ? 'text-gray-400' : 'text-gray-600'
            } break-words`}>
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
