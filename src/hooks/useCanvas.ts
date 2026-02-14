'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/lib/constants';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentImage,
    zoomPan,
    setZoomPan,
  } = useEditorStore();

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = currentImage;
  }, [currentImage]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const zoomIn = useCallback(() => {
    setZoomPan({ scale: Math.min(zoomPan.scale + ZOOM_STEP, MAX_ZOOM) });
  }, [zoomPan.scale, setZoomPan]);

  const zoomOut = useCallback(() => {
    setZoomPan({ scale: Math.max(zoomPan.scale - ZOOM_STEP, MIN_ZOOM) });
  }, [zoomPan.scale, setZoomPan]);

  const resetZoom = useCallback(() => {
    setZoomPan({ scale: 1, offsetX: 0, offsetY: 0 });
  }, [setZoomPan]);

  const fitToContainer = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || canvas.width === 0) return;

    const containerRect = container.getBoundingClientRect();
    const scaleX = (containerRect.width - 40) / canvas.width;
    const scaleY = (containerRect.height - 40) / canvas.height;
    const scale = Math.min(scaleX, scaleY, 1);

    setZoomPan({ scale, offsetX: 0, offsetY: 0 });
  }, [setZoomPan]);

  return {
    canvasRef,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToContainer,
  };
}
