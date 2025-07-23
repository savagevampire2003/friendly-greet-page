import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calendar, Clock, DollarSign, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  specialty_name: string | null;
  years_of_experience: number;
  hospital_affiliation: string | null;
  professional_bio: string | null;
  education_details: string;
  contact_phone: string;
}

interface Specialty {
  id: string;
  name: string;
}

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toast } = useToast();

  // Mock time slots for now
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      const filtered = doctors.filter(doc => 
        doc.specialty_name === selectedSpecialty || 
        doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
    setSelectedDoctor(null);
  }, [selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('approved_doctors')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
    }
  };

  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) return;

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
          doctor_id: selectedDoctor.id,
          patient_id: user.id,
          appointment_date: selectedDate,
          appointment_time: selectedSlot,
          status: 'pending',
          notes: notes,
          consultation_fee: 50,
          consultation_type: 'video'
        });

      if (error) throw error;

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been booked successfully. The doctor will confirm shortly.",
      });

      // Reset form
      setSelectedDoctor(null);
      setSelectedSlot('');
      setNotes('');
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
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // Show doctor selection
  if (!selectedDoctor) {
    return (
      <Card className="max-w-4xl mx-auto p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Book a Consultation</h2>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Filter by Specialty</label>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All specialties</SelectItem>
              {specialties.map(specialty => (
                <SelectItem key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doctor => (
            <Card key={doctor.id} className="p-4 hover:shadow-lg cursor-pointer transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                  <p className="text-blue-600 font-medium">
                    {doctor.specialty_name || doctor.specialization}
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>{doctor.years_of_experience} years experience</p>
                  {doctor.hospital_affiliation && (
                    <p>{doctor.hospital_affiliation}</p>
                  )}
                </div>

                {doctor.professional_bio && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {doctor.professional_bio}
                  </p>
                )}

                <Button 
                  onClick={() => setSelectedDoctor(doctor)}
                  className="w-full"
                >
                  Select Doctor
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No doctors found for the selected specialty.
          </p>
        )}
      </Card>
    );
  }

  // Show appointment booking form
  return (
    <Card className="max-w-2xl mx-auto p-6 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedDoctor(null)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <p className="text-gray-600">with Dr. {selectedDoctor.full_name}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <User className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="font-medium">{selectedDoctor.full_name}</h3>
            <p className="text-sm text-gray-600">
              {selectedDoctor.specialty_name || selectedDoctor.specialization}
            </p>
            <p className="text-sm text-gray-500">
              {selectedDoctor.hospital_affiliation}
            </p>
          </div>
          <Badge className="ml-auto">
            <DollarSign className="h-3 w-3 mr-1" />
            $50
          </Badge>
        </div>

        <div>
          <label className="block mb-2 font-medium">Select Date</label>
          <Input
            type="date"
            value={selectedDate}
            min={getMinDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Select Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map(slot => (
              <Button
                key={slot}
                variant={selectedSlot === slot ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSlot(slot)}
              >
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(slot)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Additional Notes (Optional)</label>
          <textarea
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            placeholder="Describe your symptoms or reason for consultation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button 
          onClick={bookAppointment}
          disabled={!selectedSlot || bookingLoading}
          className="w-full"
        >
          {bookingLoading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </div>
    </Card>
  );
};

export default BookAppointment;