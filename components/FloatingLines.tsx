import React, { useEffect, useRef } from 'react';

interface FloatingLinesProps {
    linesGradient: string[];
    animationSpeed?: number;
    interactive?: boolean;
    bendRadius?: number;
    bendStrength?: number;
    mouseDamping?: number;
    parallax?: boolean;
    parallaxStrength?: number;
    className?: string;
}

export const FloatingLines: React.FC<FloatingLinesProps> = ({
    linesGradient = ["#E945F5", "#2F4BC0", "#E945F5"],
    animationSpeed = 1.6,
    interactive = true,
    bendRadius = 200,
    bendStrength = 0.5,
    className = ""
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let time = 0;

        // Line configuration
        const lines: { x: number; width: number; speed: number; color: string }[] = [];
        const numLines = 40;
        const spacing = width / numLines;

        for (let i = 0; i < numLines; i++) {
            lines.push({
                x: i * spacing + spacing / 2,
                width: Math.random() * 2 + 1,
                speed: (Math.random() * 0.5 + 0.5) * animationSpeed,
                color: linesGradient[Math.floor(Math.random() * linesGradient.length)]
            });
        }

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener('resize', resize);
        if (interactive) window.addEventListener('mousemove', onMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            time += 0.01;

            lines.forEach(line => {
                ctx.beginPath();
                ctx.strokeStyle = line.color;
                ctx.lineWidth = line.width;
                ctx.globalAlpha = 0.6;

                // Draw curve
                for (let y = 0; y <= height; y += 10) {
                    let x = line.x;

                    // Interaction
                    if (interactive) {
                        const dy = y - mouseRef.current.y;
                        const dx = x - mouseRef.current.x;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < bendRadius) {
                            const force = (1 - dist / bendRadius) * bendStrength * 100;
                            if (mouseRef.current.x < x) x += force;
                            else x -= force;
                        }
                    }

                    // Natural flow
                    x += Math.sin(y * 0.01 + time * line.speed) * 20;

                    if (y === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [linesGradient, animationSpeed, interactive, bendRadius, bendStrength]);

    return (
        <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
    );
};