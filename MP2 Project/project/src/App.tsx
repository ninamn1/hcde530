import { useEffect, useState, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { HelpCircle, X, Sunrise, Sun, Moon, RotateCcw } from 'lucide-react';

type TimeOfDay = 'morning' | 'afternoon' | 'night';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 20) return 'afternoon';
  return 'night';
}

export type NavTheme = {
  bg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  logoBg: string;
  activeBg: string;
  hoverBg: string;
};

const NAV_THEMES: Record<TimeOfDay, NavTheme> = {
  morning: {
    bg: 'rgba(254, 243, 226, 0.92)',
    border: 'rgba(209, 180, 140, 0.5)',
    textPrimary: '#44403c',
    textSecondary: '#78716c',
    logoBg: '#292524',
    activeBg: 'rgba(209, 180, 140, 0.35)',
    hoverBg: 'rgba(209, 180, 140, 0.2)',
  },
  afternoon: {
    bg: 'rgba(232, 244, 240, 0.92)',
    border: 'rgba(130, 190, 170, 0.45)',
    textPrimary: '#1f3830',
    textSecondary: '#4a7a6e',
    logoBg: '#1f3830',
    activeBg: 'rgba(130, 190, 170, 0.3)',
    hoverBg: 'rgba(130, 190, 170, 0.2)',
  },
  night: {
    bg: 'rgba(15, 12, 26, 0.93)',
    border: 'rgba(60, 50, 100, 0.6)',
    textPrimary: '#e2ddf5',
    textSecondary: '#8b8faf',
    logoBg: '#2d2a40',
    activeBg: 'rgba(60, 50, 100, 0.5)',
    hoverBg: 'rgba(60, 50, 100, 0.35)',
  },
};

import { supabase } from './lib/supabase';
import type { TrendMatch } from './lib/supabase';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Results from './pages/Results';
import Gallery from './pages/Gallery';
import TrendManager from './pages/TrendManager';

type Page = 'home' | 'results' | 'gallery' | 'manage';

const HOW_STEPS = [
  { step: '01', title: 'Upload a reference', desc: 'Drop any image — a screenshot, photo, or design that caught your eye.' },
  { step: '02', title: 'AI identifies the trend', desc: 'Gemini Vision analyses your image against our curated library of top design trends.' },
  { step: '03', title: 'Explore matches', desc: 'Get top 2–3 matches with defining traits and example images — no more guessing search terms.' },
];

const TIME_OPTIONS: { value: TimeOfDay; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: 'morning',   label: 'Morning',   Icon: Sunrise },
  { value: 'afternoon', label: 'Afternoon', Icon: Sun },
  { value: 'night',     label: 'Night',     Icon: Moon },
];

function TimePickerButton({
  timeOverride,
  onTimeOverride,
}: {
  timeOverride: TimeOfDay | null;
  onTimeOverride: (v: TimeOfDay | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const active = TIME_OPTIONS.find(o => o.value === timeOverride);
  const ActiveIcon = active?.Icon ?? Sun;

  return (
    <div className="flex flex-col items-end gap-2">
      {open && (
        <div
          ref={panelRef}
          className="bg-white border border-stone-200 rounded-2xl shadow-2xl p-3 w-44 animate-fade-in"
        >
          <p className="text-stone-400 text-xs font-medium px-2 pb-2">Day theme</p>
          <button
            onClick={() => { onTimeOverride(null); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
              timeOverride === null
                ? 'bg-stone-900 text-white'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Auto</span>
          </button>
          {TIME_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => { onTimeOverride(value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                timeOverride === value
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        title="Change day theme"
        className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-150 ${
          open || timeOverride !== null
            ? 'bg-stone-900 text-white scale-95'
            : 'bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:shadow-xl hover:scale-105'
        }`}
      >
        <ActiveIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

function HowItWorksButton() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          className="w-72 bg-white border border-stone-200 rounded-2xl shadow-2xl p-5 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-900 font-semibold text-base" style={{ fontFamily: "'Funnel Display', sans-serif" }}>
              How it works
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {HOW_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-3">
                <span className="text-2xl font-black text-stone-200 leading-none w-8 shrink-0">{step}</span>
                <div>
                  <p className="text-stone-800 font-medium text-sm leading-snug">{title}</p>
                  <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        title="How it works"
        className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-150 ${
          open
            ? 'bg-stone-900 text-white scale-95'
            : 'bg-white border border-stone-200 text-stone-500 hover:text-stone-900 hover:shadow-xl hover:scale-105'
        }`}
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [matchResults, setMatchResults] = useState<TrendMatch[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [timeOverride, setTimeOverride] = useState<TimeOfDay | null>(null);
  const [galleryFilterId, setGalleryFilterId] = useState<string | undefined>(undefined);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.shiftKey && e.key === 'A' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setAuthOpen(true);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleResults(results: TrendMatch[], imageUrl: string) {
    setMatchResults(results);
    setUploadedImageUrl(imageUrl);
    setPage('results');
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setPage('home');
  }

  const tod = timeOverride ?? getTimeOfDay(new Date().getHours());
  const navTheme = NAV_THEMES[tod];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar
        currentPage={page}
        onNavigate={(p) => { if (p === 'gallery') setGalleryFilterId(undefined); setPage(p); }}
        user={user}
        onAuthOpen={() => setAuthOpen(true)}
        onSignOut={handleSignOut}
        navTheme={navTheme}
      />

      {page === 'home' && (
        <Home onNavigate={setPage} onResults={handleResults} timeOverride={timeOverride} />
      )}
      {page === 'results' && (
        <Results
          matches={matchResults}
          uploadedImageUrl={uploadedImageUrl}
          onNavigate={setPage}
          onNavigateToGallery={(trendId) => { setGalleryFilterId(trendId); setPage('gallery'); }}
          tod={tod}
        />
      )}
      {page === 'gallery' && (
        <Gallery initialFilterId={galleryFilterId} />
      )}
      {page === 'manage' && (
        <TrendManager user={user} onAuthOpen={() => setAuthOpen(true)} />
      )}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <TimePickerButton timeOverride={timeOverride} onTimeOverride={setTimeOverride} />
        <HowItWorksButton />
      </div>
    </div>
  );
}
