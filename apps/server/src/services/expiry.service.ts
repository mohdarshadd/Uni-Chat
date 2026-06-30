import { Message } from '../models/Message.js';
import { io } from '../socket/index.js';

let expiryInterval: ReturnType<typeof setInterval> | null = null;

const EXPIRY_CHECK_INTERVAL_MS = 10_000;

export async function startExpiryWatcher(): Promise<void> {
  if (expiryInterval) return;

  const check = async () => {
    try {
      const now = new Date();

      const expiredMessages = await Message.find(
        { expiresAt: { $lte: now } },
        { roomId: 1, _id: 1 },
      ).lean();

      if (expiredMessages.length === 0) return;

      for (const msg of expiredMessages) {
        io.to(msg.roomId.toString()).emit('message:expired', {
          messageId: msg._id.toString(),
        });
      }

      const ids = expiredMessages.map((m) => m._id);
      await Message.deleteMany({ _id: { $in: ids } });

      console.log(`[Expiry] Removed ${expiredMessages.length} expired messages`);
    } catch (err) {
      console.error('[Expiry] Check error:', err);
    }
  };

  expiryInterval = setInterval(check, EXPIRY_CHECK_INTERVAL_MS);
  console.log(`[Expiry] Watcher started (interval: ${EXPIRY_CHECK_INTERVAL_MS}ms)`);
}

export function stopExpiryWatcher(): void {
  if (expiryInterval) {
    clearInterval(expiryInterval);
    expiryInterval = null;
    console.log('[Expiry] Watcher stopped');
  }
}
