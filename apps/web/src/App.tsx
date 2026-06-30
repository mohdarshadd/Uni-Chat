import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Chat } from './pages/Chat';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat/:universityId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
