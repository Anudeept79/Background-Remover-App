import { removeBackground } from '@imgly/background-removal';

export const processImage = async (imageSrc) => {
  try {
    // using default config (CDN) ensures high reliability without managing local asset integrity
    const blob = await removeBackground(imageSrc, {
      progress: (key, current, total) => {
        // console.log(`Downloading ${key}: ${current} of ${total}`);
      },
      debug: false
    });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Background removal failed:', error);
    // Fallback or detailed error handling could go here
    throw error;
  }
};
