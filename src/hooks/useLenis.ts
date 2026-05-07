import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger on every frame
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker instead of raw requestAnimationFrame for unified timing
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker provides time in seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);

    // Disable GSAP's default lag smoothing to avoid fighting Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
