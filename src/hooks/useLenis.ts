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

    // Every in-page navigation uses the same controller as the wheel.
    // Native smooth scroll would otherwise compete with Lenis's RAF updates.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const id = anchor.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { immediate: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    };
    document.addEventListener('click', onAnchorClick);

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
      document.removeEventListener('click', onAnchorClick);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
