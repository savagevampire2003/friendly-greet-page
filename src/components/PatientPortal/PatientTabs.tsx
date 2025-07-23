import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import BookAppointment from './BookAppointment';
import Profile from './Profile';
import DoctorSearch from './DoctorSearch';
import DoctorProfile from './DoctorProfile';
import MyAppointments from './MyAppointments';

const PatientTabs: React.FC = () => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setActiveTab("doctor-profile");
  };

  const handleBackFromProfile = () => {
    setSelectedDoctorId(null);
    setActiveTab("doctors");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
        <TabsTrigger value="book">Book Appointment</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <div className="p-4">Welcome to your dashboard! (Summary, quick actions, etc.)</div>
      </TabsContent>
      <TabsContent value="appointments">
        <MyAppointments />
      </TabsContent>
      <TabsContent value="doctors">
        <DoctorSearch onDoctorSelect={handleDoctorSelect} />
      </TabsContent>
      <TabsContent value="doctor-profile">
        {selectedDoctorId && (
          <DoctorProfile 
            doctorId={selectedDoctorId} 
            onBack={handleBackFromProfile} 
          />
        )}
      </TabsContent>
      <TabsContent value="book">
        <BookAppointment />
      </TabsContent>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
    </Tabs>
  );
};

export default PatientTabs; 