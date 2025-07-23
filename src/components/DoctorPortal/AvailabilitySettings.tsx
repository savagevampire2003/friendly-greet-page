import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  consultation_fee: number;
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const AvailabilitySettings: React.FC = () => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get doctor registration
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor_registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (doctorError) throw doctorError;
      
      setDoctorId(doctorData.id);

      // For now, just initialize with empty array
      // Once the types are updated, we can fetch real availability data
      setAvailability([]);

    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast({
        title: "Error",
        description: "Failed to load availability settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewSlot = () => {
    const newSlot: AvailabilitySlot = {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
      consultation_fee: 50,
      is_active: true,
    };
    setAvailability([...availability, newSlot]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeSlot = async (index: number) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const saveAvailability = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);

      // For now, just show success message
      // Once types are updated, we can implement real database operations
      toast({
        title: "Success",
        description: "Availability settings will be saved once database types are updated",
      });

    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading availability settings...</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Set Your Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {availability.map((slot, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Availability Slot {index + 1}</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={slot.is_active}
                  onCheckedChange={(checked) => updateSlot(index, 'is_active', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSlot(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label>Day of Week</Label>
                <Select
                  value={slot.day_of_week.toString()}
                  onValueChange={(value) => updateSlot(index, 'day_of_week', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={slot.start_time}
                  onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                />
              </div>

              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={slot.end_time}
                  onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                />
              </div>

              <div>
                <Label>Slot Duration (minutes)</Label>
                <Select
                  value={slot.slot_duration_minutes.toString()}
                  onValueChange={(value) => updateSlot(index, 'slot_duration_minutes', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Consultation Fee ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={slot.consultation_fee}
                  onChange={(e) => updateSlot(index, 'consultation_fee', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <Button variant="outline" onClick={addNewSlot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
          <Button onClick={saveAvailability} disabled={loading}>
            Save Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilitySettings;