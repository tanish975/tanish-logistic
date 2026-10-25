'use client';

import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect, useCallback } from 'react';

// ============================================
// REUSABLE ANIMATION VARIANTS
// ============================================

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Text reveal variants
export const textReveal = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const textRevealStagger = {
  hidden: { opacity: 0, y: '100%' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.03 },
  }),
};

// ============================================
// REUSABLE ANIMATED COMPONENTS
// ============================================

export function RevealText({ children, className = '', delay = 0, as: Component = 'span', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  if (shouldReduceMotion) {
    return <Component ref={ref} className={className} {...props}>{children}</Component>;
  }

  return (
    <Component ref={ref} className={className} {...props}>
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%', rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: '100%', rotateX: -90 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: delay + i * 0.02 }}
          style={{ display: 'inline-block', transformOrigin: 'center bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Component>
  );
}

export function StaggeredList({ children, className = '', delay = 0, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.ul
      ref={useRef}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          key: child.key || i,
          variants: staggerItem,
          style: { ...child.props.style, transitionDelay: `${delay + i * 100}ms` },
        })
      )}
    </motion.ul>
  );
}

export function FloatingElement({ children, amplitude = 10, duration = 3, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxLayer({ children, speed = 0.3, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, window.innerHeight * 2], [0, speed * 100]);

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={{ y }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealOnScroll({ children, variant = fadeInUp, className = '', once = true, margin = '-100px', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  if (shouldReduceMotion) {
    return <div ref={ref} className={className} {...props}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={{ hidden: variant.hidden, visible: variant.visible }}
      initial={false}
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
      viewport={{ once, margin }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Skeleton({ className = '', lines = 3, ...props }) {
  return (
    <div className={className} {...props}>
      {[...Array(lines)].map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-slate-200 rounded animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%', marginBottom: '0.5rem' }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function ButtonLoader({ isLoading, children, className = '', ...props }) {
  return (
    <button
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <motion.svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </motion.svg>
      ) : null}
      {children}
    </button>
  );
}

export function InputFocus({ children, className = '', ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`} {...props}>
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-sky-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  );
}

export function MagneticButton({ children, className = '', strength = 0.3, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  }, [shouldReduceMotion, strength]);

  const handleMouseLeave = useCallback(() => {
    setPos({ x: 0, y: 0 });
  }, []);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function TabTransition({ children, className = '', ...props }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={props.activeKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function ModalTransition({ children, isOpen, onClose, className = '', ...props }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Tooltip({ children, content, position = 'top', className = '', ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`} {...props} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : 'left-full ml-2'} z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded shadow-lg whitespace-nowrap`}
            style={{ transformOrigin: position === 'top' ? 'bottom center' : 'top center' }}
          >
            {content}
            <motion.div
              className={`absolute ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2' : 'bottom-full left-1/2 -translate-x-1/2'} w-2 h-2 bg-slate-900 rotate-45`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

import { MovingTruckLoader } from './MovingTruckLoader';
import { LogoLoader } from './LogoLoader';

export { MovingTruckLoader, MovingTruckLoader as TruckLoader, LogoLoader };

export function PageLoader() {
  return (
    <LogoLoader
      fullScreen={true}
      text="Tanish Logistic"
      subtext="Connecting Indian Freight Corridors..."
    />
  );
}

export default {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
  textReveal,
  textRevealStagger,
  RevealText,
  StaggeredList,
  FloatingElement,
  ParallaxLayer,
  RevealOnScroll,
  Skeleton,
  ButtonLoader,
  InputFocus,
  MagneticButton,
  TabTransition,
  ModalTransition,
  Tooltip,
  PageLoader,
  MovingTruckLoader,
  LogoLoader,
};