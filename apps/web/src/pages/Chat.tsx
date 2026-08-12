import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { useExpiryTimer } from '../hooks/useExpiryTimer';
import { ChatTopBar } from '../components/chat/ChatTopBar';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { CreatePollModal } from '../components/chat/CreatePollModal';
import { AnnouncementBubble } from '../components/chat/AnnouncementBubble';
import { useChatStore } from '../store/useChatStore';
import { Skeleton } from '../components/ui/Skeleton';
import { getSocket } from '../lib/socket';

export function Chat() {
  useExpiryTimer();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error: authError } = useAuth();
  const {
    isLoading: chatLoading,
    hasMore,
    replyTo,
    setReplyTo,
    sendMessage,
    deleteMessage,
    likeMessage,
    handleTyping,
    createPoll,
    votePoll,
    dismissAnnouncement,
    loadMore,
    polls,
    announcements,
  } = useChat();

  const { university, onlineCount, messages } = useChatStore();
  const { rename } = useAuth();
  const [showPollModal, setShowPollModal] = useState(false);

  const handleLeave = () => {
    getSocket().disconnect();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-bg)] gap-4 px-4">
        <p className="text-[var(--color-text-secondary)] text-center">
          {authError || 'Could not connect to the server'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-[var(--color-on-accent)] hover:bg-brand-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (chatLoading) {
    return (
      <div className="flex h-screen flex-col bg-[var(--color-bg)]">
        <header className="border-b border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </header>
        <div className="flex-1 space-y-3 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3" style={{ paddingLeft: i % 3 === 0 ? '0' : '48px' }}>
              {i % 3 === 0 ? <Skeleton className="h-8 w-8 rounded-full" /> : null}
              <div className="space-y-2" style={{ width: `${60 + Math.random() * 30}%` }}>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-10" />
                </div>
                <Skeleton className="h-8 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!university) {
    localStorage.removeItem('lastRoom');
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-bg)] gap-4">
        <p className="text-[var(--color-text-secondary)]">Room not found</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col bg-[var(--color-bg)]">
      <ChatTopBar
        universityName={university.name}
        cityName={university.cityName}
        onlineCount={onlineCount}
        onRename={rename}
        onLeave={handleLeave}
      />

      {announcements.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex flex-col items-center gap-1">
          {announcements.map((ann) => (
            <div key={ann.id} className="pointer-events-auto w-full max-w-xl">
              <AnnouncementBubble
                announcement={ann}
                onDismiss={dismissAnnouncement}
              />
            </div>
          ))}
        </div>
      ) : null}

      <MessageList
        messages={messages}
        polls={polls}
        onReply={setReplyTo}
        onDelete={deleteMessage}
        onLike={likeMessage}
        onVote={votePoll}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />

      <MessageInput
        onSend={sendMessage}
        onSendGif={(gif, replyToId) => sendMessage(gif.title || '', replyToId, { url: gif.url, title: gif.title })}
        onCreatePoll={() => setShowPollModal(true)}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />

      <CreatePollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
        onCreate={createPoll}
      />
    </div>
  );
}
