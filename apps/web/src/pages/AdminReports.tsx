import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Trash2, Ban } from 'lucide-react';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { AdminLayout } from '../components/admin/AdminLayout';

interface Report {
  _id: string;
  messageId: string;
  reportedBy: string;
  reason: string;
  status: string;
  createdAt: string;
}

export function AdminReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const adminKey = sessionStorage.getItem('admin-key');

  useEffect(() => {
    if (!adminKey) { navigate('/admin'); return; }
    api.get('/api/admin/reports', { headers: { 'admin-key': adminKey } })
      .then(({ data }) => setReports(data))
      .catch(() => navigate('/admin'));
  }, [adminKey, navigate]);

  const handleAction = async (reportId: string, action: string) => {
    await api.patch(`/api/admin/reports/${reportId}`, { action }, {
      headers: { 'admin-key': adminKey },
    });
    setReports((prev) => prev.filter((r) => r._id !== reportId));
  };

  return (
    <AdminLayout activePath="/admin/reports">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="mb-6 text-2xl font-bold text-[var(--color-text)]">
        Pending Reports ({reports.length})
      </h1>

      {reports.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">No pending reports</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="glass rounded-xl border border-[var(--color-border)] p-4"
            >
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Report by <span className="text-brand-500">{report.reportedBy}</span>
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(report._id, 'dismiss')}
                    title="Dismiss"
                  >
                    <X size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(report._id, 'mute_user')}
                    title="Mute User"
                  >
                    <Ban size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAction(report._id, 'delete_message')}
                    title="Delete Message & Mute"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <p className="break-all text-sm text-[var(--color-text)]">
                Message: <span className="text-[var(--color-text-secondary)]">{report.messageId}</span>
              </p>
              <p className="mt-1 break-words rounded-lg bg-orange-500/10 p-2 text-sm text-orange-600 dark:text-orange-400">
                {report.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
