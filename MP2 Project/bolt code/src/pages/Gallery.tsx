import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import MasonryGrid from '../components/MasonryGrid';
import { supabase } from '../lib/supabase';
import type { Trend, TrendImage } from '../lib/supabase';

type ImageWithTrend = TrendImage & { trend_name: string };

export default function Gallery({ initialFilterId }: { initialFilterId?: string }) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [images, setImages] = useState<ImageWithTrend[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    () => new Set(initialFilterId ? [initialFilterId] : [])
  );
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState<ImageWithTrend | null>(null);
  const [displayedImage, setDisplayedImage] = useState<ImageWithTrend | null>(null);
  const [leftVisible, setLeftVisible] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const [{ data: trendData }, { data: imgData }] = await Promise.all([
        supabase.from('trends').select('*').order('name'),
        supabase.from('trend_images').select('*, trends(name)').order('sort_order'),
      ]);
      setTrends(trendData ?? []);
      const mapped: ImageWithTrend[] = (imgData ?? []).map(row => ({
        id: row.id,
        trend_id: row.trend_id,
        url: row.url,
        source: row.source,
        attribution: row.attribution,
        sort_order: row.sort_order,
        trend_name: (row.trends as { name: string } | null)?.name ?? '',
      }));
      for (let i = mapped.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
      }
      setImages(mapped);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  const filtered = activeFilters.size === 0 ? images : images.filter(i => activeFilters.has(i.trend_id));

  function toggleFilter(id: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (expandedImage === null) {
      setDisplayedImage(null);
      setLeftVisible(true);
      return;
    }
    if (displayedImage === null) {
      setDisplayedImage(expandedImage);
      setLeftVisible(true);
      return;
    }
    setLeftVisible(false);
    const t = setTimeout(() => {
      setDisplayedImage(expandedImage);
      setLeftVisible(true);
    }, 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedImage]);

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="px-[80px] py-10">

        {/* Header row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Trend Gallery</h1>
            <p className="text-stone-500 text-sm mt-1">Browse all curated design examples.</p>
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150
                ${filterOpen || activeFilters.size > 0
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:text-stone-900'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {activeFilters.size > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-md bg-white/20 font-semibold">
                  {activeFilters.size}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl z-30
                transition-all duration-200 origin-top-right
                ${filterOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Filter by trend</span>
                {activeFilters.size > 0 && (
                  <button
                    onClick={() => setActiveFilters(new Set())}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {trends.map(t => {
                  const active = activeFilters.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleFilter(t.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 mt-1 first:mt-0
                        ${active ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors
                        ${active ? 'bg-white border-white' : 'border-stone-300'}`}
                      >
                        {active && (
                          <svg className="w-2.5 h-2.5 text-stone-900" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-xl bg-stone-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">No images found for this filter.</div>
        ) : (
          <>
            <div className="hidden sm:block">
              <MasonryGrid columns={5} gap={4}>
                {filtered.map(img => (
                  <FadeInWrapper key={img.id}>
                    <ImageCard
                      url={img.url}
                      attribution={img.attribution}
                      trendName={img.trend_name}
                      onClick={() => setExpandedImage(img)}
                    />
                  </FadeInWrapper>
                ))}
              </MasonryGrid>
            </div>
            <div className="sm:hidden grid grid-cols-2 gap-4">
              {filtered.map(img => (
                <FadeInWrapper key={img.id}>
                  <ImageCard
                    url={img.url}
                    attribution={img.attribution}
                    trendName={img.trend_name}
                    onClick={() => setExpandedImage(img)}
                  />
                </FadeInWrapper>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Expanded image modal */}
      {expandedImage && displayedImage && (() => {
        const similar = images.filter(i => i.trend_id === displayedImage.trend_id && i.id !== displayedImage.id);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setExpandedImage(null)}>
            <div
              className="relative bg-white rounded-2xl w-full overflow-hidden flex flex-row"
              style={{ maxWidth: '90vw', maxHeight: '88vh', height: '88vh' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 shadow-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left: image + meta */}
              <div
                className="flex flex-col w-1/2 h-full border-r border-stone-100 shrink-0 transition-opacity duration-200"
                style={{ opacity: leftVisible ? 1 : 0 }}
              >
                <div className="flex-1 min-h-0 bg-stone-50 flex items-center justify-center overflow-hidden p-4">
                  <img
                    src={displayedImage.url}
                    alt={displayedImage.trend_name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="p-6 shrink-0 border-t border-stone-100">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">Trend</p>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">{displayedImage.trend_name}</h2>
                  {displayedImage.attribution && (
                    <p className="text-sm text-stone-400 truncate">{displayedImage.attribution}</p>
                  )}
                </div>
              </div>

              {/* Right: scrollable similar images */}
              <div className="w-1/2 h-full overflow-y-auto">
                {similar.length > 0 ? (
                  <div className="p-4">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">More like this</p>
                    <div className="columns-4 gap-1.5">
                      {similar.map(img => (
                        <FadeInImage
                          key={img.id}
                          img={img}
                          onClick={() => setExpandedImage(img)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-400 text-sm">
                    No similar images found.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function FadeInImage({ img, onClick }: { img: ImageWithTrend; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-lg overflow-hidden cursor-pointer group mb-1.5 break-inside-avoid transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
      onClick={onClick}
    >
      <img
        src={img.url}
        alt={img.trend_name}
        className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl" />
    </div>
  );
}

function FadeInWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)' }}
    >
      {children}
    </div>
  );
}