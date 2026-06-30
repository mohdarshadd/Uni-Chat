import { Report } from '../models/Report.js';
import { Message } from '../models/Message.js';
import { muteUser } from './mute.service.js';

export async function createReport(
  messageId: string,
  reportedBy: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const message = await Message.findById(messageId);
  if (!message) {
    return { success: false, error: 'Message not found' };
  }

  const existingReport = await Report.findOne({
    messageId,
    reportedBy,
    status: 'pending',
  });
  if (existingReport) {
    return { success: false, error: 'Already reported this message' };
  }

  const report = new Report({
    messageId,
    reportedBy,
    reason,
    status: 'pending',
  });

  await report.save();
  return { success: true };
}

export async function getPendingReports(): Promise<any[]> {
  return Report.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .lean();
}

export async function resolveReport(
  reportId: string,
  action: 'dismiss' | 'delete_message' | 'mute_user',
): Promise<boolean> {
  const report = await Report.findById(reportId);
  if (!report) return false;

  report.status = action === 'dismiss' ? 'dismissed' : 'resolved';
  await report.save();

  if (action === 'delete_message') {
    const message = await Message.findById(report.messageId);
    if (message) {
      muteUser(message.senderId, message.roomId.toString(), 15);
      await Message.deleteOne({ _id: report.messageId });
    }
  }

  if (action === 'mute_user') {
    const message = await Message.findById(report.messageId);
    if (message) {
      muteUser(message.senderId, message.roomId.toString(), 15);
    }
  }

  return true;
}
