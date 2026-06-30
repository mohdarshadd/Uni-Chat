import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

interface University {
  id: string;
  name: string;
  cityName: string;
  memberCount: number;
}

interface City {
  id: string;
  name: string;
  stateName: string;
  countryName: string;
  universityCount: number;
}

export function Landing() {
  useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'welcome' | 'select'>('welcome');
  const [cities, setCities] = useState<City[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    api.get<City[]>('/api/cities').then(({ data }) => setCities(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    setIsSearching(true);
    const timer = setTimeout(() => {
      api
        .get<University[]>(`/api/universities?cityId=${selectedCity.id}&search=${searchQuery}`)
        .then(({ data }) => setUniversities(data))
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCity, searchQuery]);

  const handleSelectUniversity = (uni: University) => {
    navigate(`/chat/${uni.id}`);
  };

  if (step === 'welcome') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500/10">
            <MessageCircle className="h-10 w-10 text-brand-500" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-[var(--color-text)] sm:text-5xl">
            Campus Chat
          </h1>
          <p className="mb-8 text-lg text-[var(--color-text-secondary)]">
            Anonymous real-time chat for university students
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('select')}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
          >
            Get Started
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <header className="glass sticky top-0 z-10 border-b border-[var(--color-border)] px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <MessageCircle className="h-6 w-6 text-brand-500" />
          <h1 className="text-lg font-semibold text-[var(--color-text)]">
            Campus Chat
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {!selectedCity ? (
          <>
            <h2 className="mb-6 text-xl font-semibold text-[var(--color-text)]">
              Select your city
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {cities.map((city) => (
                <motion.button
                  key={city.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCity(city)}
                  className="glass rounded-xl border border-[var(--color-border)] p-4 text-left transition-all hover:border-brand-500/50"
                >
                  <p className="font-medium text-[var(--color-text)]">{city.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {city.stateName}, {city.countryName}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {city.universityCount} universities
                  </p>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setSelectedCity(null)}
                className="mb-4 text-sm text-brand-500 hover:text-brand-600"
              >
                &larr; Change city
              </button>
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                {selectedCity.name}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Select your university
              </p>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              {isSearching ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-[var(--color-border)] p-4"
                  >
                    <div className="mb-2 h-4 w-3/4 rounded bg-[var(--color-border)]" />
                    <div className="h-3 w-1/4 rounded bg-[var(--color-border)]" />
                  </div>
                ))
              ) : universities.length === 0 ? (
                <p className="py-8 text-center text-[var(--color-text-secondary)]">
                  No universities found
                </p>
              ) : (
                universities.map((uni) => (
                  <motion.button
                    key={uni.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectUniversity(uni)}
                    className="w-full rounded-xl border border-[var(--color-border)] p-4 text-left transition-all hover:border-brand-500/50"
                  >
                    <p className="font-medium text-[var(--color-text)]">{uni.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {uni.memberCount} online
                    </p>
                  </motion.button>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
