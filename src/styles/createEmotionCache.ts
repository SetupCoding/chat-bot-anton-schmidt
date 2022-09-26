import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';
import { isBrowser } from '../utils';

export const createEmotionCache = (): EmotionCache => {
  let insertionPoint: HTMLElement | undefined;

  if (isBrowser) {
    const emotionInsertionPoint: HTMLElement | null = document.querySelector(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }
  return createCache({ key: 'mui-style', insertionPoint });
};
