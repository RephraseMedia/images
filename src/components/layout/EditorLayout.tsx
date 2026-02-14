'use client';

import Header from './Header';
import Toolbar from '@/components/editor/Toolbar';
import ToolPanel from '@/components/editor/ToolPanel';
import EditorCanvas from '@/components/editor/EditorCanvas';
import BrushCanvas from '@/components/editor/BrushCanvas';
import ProcessingOverlay from '@/components/editor/ProcessingOverlay';
import ZoomControls from '@/components/editor/ZoomControls';
import UndoRedo from '@/components/editor/UndoRedo';
import { useEditorStore } from '@/stores/editorStore';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function EditorLayout() {
  useKeyboardShortcuts();
  const router = useRouter();
  const reset = useEditorStore((s) => s.reset);
  const zoomPan = useEditorStore((s) => s.zoomPan);
  const imageWidth = useEditorStore((s) => s.imageWidth);
  const imageHeight = useEditorStore((s) => s.imageHeight);

  const handleNewImage = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col">
      <Header showEditor onNewImage={handleNewImage}>
        <UndoRedo />
      </Header>
      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-secondary/30">
          <div
            style={{
              transform: `translate(${zoomPan.offsetX}px, ${zoomPan.offsetY}px) scale(${zoomPan.scale})`,
              transformOrigin: 'center center',
              width: imageWidth,
              height: imageHeight,
            }}
            className="relative"
          >
            <EditorCanvas />
            <BrushCanvas />
          </div>
          <ProcessingOverlay />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <ZoomControls />
          </div>
        </div>
        <ToolPanel />
      </div>
    </div>
  );
}
