import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Star, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  specialty_name: string | null;
  hospital_affiliation: string | null;
  years_of_experience: number;
  professional_bio: string | null;
  education_details: string;
  contact_phone: string;
  email: string | null;
}

interface TimeSlot {
  slot_time: string;
  is_available: boolean;
}

interface DoctorProfileProps {
  doctorId: string;
  onBack: () => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctorId, onBack }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctorProfile();
  }, [doctorId]);

  useEffect(() => {
    if (doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchDoctorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('approved_doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) throw error;
      setDoctor(data);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load doctor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!doctor) return;

    try {
      const { data, error } = await supabase
        .rpc('get_available_slots', {
          p_doctor_id: doctor.id,
          p_date: selectedDate
        });

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Show empty slots if function fails
      setAvailableSlots([]);
    }
  };

  const bookAppointment = async () => {
    if (!doctor || !selectedSlot) return;

    try {
      setBookingLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to book an appointment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: doctor.id,
          patient_id: user.id,
          appointment_date: selectedDate,
          appointment_time: selectedSlot,
          status: 'pending',
          consultation_fee: 100, // Default fee for now
          consultation_type: 'video'
        });

      if (error) throw error;

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been booked successfully. The doctor will confirm shortly.",
      });

      // Reset selection and refresh slots
      setSelectedSlot('');
      fetchAvailableSlots();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="p-4">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return (
      <div className="text-center p-8">
        <p>Doctor not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back to Search
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{doctor.full_name}</h2>
              <p className="text-lg text-muted-foreground">{doctor.specialty_name || doctor.specialization}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Consultation Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span>{doctor.years_of_experience} years experience</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>{doctor.hospital_affiliation}</span>
            </div>
          </div>

          {doctor.professional_bio && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700">{doctor.professional_bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education & Qualifications
            </h3>
            <p className="text-gray-700">{doctor.education_details}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book an Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              min={getMinDate()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          {availableSlots.length > 0 ? (
            <div>
              <label className="block text-sm font-medium mb-2">Available Time Slots</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.slot_time}
                    variant={selectedSlot === slot.slot_time ? "default" : "outline"}
                    disabled={!slot.is_available}
                    onClick={() => setSelectedSlot(slot.slot_time)}
                    className="text-sm"
                  >
                    {formatTime(slot.slot_time)}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Appointment booking will be available once the doctor sets their availability.
            </p>
          )}

          <Button
            onClick={bookAppointment}
            disabled={!selectedSlot || bookingLoading}
            className="w-full"
          >
            {bookingLoading ? 'Booking...' : 'Book Appointment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfile;