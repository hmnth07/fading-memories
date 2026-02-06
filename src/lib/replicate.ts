import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Flux Schnell - fast model
export const MODEL_ID = "black-forest-labs/flux-schnell" as const;

export const DEFAULT_PARAMS = {
  num_outputs: 1,
  aspect_ratio: "1:1",
  output_format: "webp",
  output_quality: 90,
} as const;
