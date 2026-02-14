'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { drawBrushLine, canvasToBase64, clearMask } from '@/lib/canvasUtils';
import { Tool } from '@/types/editor';

export default function BrushCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const {
    activeTool,
    imageWidth,
    imageHeight,
    brushSettings,
    zoomPan,
    setMaskData,
  } = useEditorStore();

  const isBrushTool =
    activeTool === Tool.GenerativeFill || activeTool === Tool.RemoveObject;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isBrushTool) return;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    clearMask(canvas);
  }, [imageWidth, imageHeight, isBrushTool]);

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / zoomPan.scale;
      const y = (clientY - rect.top) / zoomPan.scale;
      return { x, y };
    },
    [zoomPan.scale]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isBrushTool || e.button !== 0 || e.altKey) return;
    isDrawing.current = true;
    const pos = getCanvasCoords(e.clientX, e.clientY);
    lastPos.current = pos;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = brushSettings.opacity;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSettings.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getCanvasCoords(e.clientX, e.clientY);
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (!isDrawing.current || !isBrushTool) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPos.current) return;

    drawBrushLine(
      ctx,
      lastPos.current.x,
      lastPos.current.y,
      pos.x,
      pos.y,
      brushSettings.size,
      brushSettings.opacity
    );
    lastPos.current = pos;
  };

  const handleMouseUp = () => {
    if (isDrawing.current && canvasRef.current) {
      isDrawing.current = false;
      lastPos.current = null;
      setMaskData(canvasToBase64(canvasRef.current));
    }
  };

  const handleClearMask = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearMask(canvas);
    setMaskData(null);
  }, [setMaskData]);

  // Expose clear function
  useEffect(() => {
    if (!isBrushTool) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClearMask();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isBrushTool, handleClearMask]);

  if (!isBrushTool) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 opacity-40 brush-cursor"
        style={{
          width: imageWidth,
          height: imageHeight,
          pointerEvents: 'auto',
          mixBlendMode: 'screen',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {cursorPos && isBrushTool && (
        <div
          className="fixed pointer-events-none border-2 border-white rounded-full mix-blend-difference z-50"
          style={{
            width: brushSettings.size * zoomPan.scale,
            height: brushSettings.size * zoomPan.scale,
            left: cursorPos.x - (brushSettings.size * zoomPan.scale) / 2,
            top: cursorPos.y - (brushSettings.size * zoomPan.scale) / 2,
          }}
        />
      )}
    </>
  );
}
