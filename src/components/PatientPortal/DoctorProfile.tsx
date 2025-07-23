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
  specialty_name: string;
  hospital_affiliation: string;
  years_of_experience: number;
  professional_bio: string;
  education_details: string;
  avg_consultation_fee: number;
  has_availability: boolean;
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
      // Use the existing approved_doctors view
      const { data, error } = await supabase
        .from('approved_doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      const doctorData: Doctor = {
        id: data.id,
        full_name: data.full_name,
        specialization: data.specialization,
        specialty_name: data.specialty_name,
        hospital_affiliation: data.hospital_affiliation || '',
        years_of_experience: data.years_of_experience,
        professional_bio: data.professional_bio || '',
        education_details: data.education_details || '',
        avg_consultation_fee: 50, // Default fee for now
        has_availability: true // Assume true for now
      };
      
      setDoctor(doctorData);
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
      // For now, generate mock slots since the RPC function might not be available
      const mockSlots: TimeSlot[] = [
        { slot_time: '09:00', is_available: true },
        { slot_time: '09:30', is_available: true },
        { slot_time: '10:00', is_available: false },
        { slot_time: '10:30', is_available: true },
        { slot_time: '11:00', is_available: true },
        { slot_time: '14:00', is_available: true },
        { slot_time: '14:30', is_available: false },
        { slot_time: '15:00', is_available: true },
        { slot_time: '15:30', is_available: true },
        { slot_time: '16:00', is_available: true },
      ];
      
      setAvailableSlots(mockSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
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
          consultation_fee: doctor.avg_consultation_fee,
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
              ${doctor.avg_consultation_fee}/session
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

      {doctor.has_availability ? (
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
                No available slots for {selectedDate}. Please select another date.
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
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              This doctor is not currently accepting appointments online.
              Please contact them directly for scheduling.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorProfile;