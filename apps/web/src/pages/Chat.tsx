import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { useExpiryTimer } from '../hooks/useExpiryTimer';
import { ChatTopBar } from '../components/chat/ChatTopBar';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { useChatStore } from '../store/useChatStore';
import { Skeleton } from '../components/ui/Skeleton';
import { getSocket } from '../lib/socket';

export function Chat() {
  useExpiryTimer();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const {
    isLoading: chatLoading,
    hasMore,
    replyTo,
    setReplyTo,
    sendMessage,
    deleteMessage,
    likeMessage,
    handleTyping,
    loadMore,
  } = useChat();

  const { university, onlineCount, messages } = useChatStore();
  const { rename } = useAuth();

  const handleLeave = () => {
    getSocket().disconnect();
    navigate('/');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
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
    <div className="flex h-screen flex-col bg-[var(--color-bg)]">
      <ChatTopBar
        universityName={university.name}
        cityName={university.cityName}
        onlineCount={onlineCount}
        onRename={rename}
        onLeave={handleLeave}
      />

      <MessageList
        messages={messages}
        onReply={setReplyTo}
        onDelete={deleteMessage}
        onLike={likeMessage}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />

      <MessageInput
        onSend={sendMessage}
        onSendGif={(gif, replyToId) => sendMessage(gif.title || '', replyToId, { url: gif.url, title: gif.title })}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />
    </div>
  );
}
