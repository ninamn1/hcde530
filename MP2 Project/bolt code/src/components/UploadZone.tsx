import { useRef, useState, useCallback } from 'react';
import { Upload, ImageIcon } from 'lucide-react';

type Props = {
  onFile: (file: File) => void;
  loading?: boolean;
};

export default function UploadZone({ onFile, loading = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    onFile(file);
  }, [onFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !loading && inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-12 flex flex-col items-center justify-center gap-4 group
        ${dragging
          ? 'border-teal-500 bg-teal-50 scale-[1.01]'
          : 'border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100'
        }
        ${loading ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-teal-100' : 'bg-white shadow-sm group-hover:bg-stone-50'}`}>
        {dragging ? (
          <ImageIcon className="w-7 h-7 text-teal-600" />
        ) : (
          <Upload className="w-7 h-7 text-stone-400 group-hover:text-stone-600 transition-colors" />
        )}
      </div>

      <div className="text-center">
        <p className="text-stone-700 font-medium">
          {dragging ? 'Drop to identify trend' : 'Drop your image here'}
        </p>
        <p className="text-stone-400 text-sm mt-1">
          or <span className="text-teal-600 font-medium">browse files</span> — JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
}
