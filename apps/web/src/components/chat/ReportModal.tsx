import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
}

export function ReportModal({ isOpen, onClose, messageId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (reason.length < 10) {
      setError('Please provide a reason (at least 10 characters)');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/reports', { messageId, reason });
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setError('Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Message">
      {success ? (
        <p className="text-center text-sm text-green-500">Report submitted successfully</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              Reason for report
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this message violates the rules..."
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {reason.length}/500
            </p>
          </div>
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={isLoading}>
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
