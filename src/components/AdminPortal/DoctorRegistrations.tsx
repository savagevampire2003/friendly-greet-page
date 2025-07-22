import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DoctorRegistration {
  id: string;
  user_id: string;
  full_name: string;
  medical_license_number: string;
  specialization: string;
  years_of_experience: number;
  hospital_affiliation: string;
  contact_phone: string;
  professional_bio: string;
  education_details: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

const DoctorRegistrations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<DoctorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<DoctorRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (registrationId: string, approve: boolean) => {
    if (!user) return;
    
    setActionLoading(true);
    try {
      const updateData: any = {
        status: approve ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id
      };

      if (!approve && rejectionReason.trim()) {
        updateData.rejection_reason = rejectionReason.trim();
      }

      const { error } = await supabase
        .from('doctor_registrations')
        .update(updateData)
        .eq('id', registrationId);

      if (error) throw error;

      // Create notification for the doctor
      const registration = registrations.find(r => r.id === registrationId);
      if (registration) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: registration.user_id,
            title: `Registration ${approve ? 'Approved' : 'Rejected'}`,
            message: approve 
              ? 'Congratulations! Your doctor registration has been approved. You can now access all doctor portal features.'
              : `Your doctor registration was rejected. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
            type: approve ? 'success' : 'error'
          }]);
      }

      toast({
        title: "Success",
        description: `Registration ${approve ? 'approved' : 'rejected'} successfully.`,
      });

      setSelectedRegistration(null);
      setRejectionReason('');
      fetchRegistrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center p-8">Loading registrations...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registrations found.</p>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <Card key={registration.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{registration.full_name}</h3>
                      <p className="text-muted-foreground">{registration.specialization}</p>
                    </div>
                    {getStatusBadge(registration.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>License:</strong> {registration.medical_license_number}
                    </div>
                    <div>
                      <strong>Experience:</strong> {registration.years_of_experience} years
                    </div>
                    <div>
                      <strong>Phone:</strong> {registration.contact_phone}
                    </div>
                    <div>
                      <strong>Hospital:</strong> {registration.hospital_affiliation || 'Not specified'}
                    </div>
                  </div>

                  <div className="mt-4">
                    <strong>Education:</strong>
                    <p className="text-sm text-muted-foreground mt-1">{registration.education_details}</p>
                  </div>

                  {registration.professional_bio && (
                    <div className="mt-4">
                      <strong>Bio:</strong>
                      <p className="text-sm text-muted-foreground mt-1">{registration.professional_bio}</p>
                    </div>
                  )}

                  {registration.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(registration.id, true)}
                        disabled={actionLoading}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRegistration(registration)}
                        disabled={actionLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {registration.status === 'rejected' && registration.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <strong className="text-red-800">Rejection Reason:</strong>
                      <p className="text-red-700 text-sm mt-1">{registration.rejection_reason}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      {selectedRegistration && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Reject Registration - {selectedRegistration.full_name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rejection Reason (Optional)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRegistration(null);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(selectedRegistration.id, false)}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DoctorRegistrations;