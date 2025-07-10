
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { Task, Priority } from '@/types';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    // Update localStorage
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));
    
    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What would you like to accomplish?"
              className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details..."
              className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 min-h-20"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Priority *
            </Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="mt-2 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Due Date (optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-2 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
