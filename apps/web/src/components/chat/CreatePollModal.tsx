import { useState } from 'react';
import { BarChart3, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (question: string, options: string[]) => void;
}

export function CreatePollModal({ isOpen, onClose, onCreate }: CreatePollModalProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    const trimmedOptions = options.map((o) => o.trim()).filter((o) => o);
    if (!question.trim() || trimmedOptions.length < 2) return;
    onCreate(question.trim(), trimmedOptions);
    setQuestion('');
    setOptions(['', '']);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass w-full max-w-md rounded-xl border border-[var(--color-border)] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-brand-500" />
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Create Poll</h2>
              </div>
              <button onClick={onClose} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Question</label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you think?"
                maxLength={200}
              />
            </div>

            <div className="mb-4 space-y-2">
              <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Options</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    maxLength={100}
                    className="flex-1"
                  />
                  {options.length > 2 ? (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              ))}
              {options.length < 10 ? (
                <button
                  onClick={handleAddOption}
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--color-border)] py-2 text-sm text-[var(--color-text-secondary)] hover:border-brand-500 hover:text-brand-500 transition-colors"
                >
                  <Plus size={14} /> Add Option
                </button>
              ) : null}
            </div>

            <Button
              onClick={handleCreate}
              disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
              className="w-full"
            >
              Create Poll
            </Button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
