import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

interface DoctorRegistrationData {
  full_name: string;
  medical_license_number: string;
  specialization: string;
  specialty_id: string;
  years_of_experience: number;
  hospital_affiliation: string;
  contact_phone: string;
  professional_bio: string;
  education_details: string;
}

interface DoctorRegistrationFormProps {
  onSubmissionComplete: () => void;
}

const DoctorRegistrationForm: React.FC<DoctorRegistrationFormProps> = ({ onSubmissionComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState<DoctorRegistrationData>({
    full_name: '',
    medical_license_number: '',
    specialization: '',
    specialty_id: '',
    years_of_experience: 0,
    hospital_affiliation: '',
    contact_phone: '',
    professional_bio: '',
    education_details: ''
  });

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpecialties(data || []);
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
    }
  };

  const handleInputChange = (field: keyof DoctorRegistrationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('doctor_registrations')
        .insert([{
          user_id: user.id,
          ...formData
        }]);

      if (error) throw error;

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted for review.",
      });

      onSubmissionComplete();
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Doctor Registration Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              required
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="medical_license_number">Medical License Number *</Label>
            <Input
              id="medical_license_number"
              required
              value={formData.medical_license_number}
              onChange={(e) => handleInputChange('medical_license_number', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="specialty_id">Specialization *</Label>
            <Select 
              value={formData.specialty_id} 
              onValueChange={(value) => {
                const selectedSpecialty = specialties.find(s => s.id === value);
                handleInputChange('specialty_id', value);
                handleInputChange('specialization', selectedSpecialty?.name || '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    <div>
                      <div className="font-medium">{specialty.name}</div>
                      {specialty.description && (
                        <div className="text-xs text-muted-foreground">{specialty.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="years_of_experience">Years of Experience *</Label>
            <Input
              id="years_of_experience"
              type="number"
              min="0"
              required
              value={formData.years_of_experience}
              onChange={(e) => handleInputChange('years_of_experience', parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="hospital_affiliation">Hospital Affiliation</Label>
            <Input
              id="hospital_affiliation"
              value={formData.hospital_affiliation}
              onChange={(e) => handleInputChange('hospital_affiliation', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone *</Label>
            <Input
              id="contact_phone"
              type="tel"
              required
              value={formData.contact_phone}
              onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="education_details">Education Details *</Label>
            <Textarea
              id="education_details"
              required
              rows={3}
              value={formData.education_details}
              onChange={(e) => handleInputChange('education_details', e.target.value)}
              placeholder="Medical degree, certifications, etc."
            />
          </div>

          <div>
            <Label htmlFor="professional_bio">Professional Bio</Label>
            <Textarea
              id="professional_bio"
              rows={4}
              value={formData.professional_bio}
              onChange={(e) => handleInputChange('professional_bio', e.target.value)}
              placeholder="Brief professional background and experience"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorRegistrationForm;