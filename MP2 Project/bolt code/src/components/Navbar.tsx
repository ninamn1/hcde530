import { Grid, LogOut, User, SlidersHorizontal } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { NavTheme } from '../App';

type Page = 'home' | 'results' | 'gallery' | 'manage';

type Props = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: SupabaseUser | null;
  onAuthOpen: () => void;
  onSignOut: () => void;
  navTheme: NavTheme;
};

export default function Navbar({ currentPage, onNavigate, user, onAuthOpen, onSignOut, navTheme }: Props) {
  const { bg, border, textPrimary, textSecondary, logoBg, activeBg, hoverBg } = navTheme;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-700"
      style={{ background: bg, borderColor: border }}
    >
      <div className="px-[80px]">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-end gap-2.5 group"
          >
            <TrendArLogo logoBg={textPrimary} />
            <span
              className="font-semibold text-[26px] leading-none mb-[4px] transition-colors duration-700"
              style={{ fontFamily: "'Funnel Display', sans-serif", color: textPrimary }}
            >
              trendar
            </span>
          </button>

          <div className="flex items-center gap-1">
            <NavButton
              active={currentPage === 'gallery'}
              onClick={() => onNavigate('gallery')}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              activeBg={activeBg}
              hoverBg={hoverBg}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </NavButton>

            {user?.email === 'ninamn1@uw.edu' && (
              <NavButton
                active={currentPage === 'manage'}
                onClick={() => onNavigate('manage')}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                activeBg={activeBg}
                hoverBg={hoverBg}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
              </NavButton>
            )}

            {user && <div className="w-px h-5 mx-1 transition-colors duration-700" style={{ background: border }} />}

            {user ? (
              <div className="flex items-center gap-1">
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-700"
                  style={{ color: textSecondary }}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{ color: textSecondary }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.color = textPrimary;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = textSecondary;
                  }}
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({
  active,
  onClick,
  textPrimary,
  textSecondary,
  activeBg,
  hoverBg,
  children,
}: {
  active: boolean;
  onClick: () => void;
  textPrimary: string;
  textSecondary: string;
  activeBg: string;
  hoverBg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        background: active ? activeBg : 'transparent',
        color: active ? textPrimary : textSecondary,
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
          (e.currentTarget as HTMLButtonElement).style.color = textPrimary;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = textSecondary;
        }
      }}
    >
      {children}
    </button>
  );
}

function Sparkle({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const d = r;
  const s = r * 0.6;
  return (
    <g>
      <line x1={cx} y1={cy - d} x2={cx} y2={cy + d} stroke={color} strokeWidth={r * 0.55} strokeLinecap="round" />
      <line x1={cx - d} y1={cy} x2={cx + d} y2={cy} stroke={color} strokeWidth={r * 0.55} strokeLinecap="round" />
      <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} stroke={color} strokeWidth={r * 0.4} strokeLinecap="round" />
      <line x1={cx + s} y1={cy - s} x2={cx - s} y2={cy + s} stroke={color} strokeWidth={r * 0.4} strokeLinecap="round" />
    </g>
  );
}

function TrendArLogo({ logoBg }: { logoBg: string }) {
  // Radar centered at (14,14), origin point bottom-left at (14,14)
  // Three concentric arcs (top-right quadrant sweep), sweep line, sparkles at detected points
  const cx = 14;
  const cy = 14;
  return (
    <svg width="56" height="32" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 transition-colors duration-700">
      {/* concentric arcs — top-right quadrant, 0° to 90° */}
      <path d={`M ${cx} ${cy - 5} A 5 5 0 0 1 ${cx + 5} ${cy}`} stroke={logoBg} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
      <path d={`M ${cx} ${cy - 9} A 9 9 0 0 1 ${cx + 9} ${cy}`} stroke={logoBg} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      <path d={`M ${cx} ${cy - 13} A 13 13 0 0 1 ${cx + 13} ${cy}`} stroke={logoBg} strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      {/* sweep line at ~40° from vertical */}
      <line x1={cx} y1={cy} x2={cx + 8.5} y2={cy - 7} stroke={logoBg} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* origin dot */}
      <circle cx={cx} cy={cy} r="1.4" fill={logoBg} />
      {/* sparkle on outer arc ~20° */}
      <Sparkle cx={cx + 4.4} cy={cy - 12.3} r={1.5} color={logoBg} />
      {/* sparkle on mid arc ~60° */}
      <Sparkle cx={cx + 7.8} cy={cy - 4.5} r={1.1} color={logoBg} />
    </svg>
  );
}
