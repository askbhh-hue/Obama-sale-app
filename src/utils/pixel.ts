import { FB_PIXEL_ID } from '../config/siteConfig';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initialized = false;

export function isPixelConfigured(pixelId = FB_PIXEL_ID): boolean {
  return Boolean(pixelId && pixelId !== 'YOUR_FB_PIXEL_ID' && /^[0-9]{8,20}$/.test(pixelId));
}

export function initFacebookPixel(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  if (!isPixelConfigured()) {
    // Provide a safe no-op queue when placeholder ID is still active
    if (!window.fbq) {
      window.fbq = () => {};
    }
    return;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const n: any = function (...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod(...args);
    } else {
      n.queue.push(args);
    }
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (!window.fbq) {
    window.fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  window.fbq?.('init', FB_PIXEL_ID);
}

export type PixelEventName = 'PageView' | 'ViewContent' | 'Lead' | 'Contact';

export function trackPixelEvent(
  eventName: PixelEventName,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    }
  } catch {
    // Never let tracking block conversion flows
  }
}
