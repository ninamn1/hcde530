import { ReactNode } from 'react';

type Props = {
  children: ReactNode[];
  columns?: number;
  gap?: number;
};

export default function MasonryGrid({ children, columns = 3, gap = 4 }: Props) {
  const cols: ReactNode[][] = Array.from({ length: columns }, () => []);
  children.forEach((child, i) => {
    cols[i % columns].push(child);
  });

  const gapClass: Record<number, string> = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };

  return (
    <div className={`grid ${gapClass[gap] ?? 'gap-4'}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {cols.map((col, ci) => (
        <div key={ci} className={`flex flex-col ${gapClass[gap] ?? 'gap-4'}`}>
          {col.map((item, ii) => (
            <div key={ii}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
