import { useMemo } from 'react';
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import MasonryGrid from '../components/MasonryGrid';
import type { TrendMatch } from '../lib/supabase';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type TimeOfDay = 'morning' | 'afternoon' | 'night';
type Page = 'home' | 'results' | 'gallery' | 'manage';

type Props = {
  matches: TrendMatch[];
  uploadedImageUrl: string;
  onNavigate: (page: Page) => void;
  onNavigateToGallery: (trendId: string) => void;
  tod: TimeOfDay;
};

const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'bg-teal-50 text-teal-700 border-teal-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-stone-100 text-stone-600 border-stone-200',
};

const SEE_MORE_STYLES: Record<TimeOfDay, { bg: string; text: string; hoverBg: string; border: string }> = {
  morning:   { bg: '#292524', text: '#fef9f4', hoverBg: '#44403c', border: '#292524' },
  afternoon: { bg: '#1f3830', text: '#e8f4f0', hoverBg: '#2d5044', border: '#1f3830' },
  night:     { bg: '#e2ddf5', text: '#0f0c1a', hoverBg: '#f0edff', border: '#e2ddf5' },
};

export default function Results({ matches, uploadedImageUrl, onNavigate, onNavigateToGallery, tod }: Props) {
  const btnStyle = SEE_MORE_STYLES[tod];

  const shuffledMatches = useMemo(
    () => matches.map(m => ({ ...m, images: shuffle(m.images) })),
    [matches]
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Upload another image
        </button>

        {/* Upload + summary */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-12">
          <img
            src={uploadedImageUrl}
            alt="Your upload"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-md flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-stone-500 text-sm uppercase tracking-wide font-medium mb-1">Top matches</p>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">
              {matches.length} trend{matches.length !== 1 ? 's' : ''} identified
            </h1>
            <div className="flex flex-wrap gap-2">
              {matches.map(m => (
                <span key={m.trend_id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white text-sm font-medium rounded-full">
                  <Tag className="w-3 h-3" />
                  {m.trend_name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trend cards */}
        <div className="space-y-16">
          {shuffledMatches.map((match, idx) => {
            const cols = 4;
            const visibleImages = match.images.slice(0, 8);
            const hasMore = match.images.length > 8;

            return (
              <section key={match.trend_id}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-stone-400 text-sm font-medium">#{idx + 1}</span>
                      <h2 className="text-2xl font-bold text-stone-900">{match.trend_name}</h2>
                      {(match as TrendMatch & { confidence?: string }).confidence && (
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${CONFIDENCE_COLORS[(match as TrendMatch & { confidence?: string }).confidence ?? 'medium']}`}>
                          {(match as TrendMatch & { confidence?: string }).confidence} match
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed italic mb-3">"{match.rationale}"</p>
                    <div className="flex flex-wrap gap-2">
                      {match.traits.map(trait => (
                        <span key={trait} className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full border border-stone-200">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {match.images.length > 0 && (
                  <div>
                    <p className="text-stone-500 text-xs font-medium uppercase tracking-wider mb-3">
                      Example images from this trend
                    </p>
                    <div className="hidden sm:block">
                      <MasonryGrid columns={cols} gap={3}>
                        {visibleImages.map(img => (
                          <ImageCard key={img.id} url={img.url} attribution={img.attribution} trendName={match.trend_name} noHover />
                        ))}
                      </MasonryGrid>
                    </div>
                    <div className="sm:hidden grid grid-cols-2 gap-3">
                      {match.images.slice(0, 4).map(img => (
                        <ImageCard key={img.id} url={img.url} attribution={img.attribution} trendName={match.trend_name} noHover />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="mt-5 flex justify-center">
                        <button
                          onClick={() => onNavigateToGallery(match.trend_id)}
                          className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-150 active:scale-95"
                          style={{
                            backgroundColor: btnStyle.bg,
                            color: btnStyle.text,
                            border: `1.5px solid ${btnStyle.border}`,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = btnStyle.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = btnStyle.bg)}
                        >
                          View all {match.trend_name} images
                          <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {match.images.length === 0 && (
                  <div className="rounded-xl bg-stone-100 border border-stone-200 p-8 text-center text-stone-400 text-sm">
                    No example images seeded for this trend yet.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
