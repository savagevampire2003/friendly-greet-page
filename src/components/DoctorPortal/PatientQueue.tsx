import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const mockQueue = [
  { id: 1, name: 'Ali Raza', reason: 'Chest pain' },
  { id: 2, name: 'Nida Fatima', reason: 'Skin rash' },
];

const PatientQueue: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Patient Queue</h2>
      <ul className="divide-y divide-gray-200">
        {mockQueue.map(patient => (
          <li key={patient.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-gray-500">{patient.reason}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Start Consultation</Button>
              <Button size="sm" variant="outline">Remove</Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PatientQueue; 