'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editorStore';
import EditorLayout from '@/components/layout/EditorLayout';

export default function EditorPage() {
  const router = useRouter();
  const currentImage = useEditorStore((s) => s.currentImage);

  useEffect(() => {
    if (!currentImage) {
      router.replace('/');
    }
  }, [currentImage, router]);

  if (!currentImage) {
    return (
      <div className="h-screen flex items-center justify-center text-muted">
        Redirecting...
      </div>
    );
  }

  return <EditorLayout />;
}
