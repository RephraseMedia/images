'use client';

import { useCallback, useState, DragEvent, useRef } from 'react';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function DropZone({
  onFiles,
  accept = 'image/*',
  multiple = false,
  children,
  className = '',
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFiles(files);
    },
    [onFiles]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFiles(files);
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
