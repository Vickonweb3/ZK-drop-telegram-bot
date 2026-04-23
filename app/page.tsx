'use client';

import Scene from '@/components/Scene';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function Page() {
  return (
    <main className="relative h-screen w-screen">
      <Canvas camera={{ position: [0, 0, 2.35], fov: 40 }} dpr={[1, 1.6]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.38)_100%)]" />
    </main>
  );
}
