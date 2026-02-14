export interface RealEsrganInput {
  image: string;
  scale?: number;
  face_enhance?: boolean;
}

export interface RembgInput {
  image: string;
}

export interface SdxlInpaintingInput {
  image: string;
  mask: string;
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number;
  guidance_scale?: number;
  strength?: number;
  seed?: number;
}

export type ReplicateOutput = string | string[] | { output: string };
