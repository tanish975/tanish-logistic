import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function MovingTruckLoader({
  text = 'Moving Your Freight Across India...',
  subtext = 'Fast • Dependable • 24/7 Road Transit',
  size = 'md',
  fullScreen = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  const containerSizes = {
    sm: 'scale-75',
    md: 'scale-100',
    lg: 'scale-125',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className={`relative w-[340px] h-[140px] ${containerSizes[size] || 'scale-100'}`}>
        <svg
          viewBox="0 0 340 130"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="truckBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B2545" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </linearGradient>

            <linearGradient id="cabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="windshieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="lightBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#FDE047" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0" />
              <stop offset="15%" stopColor="#1E293B" />
              <stop offset="85%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Road Surface */}
          <rect x="10" y="94" width="320" height="8" rx="4" fill="url(#roadGrad)" />

          {/* Animated Highway Dashes */}
          {!shouldReduceMotion ? (
            <motion.line
              x1="20"
              y1="98"
              x2="320"
              y2="98"
              stroke="#F8FAFC"
              strokeWidth="2.5"
              strokeDasharray="16 14"
              strokeLinecap="round"
              animate={{ strokeDashoffset: [0, 60] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <line
              x1="20"
              y1="98"
              x2="320"
              y2="98"
              stroke="#F8FAFC"
              strokeWidth="2.5"
              strokeDasharray="16 14"
              strokeLinecap="round"
            />
          )}

          {/* Road Tire Shadow */}
          <ellipse cx="140" cy="95" rx="72" ry="4" fill="#020617" opacity="0.45" />

          {/* Headlight Beam Cone */}
          <polygon
            points="218,74 330,60 330,95 218,80"
            fill="url(#lightBeamGrad)"
          />

          {/* Speed Wind Lines Behind Truck */}
          {!shouldReduceMotion && (
            <g>
              <motion.line
                x1="45"
                y1="50"
                x2="15"
                y2="50"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ x: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.line
                x1="52"
                y1="64"
                x2="25"
                y2="64"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ x: [0, -22, 0], opacity: [0.1, 0.7, 0.1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}
              />
              <motion.line
                x1="40"
                y1="76"
                x2="10"
                y2="76"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ x: [0, -16, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 0.55, repeat: Infinity, delay: 0.08, ease: 'easeInOut' }}
              />
            </g>
          )}

          {/* The Truck Body (with suspension vibration bounce) */}
          <motion.g
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -1.8, 0, 1.2, 0],
                  }
            }
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Trailer Body */}
            <rect
              x="55"
              y="32"
              width="106"
              height="50"
              rx="4"
              fill="url(#truckBodyGrad)"
              stroke="#075985"
              strokeWidth="1.5"
            />

            {/* Trailer Corrugated Texture Ribs */}
            <line x1="72" y1="34" x2="72" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            <line x1="88" y1="34" x2="88" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            <line x1="104" y1="34" x2="104" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            <line x1="120" y1="34" x2="120" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            <line x1="136" y1="34" x2="136" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            <line x1="150" y1="34" x2="150" y2="80" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />

            {/* Trailer Lower Aero Stripe */}
            <rect x="55" y="74" width="106" height="8" fill="#0284C7" />
            <line x1="55" y1="74" x2="161" y2="74" stroke="#38BDF8" strokeWidth="1" />

            {/* Trailer Brand Logo / Wordmark */}
            <text
              x="108"
              y="56"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="900"
              letterSpacing="1.2"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              TANISH
            </text>
            <text
              x="108"
              y="67"
              fill="#BAE6FD"
              fontSize="6"
              fontWeight="700"
              letterSpacing="1.5"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              LOGISTIC
            </text>

            {/* Hitch Connector Between Trailer & Cab */}
            <rect x="159" y="68" width="8" height="12" fill="#334155" rx="1" />

            {/* Cab Section */}
            {/* Cab Main Body */}
            <path
              d="M165 48 C165 48 185 45 195 50 L216 66 C218 68 220 72 220 76 L220 82 L165 82 Z"
              fill="url(#cabGrad)"
              stroke="#0369A1"
              strokeWidth="1.2"
            />

            {/* Cab Roof Deflector */}
            <path
              d="M164 48 C164 48 178 38 194 40 L195 48 Z"
              fill="#082F49"
            />

            {/* Windshield */}
            <polygon
              points="184,50 195,50 212,65 184,65"
              fill="url(#windshieldGrad)"
              stroke="#0284C7"
              strokeWidth="0.8"
            />
            {/* Windshield Sun Glare Streak */}
            <line x1="190" y1="52" x2="198" y2="63" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

            {/* Cab Side Window */}
            <rect x="169" y="52" width="12" height="12" rx="2" fill="#0C4A6E" />

            {/* Side Mirror */}
            <rect x="180" y="55" width="2" height="7" rx="1" fill="#020617" />

            {/* Front Headlight Lamp */}
            <rect x="216" y="73" width="4" height="6" rx="1" fill="#FEF08A" />

            {/* Front Bumper */}
            <rect x="214" y="79" width="7" height="4" rx="1" fill="#0F172A" />

            {/* Chassis Under-rail */}
            <rect x="68" y="81" width="138" height="3" fill="#1E293B" />
          </motion.g>

          {/* Rotating Wheels (Plotted with relative translation centers) */}
          {/* Wheel 1: Trailer Rear Back */}
          <g transform="translate(74, 86)">
            <motion.g
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5.5" fill="#94A3B8" />
              <circle cx="0" cy="0" r="2.5" fill="#0F172A" />
              {/* Wheel Spokes for visible rotation */}
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="1" />
            </motion.g>
          </g>

          {/* Wheel 2: Trailer Rear Tandem */}
          <g transform="translate(98, 86)">
            <motion.g
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5.5" fill="#94A3B8" />
              <circle cx="0" cy="0" r="2.5" fill="#0F172A" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="1" />
            </motion.g>
          </g>

          {/* Wheel 3: Cab Front Steer */}
          <g transform="translate(196, 86)">
            <motion.g
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="0" cy="0" r="9" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5.5" fill="#94A3B8" />
              <circle cx="0" cy="0" r="2.5" fill="#0F172A" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="1" />
            </motion.g>
          </g>
        </svg>
      </div>

      {/* Loading Text & Active Highway Bar */}
      <div className="mt-4 flex flex-col items-center">
        <p className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
          {text}
        </p>
        {subtext && (
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {subtext}
          </p>
        )}

        {/* Animated Highway Progress Bar */}
        <div className="mt-4 h-1.5 w-44 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <motion.div
      role="status"
      aria-label="Loading page"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/15 sm:p-8">
        {content}
      </div>
    </motion.div>
  );
}

export default MovingTruckLoader;
