import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Search, Phone, GraduationCap, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../ui/use-toast';

interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  specialty_name: string | null;
  specialty_description: string | null;
  hospital_affiliation: string | null;
  years_of_experience: number;
  professional_bio: string | null;
  education_details: string;
  contact_phone: string;
  email: string;
}

interface Specialty {
  id: string;
  name: string;
}

const DoctorSearch: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([fetchDoctors(), fetchSpecialties()]);
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchName, selectedSpecialty, doctors]);

  const fetchDoctors = async () => {
    try {
      // First get approved doctors
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctor_registrations')
        .select(`
          id,
          user_id,
          full_name,
          specialization,
          specialty_id,
          hospital_affiliation,
          years_of_experience,
          professional_bio,
          education_details,
          contact_phone,
          specialties(name, description)
        `)
        .eq('status', 'approved');

      if (doctorError) throw doctorError;

      // Get user emails separately
      const userIds = doctorData?.map(doctor => doctor.user_id) || [];
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profileError) throw profileError;

      const transformedData = doctorData?.map(doctor => {
        const profile = profileData?.find(p => p.id === doctor.user_id);
        return {
          id: doctor.id,
          user_id: doctor.user_id,
          full_name: doctor.full_name,
          specialization: doctor.specialization,
          specialty_name: doctor.specialties?.name || null,
          specialty_description: doctor.specialties?.description || null,
          hospital_affiliation: doctor.hospital_affiliation,
          years_of_experience: doctor.years_of_experience,
          professional_bio: doctor.professional_bio,
          education_details: doctor.education_details,
          contact_phone: doctor.contact_phone,
          email: profile?.email || ''
        };
      }) || [];

      setDoctors(transformedData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors. Please try again.",
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

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchName.trim()) {
      filtered = filtered.filter(doctor =>
        doctor.full_name.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialty_name === selectedSpecialty || 
        doctor.specialization.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleSearch = () => {
    filterDoctors();
  };

  const clearFilters = () => {
    setSearchName('');
    setSelectedSpecialty('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading doctors...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Find a Doctor</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter doctor's name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Filter by Specialty</label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{doctor.full_name}</h3>
                <p className="text-primary font-medium">
                  {doctor.specialty_name || doctor.specialization}
                </p>
                {doctor.specialty_description && (
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialty_description}
                  </p>
                )}
              </div>

              {doctor.professional_bio && (
                <p className="text-sm text-muted-foreground">
                  {doctor.professional_bio}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{doctor.years_of_experience} years experience</span>
                </div>
                
                {doctor.hospital_affiliation && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{doctor.hospital_affiliation}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.contact_phone}</span>
                </div>
              </div>

              <Button className="w-full">
                Book Consultation
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No doctors found matching your criteria.
          </p>
        </Card>
      )}
    </div>
  );
};

export default DoctorSearch;