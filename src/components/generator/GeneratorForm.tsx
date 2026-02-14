'use client';

import { useImageGenerator } from '@/hooks/useImageGenerator';
import StyleSelector from './StyleSelector';
import AspectRatioSelector from './AspectRatioSelector';
import ImageResults from './ImageResults';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { MAX_GENERATE_PROMPT_LENGTH } from '@/lib/constants';
import { MAX_GENERATED_IMAGES } from '@/types/generator';

export default function GeneratorForm() {
  const {
    prompt,
    style,
    aspectRatio,
    numberOfImages,
    isGenerating,
    generatedImages,
    setPrompt,
    setStyle,
    setAspectRatio,
    setNumberOfImages,
    generate,
  } = useImageGenerator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate();
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Prompt Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="generate-prompt" className="text-sm font-medium">
            Describe your image
          </label>
          <textarea
            id="generate-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A serene mountain landscape at sunset with golden light reflecting off a crystal-clear lake..."
            rows={4}
            maxLength={MAX_GENERATE_PROMPT_LENGTH}
            className="w-full px-4 py-3 text-base border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isGenerating}
          />
          <div className="flex justify-between text-xs text-muted">
            <span>Be descriptive for better results</span>
            <span>{prompt.length}/{MAX_GENERATE_PROMPT_LENGTH}</span>
          </div>
        </div>

        {/* Style Selector */}
        <StyleSelector value={style} onChange={setStyle} />

        {/* Aspect Ratio */}
        <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />

        {/* Number of Images */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Number of Images</label>
          <div className="flex gap-2">
            {Array.from({ length: MAX_GENERATED_IMAGES }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNumberOfImages(num)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  numberOfImages === num
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/30 text-foreground'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          size="lg"
          loading={isGenerating}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>
      </form>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Spinner size="lg" />
          <p className="text-muted text-sm">
            Creating your {numberOfImages > 1 ? 'images' : 'image'}... This may take 10-30 seconds.
          </p>
        </div>
      )}

      {/* Results */}
      <ImageResults images={generatedImages} />
    </div>
  );
}
