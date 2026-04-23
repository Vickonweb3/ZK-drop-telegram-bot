'use client';

import { Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import BackgroundVideo from './BackgroundVideo';
import POVContent from './POVContent';

export default function Scene() {
  const { mouse, camera } = useThree();
  const [entered, setEntered] = useState(false);

  const basePosition = useMemo(() => new THREE.Vector3(0, 0, 2.35), []);
  const enterPosition = useMemo(() => new THREE.Vector3(0, 0, 1.25), []);

  useFrame((_, delta) => {
    const target = entered ? enterPosition : basePosition;
    const px = target.x + mouse.x * 0.09;
    const py = target.y + mouse.y * 0.06;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px, 1 - Math.exp(-4 * delta));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, py, 1 - Math.exp(-4 * delta));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target.z, 1 - Math.exp(-2.6 * delta));
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.26} color="#dbeafe" />
      <directionalLight position={[1.5, 2, 3]} intensity={0.34} color="#e2e8f0" />
      <BackgroundVideo />
      <Float speed={0.4} floatIntensity={0.055} rotationIntensity={0}>
        <POVContent entered={entered} onEnter={() => setEntered(true)} />
      </Float>
    </>
  );
}
