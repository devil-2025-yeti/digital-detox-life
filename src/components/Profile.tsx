import { useState } from 'react';
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
    name: state.user?.name || '',
    email: state.user?.email || '',
    focusArea: state.user?.focusArea || '',
    goals: state.user?.goals?.join('\n') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        ...state.user!,
        ...formData,
        goals: formData.goals.split('\n').filter(goal => goal.trim() !== '')
      }
    });
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary/5 to-tree-600/5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <Card className="p-8 glass-effect">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{state.user?.name}</h2>
                <p className="text-gray-600">Member since today</p>
              </div>
            </div>
            
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="focusArea">Focus Area</Label>
              <Input
                id="focusArea"
                value={formData.focusArea}
                onChange={(e) => setFormData(prev => ({ ...prev, focusArea: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Study, Work, Fitness"
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>

            <div>
              <Label htmlFor="goals">Personal Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                disabled={!isEditing}
                placeholder="Enter each goal on a new line..."
                className={!isEditing ? "bg-gray-50" : ""}
                rows={4}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
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
