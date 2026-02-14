import Replicate from 'replicate';
import { ReplicateError } from './errors';

let replicateClient: Replicate | null = null;

function getClient(): Replicate {
  if (!replicateClient) {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new ReplicateError('REPLICATE_API_TOKEN is not configured');
    }
    replicateClient = new Replicate({ auth: token });
  }
  return replicateClient;
}

export const MODELS = {
  enhance: 'nightmareai/real-esrgan' as const,
  removeBackground: 'cjwbw/rembg' as const,
  inpainting: 'lucataco/sdxl-inpainting' as const,
  generate: 'stability-ai/sdxl' as const,
};

export async function runModel(
  model: string,
  input: Record<string, unknown>
): Promise<string> {
  try {
    const client = getClient();
    const output = await client.run(model as `${string}/${string}`, { input });

    // Replicate returns different formats depending on the model
    let resultUrl: string;

    if (typeof output === 'string') {
      resultUrl = output;
    } else if (Array.isArray(output) && typeof output[0] === 'string') {
      resultUrl = output[0];
    } else if (output && typeof output === 'object' && 'output' in output) {
      resultUrl = (output as { output: string }).output;
    } else {
      throw new ReplicateError('Unexpected output format from Replicate');
    }

    return resultUrl;
  } catch (error) {
    if (error instanceof ReplicateError) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Replicate error';
    throw new ReplicateError(message);
  }
}

export async function enhance(imageUrl: string, faceEnhance: boolean = false) {
  return runModel(MODELS.enhance, {
    image: imageUrl,
    scale: 2,
    face_enhance: faceEnhance,
  });
}

export async function removeBackground(imageUrl: string) {
  return runModel(MODELS.removeBackground, {
    image: imageUrl,
  });
}

export async function generateImage(
  prompt: string,
  negativePrompt: string,
  width: number,
  height: number,
  numOutputs: number = 1
): Promise<string[]> {
  try {
    const client = getClient();
    const output = await client.run(MODELS.generate as `${string}/${string}`, {
      input: {
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        num_outputs: numOutputs,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        scheduler: 'K_EULER',
      },
    });

    if (Array.isArray(output)) {
      return output.filter((item): item is string => typeof item === 'string');
    }
    if (typeof output === 'string') {
      return [output];
    }
    throw new ReplicateError('Unexpected output format from Replicate');
  } catch (error) {
    if (error instanceof ReplicateError) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Replicate error';
    throw new ReplicateError(message);
  }
}

export async function inpaint(
  imageUrl: string,
  maskUrl: string,
  prompt: string,
  negativePrompt: string = 'blurry, low quality, distorted'
) {
  return runModel(MODELS.inpainting, {
    image: imageUrl,
    mask: maskUrl,
    prompt,
    negative_prompt: negativePrompt,
    num_inference_steps: 25,
    guidance_scale: 7.5,
    strength: 0.99,
  });
}
