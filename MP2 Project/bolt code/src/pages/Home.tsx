import { useState, useCallback, useEffect } from 'react';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TrendMatch } from '../lib/supabase';

type Page = 'home' | 'results' | 'gallery' | 'moodboards' | 'moodboard-detail';

type Props = {
  onNavigate: (page: Page) => void;
  onResults: (results: TrendMatch[], imageUrl: string) => void;
  timeOverride?: 'morning' | 'afternoon' | 'night' | null;
};

type TimeOfDay = 'morning' | 'afternoon' | 'night';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 20) return 'afternoon';
  return 'night';
}

const THEMES = {
  morning: {
    bg: 'linear-gradient(160deg, #fef3e2 0%, #fff8f0 40%, #fde8d0 100%)',
    wall: '#fff5e6',
    floor: '#e8d9c8',
    baseboard: '#d4c2ae',
    skyTop: '#f9c46b',
    skyBottom: '#fde9b0',
    skyOpacity: 0.85,
    windowGlass: '#fde8b0',
    curtain: '#f0d9b8',
    desk: '#c8a882',
    deskEdge: '#b8956e',
    deskLeg: '#b8956e',
    monitorBg: '#292524',
    monitorTitle: '#44403c',
    screenBg: '#fafaf9',
    headingClass: 'text-amber-900',
    accentClass: 'text-amber-600',
    pillBg: 'rgba(255,255,255,0.65)',
    pillBorder: 'rgba(0,0,0,0.08)',
    pillIconColor: '#f59e0b',
    pillTextColor: '#44403c',
    clockFace: '#f5f0e8',
    clockBody: '#e8ddd0',
    clockFeet: '#d4c8b8',
    clockHand: '#5a5248',
    clockMinute: '#7a6e60',
    clockTick: '#c0b8a8',
    mugBody: '#f0e8dc',
    mugBrim: '#e0d0bc',
    mugSteam: '#c8b8a8',
  },
  afternoon: {
    bg: 'linear-gradient(160deg, #e8f4f0 0%, #f5f0e8 40%, #e8eef5 100%)',
    wall: '#f0ebe3',
    floor: '#ddd6cc',
    baseboard: '#c8bfb3',
    skyTop: '#acd8f0',
    skyBottom: '#e8f5e0',
    skyOpacity: 0.6,
    windowGlass: '#cce5f7',
    curtain: '#e8d5c0',
    desk: '#c8a882',
    deskEdge: '#b8956e',
    deskLeg: '#b8956e',
    monitorBg: '#292524',
    monitorTitle: '#44403c',
    screenBg: '#fafaf9',
    headingClass: 'text-stone-800',
    accentClass: 'text-teal-600',
    pillBg: 'rgba(255,255,255,0.65)',
    pillBorder: 'rgba(0,0,0,0.08)',
    pillIconColor: '#0d9488',
    pillTextColor: '#44403c',
    clockFace: '#f5f0e8',
    clockBody: '#e8ddd0',
    clockFeet: '#d4c8b8',
    clockHand: '#5a5248',
    clockMinute: '#7a6e60',
    clockTick: '#c0b8a8',
    mugBody: '#f0e8dc',
    mugBrim: '#e0d0bc',
    mugSteam: '#c8b8a8',
  },
  night: {
    bg: 'linear-gradient(160deg, #0f0c1a 0%, #1a1230 40%, #0d1a2e 100%)',
    wall: '#1a1530',
    floor: '#12102a',
    baseboard: '#0d0c20',
    skyTop: '#0d1a3a',
    skyBottom: '#1a2050',
    skyOpacity: 0.95,
    windowGlass: '#0d1a3a',
    curtain: '#2a1850',
    desk: '#3a2e22',
    deskEdge: '#2a2018',
    deskLeg: '#2a2018',
    monitorBg: '#1e1b2e',
    monitorTitle: '#2d2a40',
    screenBg: '#0f0c1a',
    headingClass: 'text-slate-100',
    accentClass: 'text-blue-400',
    pillBg: 'rgba(255,255,255,0.07)',
    pillBorder: 'rgba(255,255,255,0.15)',
    pillIconColor: '#93c5fd',
    pillTextColor: '#cbd5e1',
    clockFace: '#1a1530',
    clockBody: '#2a2040',
    clockFeet: '#2a2040',
    clockHand: '#94a3b8',
    clockMinute: '#64748b',
    clockTick: '#4a4070',
    mugBody: '#2a2040',
    mugBrim: '#1e1830',
    mugSteam: '#3a3060',
  },
} as const;

type Theme = typeof THEMES[TimeOfDay];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export default function Home({ onNavigate: _onNavigate, onResults, timeOverride }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const tod = timeOverride ?? getTimeOfDay(now.getHours());
  const theme = THEMES[tod];

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setError('');
    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch(`${SUPABASE_URL}/functions/v1/match-trend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? 'Trend matching failed. Please try again.');
      const trendIds: string[] = data.matches.map((m: TrendMatch) => m.trend_id);
      const { data: imgs } = await supabase
        .from('trend_images')
        .select('*')
        .in('trend_id', trendIds)
        .order('sort_order');
      const enriched: TrendMatch[] = data.matches.map((m: TrendMatch) => ({
        ...m,
        images: (imgs ?? []).filter(img => img.trend_id === m.trend_id),
      }));
      onResults(enriched, objectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }, [onResults]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div
      className="h-screen overflow-hidden relative flex flex-col transition-all duration-1000"
      style={{ background: theme.bg }}
    >
      {/* Room background — wall, floor, windows only */}
      <RoomBackground theme={theme} tod={tod} />

      {/* Content column — fills full height */}
      <div className="relative z-10 flex flex-col items-center w-full h-full">

        {/* Pill + headline — vertically centered in the zone above the monitor */}
        <div className="flex flex-col items-center justify-center px-6" style={{ flexGrow: 0.35, flexShrink: 0, flexBasis: 'auto', overflow: 'visible' }}>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border mb-4 transition-all duration-700"
            style={{ background: theme.pillBg, borderColor: theme.pillBorder, backdropFilter: 'blur(8px)' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.pillIconColor }} />
            <span className="text-xs font-medium" style={{ color: theme.pillTextColor }}>
              Powered by Gemini Vision
            </span>
          </div>
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-semibold text-center leading-tight tracking-tight whitespace-nowrap transition-colors duration-700 ${theme.headingClass}`}
            style={{ fontFamily: "'Funnel Display', sans-serif" }}
          >
            Name the design <span className={`transition-colors duration-700 ${theme.accentClass}`}>trend you love.</span>
          </h1>
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-5 py-2 text-red-700 text-sm max-w-md text-center">
              {error}
            </div>
          )}
        </div>

        {/* Monitor — grows to fill remaining space below headline */}
        <div
          className="flex-1 min-h-0 flex flex-col self-center w-full"
          style={{ maxWidth: 'clamp(400px, 70vw, 900px)', padding: '0 8px' }}
        >
          <div
            className="flex-1 min-h-0 flex flex-col rounded-2xl p-3 pb-2 transition-colors duration-700"
            style={{ background: theme.monitorBg, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.22))' }}
          >
            {/* Title bar */}
            <div
              className="flex-shrink-0 rounded-t-lg px-3 py-2 flex items-center gap-1.5 mb-0 transition-colors duration-700"
              style={{ background: theme.monitorTitle }}
            >
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-stone-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                trendar — upload reference
              </span>
            </div>

            {/* Screen — grows with monitor */}
            <div
              className={`flex-1 min-h-0 rounded-b-lg transition-colors ${dragOver ? 'bg-teal-50' : ''}`}
              style={{ background: dragOver ? undefined : theme.screenBg }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {loading && preview ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="relative">
                    <img src={preview} alt="Uploaded" className="w-28 h-28 object-cover rounded-xl shadow" />
                    <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-white animate-spin" />
                    </div>
                  </div>
                  <p className="text-stone-500 text-sm">Identifying design trends…</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-full cursor-pointer gap-4 group py-8">
                  <input type="file" accept="image/*" className="sr-only" onChange={handleFileInput} />
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragOver ? 'bg-teal-100 scale-110' : 'bg-stone-100 group-hover:bg-teal-50 group-hover:scale-105'}`}>
                    <Upload className={`w-7 h-7 transition-colors ${dragOver ? 'text-teal-600' : 'text-stone-400 group-hover:text-teal-500'}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-stone-700 font-medium text-sm">Upload any reference image to identify its design trend</p>
                    <p className="text-stone-400 text-xs mt-1">Drop a file here, or click to browse</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full">PNG</span>
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full">JPG</span>
                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-xs rounded-full">WEBP</span>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Monitor stand — neck + base, outside monitor wrapper so height is independent */}
        <div className="flex flex-col items-center flex-shrink-0 self-center">
          <div className="transition-colors duration-700" style={{ width: 60, height: 80, background: theme.monitorTitle, borderRadius: '0 0 2px 2px' }} />
          <div className="transition-colors duration-700" style={{ width: 240, height: 16, background: theme.monitorTitle, borderRadius: '0 0 12px 12px' }} />
        </div>

        {/* Desk — anchored at bottom, legs extend off-screen */}
        <div
          className="flex-shrink-0 relative self-stretch transition-colors duration-700"
          style={{
            height: 52,
            background: `linear-gradient(180deg, ${theme.desk} 0%, ${theme.deskEdge} 100%)`,
            boxShadow: '0 -2px 0 rgba(0,0,0,0.08)',
          }}
        >
          {/* Plant — left of monitor */}
          <div className="absolute" style={{ left: 'calc(50% - clamp(200px, 35vw, 450px) - 180px)', bottom: '100%' }}>
            <PlantDecor />
          </div>
          {/* Clock — right of monitor */}
          <div className="absolute" style={{ left: 'calc(50% + clamp(200px, 35vw, 450px) + 50px)', bottom: '100%' }}>
            <ClockDecor theme={theme} now={now} />
          </div>
          {/* Mug — right of clock */}
          <div className="absolute" style={{ left: 'calc(50% + clamp(200px, 35vw, 450px) + 170px)', bottom: '100%' }}>
            <MugDecor />
          </div>
          {/* Keyboard — on desk surface, centered */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-3"
            style={{ width: 'min(380px, 50vw)', height: 20, background: '#d1d5db', borderRadius: 5 }}
          >
            <div className="flex items-center justify-center h-full gap-1.5 px-3">
              {[22, 22, 22, 60, 22, 22, 22].map((w, i) => (
                <div key={i} style={{ width: w, height: 9, borderRadius: 2, background: '#e5e7eb' }} />
              ))}
            </div>
          </div>
          {/* Mouse — sits right of keyboard */}
          <div
            className="absolute"
            style={{ left: 'calc(50% + min(190px, 25vw) + 10px)', top: 8 }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" style={{ display: 'block' }}>
              <path d="M2 13 Q2 4 10 3 Q18 4 18 13 L18 22 Q18 28 10 28 Q2 28 2 22 Z" fill="#d1d5db" />
              <line x1="10" y1="3" x2="10" y2="13" stroke="#b8bfc9" strokeWidth="1.5" />
              <rect x="7.5" y="10" width="5" height="7" rx="2.5" fill="#b8bfc9" />
            </svg>
          </div>
          {/* Left leg */}
          <div
            className="absolute transition-colors duration-700"
            style={{ left: '8%', top: '100%', width: 32, height: '100vh', background: theme.deskLeg, borderRadius: '0 0 8px 8px' }}
          />
          {/* Right leg */}
          <div
            className="absolute transition-colors duration-700"
            style={{ right: '8%', top: '100%', width: 32, height: '100vh', background: theme.deskLeg, borderRadius: '0 0 8px 8px' }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Decorative desk items ──────────────────────────────────────────────────

function PlantDecor() {
  return (
    <svg viewBox="0 0 60 90" width="120" height="180" style={{ display: 'block' }}>
      {/* Pot */}
      <path d="M12 72 L16 90 L44 90 L48 72 Z" fill="#c8926a" rx="3" />
      <rect x="10" y="68" width="40" height="6" rx="3" fill="#d4a07a" />
      {/* Stem */}
      <line x1="30" y1="68" x2="30" y2="36" stroke="#5a8a4a" strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf */}
      <path d="M30 54 Q18 46 16 36 Q24 40 30 50" fill="#6aaa56" />
      {/* Right leaf */}
      <path d="M30 50 Q42 42 44 32 Q36 38 30 48" fill="#5a9a48" />
      {/* Tulip petals */}
      <ellipse cx="24" cy="26" rx="8" ry="14" fill="#f06090" transform="rotate(-12 24 26)" />
      <ellipse cx="36" cy="26" rx="8" ry="14" fill="#f06090" transform="rotate(12 36 26)" />
      <ellipse cx="30" cy="22" rx="8" ry="15" fill="#f472a0" />
      {/* Inner shading */}
      <ellipse cx="30" cy="28" rx="4" ry="8" fill="#c0406a" opacity="0.3" />
    </svg>
  );
}

function ClockDecor({ theme, now }: { theme: Theme; now: Date }) {
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');

  return (
    <svg viewBox="0 0 52 60" width="104" height="120" style={{ display: 'block' }}>
      {/* Body */}
      <rect x="0" y="0" width="52" height="58" rx="8" fill={theme.clockBody} />
      {/* Digital display panel */}
      <rect x="5" y="12" width="42" height="24" rx="4" fill={theme.clockFace} />
      {/* Time display */}
      <text
        x="26" y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fill={theme.clockHand}
        fontSize="10"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontWeight="700"
        letterSpacing="1"
      >{h}:{m}</text>
      {/* Feet */}
      <rect x="14" y="52" width="8" height="8" rx="2" fill={theme.clockFeet} />
      <rect x="30" y="52" width="8" height="8" rx="2" fill={theme.clockFeet} />
    </svg>
  );
}

function MugDecor() {
  return (
    <svg viewBox="0 0 64 72" width="128" height="144" style={{ display: 'block' }}>
      <rect x="4" y="22" width="44" height="50" rx="5" fill="#b07252" />
      <rect x="4" y="22" width="44" height="8" rx="3" fill="#8a5638" />
      <path d="M48,32 Q62,32 62,47 Q62,62 48,62" fill="none" stroke="#8a5638" strokeWidth="5" strokeLinecap="round" />
      <path d="M18,17 Q20,7 18,2" fill="none" stroke="#c8967a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M28,14 Q30,4 28,0" fill="none" stroke="#c8967a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M38,17 Q40,7 38,2" fill="none" stroke="#c8967a" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ── Room background — wall, floor, windows only ───────────────────────────

function RoomBackground({ theme, tod }: { theme: Theme; tod: TimeOfDay }) {
  const stars: [number, number][] = tod === 'night'
    ? [[100, 60], [160, 30], [55, 100], [175, 80], [130, 20], [90, 140], [40, 40], [190, 120], [70, 180], [155, 155]]
    : [];

  const WindowPane = ({ id, gx, showCelestial }: { id: string; gx: number; showCelestial: boolean }) => (
    <g transform={`translate(${gx}, 80)`}>
      <rect x="0" y="0" width="220" height="320" rx="6" fill={theme.windowGlass} opacity="0.7" />
      <rect x="0" y="0" width="220" height="320" rx="6" fill="none" stroke={theme.baseboard} strokeWidth="10" />
      <line x1="110" y1="0" x2="110" y2="320" stroke={theme.baseboard} strokeWidth="6" />
      <line x1="0" y1="160" x2="220" y2="160" stroke={theme.baseboard} strokeWidth="6" />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.skyTop} />
          <stop offset="100%" stopColor={theme.skyBottom} />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="210" height="310" rx="3" fill={`url(#${id})`} opacity={theme.skyOpacity} />
      {stars.map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r="1.5" fill="white" opacity="0.8" />)}
      {showCelestial && tod === 'morning' && <circle cx="170" cy="80"  r="28" fill="#fbbf24" opacity="0.9" />}
      {showCelestial && tod === 'night'   && <circle cx="160" cy="70"  r="18" fill="#e2e8f0" opacity="0.9" />}
      <path d="M0,0 Q20,60 10,160 Q20,260 0,320 L30,320 Q40,220 30,160 Q40,80 30,0 Z"   fill={theme.curtain} opacity="0.85" />
      <path d="M220,0 Q200,60 210,160 Q200,260 220,320 L190,320 Q180,220 190,160 Q180,80 190,0 Z" fill={theme.curtain} opacity="0.85" />
    </g>
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="680" width="1440" height="220" fill={theme.floor} />
      <rect x="0" y="0"   width="1440" height="680" fill={theme.wall} />
      <rect x="0" y="672" width="1440" height="12"  fill={theme.baseboard} />
      <WindowPane id="skyL" gx={80}   showCelestial={tod === 'morning'} />
      <WindowPane id="skyR" gx={1140} showCelestial={tod === 'night'} />
    </svg>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
