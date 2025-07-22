import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '../ui/use-toast';

interface DoctorProfile {
  id: string;
  full_name: string;
  specialization: string;
  specialty_name: string | null;
  hospital_affiliation: string | null;
  years_of_experience: number;
  professional_bio: string | null;
  education_details: string;
  contact_phone: string;
  email: string;
  status: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doctor_registrations')
        .select(`
          id,
          full_name,
          specialization,
          hospital_affiliation,
          years_of_experience,
          professional_bio,
          education_details,
          contact_phone,
          status,
          profiles!inner(email),
          specialties(name)
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        id: data.id,
        full_name: data.full_name,
        specialization: data.specialization,
        specialty_name: data.specialties?.name || null,
        hospital_affiliation: data.hospital_affiliation,
        years_of_experience: data.years_of_experience,
        professional_bio: data.professional_bio,
        education_details: data.education_details,
        contact_phone: data.contact_phone,
        email: (data.profiles as any)?.email || '',
        status: data.status
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('doctor_registrations')
        .update({
          full_name: profile.full_name,
          hospital_affiliation: profile.hospital_affiliation,
          professional_bio: profile.professional_bio,
          contact_phone: profile.contact_phone,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DoctorProfile, value: string | number) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center">Loading profile...</div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">No doctor registration found.</p>
          <p className="text-sm">Please complete your doctor registration first.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Doctor Profile</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          profile.status === 'approved' 
            ? 'bg-green-100 text-green-800' 
            : profile.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
        </div>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input 
              value={profile.full_name} 
              onChange={e => handleInputChange('full_name', e.target.value)} 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input 
              type="email" 
              value={profile.email} 
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Specialty</label>
            <Input 
              value={profile.specialty_name || profile.specialization} 
              disabled
              className="bg-muted"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Years of Experience</label>
            <Input 
              type="number" 
              value={profile.years_of_experience} 
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Hospital Affiliation</label>
          <Input 
            value={profile.hospital_affiliation || ''} 
            onChange={e => handleInputChange('hospital_affiliation', e.target.value)}
            placeholder="Enter hospital affiliation"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Phone</label>
          <Input 
            value={profile.contact_phone} 
            onChange={e => handleInputChange('contact_phone', e.target.value)} 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Professional Bio</label>
          <Textarea 
            value={profile.professional_bio || ''} 
            onChange={e => handleInputChange('professional_bio', e.target.value)}
            placeholder="Write a brief professional bio..."
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Education Details</label>
          <Textarea 
            value={profile.education_details} 
            disabled
            className="bg-muted"
            rows={3}
          />
        </div>

        <Button 
          type="button"
          onClick={updateProfile} 
          disabled={saving || profile.status !== 'approved'} 
          className="w-full mt-4"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>

        {profile.status !== 'approved' && (
          <p className="text-sm text-muted-foreground text-center">
            Profile editing is only available for approved doctors.
          </p>
        )}
      </form>
    </Card>
  );
};

export default Profile;