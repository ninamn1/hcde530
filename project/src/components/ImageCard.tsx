import { useState } from 'react';

type Props = {
  url: string;
  attribution?: string;
  trendName?: string;
  onClick?: () => void;
  noHover?: boolean;
};

export default function ImageCard({ url, attribution, trendName, onClick, noHover }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const interactive = !noHover;

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-stone-100 group ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      onClick={onClick}
    >
      {imgError ? (
        <div className="aspect-[4/5] bg-stone-200 flex items-center justify-center">
          <span className="text-stone-400 text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={url}
          alt={trendName ?? 'Trend example'}
          className={`w-full h-auto block object-cover ${interactive ? 'transition-transform duration-500 group-hover:scale-105' : ''}`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}

      {interactive && (
        <>
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`} />
          {(trendName || attribution) && (
            <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-200 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}>
              {trendName && <p className="text-white text-xs font-semibold uppercase tracking-wide">{trendName}</p>}
              {attribution && <p className="text-white/60 text-xs mt-0.5 truncate">{attribution}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
