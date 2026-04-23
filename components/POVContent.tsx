'use client';

import { Html } from '@react-three/drei';

type Props = {
  entered: boolean;
  onEnter: () => void;
};

export default function POVContent({ entered, onEnter }: Props) {
  return (
    <Html center transform distanceFactor={1.75}>
      <div
        className={`flex min-w-[680px] flex-col items-center text-center transition-all duration-700 ${
          entered ? 'opacity-25 blur-[2px]' : 'opacity-100'
        }`}
      >
        <h1 className="font-display text-6xl font-bold uppercase tracking-[0.24em] text-white md:text-7xl">
          Vick Perry POV
        </h1>

        <div className="mt-8 flex gap-12 text-[11px] uppercase tracking-[0.34em] text-slate-200/90 md:text-xs">
          <span>Building communities</span>
          <span>Video editor</span>
          <span>Automation systems</span>
        </div>

        <button
          onClick={onEnter}
          className="mt-16 rounded-full border border-white/55 px-11 py-3 text-sm uppercase tracking-[0.34em] text-white transition duration-300 hover:scale-[1.03] hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          Enter
        </button>
      </div>
    </Html>
  );
}
