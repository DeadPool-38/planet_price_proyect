import React from 'react';

const Logo = ({ size = 'medium', showText = true, className = '', inverted = false }) => {
  const sizes = {
    small: { width: '55px', fontSize: '1rem' },
    medium: { width: '75px', fontSize: '1.5rem' },
    large: { width: '150px', fontSize: '2rem' },
  };

  const currentSize = sizes[size] || sizes.medium;
  
  // Rich golden color scheme with 3D HDR effect
  const colors = inverted ? {
    // For dark backgrounds
    planetCore: '#FFD700',        // Bright gold core
    planetMid: '#F4C430',         // Saffron gold
    planetBase: '#D4AF37',        // Rich gold
    planetShadow: '#B8860B',      // Dark goldenrod
    planetDeep: '#8B6914',        // Deep gold shadow
    ring: '#1a1a1a',              // Black ring
    ringGlow: '#D4AF37',          // Golden ring glow
    stars: '#FFD700',             // Bright gold stars
    orbs: '#F4C430',              // Golden orbs
    textPlanet: '#ffffff',        // White text
    textPrice: '#FFD700'          // Bright gold text
  } : {
    // For light backgrounds
    planetCore: '#FFD700',        // Bright gold core
    planetMid: '#F4C430',         // Saffron gold
    planetBase: '#D4AF37',        // Rich gold
    planetShadow: '#B8860B',      // Dark goldenrod
    planetDeep: '#8B6914',        // Deep gold shadow
    ring: '#1a1a1a',              // Black ring
    ringGlow: '#D4AF37',          // Golden ring glow
    stars: '#FFD700',             // Bright gold stars
    orbs: '#F4C430',              // Golden orbs
    textPlanet: '#1a1a1a',        // Black text
    textPrice: '#D4AF37'          // Rich gold text
  };

  return (
    <div className={`logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* SVG Logo - 3D Golden Planet with HDR and Rotation */}
      <svg 
        width={currentSize.width} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.4))' }}
      >
        {/* Definitions */}
        <defs>
          {/* 3D HDR Radial gradient for planet - multiple layers */}
          <radialGradient id={`planetGrad3D-${inverted ? 'inv' : 'norm'}`} cx="35%" cy="35%">
            <stop offset="0%" stopColor={colors.planetCore} stopOpacity="1" />
            <stop offset="25%" stopColor={colors.planetMid} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.planetBase} stopOpacity="1" />
            <stop offset="75%" stopColor={colors.planetShadow} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.planetDeep} stopOpacity="1" />
          </radialGradient>

          {/* Highlight gradient for HDR effect */}
          <radialGradient id={`highlightGrad-${inverted ? 'inv' : 'norm'}`}>
            <stop offset="0%" stopColor="#FFFACD" stopOpacity="0.9" />
            <stop offset="40%" stopColor={colors.planetCore} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.planetMid} stopOpacity="0" />
          </radialGradient>

          {/* Shadow gradient for depth */}
          <radialGradient id={`shadowGrad-${inverted ? 'inv' : 'norm'}`} cx="70%" cy="70%">
            <stop offset="0%" stopColor={colors.planetShadow} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.planetDeep} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6B5610" stopOpacity="0.8" />
          </radialGradient>

          {/* Gradient for matte black ring with golden glow */}
          <linearGradient id={`ringGrad-${inverted ? 'inv' : 'norm'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.ring} stopOpacity="0.95" />
            <stop offset="30%" stopColor="#2C2C2C" stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.ringGlow} stopOpacity="0.3" />
            <stop offset="70%" stopColor="#2C2C2C" stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.ring} stopOpacity="0.95" />
          </linearGradient>

          {/* Glow filter for HDR effect */}
          <filter id={`hdrGlow-${inverted ? 'inv' : 'norm'}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Decorative orbs - left side with golden glow */}
        <circle cx="40" cy="80" r="6" fill={colors.orbs} opacity="0.8" filter={`url(#hdrGlow-${inverted ? 'inv' : 'norm'})`}>
          <animate attributeName="cy" values="80;75;80" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="55" cy="100" r="4" fill={colors.orbs} opacity="0.6" filter={`url(#hdrGlow-${inverted ? 'inv' : 'norm'})`}>
          <animate attributeName="cy" values="100;95;100" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Back part of ring (behind planet) - matte black with golden accent */}
        <ellipse 
          cx="100" 
          cy="100" 
          rx="90" 
          ry="22" 
          fill="none" 
          stroke={`url(#ringGrad-${inverted ? 'inv' : 'norm'})`}
          strokeWidth="9" 
          opacity="0.95"
          transform="rotate(-25 100 100)"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))' }}
        />

        {/* Rotating planet group - 3D effect with rotation */}
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="20s"
            repeatCount="indefinite"
          />

          {/* Main 3D golden planet sphere with HDR */}
          <circle 
            cx="100" 
            cy="100" 
            r="50" 
            fill={`url(#planetGrad3D-${inverted ? 'inv' : 'norm'})`}
            filter={`url(#hdrGlow-${inverted ? 'inv' : 'norm'})`}
          />

          {/* HDR Highlight on planet - bright spot */}
          <ellipse 
            cx="80" 
            cy="80" 
            rx="22" 
            ry="20" 
            fill={`url(#highlightGrad-${inverted ? 'inv' : 'norm'})`}
            opacity="0.85"
          />

          {/* Secondary highlight for extra depth */}
          <ellipse 
            cx="75" 
            cy="75" 
            rx="12" 
            ry="10" 
            fill="#FFFACD"
            opacity="0.6"
          >
            <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* Shadow layer for 3D depth */}
          <ellipse 
            cx="120" 
            cy="120" 
            rx="30" 
            ry="28" 
            fill={`url(#shadowGrad-${inverted ? 'inv' : 'norm'})`}
            opacity="0.7"
          />

          {/* Rotating light bands for dynamic effect */}
          <ellipse 
            cx="100" 
            cy="100" 
            rx="45" 
            ry="8" 
            fill="none"
            stroke={colors.planetCore}
            strokeWidth="1"
            opacity="0.3"
            transform="rotate(30 100 100)"
          >
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
          </ellipse>
          
          <ellipse 
            cx="100" 
            cy="100" 
            rx="45" 
            ry="8" 
            fill="none"
            stroke={colors.planetCore}
            strokeWidth="1"
            opacity="0.2"
            transform="rotate(-30 100 100)"
          >
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Front part of ring (in front of planet) - matte black with golden glow */}
        <ellipse 
          cx="100" 
          cy="100" 
          rx="90" 
          ry="22" 
          fill="none" 
          stroke={`url(#ringGrad-${inverted ? 'inv' : 'norm'})`}
          strokeWidth="9" 
          opacity="0.98"
          transform="rotate(-25 100 100)"
          clipPath="inset(50% 0 0 0)"
          style={{ filter: 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.6))' }}
        />

        {/* Golden accent line on ring */}
        <ellipse 
          cx="100" 
          cy="100" 
          rx="90" 
          ry="22" 
          fill="none" 
          stroke={colors.ringGlow}
          strokeWidth="1.5" 
          opacity="0.5"
          transform="rotate(-25 100 100)"
          clipPath="inset(50% 0 0 0)"
        />

        {/* Decorative orbs - right side with golden glow */}
        <circle cx="145" cy="90" r="5" fill={colors.orbs} opacity="0.7" filter={`url(#hdrGlow-${inverted ? 'inv' : 'norm'})`}>
          <animate attributeName="cy" values="90;85;90" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="110" r="7" fill={colors.orbs} opacity="0.8" filter={`url(#hdrGlow-${inverted ? 'inv' : 'norm'})`}>
          <animate attributeName="cy" values="110;105;110" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2.8s" repeatCount="indefinite" />
        </circle>

        {/* Star sparkles - top right */}
        <g opacity="0.9">
          {/* Large star */}
          <g transform="translate(155, 50)">
            <line x1="-6" y1="0" x2="6" y2="0" stroke={colors.stars} strokeWidth="2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="-6" x2="0" y2="6" stroke={colors.stars} strokeWidth="2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="-4" y1="-4" x2="4" y2="4" stroke={colors.stars} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1="4" y1="-4" x2="-4" y2="4" stroke={colors.stars} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </line>
          </g>

          {/* Medium star */}
          <g transform="translate(170, 70)">
            <line x1="-4" y1="0" x2="4" y2="0" stroke={colors.stars} strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            </line>
            <line x1="0" y1="-4" x2="0" y2="4" stroke={colors.stars} strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            </line>
          </g>

          {/* Small star */}
          <g transform="translate(145, 65)">
            <line x1="-3" y1="0" x2="3" y2="0" stroke={colors.stars} strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
            </line>
            <line x1="0" y1="-3" x2="0" y2="3" stroke={colors.stars} strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
            </line>
          </g>
        </g>

        {/* Star sparkles - bottom left */}
        <g opacity="0.8">
          {/* Small star bottom */}
          <g transform="translate(60, 150)">
            <line x1="-3" y1="0" x2="3" y2="0" stroke={colors.stars} strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite" begin="0.3s" />
            </line>
            <line x1="0" y1="-3" x2="0" y2="3" stroke={colors.stars} strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite" begin="0.3s" />
            </line>
          </g>

          {/* Tiny star */}
          <g transform="translate(75, 160)">
            <line x1="-2" y1="0" x2="2" y2="0" stroke={colors.stars} strokeWidth="1" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite" begin="1.2s" />
            </line>
            <line x1="0" y1="-2" x2="0" y2="2" stroke={colors.stars} strokeWidth="1" strokeLinecap="round">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite" begin="1.2s" />
            </line>
          </g>
        </g>
      </svg>

      {showText && (
        <div style={{ 
          fontFamily: "'Montserrat', 'Inter', sans-serif", 
          fontSize: currentSize.fontSize,
          fontWeight: '800',
          letterSpacing: '-0.02em',
          lineHeight: '1'
        }}>
          <span style={{ 
            color: colors.textPlanet,
            fontWeight: '800'
          }}>Planet</span>{' '}
          <span style={{ 
            color: colors.textPrice,
            fontWeight: '700'
          }}>Price</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
