import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Loader2, ImageOff, ChevronRight, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Trend, TrendImage } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type Props = {
  user: User | null;
  onAuthOpen: () => void; // kept for interface compatibility
};

export default function TrendManager({ user, onAuthOpen }: Props) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [images, setImages] = useState<TrendImage[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTrend = trends.find(t => t.id === selectedId) ?? null;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('trends')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setTrends(data ?? []);
        setLoadingTrends(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingImages(true);
    supabase
      .from('trend_images')
      .select('*')
      .eq('trend_id', selectedId)
      .order('sort_order')
      .then(({ data }) => {
        setImages(data ?? []);
        setLoadingImages(false);
      });
  }, [selectedId]);

  async function handleFiles(files: FileList | null) {
    if (!files || !selectedId || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${selectedId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('trend-images')
        .upload(path, file, { upsert: false });

      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from('trend-images')
        .getPublicUrl(path);

      const { data: row } = await supabase
        .from('trend_images')
        .insert({
          trend_id: selectedId,
          url: urlData.publicUrl,
          source: 'upload',
          attribution: '',
          sort_order: images.length,
        })
        .select()
        .single();

      if (row) setImages(prev => [...prev, row]);
    }

    setUploading(false);
  }

  async function handleDelete(img: TrendImage) {
    setDeletingId(img.id);

    // Extract storage path from public URL
    const url = new URL(img.url);
    const pathParts = url.pathname.split('/trend-images/');
    if (pathParts.length > 1) {
      await supabase.storage.from('trend-images').remove([pathParts[1]]);
    }

    await supabase.from('trend_images').delete().eq('id', img.id);
    setImages(prev => prev.filter(i => i.id !== img.id));
    setDeletingId(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  if (!user || user.email !== 'ninamn1@uw.edu') {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-7 h-7 text-stone-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Access restricted</h2>
          <p className="text-stone-500 text-sm">This page is only available to the site admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-stone-200 overflow-y-auto">
          <div className="p-4 border-b border-stone-100">
            <h1 className="text-base font-semibold text-stone-900">Trend Manager</h1>
            <p className="text-xs text-stone-400 mt-0.5">Upload reference images per trend</p>
          </div>

          {loadingTrends ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 bg-stone-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="p-2">
              {trends.map(trend => (
                <li key={trend.id}>
                  <button
                    onClick={() => setSelectedId(trend.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left group ${
                      selectedId === trend.id
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span className="truncate">{trend.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 transition-colors ${
                      selectedId === trend.id ? 'text-white' : 'text-stone-300 group-hover:text-stone-500'
                    }`} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {!selectedTrend ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageOff className="w-7 h-7 text-stone-300" />
                </div>
                <p className="text-stone-500 text-sm">Select a trend to manage its images</p>
              </div>
            </div>
          ) : (
            <div className="p-6 max-w-5xl">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-stone-900">{selectedTrend.name}</h2>
                <p className="text-stone-500 text-sm mt-1">{selectedTrend.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedTrend.traits?.map(trait => (
                    <span key={trait} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-md">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upload zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                    <p className="text-sm text-stone-500">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
                      <Upload className="w-5 h-5 text-stone-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-700">
                      Drop images here or <span className="text-teal-600">browse</span>
                    </p>
                    <p className="text-xs text-stone-400">JPEG, PNG, WebP or GIF — up to 10 MB each</p>
                  </div>
                )}
              </div>

              {/* Image grid */}
              {loadingImages ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-stone-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-stone-400 text-sm">No images yet — upload some above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map(img => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {img.attribution && (
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {img.attribution}
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(img)}
                        disabled={deletingId === img.id}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                      >
                        {deletingId === img.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
