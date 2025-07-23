import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  specialty_name: string | null;
}

interface Specialty {
  id: string;
  name: string;
}

const mockSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM',
];

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [doctor, setDoctor] = useState('');
  const [slot, setSlot] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

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
    setDoctor(''); // Reset doctor selection when specialty changes
  }, [selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_registrations')
        .select(`
          id,
          full_name,
          specialization,
          specialties(name)
        `)
        .eq('status', 'approved');

      if (error) throw error;

      const transformedData = data?.map(doctor => ({
        id: doctor.id,
        full_name: doctor.full_name,
        specialization: doctor.specialization,
        specialty_name: doctor.specialties?.name || null
      })) || [];

      setDoctors(transformedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
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

  return (
    <Card className="max-w-xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Book a Consultation</h2>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter by Specialty</label>
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

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Doctor</label>
        <Select value={doctor} onValueChange={setDoctor}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a doctor" />
          </SelectTrigger>
          <SelectContent>
            {filteredDoctors.map(doc => (
              <SelectItem key={doc.id} value={doc.id}>
                {doc.full_name} ({doc.specialty_name || doc.specialization})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Time Slot</label>
        <Select value={slot} onValueChange={setSlot}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a time" />
          </SelectTrigger>
          <SelectContent>
            {mockSlots.map(time => (
              <SelectItem key={time} value={time}>{time}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">Upload Medical Report (optional)</label>
        <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        {file && <span className="text-sm text-green-600 mt-1 block">{file.name} selected</span>}
      </div>
      
      <Button className="w-full" disabled={!doctor || !slot}>Book Appointment</Button>
    </Card>
  );
};

export default BookAppointment; 