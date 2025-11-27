import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  illustration,
}) => {
  return (
    <section
      className="flex flex-col items-center justify-center py-16 px-4"
      role="status"
      aria-label="空状态"
    >
      {illustration || (
        <div className="w-64 h-64 mb-6 opacity-50" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
            <path d="M70 100 L130 100 M100 70 L100 130" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 text-center max-w-md">{description}</p>}
      {action && (
        <Button
          onClick={action.onClick}
          size="lg"
          className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.label}
        </Button>
      )}
    </section>
  );
};
