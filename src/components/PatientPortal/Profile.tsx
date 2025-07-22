import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Profile: React.FC = () => {
  const [name, setName] = useState('Ali Raza');
  const [email, setEmail] = useState('ali.raza@email.com');
  const [dob, setDob] = useState('1990-01-01');

  return (
    <Card className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <Input type="date" value={dob} onChange={e => setDob(e.target.value)} />
        </div>
        <Button className="w-full mt-4">Save</Button>
      </form>
    </Card>
  );
};

export default Profile; 