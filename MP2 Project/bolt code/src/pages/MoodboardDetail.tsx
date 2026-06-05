import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Download, Pencil, Check, X, Trash2, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Moodboard, MoodboardImage } from '../lib/supabase';

type Page = 'home' | 'results' | 'gallery' | 'moodboards' | 'moodboard-detail';

type Props = {
  boardId: string;
  onNavigate: (page: Page) => void;
};

export default function MoodboardDetail({ boardId, onNavigate }: Props) {
  const [board, setBoard] = useState<Moodboard | null>(null);
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [exporting, setExporting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    load();
  }, [boardId]);

  async function load() {
    setLoading(true);
    const [{ data: boardData }, { data: imgData }] = await Promise.all([
      supabase.from('moodboards').select('*').eq('id', boardId).maybeSingle(),
      supabase.from('moodboard_images').select('*').eq('moodboard_id', boardId).order('sort_order'),
    ]);
    setBoard(boardData);
    setImages(imgData ?? []);
    setLoading(false);
  }

  async function saveName() {
    if (!editName.trim() || !board) return;
    await supabase.from('moodboards').update({ name: editName.trim(), updated_at: new Date().toISOString() }).eq('id', boardId);
    setBoard({ ...board, name: editName.trim() });
    setEditing(false);
  }

  async function removeImage(id: string) {
    await supabase.from('moodboard_images').delete().eq('id', id);
    setImages(prev => prev.filter(img => img.id !== id));
  }

  async function move(id: string, dir: 'up' | 'down') {
    const idx = images.findIndex(i => i.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === images.length - 1) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    const updated = [...images];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }));
    setImages(reordered);
    await Promise.all(
      reordered.map(img => supabase.from('moodboard_images').update({ sort_order: img.sort_order }).eq('id', img.id))
    );
  }

  async function exportPng() {
    setExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const cols = Math.min(images.length, 3);
      const cellSize = 400;
      const padding = 16;
      const rows = Math.ceil(images.length / cols);
      const headerH = 80;
      canvas.width = cols * (cellSize + padding) + padding;
      canvas.height = rows * (cellSize + padding) + padding + headerH;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#fafaf9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText(board?.name ?? 'Moodboard', padding + 4, 52);

      // Images
      await Promise.all(
        images.map((img, i) => new Promise<void>(resolve => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = padding + col * (cellSize + padding);
          const y = headerH + padding + row * (cellSize + padding);
          const imgEl = new Image();
          imgEl.crossOrigin = 'anonymous';
          imgEl.onload = () => {
            ctx.drawImage(imgEl, x, y, cellSize, cellSize);
            resolve();
          };
          imgEl.onerror = () => {
            ctx.fillStyle = '#e7e5e4';
            ctx.fillRect(x, y, cellSize, cellSize);
            resolve();
          };
          imgEl.src = img.image_url;
        }))
      );

      const link = document.createElement('a');
      link.download = `${board?.name ?? 'moodboard'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Moodboard not found.</p>
          <button onClick={() => onNavigate('moodboards')} className="text-teal-600 font-medium hover:underline text-sm">
            Back to moodboards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => onNavigate('moodboards')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All moodboards
        </button>

        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false); }}
                  className="text-2xl font-bold text-stone-900 bg-transparent border-b-2 border-teal-500 focus:outline-none"
                />
                <button onClick={saveName} className="text-teal-600 hover:text-teal-500"><Check className="w-5 h-5" /></button>
                <button onClick={() => setEditing(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-stone-900">{board.name}</h1>
                <button
                  onClick={() => { setEditName(board.name); setEditing(true); }}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-stone-400 text-sm mt-1">{images.length} image{images.length !== 1 ? 's' : ''}</p>
          </div>

          <button
            onClick={exportPng}
            disabled={exporting || images.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export PNG
          </button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-400 mb-2">This moodboard is empty.</p>
            <p className="text-stone-400 text-sm">
              Add images from the{' '}
              <button onClick={() => onNavigate('gallery')} className="text-teal-600 font-medium hover:underline">
                gallery
              </button>{' '}
              or upload an image on the{' '}
              <button onClick={() => onNavigate('home')} className="text-teal-600 font-medium hover:underline">
                home page
              </button>.
            </p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="group relative rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={img.image_url}
                  alt={img.trend_name}
                  className="w-full h-auto block object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => move(img.id, 'up')}
                    disabled={idx === 0}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 shadow-sm"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(img.id, 'down')}
                    disabled={idx === images.length - 1}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 shadow-sm"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {img.trend_name && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium bg-black/60 px-2 py-0.5 rounded-full">{img.trend_name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
