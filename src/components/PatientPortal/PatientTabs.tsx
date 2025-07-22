import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import BookAppointment from './BookAppointment';
import MyReports from './MyReports';
import Profile from './Profile';
import DoctorSearch from './DoctorSearch';

const PatientTabs: React.FC = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
        <TabsTrigger value="book">Book Appointment</TabsTrigger>
        <TabsTrigger value="reports">My Reports</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <div className="p-4">Welcome to your dashboard! (Summary, quick actions, etc.)</div>
      </TabsContent>
      <TabsContent value="doctors">
        <DoctorSearch />
      </TabsContent>
      <TabsContent value="book">
        <BookAppointment />
      </TabsContent>
      <TabsContent value="reports">
        <MyReports />
      </TabsContent>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
    </Tabs>
  );
};

export default PatientTabs; 