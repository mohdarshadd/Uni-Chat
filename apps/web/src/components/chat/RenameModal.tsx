import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useChatStore } from '../../store/useChatStore';
import { displayNameSchema } from '@campus-chat/shared';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (name: string) => Promise<boolean>;
}

export function RenameModal({ isOpen, onClose, onRename }: RenameModalProps) {
  const currentName = useChatStore((s) => s.displayName) ?? '';
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = displayNameSchema.safeParse(name);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const success = await onRename(parsed.data);
    setIsLoading(false);

    if (success) {
      onClose();
    } else {
      setError('Failed to update name. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Display Name">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error ?? undefined}
          placeholder="Enter your display name"
          maxLength={30}
          autoFocus
        />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
