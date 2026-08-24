import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GifResult {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
}

interface GifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (gif: GifResult) => void;
}

function GifTile({ gif, onSelect }: { gif: GifResult; onSelect: (gif: GifResult) => void }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <button
      onClick={() => {
        if (status === 'loaded') onSelect(gif);
      }}
      className="group relative aspect-video overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] transition-transform hover:scale-105"
      disabled={status !== 'loaded'}
    >
      {status !== 'error' ? (
        <img
          src={gif.previewUrl}
          alt={gif.title || 'GIF'}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover',
            status === 'loading' ? 'opacity-0' : 'opacity-100',
          )}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--color-text-secondary)]">
          <ImageOff size={16} />
          <span className="text-[10px]">Failed</span>
        </div>
      )}
      {status === 'loading' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : null}
      {gif.title && status === 'loaded' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="truncate text-xs text-white">{gif.title}</p>
        </div>
      ) : null}
    </button>
  );
}

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

export function GifPicker({ isOpen, onClose, onSelect }: GifPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GifResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchGifs = useCallback(async (search: string) => {
    if (!GIPHY_API_KEY || GIPHY_API_KEY === 'your_giphy_api_key_here') {
      setError('Set VITE_GIPHY_API_KEY in .env');
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = search
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(search)}&limit=25&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=25&rating=g`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch GIFs');

      const json = await res.json();
      setResults(
        json.data.map((gif: any) => ({
          id: gif.id,
          title: gif.title,
          url: gif.images.original.url,
          previewUrl: gif.images.fixed_height_downsampled?.url || gif.images.fixed_height.url,
          width: gif.images.fixed_height.width,
          height: gif.images.fixed_height.height,
        })),
      );
    } catch (err) {
      setError('Failed to load GIFs. Check your API key.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifs('');
  }, [fetchGifs]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchGifs(query);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchGifs]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full right-0 z-50 mb-2 w-80 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl"
          data-picker
        >
          <div className="border-b border-[var(--color-border)] p-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search GIFs..."
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-2 pl-8 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-2">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <ImageOff size={24} className="text-[var(--color-text-secondary)]" />
                <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Get a free key at developers.giphy.com</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video animate-pulse rounded-lg bg-[var(--color-bg-secondary)]"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {results.map((gif) => (
                  <GifTile key={gif.id} gif={gif} onSelect={onSelect} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
