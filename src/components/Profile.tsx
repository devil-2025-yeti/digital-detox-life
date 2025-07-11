
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit, Save, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function Profile() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    focusArea: '',
    goals: ''
  });

  useEffect(() => {
    // Load user data from localStorage if not in state
    if (!state.user) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      }
    }

    // Update form data when user state changes
    if (state.user) {
      setFormData({
        name: state.user.name || '',
        email: state.user.email || '',
        focusArea: state.user.focusArea || '',
        goals: state.user.goals?.join('\n') || ''
      });
    }
  }, [state.user, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...state.user!,
      ...formData,
      goals: formData.goals.split('\n').filter(goal => goal.trim() !== '')
    };
    
    dispatch({
      type: 'UPDATE_USER',
      payload: updatedUser
    });
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || '',
      email: state.user?.email || '',
      focusArea: state.user?.focusArea || '',
      goals: state.user?.goals?.join('\n') || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-br from-primary/5 to-tree-600/5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your personal information and preferences</p>
        </div>

        <Card className="p-4 sm:p-8 glass-effect">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                  {state.user?.name || 'User'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Member since today</p>
              </div>
            </div>
            
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center space-x-2 self-start sm:self-auto"
                size="sm"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="focusArea" className="text-sm sm:text-base">Focus Area</Label>
              <Input
                id="focusArea"
                value={formData.focusArea}
                onChange={(e) => setFormData(prev => ({ ...prev, focusArea: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Study, Work, Fitness"
                className={`mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-sm sm:text-base">Personal Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter each goal on a new line..."
                className={`mt-1 ${!isEditing ? "bg-gray-50" : ""}`}
                rows={4}
              />
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button type="submit" className="flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
