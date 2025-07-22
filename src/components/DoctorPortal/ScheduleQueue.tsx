import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const mockAppointments = [
  { id: 1, patient: 'Ali Raza', time: '10:00 AM' },
  { id: 2, patient: 'Sara Malik', time: '11:00 AM' },
];

const mockQueue = [
  { id: 1, patient: 'Bilal Ahmed' },
  { id: 2, patient: 'Nida Fatima' },
];

const ScheduleQueue: React.FC = () => {
  return (
    <div className="space-y-6 mt-8">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Today's Appointments</h2>
        <ul className="mb-2">
          {mockAppointments.map(app => (
            <li key={app.id} className="flex justify-between py-1">
              <span>{app.patient}</span>
              <span>{app.time}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full">View Full Schedule</Button>
      </Card>
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Patient Queue</h2>
        <ul className="mb-2">
          {mockQueue.map(q => (
            <li key={q.id} className="py-1">{q.patient}</li>
          ))}
        </ul>
        <Button className="w-full">Manage Queue</Button>
      </Card>
    </div>
  );
};

export default ScheduleQueue; 