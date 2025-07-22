import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RegistrationStatus {
  id: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
}

const DoctorRegistrationStatus: React.FC = () => {
  const [registration, setRegistration] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchRegistration = async () => {
      try {
        const { data, error } = await supabase
          .from('doctor_registrations')
          .select('id, status, rejection_reason, created_at, updated_at')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching registration:', error);
          return;
        }

        setRegistration(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [user]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!registration) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved': return 'Your registration has been approved! You can now access all doctor features.';
      case 'rejected': return 'Your registration has been rejected. Please review the feedback and resubmit.';
      default: return 'Your registration is pending admin review. Please wait for approval.';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Registration Status</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge className={getStatusColor(registration.status)}>
            {registration.status.toUpperCase()}
          </Badge>
        </div>

        <p className="text-muted-foreground">
          {getStatusMessage(registration.status)}
        </p>

        {registration.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
            <p className="text-red-700">{registration.rejection_reason}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Submitted: {new Date(registration.created_at).toLocaleDateString()}</p>
          {registration.updated_at && (
            <p>Updated: {new Date(registration.updated_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DoctorRegistrationStatus;