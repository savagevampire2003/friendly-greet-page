import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const mockUsers = [
  { id: 1, name: 'Dr. Sarah Khan', role: 'Doctor', verified: false },
  { id: 2, name: 'Ali Raza', role: 'Patient', verified: true },
  { id: 3, name: 'Dr. Ahmed Ali', role: 'Doctor', verified: true },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);

  const verifyDoctor = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, verified: true } : u));
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.verified ? 'Verified' : 'Pending'}</td>
              <td className="p-2">
                {user.role === 'Doctor' && !user.verified ? (
                  <Button size="sm" onClick={() => verifyDoctor(user.id)}>Verify</Button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default UserManagement; 