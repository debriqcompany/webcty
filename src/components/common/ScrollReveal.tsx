import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  className?: string;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  threshold = 0.1,
  once = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getVariantClass = () => {
    switch (variant) {
      case 'fade-in':
        return 'reveal-fade-in';
      case 'slide-left':
        return 'reveal-slide-left';
      case 'slide-right':
        return 'reveal-slide-right';
      case 'fade-up':
      default:
        return 'reveal-fade-up';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
      className={`${getVariantClass()} ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
