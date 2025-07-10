
import { Task, Priority } from '@/types';

const taskTemplates = {
  health: [
    { title: "Take a 15-minute walk outside", description: "Fresh air and movement to boost energy", priority: "Medium" as Priority },
    { title: "Drink 8 glasses of water today", description: "Stay hydrated for better focus", priority: "High" as Priority },
    { title: "Do 10 minutes of stretching", description: "Release tension and improve flexibility", priority: "Low" as Priority },
    { title: "Prepare a healthy meal", description: "Nourish your body with wholesome ingredients", priority: "Medium" as Priority },
    { title: "Get 7-8 hours of sleep", description: "Quality rest for optimal performance", priority: "High" as Priority },
  ],
  learning: [
    { title: "Read for 20 minutes", description: "Expand your knowledge and perspective", priority: "Medium" as Priority },
    { title: "Watch an educational video", description: "Learn something new today", priority: "Low" as Priority },
    { title: "Practice a new skill for 15 minutes", description: "Build expertise through consistent practice", priority: "Medium" as Priority },
    { title: "Write in a learning journal", description: "Reflect on what you've discovered", priority: "Low" as Priority },
    { title: "Take an online course lesson", description: "Invest in your personal development", priority: "High" as Priority },
  ],
  relationships: [
    { title: "Call a friend or family member", description: "Strengthen your connections", priority: "Medium" as Priority },
    { title: "Send a thoughtful message", description: "Let someone know you're thinking of them", priority: "Low" as Priority },
    { title: "Plan quality time with loved ones", description: "Create meaningful shared experiences", priority: "High" as Priority },
    { title: "Practice active listening", description: "Be fully present in conversations", priority: "Medium" as Priority },
    { title: "Express gratitude to someone", description: "Share appreciation for others", priority: "Low" as Priority },
  ],
  mindfulness: [
    { title: "Meditate for 10 minutes", description: "Calm your mind and center yourself", priority: "High" as Priority },
    { title: "Practice deep breathing", description: "Reduce stress with mindful breathing", priority: "Medium" as Priority },
    { title: "Write in a gratitude journal", description: "Focus on the positive aspects of life", priority: "Low" as Priority },
    { title: "Take a mindful nature break", description: "Connect with the natural world", priority: "Medium" as Priority },
    { title: "Do a body scan meditation", description: "Increase awareness of physical sensations", priority: "Low" as Priority },
  ],
  creativity: [
    { title: "Work on a creative project", description: "Express yourself through art or craft", priority: "High" as Priority },
    { title: "Brainstorm new ideas", description: "Let your imagination run free", priority: "Medium" as Priority },
    { title: "Try a new creative technique", description: "Experiment with unfamiliar methods", priority: "Low" as Priority },
    { title: "Document your creative process", description: "Reflect on your artistic journey", priority: "Low" as Priority },
    { title: "Share your creativity with others", description: "Get feedback and inspire others", priority: "Medium" as Priority },
  ],
  career: [
    { title: "Update your professional profile", description: "Keep your credentials current", priority: "Medium" as Priority },
    { title: "Network with a colleague", description: "Build professional relationships", priority: "Low" as Priority },
    { title: "Learn a job-relevant skill", description: "Invest in your career development", priority: "High" as Priority },
    { title: "Organize your workspace", description: "Create an environment for productivity", priority: "Low" as Priority },
    { title: "Set a professional goal", description: "Define clear objectives for growth", priority: "High" as Priority },
  ],
};

export function generatePersonalizedTasks(goals: string[]): Task[] {
  const allTasks: Task[] = [];
  
  goals.forEach(goal => {
    const templates = taskTemplates[goal as keyof typeof taskTemplates] || [];
    // Get 2-3 tasks from each selected goal area
    const selectedTasks = templates.slice(0, Math.min(3, templates.length));
    
    selectedTasks.forEach(template => {
      allTasks.push({
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: template.title,
        description: template.description,
        priority: template.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    });
  });
  
  // Shuffle and return up to 10 tasks
  const shuffled = allTasks.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

export function getMotivationalQuote(): string {
  const quotes = [
    "The journey of a thousand miles begins with one step.",
    "Focus on progress, not perfection.",
    "Small daily improvements lead to stunning results.",
    "Your future self will thank you for starting today.",
    "Mindful moments create a meaningful life.",
    "Every small step forward is still progress.",
    "Peace comes from within. Do not seek it from outside.",
    "The present moment is the only time over which we have power.",
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}
