'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });

  const { currentImage, zoomPan, setZoomPan, imageWidth, imageHeight } = useEditorStore();

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = imageWidth;
      canvas.height = imageHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
    };
    img.src = currentImage;
  }, [currentImage, imageWidth, imageHeight]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.min(Math.max(zoomPan.scale + delta, 0.1), 5);
      setZoomPan({ scale: newScale });
    },
    [zoomPan.scale, setZoomPan]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPanPos.current.x;
    const dy = e.clientY - lastPanPos.current.y;
    lastPanPos.current = { x: e.clientX, y: e.clientY };
    setZoomPan({
      offsetX: zoomPan.offsetX + dx,
      offsetY: zoomPan.offsetY + dy,
    });
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  if (!currentImage) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        No image loaded
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative bg-secondary/30 flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${zoomPan.offsetX}px, ${zoomPan.offsetY}px) scale(${zoomPan.scale})`,
          transformOrigin: 'center center',
        }}
        className="transition-none"
      >
        <div className="checkerboard relative">
          <canvas
            ref={canvasRef}
            className="block max-w-none"
            style={{ imageRendering: zoomPan.scale > 2 ? 'pixelated' : 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}
