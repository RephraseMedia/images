export interface ApiResponse {
  image: string; // base64
}

export interface ApiError {
  error: string;
  code?: string;
}

export interface EnhanceRequest {
  image: string; // base64
  faceEnhance?: boolean;
}

export interface RemoveBackgroundRequest {
  image: string; // base64
}

export interface ReplaceBackgroundRequest {
  image: string; // base64
  mode: 'prompt' | 'color' | 'upload';
  prompt?: string;
  color?: string;
  backgroundImage?: string; // base64
}

export interface GenerativeFillRequest {
  image: string; // base64
  mask: string; // base64 PNG mask
  prompt: string;
}

export interface RemoveObjectRequest {
  image: string; // base64
  mask: string; // base64 PNG mask
}
