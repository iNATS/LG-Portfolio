import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Use local constants for non-standard JSX tags to avoid polluting global JSX.IntrinsicElements.
// This prevents standard HTML tags (div, span, etc.) from being shadowed and missing from the JSX namespace.
const Mesh = 'mesh' as any;
const Group = 'group' as any;
const PlaneGeometry = 'planeGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;
const SphereGeometry = 'sphereGeometry' as any;

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  className?: string;
}

const BeamUnit = ({ position, rotation, scale, color, speed, height, width }: any) => {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating movement
      meshRef.current.rotation.z += speed * 0.0005;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.005;
    }
  });

  return (
    <Mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <PlaneGeometry args={[width, height]} />
      <MeshBasicMaterial
        color={new THREE.Color(color)}
        opacity={0.06}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Mesh>
  );
};

const Scene = ({ beamNumber, beamWidth, beamHeight, lightColor, speed, scale, rotation }: BeamsProps) => {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed * 0.02 + rotation;
    }
  });

  const beams = useMemo(() => {
    return new Array(beamNumber).fill(0).map((_, i) => {
      const angle = (i / beamNumber) * Math.PI * 2;
      const radius = 4 + Math.random() * 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;
      
      const rotX = Math.random() * 0.5;
      const rotY = angle + Math.PI / 2;
      const rotZ = Math.random() * 0.5;

      return {
        position: [x, y, z],
        rotation: [rotX, rotY, rotZ],
        scale: [1, 1 + Math.random(), 1],
      };
    });
  }, [beamNumber]);

  return (
    <Group ref={groupRef} scale={[scale, scale, scale]}>
      {beams.map((props, i) => (
        <BeamUnit
          key={i}
          {...props}
          width={beamWidth}
          height={beamHeight}
          color={lightColor}
          speed={speed}
        />
      ))}
      
      {/* Central glow to hide origin */}
      <Mesh>
        <SphereGeometry args={[2, 32, 32]} />
        <MeshBasicMaterial 
            color={lightColor} 
            transparent 
            opacity={0.02} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
        />
      </Mesh>
    </Group>
  );
};

export const Beams: React.FC<BeamsProps> = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  className = ""
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      {/* Reduced DPR for performance on mobile */}
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <Scene
          beamWidth={beamWidth}
          beamHeight={beamHeight}
          beamNumber={beamNumber}
          lightColor={lightColor}
          speed={speed}
          noiseIntensity={noiseIntensity}
          scale={scale}
          rotation={rotation}
        />
      </Canvas>
    </div>
  );
};

export default Beams;