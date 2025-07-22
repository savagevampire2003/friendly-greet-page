import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface RegistrationStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
}

const RegistrationStatus: React.FC<RegistrationStatusProps> = ({ 
  status, 
  rejectionReason, 
  submittedAt 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'bg-yellow-100 text-yellow-800',
          title: 'Registration Under Review',
          message: 'Your registration is being reviewed by our admin team. You will be notified once the review is complete.'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'bg-green-100 text-green-800',
          title: 'Registration Approved',
          message: 'Congratulations! Your registration has been approved. You can now access all doctor portal features.'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'bg-red-100 text-red-800',
          title: 'Registration Rejected',
          message: 'Unfortunately, your registration was not approved. Please review the reason below and resubmit if needed.'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'bg-gray-100 text-gray-800',
          title: 'Unknown Status',
          message: 'Please contact support for assistance.'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {config.icon}
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Badge className={config.color}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
        </div>
        
        <p className="text-muted-foreground">{config.message}</p>
        
        <div className="text-sm text-muted-foreground">
          Submitted: {new Date(submittedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        {status === 'rejected' && rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
            <p className="text-red-700">{rejectionReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationStatus;