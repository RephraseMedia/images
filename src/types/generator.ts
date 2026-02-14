export type ImageStyle =
  | 'photorealistic'
  | 'digital-art'
  | 'oil-painting'
  | 'watercolor'
  | 'anime'
  | '3d-render'
  | 'pixel-art'
  | 'sketch'
  | 'pop-art'
  | 'none';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface StyleOption {
  id: ImageStyle;
  label: string;
  promptSuffix: string;
}

export interface AspectRatioOption {
  id: AspectRatio;
  label: string;
  width: number;
  height: number;
}

export interface GeneratorState {
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  numberOfImages: number;
  isGenerating: boolean;
  generatedImages: string[]; // base64 data URIs
  error: string | null;
}

export const STYLE_OPTIONS: StyleOption[] = [
  { id: 'none', label: 'None', promptSuffix: '' },
  { id: 'photorealistic', label: 'Photorealistic', promptSuffix: ', photorealistic, ultra detailed, 8k, DSLR photo' },
  { id: 'digital-art', label: 'Digital Art', promptSuffix: ', digital art, trending on artstation, highly detailed' },
  { id: 'oil-painting', label: 'Oil Painting', promptSuffix: ', oil painting, classical art style, textured brushstrokes' },
  { id: 'watercolor', label: 'Watercolor', promptSuffix: ', watercolor painting, soft colors, delicate strokes' },
  { id: 'anime', label: 'Anime', promptSuffix: ', anime style, vibrant colors, manga illustration' },
  { id: '3d-render', label: '3D Render', promptSuffix: ', 3d render, octane render, cinema 4d, blender, highly detailed' },
  { id: 'pixel-art', label: 'Pixel Art', promptSuffix: ', pixel art, 16-bit, retro game style' },
  { id: 'sketch', label: 'Sketch', promptSuffix: ', pencil sketch, hand drawn, detailed linework' },
  { id: 'pop-art', label: 'Pop Art', promptSuffix: ', pop art style, bold colors, comic book, Roy Lichtenstein inspired' },
];

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { id: '1:1', label: '1:1', width: 1024, height: 1024 },
  { id: '16:9', label: '16:9', width: 1344, height: 768 },
  { id: '9:16', label: '9:16', width: 768, height: 1344 },
  { id: '4:3', label: '4:3', width: 1152, height: 896 },
  { id: '3:4', label: '3:4', width: 896, height: 1152 },
];

export const MAX_GENERATED_IMAGES = 4;
export const MIN_GENERATED_IMAGES = 1;
