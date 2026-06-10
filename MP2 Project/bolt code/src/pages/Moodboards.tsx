import { useEffect, useState } from 'react';
import { Plus, BookOpen, Loader2, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Moodboard } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'results' | 'gallery' | 'moodboards' | 'moodboard-detail';

type Props = {
  user: User | null;
  onNavigate: (page: Page) => void;
  onSelectBoard: (id: string) => void;
  onAuthOpen: () => void;
};

export default function Moodboards({ user, onNavigate, onSelectBoard, onAuthOpen }: Props) {
  const [boards, setBoards] = useState<Moodboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!user) return;
    loadBoards();
  }, [user]);

  async function loadBoards() {
    setLoading(true);
    const { data } = await supabase
      .from('moodboards')
      .select('*')
      .order('updated_at', { ascending: false });
    const boards = data ?? [];
    setBoards(boards);

    // Load first 3 images for each board as preview
    if (boards.length > 0) {
      const ids = boards.map(b => b.id);
      const { data: imgs } = await supabase
        .from('moodboard_images')
        .select('moodboard_id, image_url, sort_order')
        .in('moodboard_id', ids)
        .order('sort_order');

      const map: Record<string, string[]> = {};
      (imgs ?? []).forEach(img => {
        if (!map[img.moodboard_id]) map[img.moodboard_id] = [];
        if (map[img.moodboard_id].length < 3) map[img.moodboard_id].push(img.image_url);
      });
      setPreviews(map);
    }

    setLoading(false);
  }

  async function createBoard() {
    if (!newName.trim()) return;
    setCreating(true);
    const { data } = await supabase
      .from('moodboards')
      .insert({ name: newName.trim() })
      .select()
      .single();
    if (data) {
      setBoards(prev => [data, ...prev]);
      onSelectBoard(data.id);
      onNavigate('moodboard-detail');
    }
    setCreating(false);
    setNewName('');
    setShowForm(false);
  }

  async function deleteBoard(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this moodboard?')) return;
    await supabase.from('moodboards').delete().eq('id', id);
    setBoards(prev => prev.filter(b => b.id !== id));
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-stone-400" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Sign in to view moodboards</h2>
          <p className="text-stone-500 text-sm mb-6">Create and save curated collections of design images.</p>
          <button
            onClick={onAuthOpen}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl font-medium text-sm hover:bg-stone-800 transition-colors"
          >
            Sign in / Sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-1">Moodboards</h1>
            <p className="text-stone-500">Curate images from trends you love.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New board
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-700 mb-3">Name your moodboard</p>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') createBoard(); if (e.key === 'Escape') setShowForm(false); }}
                placeholder="e.g. Swiss Minimalism Inspo"
                className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                onClick={createBoard}
                disabled={creating || !newName.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-500 disabled:opacity-50 transition-colors"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-stone-500 hover:text-stone-800 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-stone-200 rounded-2xl aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-stone-300" />
            </div>
            <p className="text-stone-500 mb-4">No moodboards yet. Create your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create moodboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {boards.map(board => (
              <button
                key={board.id}
                onClick={() => { onSelectBoard(board.id); onNavigate('moodboard-detail'); }}
                className="group text-left bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200"
              >
                <div className="grid grid-cols-3 h-32 bg-stone-100">
                  {(previews[board.id] ?? []).slice(0, 3).map((url, i) => (
                    <img key={i} src={url} alt="" className="w-full h-full object-cover" />
                  ))}
                  {Array.from({ length: 3 - (previews[board.id]?.length ?? 0) }).map((_, i) => (
                    <div key={i} className="w-full h-full bg-stone-100 border-r last:border-r-0 border-stone-200" />
                  ))}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-900 text-sm group-hover:text-teal-600 transition-colors">{board.name}</p>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {new Date(board.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => deleteBoard(board.id, e)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
