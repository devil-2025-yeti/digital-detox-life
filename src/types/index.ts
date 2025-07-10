
export interface User {
  id: string;
  name: string;
  email: string;
  bedtime: string;
  wakeTime: string;
  location: string;
  nationality: string;
  hobbies: string;
  occupation: string;
  goals: string[];
  onboardingComplete: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  currentStep: 'welcome' | 'onboarding' | 'goal-setting' | 'task-generation' | 'task-selection' | 'dashboard';
  aiSuggestedTasks: Task[];
  isLoading: boolean;
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface OnboardingData {
  name: string;
  email: string;
  bedtime: string;
  wakeTime: string;
  location: string;
  nationality: string;
  hobbies: string;
  occupation: string;
  goals: string[];
}
