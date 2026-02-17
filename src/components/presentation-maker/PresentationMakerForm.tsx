'use client';

import { usePresentationMaker } from '@/hooks/usePresentationMaker';
import StyleSelector from './StyleSelector';
import SlideCountSelector from './SlideCountSelector';
import SlidePreview from './SlidePreview';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { MAX_PRESENTATION_TOPIC_LENGTH } from '@/lib/constants';
import { generatePPTX, generatePDF } from '@/lib/presentationUtils';

export default function PresentationMakerForm() {
  const {
    topic,
    slideCount,
    style,
    isGenerating,
    presentation,
    setTopic,
    setSlideCount,
    setStyle,
    generate,
    reset,
  } = usePresentationMaker();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate();
  };

  const handleDownloadPPTX = async () => {
    if (presentation) {
      await generatePPTX(presentation, style);
    }
  };

  const handleDownloadPDF = async () => {
    if (presentation) {
      await generatePDF(presentation, style);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {!presentation && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Topic Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="presentation-topic" className="text-sm font-medium">
              Presentation Topic
            </label>
            <textarea
              id="presentation-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Renewable Energy, Introduction to Machine Learning, Q4 Sales Report..."
              rows={3}
              maxLength={MAX_PRESENTATION_TOPIC_LENGTH}
              className="w-full px-4 py-3 text-base border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating}
            />
            <div className="flex justify-between text-xs text-muted">
              <span>Describe your presentation topic in detail</span>
              <span>{topic.length}/{MAX_PRESENTATION_TOPIC_LENGTH}</span>
            </div>
          </div>

          {/* Style Selector */}
          <StyleSelector value={style} onChange={setStyle} />

          {/* Slide Count */}
          <SlideCountSelector value={slideCount} onChange={setSlideCount} />

          {/* Generate Button */}
          <Button
            type="submit"
            size="lg"
            loading={isGenerating}
            disabled={!topic.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Presentation'}
          </Button>
        </form>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Spinner size="lg" />
          <p className="text-muted text-sm">
            Creating your presentation... This may take 15-30 seconds.
          </p>
        </div>
      )}

      {/* Results */}
      {presentation && (
        <div className="flex flex-col gap-6">
          <SlidePreview presentation={presentation} style={style} />

          <div className="flex gap-3">
            <Button onClick={handleDownloadPPTX} className="flex-1">
              Download PPTX
            </Button>
            <Button onClick={handleDownloadPDF} variant="secondary" className="flex-1">
              Download PDF
            </Button>
          </div>

          <button
            onClick={reset}
            className="text-sm text-muted hover:text-foreground transition-colors text-center"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
