
import { useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Welcome } from '@/components/Welcome';
import { Onboarding } from '@/components/Onboarding';
import { GoalSetting } from '@/components/GoalSetting';
import { TaskGeneration } from '@/components/TaskGeneration';
import { TaskSelection } from '@/components/TaskSelection';
import { Dashboard } from '@/components/Dashboard';

function AppContent() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Check if user has completed onboarding
    const savedUser = localStorage.getItem('user');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_USER', payload: user });
      
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        dispatch({ type: 'SET_TASKS', payload: tasks });
      }
      
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
    }
  }, [dispatch]);

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return <Welcome />;
      case 'onboarding':
        return <Onboarding />;
      case 'goal-setting':
        return <GoalSetting />;
      case 'task-generation':
        return <TaskGeneration />;
      case 'task-selection':
        return <TaskSelection />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {renderCurrentStep()}
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
