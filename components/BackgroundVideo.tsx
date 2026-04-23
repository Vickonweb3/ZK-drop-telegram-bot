'use client';

import { Plane, useVideoTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const VIDEO_SRC =
  '/video/mixkit-the-camera-slowly-slides-into-the-tranquil-forest-on-a-50847-hd-ready.mp4';

export default function BackgroundVideo() {
  const texture = useVideoTexture(VIDEO_SRC, {
    muted: true,
    loop: true,
    crossOrigin: 'anonymous',
    playsInline: true,
    start: true
  });

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false
      }),
    [texture]
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  return (
    <group>
      <Plane args={[15, 8.4]} position={[0, 0, -2.55]} material={material} />
      <Plane args={[15, 8.4]} position={[0, 0, -2.5]}>
        <meshBasicMaterial color="#02040a" transparent opacity={0.4} />
      </Plane>
    </group>
  );
}
