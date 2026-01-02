import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

interface DarkVeilProps {
    className?: string;
}

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColor;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Subtle movement logic
    float t = uTime * 0.0005;
    
    // Create base noise/wave pattern
    float wave1 = sin(uv.x * 3.0 + t + sin(uv.y * 2.0 + t * 2.0));
    float wave2 = cos(uv.y * 4.0 - t * 1.5 + cos(uv.x * 3.0));
    float wave3 = sin((uv.x + uv.y) * 5.0 + t);
    
    float noise = (wave1 + wave2 + wave3) / 3.0;
    
    // Dark deep background
    vec3 bg = vec3(0.005, 0.005, 0.01);
    
    // Primary veil color (Purple/Blue ish)
    vec3 color1 = vec3(0.3, 0.1, 0.6); 
    // Secondary veil color (Blue/Cyan ish)
    vec3 color2 = vec3(0.1, 0.3, 0.8);
    
    // Mix based on noise
    float veilAlpha = smoothstep(-0.5, 0.5, noise);
    
    // Gradient mesh effect
    vec3 finalColor = mix(bg, color1, veilAlpha * 0.2);
    finalColor = mix(finalColor, color2, (1.0 - veilAlpha) * 0.15 * sin(t));
    
    // Vignette
    float dist = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
    
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const DarkVeil: React.FC<DarkVeilProps> = ({ className = '' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: false, dpr: 1 }); // Reduce dpr for performance if needed
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 1);

        const container = containerRef.current;
        container.appendChild(gl.canvas);

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color(0.3, 0.2, 0.5) },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        let animationId: number;
        function update(t: number) {
            animationId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t;
            renderer.render({ scene: mesh });
        }
        animationId = requestAnimationFrame(update);

        function resize() {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }
        window.addEventListener('resize', resize);
        resize();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
            if (container && container.contains(gl.canvas)) {
                container.removeChild(gl.canvas);
            }
        };
    }, []);

    return <div ref={containerRef} className={`w-full h-full ${className}`} />;
};