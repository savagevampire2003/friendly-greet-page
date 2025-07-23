import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ScheduleQueue from './ScheduleQueue';
import PatientQueue from './PatientQueue';
import Profile from './Profile';
import DoctorRegistrationForm from './DoctorRegistrationForm';
import RegistrationStatus from './RegistrationStatus';
import AvailabilitySettings from './AvailabilitySettings';
import AppointmentCalendar from './AppointmentCalendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DoctorRegistration {
  id: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

const DoctorTabs: React.FC = () => {
  const { user } = useAuth();
  const [registration, setRegistration] = useState<DoctorRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkRegistrationStatus();
    }
  }, [user]);

  const checkRegistrationStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('doctor_registrations')
        .select('id, status, rejection_reason, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setRegistration(data);
    } catch (error) {
      console.error('Error checking registration status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationComplete = () => {
    checkRegistrationStatus();
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // If no registration exists, show registration form
  if (!registration) {
    return (
      <div className="mt-8">
        <DoctorRegistrationForm onSubmissionComplete={handleRegistrationComplete} />
      </div>
    );
  }

  // If registration is pending or rejected, show status
  if (registration.status === 'pending' || registration.status === 'rejected') {
    return (
      <div className="mt-8">
        <RegistrationStatus 
          status={registration.status}
          rejectionReason={registration.rejection_reason}
          submittedAt={registration.created_at}
        />
      </div>
    );
  }

  // If approved, show full doctor portal
  return (
    <Tabs defaultValue="appointments" className="w-full mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="availability">Availability</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="queue">Patient Queue</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="appointments">
        <AppointmentCalendar />
      </TabsContent>
      <TabsContent value="availability">
        <AvailabilitySettings />
      </TabsContent>
      <TabsContent value="dashboard">
        <div className="p-4">Welcome to your dashboard! (Today's stats, quick actions, etc.)</div>
      </TabsContent>
      <TabsContent value="schedule">
        <ScheduleQueue />
      </TabsContent>
      <TabsContent value="queue">
        <PatientQueue />
      </TabsContent>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
    </Tabs>
  );
};

export default DoctorTabs; 