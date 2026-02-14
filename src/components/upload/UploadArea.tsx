'use client';

import { useRouter } from 'next/navigation';
import DropZone from '@/components/ui/DropZone';
import Spinner from '@/components/ui/Spinner';
import { useImageUpload } from '@/hooks/useImageUpload';

export default function UploadArea() {
  const router = useRouter();
  const { handleFiles, isLoading, acceptedFormats } = useImageUpload();

  const onFiles = async (files: File[]) => {
    const success = await handleFiles(files);
    if (success) {
      router.push('/editor');
    }
  };

  return (
    <DropZone
      onFiles={onFiles}
      accept={acceptedFormats}
      className="border-2 border-dashed rounded-2xl p-12 text-center"
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-muted">Processing image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold">
              Drop your image here or <span className="text-primary">browse</span>
            </p>
            <p className="text-muted text-sm mt-1">
              Supports JPEG, PNG, WebP, HEIC — up to 20MB
            </p>
          </div>
        </div>
      )}
    </DropZone>
  );
}
