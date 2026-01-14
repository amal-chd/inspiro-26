import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Cloud, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const particlePositions = new Float32Array(500).map(() => (Math.random() - 0.5) * 20);

const Monster = () => {
    const group = useRef();

    // Procedural "Mind Flayer" vibe using multiple cloud layers
    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Core body - dark and stormy */}
                <Cloud
                    opacity={0.8}
                    speed={0.4}
                    width={10}
                    depth={1.5}
                    segments={10}
                    color="#200000" // Dark red/black
                />

                {/* Tendrils / Arms */}
                <group position={[5, 2, 0]}>
                    <Cloud opacity={0.6} speed={0.8} width={5} segments={5} color="#500000" />
                </group>
                <group position={[-5, 3, 0]}>
                    <Cloud opacity={0.6} speed={0.6} width={5} segments={5} color="#400000" />
                </group>
            </Float>

            {/* Particles / Dust */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={500} // Matches the array length
                        array={particlePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.1}
                    color="#ff0000"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 60 }} performance={{ min: 0.5 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="red" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

                <Monster />
                <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />

                <fog attach="fog" args={['#050505', 5, 25]} />
            </Canvas>
        </div>
    );
};

export default Hero3D;
