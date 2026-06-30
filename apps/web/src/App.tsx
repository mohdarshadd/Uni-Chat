import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Chat } from './pages/Chat';
import { useChatStore } from './store/useChatStore';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useChatStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat/:universityId" element={<Chat />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
