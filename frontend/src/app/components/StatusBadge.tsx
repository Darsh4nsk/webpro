import { RequestStatus, AvailabilityStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus | AvailabilityStatus;
  type?: 'request' | 'availability';
}

export function StatusBadge({ status, type = 'request' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'approved':
        return 'bg-success/10 text-success border border-success/20';
      case 'rejected':
        return 'bg-error/10 text-error border border-error/20';
      case 'completed':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'available':
        return 'bg-success/10 text-success border border-success/20';
      case 'unavailable':
        return 'bg-gray-100 text-text-secondary border border-gray-200';
      default:
        return 'bg-gray-100 text-text-secondary border border-gray-200';
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-semibold ${getStatusStyles()}`}>
      {getStatusText()}
    </span>
  );
}
