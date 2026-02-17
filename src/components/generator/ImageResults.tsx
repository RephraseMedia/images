'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useEditorStore } from '@/stores/editorStore';
import { showToast } from '@/components/ui/Toast';

interface ImageResultsProps {
  images: string[];
}

export default function ImageResults({ images }: ImageResultsProps) {
  const router = useRouter();
  const setImage = useEditorStore((s) => s.setImage);

  if (images.length === 0) return null;

  const handleDownload = (image: string, index: number) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Image downloaded!');
  };

  const handleEditInEditor = (image: string) => {
    const img = new window.Image();
    img.onload = () => {
      setImage(image, img.naturalWidth, img.naturalHeight);
      router.push('/editor');
    };
    img.onerror = () => {
      showToast('error', 'Failed to load image for editing');
    };
    img.src = image;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Generated Images</h2>
      <div
        className={`grid gap-4 ${
          images.length === 1
            ? 'grid-cols-1 max-w-lg mx-auto'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {images.map((image, index) => (
          <div key={index} className="group relative rounded-xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`Generated image ${index + 1}`}
              className="w-full h-auto block"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(image, index)}
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditInEditor(image)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
