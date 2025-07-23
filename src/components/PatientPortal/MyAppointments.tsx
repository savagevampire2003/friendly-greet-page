import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, User, Video, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Appointment {
  id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  consultation_fee: number;
  meeting_link?: string;
  doctor_name?: string;
  doctor_specialization?: string;
  diagnosis?: string;
  prescription?: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: appointmentsData, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor_registrations!appointments_doctor_id_fkey (
            full_name,
            specialization
          )
        `)
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;

      const transformedAppointments = appointmentsData?.map(apt => ({
        id: apt.id,
        doctor_id: apt.doctor_id,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        status: apt.status,
        notes: apt.notes || '',
        consultation_fee: apt.consultation_fee || 0,
        meeting_link: apt.meeting_link,
        diagnosis: apt.diagnosis,
        prescription: apt.prescription,
        doctor_name: apt.doctor_registrations?.full_name || 'Unknown Doctor',
        doctor_specialization: apt.doctor_registrations?.specialization || '',
      })) || [];

      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return apt.status === 'scheduled';
    return apt.status === activeTab;
  });

  const joinMeeting = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      toast({
        title: "Meeting Link Not Available",
        description: "The doctor hasn't provided a meeting link yet.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {filteredAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No {activeTab === 'all' ? '' : activeTab} appointments found
            </p>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">
                        {formatDate(appointment.appointment_date)}
                      </span>
                      <Clock className="h-4 w-4 text-blue-600 ml-2" />
                      <span className="font-medium">
                        {formatTime(appointment.appointment_time)}
                      </span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{appointment.doctor_name}</span>
                    <span className="text-gray-500">({appointment.doctor_specialization})</span>
                  </div>

                  {appointment.notes && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}

                  {appointment.diagnosis && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Diagnosis:</strong> {appointment.diagnosis}
                    </div>
                  )}

                  {appointment.prescription && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Prescription:</strong> {appointment.prescription}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>Fee: ${appointment.consultation_fee}</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {appointment.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => joinMeeting(appointment.meeting_link || '')}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join Meeting
                      </Button>
                    )}

                    {(appointment.status === 'completed' && (appointment.diagnosis || appointment.prescription)) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Medical Records",
                            description: "Detailed medical records feature coming soon",
                          });
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Records
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAppointments;