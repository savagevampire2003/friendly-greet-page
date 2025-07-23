import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setName(profile.full_name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setDob(profile.date_of_birth || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          phone: phone,
          date_of_birth: dob || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <Card className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input 
            type="email" 
            value={email} 
            disabled
            className="bg-muted"
            placeholder="Email cannot be changed"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <Input 
            type="date" 
            value={dob} 
            onChange={e => setDob(e.target.value)} 
          />
        </div>
        <Button type="submit" className="w-full mt-4">Save</Button>
      </form>
    </Card>
  );
};

export default Profile; 