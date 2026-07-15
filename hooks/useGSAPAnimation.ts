'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Common GSAP animation presets for scroll-triggered reveals */
export const animationPresets = {
  fadeInUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  },
  fadeInLeft: {
    from: { opacity: 0, x: -40 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
  },
  fadeInRight: {
    from: { opacity: 0, x: 40 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.6, ease: 'power2.out' },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
  },
} as const;

/** Default ScrollTrigger config */
export const defaultScrollTrigger = (trigger: Element | string) => ({
  trigger,
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none none' as const,
});
