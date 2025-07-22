import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const mockReports = [
  { id: 1, name: 'CBC Report', date: '2024-07-10', file: 'cbc_report.pdf' },
  { id: 2, name: 'X-ray Chest', date: '2024-06-28', file: 'xray_chest.pdf' },
];

const MyReports: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Reports</h2>
      <ul className="divide-y divide-gray-200">
        {mockReports.map(report => (
          <li key={report.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">{report.name}</div>
              <div className="text-sm text-gray-500">{report.date}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">View</Button>
              <Button size="sm">Download</Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default MyReports; 