import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import UserManagement from './UserManagement';
import DoctorRegistrations from './DoctorRegistrations';
import SpecialtyManagement from './SpecialtyManagement';

const AdminTabs: React.FC = () => {
  return (
    <Tabs defaultValue="dashboard" className="w-full mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="registrations">Doctor Registrations</TabsTrigger>
        <TabsTrigger value="specialties">Specialties</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <div className="p-4">Welcome to the admin dashboard! (Platform stats, quick actions, etc.)</div>
      </TabsContent>
      <TabsContent value="users">
        <UserManagement />
      </TabsContent>
      <TabsContent value="registrations">
        <DoctorRegistrations />
      </TabsContent>
      <TabsContent value="specialties">
        <SpecialtyManagement />
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4">Analytics (Coming soon...)</div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs; 