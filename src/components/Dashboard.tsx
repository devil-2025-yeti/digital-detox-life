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
import { AppSidebar } from './AppSidebar';
import { NotificationSystem } from './NotificationSystem';
import { toast } from '@/hooks/use-toast';
import { ScreenTime } from './ScreenTime';
import { SocialMediaMonitor } from './SocialMediaMonitor';
import { Task } from '@/types';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [quote, setQuote] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedTask, setHighlightedTask] = useState<string | null>(null);

  useEffect(() => {
    // Load user and tasks from localStorage on component mount
    const savedUser = localStorage.getItem('user');
    const savedTasks = localStorage.getItem('tasks');

    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_USER', payload: user });
    }

    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    }

    // Generate a motivational quote
    const generateQuote = async () => {
      const newQuote = await getMotivationalQuote();
      setQuote(newQuote);
    };
    generateQuote();

    // Celebration logic
    const allTasksCompleted = state.tasks.length > 0 && state.tasks.every(task => task.completed);
    if (allTasksCompleted && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    // Check if we need to highlight a specific task
    const taskToHighlight = localStorage.getItem('highlightTask');
    if (taskToHighlight) {
      setHighlightedTask(taskToHighlight);
      localStorage.removeItem('highlightTask');
      
      // Remove highlight after 3 seconds
      setTimeout(() => setHighlightedTask(null), 3000);
    }
  }, [state.user, state.tasks.length, dispatch]);

  const toggleTaskCompletion = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETION', payload: id });
    toast({
      title: 'Task Updated',
      description: 'The task completion status has been updated.',
    });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    toast({
      title: 'Task Deleted',
      description: 'The task has been successfully deleted.',
    });
  };

  const pendingTasks = state.tasks.filter(task => !task.completed);
  const completedTasks = state.tasks.filter(task => task.completed);

  const progress = state.tasks.length > 0
    ? (completedTasks.length / state.tasks.length) * 100
    : 0;

  return (
    <>
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
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Dashboard</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome back, {state.user?.name}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <NotificationSystem onGoToTasks={() => {}} />
              </div>
            </div>
          </header>

          <div className="p-3 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <Card className="p-4 sm:p-6 glass-effect">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tasks Completed</p>
                      <p className="text-2xl font-semibold text-gray-800">{completedTasks.length}</p>
                    </div>
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <Progress value={progress} className="h-2" />
                </Card>

                <Card className="p-4 sm:p-6 glass-effect">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Pending Tasks</p>
                      <p className="text-2xl font-semibold text-gray-800">{pendingTasks.length}</p>
                    </div>
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-500">Keep up the momentum!</p>
                </Card>

                <Card className="p-4 sm:p-6 glass-effect">
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Overall Progress</p>
                      <p className="text-2xl font-semibold text-gray-800">{progress.toFixed(0)}%</p>
                    </div>
                    <Quote className="w-6 h-6 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-500">Towards your goals</p>
                </Card>
              </div>

              {/* Motivational Quote Section */}
              <Card className="p-4 sm:p-6 glass-effect mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Quote className="w-5 h-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Daily Motivation</h2>
                </div>
                <p className="text-gray-700 italic">"{quote}"</p>
              </Card>

              {/* Tasks Section */}
              <div className="grid gap-4 sm:gap-6 mb-6">
                {/* Pending Tasks */}
                {pendingTasks.length > 0 && (
                  <Card className="p-4 sm:p-6 glass-effect">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Pending Tasks</h2>
                      <Badge variant="secondary">{pendingTasks.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {pendingTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/60 backdrop-blur-sm border transition-all duration-300 ${
                            highlightedTask === task.title 
                              ? 'border-primary bg-primary/10 shadow-md scale-[1.02]' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskCompletion(task.id)}
                              className="p-1 h-6 w-6 rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary/10"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{task.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTask(task)}
                              className="p-1 h-7 w-7"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className="p-1 h-7 w-7 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <Card className="p-4 sm:p-6 glass-effect">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Completed Tasks</h2>
                      <Badge variant="outline">{completedTasks.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 transition-all duration-300">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskCompletion(task.id)}
                              className="p-1 h-6 w-6 rounded-full border-2 border-green-500 bg-green-500/10"
                            >
                              <Check className="w-3 h-3 text-green-500" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-800 line-through text-sm sm:text-base truncate">{task.title}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTask(task)}
                              className="p-1 h-7 w-7"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className="p-1 h-7 w-7 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Screen Time and Social Media Monitor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <ScreenTime />
                <SocialMediaMonitor />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />

      {/* Edit Task Modal */}
      <EditTaskDialog
        open={!!editingTask}
        onOpenChange={() => setEditingTask(null)}
        task={editingTask}
      />

      {/* Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md mx-4 p-8 text-center animate-bounce">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Congratulations!</h2>
            <p className="text-gray-700 text-lg">You've completed all your tasks!</p>
          </Card>
        </div>
      )}
    </>
  );
}
