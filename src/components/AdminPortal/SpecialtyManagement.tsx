import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

const SpecialtyManagement: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [newSpecialty, setNewSpecialty] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch specialties",
        variant: "destructive",
      });
    }
  };

  const addSpecialty = async () => {
    if (!newSpecialty.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('specialties')
        .insert([{
          name: newSpecialty.name.trim(),
          description: newSpecialty.description.trim() || null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Specialty added successfully",
      });

      setNewSpecialty({ name: '', description: '' });
      fetchSpecialties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add specialty",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSpecialty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('specialties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Specialty deleted successfully",
      });

      fetchSpecialties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete specialty",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Specialty</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Specialty Name</label>
            <Input
              value={newSpecialty.name}
              onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
              placeholder="e.g., Cardiologist"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              value={newSpecialty.description}
              onChange={(e) => setNewSpecialty({ ...newSpecialty, description: e.target.value })}
              placeholder="Brief description of the specialty"
            />
          </div>
          <Button onClick={addSpecialty} disabled={loading} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Specialty
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Specialties</h2>
        <div className="space-y-2">
          {specialties.map((specialty) => (
            <div key={specialty.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">{specialty.name}</h3>
                {specialty.description && (
                  <p className="text-sm text-muted-foreground">{specialty.description}</p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSpecialty(specialty.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SpecialtyManagement;