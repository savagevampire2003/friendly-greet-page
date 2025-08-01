import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, User, DollarSign, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';
import { useNotifications } from '../../hooks/useNotifications';

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  patient_name?: string;
  patient_email?: string;
}

const AppointmentCalendar: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const { toast } = useToast();
  const { createNotification } = useNotifications();

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Fetching appointments for doctor user:', user.id);

      // Get doctor registration
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor_registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (doctorError) {
        console.error('Doctor error:', doctorError);
        throw doctorError;
      }

      console.log('Doctor data:', doctorData);

      // Get appointments for the selected date
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .eq('appointment_date', selectedDate)
        .order('appointment_time');

      console.log('Raw appointments:', appointmentsData);

      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError);
        throw appointmentsError;
      }

      // Fetch patient profiles separately
      const transformedAppointments = [];
      for (const apt of appointmentsData || []) {
        console.log('Processing appointment:', apt.id, 'patient_id:', apt.patient_id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', apt.patient_id)
          .single();

        console.log('Profile data for patient', apt.patient_id, ':', profileData, profileError);

        transformedAppointments.push({
          id: apt.id,
          patient_id: apt.patient_id,
          appointment_date: apt.appointment_date,
          appointment_time: apt.appointment_time,
          status: apt.status,
          notes: apt.notes || '',
          patient_name: profileData?.full_name || 'Unknown Patient',
          patient_email: profileData?.email || '',
        });
      }

      console.log('Transformed appointments:', transformedAppointments);
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

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      console.log('Updating appointment status:', { appointmentId, newStatus });
      
      // Get current user info for debugging
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      // Get appointment details for notification
      const appointment = appointments.find(apt => apt.id === appointmentId);
      console.log('Found appointment:', appointment);
      
      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      
      // Add meeting link for scheduled appointments that are being updated
      if (newStatus === 'scheduled') {
        updateData.meeting_link = `https://meet.google.com/new`; // Placeholder meeting link
      }

      console.log('Update data:', updateData);
      
      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select();

      console.log('Update result:', { data, error });
      
      if (error) throw error;

      // Send notification to patient
      if (appointment) {
        let notificationTitle = '';
        let notificationMessage = '';
        
        if (newStatus === 'scheduled') {
          notificationTitle = 'Appointment Confirmed';
          notificationMessage = `Your appointment for ${appointment.appointment_date} at ${appointment.appointment_time} has been confirmed. Meeting link has been provided.`;
        } else if (newStatus === 'cancelled') {
          notificationTitle = 'Appointment Cancelled';
          notificationMessage = `Your appointment for ${appointment.appointment_date} at ${appointment.appointment_time} has been cancelled.`;
        } else if (newStatus === 'completed') {
          notificationTitle = 'Appointment Completed';
          notificationMessage = `Your appointment has been completed. Please check for any follow-up instructions.`;
        }
        
        await createNotification(appointment.patient_id, notificationTitle, notificationMessage, 'appointment');
      }

      toast({
        title: "Success",
        description: `Appointment ${newStatus} successfully`,
      });

      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-500';
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No appointments scheduled for {selectedDate}
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
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
                    <span>{appointment.patient_name}</span>
                    <span className="text-gray-500">({appointment.patient_email})</span>
                  </div>

                  {appointment.notes && (
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}

                   <div className="flex gap-2 flex-wrap">
                     {appointment.status === 'scheduled' && (
                       <>
                         <Button
                           size="sm"
                           onClick={() => {
                             toast({
                               title: "Video Consultation",
                               description: "Meeting link functionality will be available soon",
                             });
                           }}
                         >
                           <Video className="h-4 w-4 mr-1" />
                           Start Meeting
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                         >
                           Mark Complete
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                         >
                           Cancel
                         </Button>
                       </>
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

export default AppointmentCalendar;