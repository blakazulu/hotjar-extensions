# TrackStop UI/UX Design Plan
**Version:** 1.0
**Date:** 2025-01-09
**Status:** Design Specification Phase

---

## Table of Contents

1. [Research Findings](#research-findings)
2. [Design System](#design-system)
3. [Website Redesign](#website-redesign)
4. [Browser Extension Popup Redesign](#browser-extension-popup-redesign)
5. [On-Page Notification Redesign](#on-page-notification-redesign)
6. [Implementation Plan](#implementation-plan)
7. [Component Library](#component-library)
8. [Technical Specifications](#technical-specifications)

---

## Research Findings

### 1. 2025 UI/UX Trends Analysis

#### Privacy & Security Design Trends

**Key Findings:**
- **Privacy-centric design** is a major UI trend in 2025, with users demanding transparency, consent-based data collection, and ethical design
- **Dark mode** and adaptive interfaces are standard, with automatic adjustment based on environmental conditions
- **Biometric authentication** and secure login options are becoming expected features
- **Transparent design** requires clear communication about AI decisions and data usage
- **Ethical UI** means eliminating dark patterns and providing clear explanations

**Application to TrackStop:**
- Implement dark mode as default with light mode option
- Clear, transparent communication about what's being blocked and why
- No deceptive UI patterns - straightforward controls
- Real-time visibility into protection status

#### Modern Aesthetic Trends

**Glassmorphism** (2025's Dominant Trend):
- Frosted-glass effects with `backdrop-filter: blur()`
- Transparent layers with shadow effects
- Layered translucency for futuristic feel
- Perfect for privacy/security tools (Umbrel case study)
- Works exceptionally well with dark backgrounds

**Neumorphism** (Selective Use):
- Soft UI with subtle shadows and highlights
- 3D-like tactile experience
- Limited contrast (use sparingly for accessibility)
- Best for buttons and toggle elements

**Hybrid Approach** (Recommended for TrackStop):
- Glassmorphic card backgrounds for depth
- Neumorphic buttons and toggles for tactile feedback
- Combines innovation with familiarity

**Animation Philosophy:**
- **Micro-interactions**: 150-300ms duration for responsiveness
- **GPU acceleration**: Use `transform` and `opacity` only
- **Subtle feedback**: Smooth, barely noticeable yet significant
- **Accessibility**: Respect `prefers-reduced-motion`
- **Easing functions**: `ease-out` for natural deceleration

#### Competitor Analysis

**uBlock Origin:**
- ✅ Highly configurable, technical focus
- ❌ Bare-bones UI, intimidating for non-technical users
- ❌ Complex filter list management
- **Lesson:** TrackStop should be simpler, more approachable

**Privacy Badger:**
- ✅ Clean format, minimal distractions
- ✅ Green/yellow/red traffic light system (intuitive)
- ✅ "Set and forget" philosophy
- ❌ Less granular control for power users
- **Lesson:** Adopt traffic light metaphor, add advanced options

**Ghostery:**
- ✅ User-friendly interface with helpful tooltips
- ✅ Good balance of simplicity and customization
- ✅ Checkbox system for easy activation
- ❌ Corporate ownership (vs TrackStop's community-driven)
- **Lesson:** Use tooltips, maintain open-source identity

**Umbrel (Privacy Tool Website Example):**
- ✅ Dark aesthetic with neon purple accents
- ✅ Blurred-glass effect for immersive feel
- ✅ Typography-driven impact with gradient effects
- ✅ High-contrast minimalism
- **Lesson:** Apply glassmorphism, dark theme, strong typography

### 2. Color Psychology for "Stop" Theme

**Research Findings:**
- Red triggers immediate attention, urgency, and action
- Orange conveys warning but less aggressive than red
- Red-orange combinations balance urgency with approachability
- Dark backgrounds enhance red/orange vibrancy
- Gradients soften harsh "stop" connotations

**Selected Approach:**
- Primary: Red-orange gradient (energetic but not alarming)
- Accent: Deep red for blocked counters (urgency)
- Background: Dark theme with subtle texture
- Success: Green for "Protected" status
- Warning: Yellow-orange for partial protection

---

## Design System

### 1. Color Palette

#### Primary Colors (Stop Sign Theme)

```css
/* Primary Gradient - Red to Orange (Brand Identity) */
--primary-gradient: linear-gradient(135deg, #CF142B 0%, #FF5A09 100%);
--primary-red: #CF142B;        /* Stop Sign Red */
--primary-orange: #FF5A09;     /* Deep Orange */

/* Accent Colors */
--accent-red: #E63946;         /* Bright Red - for counters */
--accent-orange: #FF8C42;      /* Coral Orange - for hover states */
--accent-yellow: #FFB800;      /* Warning Yellow */

/* Track/Road Metaphor Colors */
--track-dark: #1A1A1A;         /* Asphalt Dark */
--track-line: #FFD60A;         /* Road Line Yellow */
--track-gray: #6C757D;         /* Road Gray */
```

#### Background Colors (Dark Mode Default)

```css
/* Dark Mode (Primary) */
--bg-primary: #0D1117;         /* GitHub Dark - main background */
--bg-secondary: #161B22;       /* GitHub Dark - elevated surfaces */
--bg-tertiary: #21262D;        /* GitHub Dark - cards */
--bg-glass: rgba(255, 255, 255, 0.05);  /* Glassmorphic overlay */
--bg-glass-hover: rgba(255, 255, 255, 0.08);

/* Light Mode (Optional) */
--bg-light-primary: #FFFFFF;
--bg-light-secondary: #F6F8FA;
--bg-light-tertiary: #EAEEF2;
--bg-light-glass: rgba(0, 0, 0, 0.03);
```

#### Text Colors

```css
/* Dark Mode Text */
--text-primary: #E6EDF3;       /* High contrast white */
--text-secondary: #8B949E;     /* Muted gray */
--text-tertiary: #6E7681;      /* Subtle gray */
--text-link: #58A6FF;          /* GitHub blue */

/* Light Mode Text */
--text-light-primary: #24292F;
--text-light-secondary: #57606A;
--text-light-tertiary: #6E7781;
```

#### Status Colors

```css
/* Status Indicators */
--status-protected: #2EA043;   /* Green - Protected */
--status-partial: #D29922;     /* Yellow - Partial */
--status-unprotected: #CF142B; /* Red - Not Protected */
--status-disabled: #484F58;    /* Gray - Disabled */

/* Feedback Colors */
--success: #2EA043;            /* Green */
--warning: #D29922;            /* Amber */
--error: #F85149;              /* Red */
--info: #58A6FF;               /* Blue */
```

#### Shadow & Border Colors

```css
/* Shadows for Depth */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.3);

/* Glassmorphic Shadows */
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.37);
--shadow-glass-inset: inset 0 0 20px rgba(255, 255, 255, 0.05);

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-default: rgba(255, 255, 255, 0.12);
--border-strong: rgba(255, 255, 255, 0.18);
```

### 2. Typography

#### Font Families

```css
/* Primary Font Stack */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                'Noto Sans', Helvetica, Arial, sans-serif;

/* Monospace for URLs/Technical */
--font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo,
             Consolas, 'Liberation Mono', monospace;

/* Headings with Tighter Tracking */
--font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, sans-serif;
```

#### Font Sizes (Responsive Scale)

```css
/* Font Size Scale */
--text-xs: 0.75rem;    /* 12px - timestamps, small labels */
--text-sm: 0.875rem;   /* 14px - body text, buttons */
--text-base: 1rem;     /* 16px - default body */
--text-lg: 1.125rem;   /* 18px - emphasis */
--text-xl: 1.25rem;    /* 20px - section headings */
--text-2xl: 1.5rem;    /* 24px - page titles */
--text-3xl: 2rem;      /* 32px - hero headings */
--text-4xl: 2.5rem;    /* 40px - website hero */
--text-5xl: 3rem;      /* 48px - large displays */

/* Counter Display (Blocked Requests) */
--text-counter: 3.5rem; /* 56px - big impact number */
```

#### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Line Heights

```css
--leading-tight: 1.2;   /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.7; /* Long-form content */
```

### 3. Spacing System

#### Base Unit: 4px

```css
/* Spacing Scale (4px increments) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

#### Component-Specific Spacing

```css
/* Padding */
--padding-button: var(--space-3) var(--space-5);      /* 12px 20px */
--padding-card: var(--space-6);                        /* 24px */
--padding-section: var(--space-8) var(--space-4);      /* 32px 16px */

/* Margins */
--margin-element: var(--space-4);                      /* 16px */
--margin-section: var(--space-8);                      /* 32px */
```

### 4. Border Radius

```css
/* Border Radius Scale */
--radius-sm: 4px;      /* Small elements, badges */
--radius-md: 8px;      /* Buttons, inputs */
--radius-lg: 12px;     /* Cards, modals */
--radius-xl: 16px;     /* Large containers */
--radius-2xl: 24px;    /* Hero sections */
--radius-full: 9999px; /* Pills, circular buttons */
```

### 5. Icon Set

#### Logo/Brand Icon (Stop Sign Concept)

**Primary Logo:**
- Octagonal stop sign shape
- Red-to-orange gradient fill
- White "TRACK STOP" text (or just "T" for small sizes)
- Optional: Road/track lines in background

**Simplified Icon (16px, 32px, 48px):**
- Octagonal shape
- Gradient fill
- Bold "T" or "TS" in white

**Badge Icon:**
- Minimal octagon outline
- Counter overlays in red circle

#### UI Icons (Recommended: Lucide Icons or Heroicons)

```javascript
// Icon mapping for TrackStop
const ICONS = {
  // Status
  'protected': 'shield-check',        // Green checkmark shield
  'partial': 'shield-alert',          // Yellow warning shield
  'unprotected': 'shield-off',        // Red shield off

  // Categories
  'session-replay': 'video',          // Camera/video icon
  'analytics': 'bar-chart',           // Chart icon
  'advertising': 'megaphone',         // Megaphone icon

  // Actions
  'settings': 'settings',             // Gear icon
  'close': 'x',                       // X icon
  'expand': 'chevron-down',           // Chevron down
  'collapse': 'chevron-up',           // Chevron up
  'info': 'info',                     // Info circle
  'copy': 'copy',                     // Clipboard icon
  'export': 'download',               // Download arrow

  // Modes
  'lite': 'shield',                   // Simple shield
  'balanced': 'shield-check',         // Shield with check
  'fortress': 'shield-alert',         // Shield with lock

  // UI Elements
  'check': 'check',                   // Checkmark
  'toggle-on': 'toggle-right',        // Toggle active
  'toggle-off': 'toggle-left',        // Toggle inactive
};
```

### 6. Animation Principles

#### Timing & Easing

```css
/* Animation Durations */
--duration-instant: 100ms;   /* State changes, toggles */
--duration-fast: 200ms;      /* Hover effects, tooltips */
--duration-normal: 300ms;    /* Cards, modals */
--duration-slow: 500ms;      /* Page transitions */
--duration-glacial: 1000ms;  /* Hero animations */

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);           /* Fast start, slow end */
--ease-out: cubic-bezier(0, 0, 0.2, 1);          /* Slow start, fast end (DEFAULT) */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* Smooth both ends */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful bounce */
```

#### Animation Best Practices

```css
/* GPU-Accelerated Properties Only */
.animated-element {
  /* ✅ Use these (GPU-accelerated) */
  transform: translateY(-4px);
  opacity: 0.8;

  /* ❌ Avoid these (cause repaints) */
  /* top, left, width, height, margin, padding */
}

/* Respect User Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Common Micro-Interactions

```css
/* Button Hover */
.button {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.button:active {
  transform: translateY(0);
}

/* Card Hover */
.card {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Toggle Switch */
.toggle {
  transition: background-color var(--duration-fast) var(--ease-out);
}
.toggle__slider {
  transition: transform var(--duration-fast) var(--ease-spring);
}

/* Counter Animation (Count Up) */
@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide In From Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## Website Redesign

### Hero Section

#### Design Concept

**Visual Hierarchy:**
1. Large, bold headline with gradient effect
2. Supporting subheadline (lighter text)
3. Dual CTA buttons (Chrome + Firefox)
4. Trust badges (stars, user count, open source)
5. Animated background (subtle particle system or gradient mesh)

#### Layout (Desktop: 1440px)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]                        [Download] [GitHub]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Stop Companies From                   │
│                   Recording Your Screen                 │
│                       [gradient on "Screen"]            │
│                                                         │
│     TrackStop blocks 25+ session replay, analytics,    │
│     and advertising trackers automatically.             │
│     Zero configuration. 100% open source.               │
│                                                         │
│   [🟠 Download for Chrome - It's Free]                 │
│   [⚪ Download for Firefox - It's Free]                │
│                                                         │
│   ⭐⭐⭐⭐⭐ 4.9/5.0  •  10,392 Users  •  Open Source     │
│                                                         │
│              [Animated gradient background]             │
└─────────────────────────────────────────────────────────┘
```

#### HTML Structure

```html
<section class="hero">
  <div class="hero__background">
    <!-- Animated gradient mesh or particles -->
    <div class="gradient-mesh"></div>
  </div>

  <div class="container hero__content">
    <h1 class="hero__headline">
      Stop Companies From
      <br>
      <span class="gradient-text">Recording Your Screen</span>
    </h1>

    <p class="hero__subheadline">
      TrackStop blocks 25+ session replay, analytics, and advertising trackers automatically.
      <br>
      Zero configuration. 100% open source. Trusted by 10,000+ privacy-conscious users.
    </p>

    <div class="hero__cta">
      <a href="#" class="button button--primary button--large">
        <svg class="button__icon"><!-- Chrome icon --></svg>
        Download for Chrome - It's Free
      </a>
      <a href="#" class="button button--secondary button--large">
        <svg class="button__icon"><!-- Firefox icon --></svg>
        Download for Firefox - It's Free
      </a>
    </div>

    <div class="hero__trust">
      <span class="trust-badge">
        <span class="stars">⭐⭐⭐⭐⭐</span> 4.9/5.0 Rating
      </span>
      <span class="trust-badge">10,392 Active Users</span>
      <span class="trust-badge">100% Open Source</span>
    </div>
  </div>
</section>
```

#### CSS Implementation

```css
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg-primary);
}

.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.6;
}

/* Animated gradient mesh */
.gradient-mesh {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(207, 20, 43, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 90, 9, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 140, 66, 0.1) 0%, transparent 50%);
  animation: meshMove 20s ease-in-out infinite;
}

@keyframes meshMove {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

.hero__headline {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  animation: fadeIn 800ms var(--ease-out);
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(10deg); }
}

.hero__subheadline {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  animation: fadeIn 800ms var(--ease-out) 200ms backwards;
}

.hero__cta {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
  animation: fadeIn 800ms var(--ease-out) 400ms backwards;
}

.button--primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  box-shadow: var(--shadow-md);
}

.button--primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.button--secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.button--large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

.hero__trust {
  display: flex;
  gap: var(--space-6);
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 800ms var(--ease-out) 600ms backwards;
}

.trust-badge {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.stars {
  color: #FFD60A;
}

/* Responsive */
@media (max-width: 768px) {
  .hero__headline {
    font-size: var(--text-3xl);
  }

  .hero__cta {
    flex-direction: column;
  }

  .button--large {
    width: 100%;
  }
}
```

### Features Section

#### Design Concept

**Card-Based Grid Layout:**
- 4 feature cards in 2x2 grid (desktop)
- Glassmorphic card backgrounds
- Icon animations on scroll (intersection observer)
- Hover effects with depth

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│           Everything You Need to Reclaim Your Privacy   │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  🛡️              │  │  ⚡              │           │
│  │  25+ Services    │  │  Three Protection│           │
│  │  Blocked Auto... │  │  Modes           │           │
│  │                  │  │                  │           │
│  │  Session replay..│  │  Lite Mode blo...│           │
│  └──────────────────┘  └──────────────────┘           │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  📊              │  │  ✨              │           │
│  │  See What's Being│  │  Works Instantly │           │
│  │  Blocked         │  │                  │           │
│  │                  │  │                  │           │
│  │  Live badge co...│  │  No complex fi...│           │
│  └──────────────────┘  └──────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

#### HTML Structure

```html
<section class="features">
  <div class="container">
    <h2 class="section__title">
      Everything You Need to Reclaim Your Privacy
    </h2>

    <div class="features__grid">
      <!-- Feature 1 -->
      <div class="feature-card" data-animate>
        <div class="feature-card__icon">
          <svg class="icon icon--lg"><!-- Shield icon --></svg>
        </div>
        <h3 class="feature-card__title">25+ Services Blocked Automatically</h3>
        <p class="feature-card__description">
          Session replay tools like Hotjar and FullStory. Analytics platforms
          like Mixpanel and Amplitude. Ad trackers like Google Analytics and
          Facebook Pixel. All stopped instantly without any configuration.
        </p>
      </div>

      <!-- Feature 2 -->
      <div class="feature-card" data-animate>
        <div class="feature-card__icon">
          <svg class="icon icon--lg"><!-- Lightning icon --></svg>
        </div>
        <h3 class="feature-card__title">Three Protection Modes</h3>
        <p class="feature-card__description">
          Lite Mode blocks only session recording. Balanced Mode blocks session
          replay + analytics (recommended). Fortress Mode blocks everything. Or
          customize individual services—total flexibility.
        </p>
      </div>

      <!-- Feature 3 -->
      <div class="feature-card" data-animate>
        <div class="feature-card__icon">
          <svg class="icon icon--lg"><!-- Chart icon --></svg>
        </div>
        <h3 class="feature-card__title">See What's Being Blocked</h3>
        <p class="feature-card__description">
          Live badge counter shows blocked requests. Detailed logs reveal exact
          URLs, services, and timestamps. Full transparency into your protection
          with beautiful on-page notifications.
        </p>
      </div>

      <!-- Feature 4 -->
      <div class="feature-card" data-animate>
        <div class="feature-card__icon">
          <svg class="icon icon--lg"><!-- Sparkles icon --></svg>
        </div>
        <h3 class="feature-card__title">Works Instantly</h3>
        <p class="feature-card__description">
          No complex filter lists. No domain management. Just install and go.
          Protection starts the moment you click 'Add to Browser.' Recommended
          settings work perfectly for 95% of users.
        </p>
      </div>
    </div>
  </div>
</section>
```

#### CSS Implementation

```css
.features {
  padding: var(--space-20) var(--space-4);
  background: var(--bg-primary);
}

.section__title {
  text-align: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-12);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  /* Glassmorphic effect */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-8);

  /* Shadow for depth */
  box-shadow: var(--shadow-glass);

  /* Smooth transitions */
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              background var(--duration-normal) var(--ease-out);

  /* Initial animation state */
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.is-visible {
  animation: slideInUp 600ms var(--ease-out) forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-default);
}

.feature-card__icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-5);

  /* Gradient background for icon */
  background: var(--primary-gradient);
  border-radius: var(--radius-lg);

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform var(--duration-normal) var(--ease-spring);
}

.feature-card:hover .feature-card__icon {
  transform: scale(1.1) rotate(5deg);
}

.icon {
  color: white;
  width: 32px;
  height: 32px;
}

.feature-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.feature-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* Responsive */
@media (max-width: 768px) {
  .features__grid {
    grid-template-columns: 1fr;
  }
}
```

#### JavaScript for Scroll Animations

```javascript
// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});
```

### Services Blocked Section

#### Design Concept

**Interactive Service Grid:**
- Three category sections (Session Replay, Analytics, Advertising)
- Service logos in grid layout
- Hover tooltips with privacy concerns
- Visual grouping with color coding

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│      We Block the Most Invasive Trackers on the Internet │
│                                                         │
│   Right now, hundreds of websites are using these      │
│   tools to record your screen, track your behavior,    │
│   and monitor your every click. TrackStop stops them.  │
│                                                         │
│   ┌──────────────────────────────────────────────┐    │
│   │ 🎥 SESSION REPLAY (10 services)              │    │
│   │ Tools That Record Your Screen & Keystrokes   │    │
│   │                                              │    │
│   │  [Hotjar]  [FullStory]  [LogRocket]  ...    │    │
│   │                                              │    │
│   │  ⚠️ These tools record everything—including  │    │
│   │  passwords before they're masked. Princeton  │    │
│   │  research found them on 482+ top websites.   │    │
│   └──────────────────────────────────────────────┘    │
│                                                         │
│   ┌──────────────────────────────────────────────┐    │
│   │ 📊 PRODUCT ANALYTICS (7 services)            │    │
│   │ Tools That Track Your Behavior & Engagement  │    │
│   │                                              │    │
│   │  [Mixpanel]  [Amplitude]  [Heap]  ...       │    │
│   │                                              │    │
│   │  ⚠️ Track every feature you use, every button│    │
│   │  you click, and share data with dozens of    │    │
│   │  third parties.                              │    │
│   └──────────────────────────────────────────────┘    │
│                                                         │
│   ┌──────────────────────────────────────────────┐    │
│   │ 📢 ADVERTISING & TRACKING (5+ services)      │    │
│   │ Cross-Site Tracking for Advertising          │    │
│   │                                              │    │
│   │  [Google Analytics]  [Facebook]  ...         │    │
│   └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### HTML Structure

```html
<section class="services-blocked">
  <div class="container">
    <h2 class="section__title">
      We Block the Most Invasive Trackers on the Internet
    </h2>

    <p class="section__intro">
      Right now, hundreds of websites are using these tools to record your
      screen, track your behavior, and monitor your every click. TrackStop
      stops them all.
    </p>

    <!-- Session Replay Category -->
    <div class="service-category" data-animate>
      <div class="service-category__header">
        <span class="service-category__icon">🎥</span>
        <h3 class="service-category__title">
          SESSION REPLAY <span class="badge">10 services</span>
        </h3>
        <p class="service-category__subtitle">
          Tools That Record Your Screen & Keystrokes
        </p>
      </div>

      <div class="service-grid">
        <div class="service-badge" data-tooltip="Blocks: *.hotjar.com, *.hotjar.io">
          Hotjar
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.fullstory.com">
          FullStory
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.logrocket.com, *.logrocket.io">
          LogRocket
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.mouseflow.com">
          Mouseflow
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.sessioncam.com">
          SessionCam
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.smartlook.com">
          Smartlook
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.luckyorange.com">
          Lucky Orange
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.inspectlet.com">
          Inspectlet
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.clicktale.net">
          ClickTale
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.mc.yandex.ru">
          Yandex Metrika
        </div>
      </div>

      <div class="service-category__alert">
        <svg class="icon icon--warning"><!-- Warning icon --></svg>
        <p>
          These tools record everything—including passwords before they're masked.
          Princeton research found them on 482+ top websites.
        </p>
      </div>
    </div>

    <!-- Product Analytics Category -->
    <div class="service-category" data-animate>
      <div class="service-category__header">
        <span class="service-category__icon">📊</span>
        <h3 class="service-category__title">
          PRODUCT ANALYTICS <span class="badge">7 services</span>
        </h3>
        <p class="service-category__subtitle">
          Tools That Track Your Behavior & Engagement
        </p>
      </div>

      <div class="service-grid">
        <div class="service-badge" data-tooltip="Blocks: *.mixpanel.com">
          Mixpanel
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.amplitude.com">
          Amplitude
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.heap.io">
          Heap
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.segment.com">
          Segment
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.pendo.io">
          Pendo
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.crazyegg.com">
          Crazy Egg
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.clarity.ms">
          Microsoft Clarity
        </div>
      </div>

      <div class="service-category__alert">
        <svg class="icon icon--warning"><!-- Warning icon --></svg>
        <p>
          Track every feature you use, every button you click, and share data
          with dozens of third parties. Mixpanel was caught collecting passwords
          accidentally.
        </p>
      </div>
    </div>

    <!-- Advertising Category -->
    <div class="service-category" data-animate>
      <div class="service-category__header">
        <span class="service-category__icon">📢</span>
        <h3 class="service-category__title">
          ADVERTISING & TRACKING <span class="badge">5+ services</span>
        </h3>
        <p class="service-category__subtitle">
          Cross-Site Tracking for Advertising
        </p>
      </div>

      <div class="service-grid">
        <div class="service-badge" data-tooltip="Blocks: *.google-analytics.com">
          Google Analytics
        </div>
        <div class="service-badge" data-tooltip="Blocks: connect.facebook.net">
          Facebook Pixel
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.doubleclick.net">
          DoubleClick
        </div>
        <div class="service-badge" data-tooltip="Blocks: *.quantcast.com">
          Quantcast
        </div>
      </div>

      <div class="service-category__alert">
        <svg class="icon icon--warning"><!-- Warning icon --></svg>
        <p>
          Follow you across the internet to build detailed profiles for
          advertising and surveillance.
        </p>
      </div>
    </div>
  </div>
</section>
```

#### CSS Implementation

```css
.services-blocked {
  padding: var(--space-20) var(--space-4);
  background: var(--bg-secondary);
}

.section__intro {
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--space-12);
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.service-category {
  max-width: 900px;
  margin: 0 auto var(--space-12);

  /* Glassmorphic card */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-8);

  /* Animation */
  opacity: 0;
  transform: translateY(30px);
}

.service-category.is-visible {
  animation: slideInUp 600ms var(--ease-out) forwards;
}

.service-category__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.service-category__icon {
  font-size: var(--text-4xl);
  display: block;
  margin-bottom: var(--space-3);
}

.service-category__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--primary-gradient);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  margin-left: var(--space-2);
}

.service-category__subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.service-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-6);
}

.service-badge {
  position: relative;
  padding: var(--space-3) var(--space-5);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  cursor: help;

  transition: all var(--duration-fast) var(--ease-out);
}

.service-badge:hover {
  background: var(--bg-glass-hover);
  border-color: var(--primary-orange);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Tooltip on hover */
.service-badge::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);

  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);

  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  color: var(--text-secondary);
  white-space: nowrap;

  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.service-badge:hover::after {
  opacity: 1;
}

.service-category__alert {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;

  background: rgba(255, 140, 66, 0.1);
  border: 1px solid rgba(255, 140, 66, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.icon--warning {
  color: var(--accent-orange);
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.service-category__alert p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}
```

### Social Proof Section

#### Design Concept

**Testimonial Carousel + Stats Bar:**
- Three testimonial cards
- Animated stats counter
- Star ratings
- User avatars (placeholder gradients)

#### HTML Structure

```html
<section class="social-proof">
  <div class="container">
    <h2 class="section__title">
      Trusted by Privacy-Conscious Users Worldwide
    </h2>

    <div class="testimonials">
      <div class="testimonial-card" data-animate>
        <div class="testimonial-card__stars">⭐⭐⭐⭐⭐</div>
        <blockquote class="testimonial-card__quote">
          "Finally, a privacy extension that focuses on the most invasive
          tracking—session replay. I can see Hotjar getting blocked in real-time
          on sites I visit. Game changer."
        </blockquote>
        <div class="testimonial-card__author">
          <div class="author-avatar" data-initial="S"></div>
          <div class="author-info">
            <div class="author-name">Sarah K.</div>
            <div class="author-title">Software Engineer</div>
          </div>
        </div>
      </div>

      <div class="testimonial-card" data-animate>
        <div class="testimonial-card__stars">⭐⭐⭐⭐⭐</div>
        <blockquote class="testimonial-card__quote">
          "I was shocked to see how many trackers were recording my screen.
          TrackStop stopped 147 requests in one day. So much easier than
          configuring uBlock manually."
        </blockquote>
        <div class="testimonial-card__author">
          <div class="author-avatar" data-initial="M"></div>
          <div class="author-info">
            <div class="author-name">Michael T.</div>
            <div class="author-title">Security Analyst</div>
          </div>
        </div>
      </div>

      <div class="testimonial-card" data-animate>
        <div class="testimonial-card__stars">⭐⭐⭐⭐⭐</div>
        <blockquote class="testimonial-card__quote">
          "Love that it's open source and community-driven. No corporate interests,
          no premium upsell. Just pure privacy protection that actually works."
        </blockquote>
        <div class="testimonial-card__author">
          <div class="author-avatar" data-initial="J"></div>
          <div class="author-info">
            <div class="author-name">Jessica R.</div>
            <div class="author-title">Privacy Advocate</div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat" data-animate>
        <div class="stat__value" data-count="10392">0</div>
        <div class="stat__label">Active Users</div>
      </div>
      <div class="stat" data-animate>
        <div class="stat__value" data-count="2400000">0</div>
        <div class="stat__label">Trackers Blocked</div>
      </div>
      <div class="stat" data-animate>
        <div class="stat__value" data-count="4.9">0</div>
        <div class="stat__label">Average Rating</div>
      </div>
    </div>
  </div>
</section>
```

#### CSS Implementation

```css
.social-proof {
  padding: var(--space-20) var(--space-4);
  background: var(--bg-primary);
}

.testimonials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto var(--space-12);
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-8);

  transition: all var(--duration-normal) var(--ease-out);

  opacity: 0;
  transform: translateY(30px);
}

.testimonial-card.is-visible {
  animation: slideInUp 600ms var(--ease-out) forwards;
}

.testimonial-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-default);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.testimonial-card__stars {
  color: #FFD60A;
  font-size: var(--text-base);
  margin-bottom: var(--space-4);
}

.testimonial-card__quote {
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-6);
  font-style: italic;
}

.testimonial-card__author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--primary-gradient);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: white;
}

.author-avatar::before {
  content: attr(data-initial);
}

.author-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.author-title {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.stats-bar {
  display: flex;
  gap: var(--space-8);
  justify-content: center;
  flex-wrap: wrap;

  background: var(--bg-tertiary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
}

.stat {
  text-align: center;
  opacity: 0;
}

.stat.is-visible {
  animation: fadeIn 800ms var(--ease-out) forwards;
}

.stat__value {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: var(--space-2);
}

.stat__label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### JavaScript for Counter Animation

```javascript
// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  } else if (num % 1 !== 0) {
    return num.toFixed(1) + '★';
  }
  return num;
}

// Trigger counter animation on scroll
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const valueElement = entry.target.querySelector('.stat__value');
      const targetValue = parseFloat(valueElement.dataset.count);
      animateCounter(valueElement, targetValue);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
  statObserver.observe(stat);
});
```

### Comparison Table Section

*(Due to length constraints, I'll provide a simplified version)*

#### HTML Structure

```html
<section class="comparison">
  <div class="container">
    <h2 class="section__title">How TrackStop Compares</h2>

    <div class="comparison-table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="highlight-column">TrackStop</th>
            <th>uBlock Origin</th>
            <th>Privacy Badger</th>
            <th>Ghostery</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session Replay Blocking</td>
            <td class="highlight-column">
              <span class="check check--yes">✅</span> 10 services pre-configured
            </td>
            <td><span class="check check--partial">⚠️</span> Manual config</td>
            <td><span class="check check--partial">⚠️</span> Reactive only</td>
            <td><span class="check check--partial">⚠️</span> Some services</td>
          </tr>
          <!-- More rows... -->
        </tbody>
      </table>
    </div>
  </div>
</section>
```

#### CSS Highlights

```css
.comparison-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--bg-tertiary);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.highlight-column {
  background: var(--primary-gradient);
  color: white;
  font-weight: var(--font-bold);
}

.check--yes { color: var(--status-protected); }
.check--partial { color: var(--status-partial); }
.check--no { color: var(--status-unprotected); }
```

### FAQ Section

#### Accordion Design

```html
<section class="faq">
  <div class="container">
    <h2 class="section__title">Frequently Asked Questions</h2>

    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-item__question" aria-expanded="false">
          <span>Will TrackStop break websites?</span>
          <svg class="faq-item__icon"><!-- Chevron --></svg>
        </button>
        <div class="faq-item__answer">
          <p>
            No. TrackStop only blocks third-party tracking scripts—not the
            website's core functionality. If you encounter issues (rare), you
            can whitelist specific sites or toggle protection modes with one click.
          </p>
        </div>
      </div>
      <!-- More FAQ items... -->
    </div>
  </div>
</section>
```

#### CSS for Accordion

```css
.faq-item__question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);

  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;

  transition: all var(--duration-fast) var(--ease-out);
}

.faq-item__question:hover {
  background: var(--bg-glass-hover);
  border-color: var(--primary-orange);
}

.faq-item__icon {
  width: 24px;
  height: 24px;
  transition: transform var(--duration-normal) var(--ease-out);
}

.faq-item__question[aria-expanded="true"] .faq-item__icon {
  transform: rotate(180deg);
}

.faq-item__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-out);
}

.faq-item__question[aria-expanded="true"] + .faq-item__answer {
  max-height: 500px;
}
```

### Footer

```html
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="logo.svg" alt="TrackStop" class="footer__logo">
        <p>Stop tracking. Start browsing freely.</p>
      </div>

      <div class="footer__links">
        <h4>Product</h4>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#services">Services Blocked</a></li>
          <li><a href="#download">Download</a></li>
        </ul>
      </div>

      <div class="footer__links">
        <h4>Resources</h4>
        <ul>
          <li><a href="/docs">Documentation</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
        </ul>
      </div>

      <div class="footer__links">
        <h4>Community</h4>
        <ul>
          <li><a href="https://github.com/...">GitHub</a></li>
          <li><a href="/contribute">Contribute</a></li>
          <li><a href="/support">Support</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; 2025 TrackStop. Open source under MIT License.</p>
    </div>
  </div>
</footer>
```

---

## Browser Extension Popup Redesign

### Design Philosophy

**Constraints:**
- 380px width (Chrome/Firefox standard)
- Fast rendering (service worker environment)
- Dark mode default (privacy tool aesthetic)
- 3 main views: Main, Settings, Details

**Visual Approach:**
- Glassmorphic cards for depth
- Neumorphic toggles for tactile feedback
- Traffic light colors (green/yellow/red)
- Smooth view transitions

### Main View (Default State)

#### ASCII Wireframe

```
┌──────────────────────────────────────┐ 380px width
│  ╔══════════════════════════════╗   │
│  ║ 🛑 TrackStop            [⚙️]  ║   │ Header (gradient)
│  ╚══════════════════════════════╝   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📍 example.com                 │ │ Current site
│  │ ✅ Protected - Balanced Mode   │ │ Status
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │         🔴 26                  │ │ Blocked counter
│  │    Requests Blocked            │ │ (large, animated)
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Mode: Balanced        [Change] │ │ Quick mode selector
│  │ ⚡ Recommended                 │ │
│  └────────────────────────────────┘ │
│                                      │
│  ── Categories ──                   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🎥 Session Recording      [ON] │ │ Category toggle
│  │    12 blocked              [▼] │ │ with counter
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📊 Product Analytics      [ON] │ │
│  │    8 blocked               [▼] │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 📢 Advertising           [OFF] │ │
│  │    0 blocked               [▼] │ │
│  └────────────────────────────────┘ │
│                                      │
│  [View All Blocked Requests]        │ Footer action
└──────────────────────────────────────┘
```

#### HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrackStop</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup" data-view="main">
    <!-- Header -->
    <header class="header">
      <div class="header__brand">
        <svg class="logo"><!-- Octagon stop sign --></svg>
        <h1 class="header__title">TrackStop</h1>
      </div>
      <button class="icon-button" id="settingsBtn" aria-label="Settings">
        <svg class="icon"><!-- Settings icon --></svg>
      </button>
    </header>

    <!-- Main View -->
    <div class="view view--main">
      <!-- Current Site Status -->
      <div class="status-card">
        <div class="status-card__site">
          <svg class="icon icon--pin"><!-- Location pin --></svg>
          <span id="currentSite">example.com</span>
        </div>
        <div class="status-card__protection" data-status="protected">
          <svg class="icon icon--shield"><!-- Shield check --></svg>
          <span>Protected - Balanced Mode</span>
        </div>
      </div>

      <!-- Blocked Counter -->
      <div class="counter-card">
        <div class="counter-card__icon">🔴</div>
        <div class="counter-card__value" id="blockedCount">26</div>
        <div class="counter-card__label">Requests Blocked</div>
      </div>

      <!-- Mode Selector -->
      <div class="mode-card">
        <div class="mode-card__current">
          <span>Mode: <strong id="currentMode">Balanced</strong></span>
          <button class="link-button" id="changeModeBtn">Change</button>
        </div>
        <div class="mode-card__badge">⚡ Recommended</div>
      </div>

      <!-- Categories -->
      <div class="categories">
        <h2 class="section-title">Categories</h2>

        <div class="category-card" data-category="sessionReplay">
          <div class="category-card__header">
            <div class="category-card__info">
              <span class="category-card__icon">🎥</span>
              <span class="category-card__name">Session Recording</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle__slider"></span>
            </label>
          </div>
          <div class="category-card__stats">
            <span class="category-card__count">12 blocked</span>
            <button class="expand-button" aria-expanded="false">
              <svg class="icon"><!-- Chevron --></svg>
            </button>
          </div>
          <div class="category-card__services" hidden>
            <ul class="service-list">
              <li>Hotjar (5)</li>
              <li>FullStory (4)</li>
              <li>LogRocket (3)</li>
            </ul>
          </div>
        </div>

        <div class="category-card" data-category="productAnalytics">
          <div class="category-card__header">
            <div class="category-card__info">
              <span class="category-card__icon">📊</span>
              <span class="category-card__name">Product Analytics</span>
            </div>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="toggle__slider"></span>
            </label>
          </div>
          <div class="category-card__stats">
            <span class="category-card__count">8 blocked</span>
            <button class="expand-button" aria-expanded="false">
              <svg class="icon"><!-- Chevron --></svg>
            </button>
          </div>
          <div class="category-card__services" hidden>
            <ul class="service-list">
              <li>Mixpanel (3)</li>
              <li>Amplitude (3)</li>
              <li>Heap (2)</li>
            </ul>
          </div>
        </div>

        <div class="category-card" data-category="advertising">
          <div class="category-card__header">
            <div class="category-card__info">
              <span class="category-card__icon">📢</span>
              <span class="category-card__name">Advertising</span>
            </div>
            <label class="toggle">
              <input type="checkbox">
              <span class="toggle__slider"></span>
            </label>
          </div>
          <div class="category-card__stats">
            <span class="category-card__count">0 blocked</span>
            <button class="expand-button" aria-expanded="false">
              <svg class="icon"><!-- Chevron --></svg>
            </button>
          </div>
          <div class="category-card__services" hidden>
            <ul class="service-list">
              <li>Google Analytics (0)</li>
              <li>Facebook Pixel (0)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <button class="button button--secondary button--full" id="viewDetailsBtn">
        View All Blocked Requests
      </button>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

#### CSS Implementation (popup.css)

```css
/* CSS Variables (from Design System) */
:root {
  /* Primary Colors */
  --primary-gradient: linear-gradient(135deg, #CF142B 0%, #FF5A09 100%);
  --primary-red: #CF142B;
  --primary-orange: #FF5A09;

  /* Backgrounds */
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #21262D;
  --bg-glass: rgba(255, 255, 255, 0.05);
  --bg-glass-hover: rgba(255, 255, 255, 0.08);

  /* Text */
  --text-primary: #E6EDF3;
  --text-secondary: #8B949E;
  --text-tertiary: #6E7681;

  /* Status */
  --status-protected: #2EA043;
  --status-partial: #D29922;
  --status-unprotected: #CF142B;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.37);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-default: rgba(255, 255, 255, 0.12);

  /* Spacing */
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Timing */
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Base Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 380px;
  min-height: 500px;
  max-height: 600px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-primary);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--primary-gradient);
  box-shadow: var(--shadow-md);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo {
  width: 32px;
  height: 32px;
  color: white;
}

.header__title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.icon-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.icon {
  width: 20px;
  height: 20px;
  color: white;
}

/* View Container */
.view {
  padding: var(--space-4);
}

/* Status Card */
.status-card {
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-glass);
}

.status-card__site {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  font-size: 13px;
  color: var(--text-secondary);
}

.icon--pin {
  width: 16px;
  height: 16px;
  color: var(--primary-orange);
}

.status-card__protection {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  font-weight: 600;
}

.status-card__protection[data-status="protected"] {
  color: var(--status-protected);
}

.status-card__protection[data-status="partial"] {
  color: var(--status-partial);
}

.status-card__protection[data-status="unprotected"] {
  color: var(--status-unprotected);
}

.icon--shield {
  width: 18px;
  height: 18px;
}

/* Counter Card */
.counter-card {
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  text-align: center;
  box-shadow: var(--shadow-glass);
}

.counter-card__icon {
  font-size: 32px;
  margin-bottom: var(--space-2);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.counter-card__value {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--space-2);

  animation: countUp 500ms var(--ease-out);
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.counter-card__label {
  font-size: 13px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Mode Card */
.mode-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
}

.mode-card__current {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  font-size: 14px;
}

.link-button {
  background: none;
  border: none;
  color: var(--primary-orange);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color var(--duration-fast) var(--ease-out);
}

.link-button:hover {
  color: var(--primary-red);
}

.mode-card__badge {
  display: inline-block;
  font-size: 12px;
  color: var(--status-protected);
  background: rgba(46, 160, 67, 0.1);
  border: 1px solid rgba(46, 160, 67, 0.3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
}

/* Categories */
.categories {
  margin-bottom: var(--space-5);
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
  padding: 0 var(--space-2);
}

.category-card {
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  transition: all var(--duration-fast) var(--ease-out);
}

.category-card:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-default);
}

.category-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.category-card__info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.category-card__icon {
  font-size: 20px;
}

.category-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Toggle Switch (Neumorphic Style) */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle__slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast) var(--ease-out);

  /* Neumorphic shadows */
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.3),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
}

.toggle__slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: var(--radius-full);
  transition: transform var(--duration-fast) var(--ease-spring);

  /* Neumorphic button */
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.2),
    -1px -1px 2px rgba(255, 255, 255, 0.1);
}

.toggle input:checked + .toggle__slider {
  background: var(--primary-gradient);
  box-shadow: none;
}

.toggle input:checked + .toggle__slider::before {
  transform: translateX(22px);
  box-shadow:
    -2px 2px 4px rgba(0, 0, 0, 0.2),
    1px -1px 2px rgba(255, 255, 255, 0.2);
}

.category-card__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-card__count {
  font-size: 13px;
  color: var(--text-secondary);
}

.expand-button {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.expand-button:hover {
  color: var(--text-primary);
  transform: scale(1.1);
}

.expand-button[aria-expanded="true"] {
  transform: rotate(180deg);
}

.category-card__services {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-subtle);
}

.service-list {
  list-style: none;
  font-size: 13px;
  color: var(--text-secondary);
}

.service-list li {
  padding: var(--space-2) 0;
}

/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  border: none;
}

.button--primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.button--primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.button--secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.button--secondary:hover {
  background: var(--bg-glass-hover);
  border-color: var(--primary-orange);
}

.button--full {
  width: 100%;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Settings View

#### ASCII Wireframe

```
┌──────────────────────────────────────┐
│  ╔══════════════════════════════╗   │
│  ║ [←] Settings          [Close] ║   │ Header
│  ╚══════════════════════════════╝   │
│                                      │
│  ── Protection Mode ──               │
│                                      │
│  ○ Lite Mode                         │
│     Blocks session recording only    │
│                                      │
│  ● Balanced Mode (Recommended)       │
│     Blocks session replay + analytics│
│                                      │
│  ○ Fortress Mode                     │
│     Blocks all tracking              │
│                                      │
│  ○ Custom                            │
│     Manually configure services      │
│                                      │
│  ────────────────────────────────    │
│                                      │
│  ── Advanced Settings ──             │
│                                      │
│  ☑ Show on-page notifications        │
│  ☑ Show badge counter                │
│  ☐ Whitelist current site            │
│                                      │
│  ────────────────────────────────    │
│                                      │
│  [Export Settings] [Reset to Default]│
└──────────────────────────────────────┘
```

#### HTML Structure

```html
<div class="view view--settings" hidden>
  <div class="view-header">
    <button class="icon-button" id="backBtn">
      <svg class="icon"><!-- Arrow left --></svg>
    </button>
    <h2 class="view-header__title">Settings</h2>
    <button class="icon-button" id="closeBtn">
      <svg class="icon"><!-- X --></svg>
    </button>
  </div>

  <div class="settings-content">
    <!-- Protection Mode -->
    <section class="settings-section">
      <h3 class="settings-section__title">Protection Mode</h3>

      <label class="radio-card">
        <input type="radio" name="mode" value="lite">
        <div class="radio-card__content">
          <div class="radio-card__header">
            <span class="radio-card__icon">🛡️</span>
            <span class="radio-card__title">Lite Mode</span>
          </div>
          <p class="radio-card__description">
            Blocks session recording only
          </p>
        </div>
        <span class="radio-card__indicator"></span>
      </label>

      <label class="radio-card radio-card--recommended">
        <input type="radio" name="mode" value="balanced" checked>
        <div class="radio-card__content">
          <div class="radio-card__header">
            <span class="radio-card__icon">⚡</span>
            <span class="radio-card__title">Balanced Mode</span>
            <span class="badge">Recommended</span>
          </div>
          <p class="radio-card__description">
            Blocks session replay + analytics
          </p>
        </div>
        <span class="radio-card__indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="mode" value="fortress">
        <div class="radio-card__content">
          <div class="radio-card__header">
            <span class="radio-card__icon">🔒</span>
            <span class="radio-card__title">Fortress Mode</span>
          </div>
          <p class="radio-card__description">
            Blocks all tracking
          </p>
        </div>
        <span class="radio-card__indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="mode" value="custom">
        <div class="radio-card__content">
          <div class="radio-card__header">
            <span class="radio-card__icon">⚙️</span>
            <span class="radio-card__title">Custom</span>
          </div>
          <p class="radio-card__description">
            Manually configure services
          </p>
        </div>
        <span class="radio-card__indicator"></span>
      </label>
    </section>

    <hr class="divider">

    <!-- Advanced Settings -->
    <section class="settings-section">
      <h3 class="settings-section__title">Advanced Settings</h3>

      <label class="checkbox-option">
        <input type="checkbox" checked>
        <span class="checkbox-option__label">Show on-page notifications</span>
      </label>

      <label class="checkbox-option">
        <input type="checkbox" checked>
        <span class="checkbox-option__label">Show badge counter</span>
      </label>

      <label class="checkbox-option">
        <input type="checkbox">
        <span class="checkbox-option__label">Whitelist current site</span>
      </label>
    </section>

    <hr class="divider">

    <!-- Actions -->
    <div class="settings-actions">
      <button class="button button--secondary">
        <svg class="icon"><!-- Download --></svg>
        Export Settings
      </button>
      <button class="button button--secondary">
        <svg class="icon"><!-- Refresh --></svg>
        Reset to Default
      </button>
    </div>
  </div>
</div>
```

#### CSS for Settings

```css
.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
}

.view-header__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.settings-content {
  padding: var(--space-4);
}

.settings-section {
  margin-bottom: var(--space-5);
}

.settings-section__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}

/* Radio Card */
.radio-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);

  background: var(--bg-glass);
  border: 2px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  cursor: pointer;

  transition: all var(--duration-fast) var(--ease-out);
}

.radio-card:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-default);
}

.radio-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-card input[type="radio"]:checked ~ .radio-card__indicator {
  background: var(--primary-gradient);
  border-color: var(--primary-orange);
}

.radio-card input[type="radio"]:checked ~ .radio-card__indicator::after {
  opacity: 1;
  transform: scale(1);
}

.radio-card--recommended {
  border-color: var(--status-protected);
  background: rgba(46, 160, 67, 0.05);
}

.radio-card__content {
  flex: 1;
}

.radio-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.radio-card__icon {
  font-size: 18px;
}

.radio-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.radio-card__description {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.radio-card__indicator {
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  transition: all var(--duration-fast) var(--ease-out);
}

.radio-card__indicator::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: white;
  border-radius: var(--radius-full);
  opacity: 0;
  transform: scale(0.5);
  transition: all var(--duration-fast) var(--ease-spring);
}

/* Checkbox Option */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  cursor: pointer;
}

.checkbox-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--primary-orange);
}

.checkbox-option__label {
  font-size: 14px;
  color: var(--text-primary);
}

/* Divider */
.divider {
  border: none;
  border-top: 1px solid var(--border-subtle);
  margin: var(--space-5) 0;
}

/* Settings Actions */
.settings-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
```

### Details View (Blocked Requests Log)

*(Simplified for brevity)*

```html
<div class="view view--details" hidden>
  <div class="view-header">
    <button class="icon-button" id="backFromDetailsBtn">
      <svg class="icon"><!-- Arrow left --></svg>
    </button>
    <h2 class="view-header__title">Blocked Requests (26)</h2>
    <button class="icon-button" id="copyLogBtn">
      <svg class="icon"><!-- Copy --></svg>
    </button>
  </div>

  <div class="details-content">
    <!-- Group by Service -->
    <div class="request-group">
      <div class="request-group__header">
        <span class="request-group__icon">🎥</span>
        <span class="request-group__title">Hotjar (8)</span>
      </div>
      <ul class="request-list">
        <li class="request-item">
          <div class="request-item__url">script.hotjar.com/...</div>
          <div class="request-item__meta">
            <span class="request-item__type">script</span>
            <span class="request-item__time">2:34 PM</span>
          </div>
        </li>
        <!-- More requests... -->
      </ul>
    </div>

    <!-- More groups... -->
  </div>
</div>
```

---

## On-Page Notification Redesign

### Design Concept

**Toast notification that appears when first tracker is blocked on a page:**
- Slide-in from top-right
- Glassmorphic design
- Auto-dismiss after 3 seconds with progress bar
- Manual close button

### HTML Structure (Injected by Content Script)

```html
<div class="trackstop-toast" id="trackstopNotification">
  <div class="trackstop-toast__icon">🛡️</div>
  <div class="trackstop-toast__content">
    <div class="trackstop-toast__title">TrackStop Blocked!</div>
    <div class="trackstop-toast__message">
      <span class="trackstop-toast__count">3</span> tracking requests blocked
    </div>
  </div>
  <button class="trackstop-toast__close" aria-label="Close">
    <svg viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>
  <div class="trackstop-toast__progress"></div>
</div>
```

### CSS for Toast (content.css)

```css
.trackstop-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999999;

  display: flex;
  align-items: center;
  gap: 12px;

  width: 320px;
  padding: 16px;

  /* Glassmorphic effect */
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.37),
    0 0 0 1px rgba(207, 20, 43, 0.2);

  /* Animation */
  animation: slideInRight 400ms cubic-bezier(0, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.trackstop-toast--hiding {
  animation: slideOutRight 300ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes slideOutRight {
  to {
    opacity: 0;
    transform: translateX(100px);
  }
}

.trackstop-toast__icon {
  font-size: 32px;
  flex-shrink: 0;
  animation: bounce 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.trackstop-toast__content {
  flex: 1;
}

.trackstop-toast__title {
  font-size: 14px;
  font-weight: 700;
  color: #E6EDF3;
  margin-bottom: 4px;
  background: linear-gradient(135deg, #CF142B 0%, #FF5A09 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.trackstop-toast__message {
  font-size: 13px;
  color: #8B949E;
}

.trackstop-toast__count {
  font-weight: 700;
  color: #E63946;
}

.trackstop-toast__close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;

  transition: all 200ms cubic-bezier(0, 0, 0.2, 1);
}

.trackstop-toast__close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.trackstop-toast__close svg {
  width: 14px;
  height: 14px;
  color: #8B949E;
}

.trackstop-toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.trackstop-toast__progress::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #CF142B 0%, #FF5A09 100%);
  transform-origin: left;
  animation: progressBar 3000ms linear;
}

@keyframes progressBar {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .trackstop-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
}
```

---

## Implementation Plan

### Phase 1: Design System Setup (Week 1)

**Deliverables:**
- [ ] Create `design-system.css` with all CSS variables
- [ ] Set up icon library (Lucide Icons CDN or inline SVGs)
- [ ] Create base typography and spacing utilities
- [ ] Document color usage guidelines
- [ ] Create animation utility classes

**Files to Create:**
- `C:\My Stuff\extentions\chrome\design-system.css`
- `C:\My Stuff\extentions\firefox\design-system.css`
- `C:\My Stuff\extentions\assets\icons\` (SVG icon collection)

### Phase 2: Website Redesign (Week 2-3)

**Step 1: Hero Section**
- [ ] Implement animated gradient background
- [ ] Add gradient text effect to headline
- [ ] Create CTA buttons with hover animations
- [ ] Add trust badges with fade-in animation

**Step 2: Features Section**
- [ ] Build glassmorphic feature cards
- [ ] Implement intersection observer for scroll animations
- [ ] Add icon hover effects
- [ ] Create responsive grid layout

**Step 3: Services Section**
- [ ] Design category cards with tooltips
- [ ] Implement service badge grid
- [ ] Add alert boxes with warning styling
- [ ] Create hover effects for service badges

**Step 4: Social Proof Section**
- [ ] Build testimonial cards
- [ ] Implement animated counter for stats
- [ ] Add avatar placeholders with gradients
- [ ] Create responsive testimonial grid

**Step 5: Comparison Table**
- [ ] Design responsive table with highlight column
- [ ] Add checkmark/warning icons
- [ ] Implement mobile-friendly card layout

**Step 6: FAQ Section**
- [ ] Build accordion component
- [ ] Add smooth expand/collapse animations
- [ ] Implement keyboard accessibility

**Step 7: Footer**
- [ ] Create footer grid layout
- [ ] Add link hover effects
- [ ] Implement responsive layout

**Files to Update:**
- `C:\My Stuff\extentions\website\index.html`
- `C:\My Stuff\extentions\website\styles.css`
- `C:\My Stuff\extentions\website\script.js` (for animations)

### Phase 3: Chrome Extension Popup (Week 4)

**Step 1: Main View**
- [ ] Implement header with gradient background
- [ ] Create status card with glassmorphic effect
- [ ] Build animated counter card
- [ ] Add mode selector card
- [ ] Implement category cards with toggles
- [ ] Add expand/collapse functionality

**Step 2: Settings View**
- [ ] Build radio card component for modes
- [ ] Create checkbox options
- [ ] Add view transition animations
- [ ] Implement back navigation

**Step 3: Details View**
- [ ] Design request log groups
- [ ] Add copy functionality
- [ ] Implement scrollable list
- [ ] Create timestamp formatting

**Step 4: Interactions**
- [ ] Add toggle switch animations
- [ ] Implement smooth view transitions
- [ ] Create hover effects
- [ ] Add accessibility (keyboard navigation)

**Files to Update:**
- `C:\My Stuff\extentions\chrome\popup.html`
- `C:\My Stuff\extentions\chrome\popup.css`
- `C:\My Stuff\extentions\chrome\popup.js`

### Phase 4: Firefox Extension Popup (Week 4)

**Deliverables:**
- [ ] Mirror all Chrome popup changes
- [ ] Test Firefox-specific CSS quirks (backdrop-filter support)
- [ ] Verify browser API differences

**Files to Update:**
- `C:\My Stuff\extentions\firefox\popup.html`
- `C:\My Stuff\extentions\firefox\popup.css`
- `C:\My Stuff\extentions\firefox\popup.js`

### Phase 5: On-Page Notification (Week 5)

**Deliverables:**
- [ ] Create glassmorphic toast design
- [ ] Implement slide-in animation
- [ ] Add auto-dismiss with progress bar
- [ ] Create close button functionality
- [ ] Test on various websites (z-index conflicts)

**Files to Update:**
- `C:\My Stuff\extentions\chrome\content.css`
- `C:\My Stuff\extentions\chrome\content.js`
- `C:\My Stuff\extentions\firefox\content.css`
- `C:\My Stuff\extentions\firefox\content.js`

### Phase 6: Testing & Refinement (Week 6)

**Cross-Browser Testing:**
- [ ] Chrome (latest + previous version)
- [ ] Firefox (latest + previous version)
- [ ] Edge (Chromium-based)
- [ ] Brave

**Accessibility Testing:**
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast (WCAG AA)
- [ ] Focus states
- [ ] `prefers-reduced-motion` support

**Performance Testing:**
- [ ] Measure animation FPS
- [ ] Check memory usage
- [ ] Test on low-end devices
- [ ] Optimize asset sizes

**Responsive Testing:**
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Extension popup (380px constraint)

---

## Component Library

### Reusable Components

#### 1. Button Component

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  /* ... rest of styling ... */
}

/* Icon Button */
.btn-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
```

#### 2. Card Component

```css
/* Glassmorphic Card */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-default);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

#### 3. Toggle Component

*(Already defined in popup CSS)*

#### 4. Badge Component

```css
.badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.badge--primary {
  background: var(--primary-gradient);
  color: white;
}

.badge--success {
  background: rgba(46, 160, 67, 0.1);
  border: 1px solid rgba(46, 160, 67, 0.3);
  color: var(--status-protected);
}
```

---

## Technical Specifications

### CSS Architecture

**Structure:**
```
styles/
├── design-system.css    # CSS variables, tokens
├── reset.css            # Normalize, base styles
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── toggles.css
│   └── badges.css
├── layout/
│   ├── header.css
│   ├── footer.css
│   └── grid.css
└── pages/
    ├── home.css
    └── popup.css
```

**Methodology:** BEM (Block Element Modifier)
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__content { }

/* Modifier */
.card--glassmorphic { }
.card--highlighted { }
```

### Animation Library

**Pure CSS Approach (Recommended):**
- Use CSS `@keyframes` for all animations
- GPU-accelerated properties only (`transform`, `opacity`)
- Respect `prefers-reduced-motion`

**Optional JavaScript Library:**
- **GSAP** (if complex scroll-triggered animations needed)
- **Intersection Observer API** (for scroll animations)

### Asset Requirements

**Graphics/Icons:**
- [ ] TrackStop logo (SVG, multiple sizes: 16px, 32px, 48px, 128px, 512px)
- [ ] Stop sign icon variations
- [ ] UI icon set (Lucide Icons recommended)
- [ ] Service logos (Hotjar, FullStory, etc. - optional)

**Images:**
- [ ] Hero background gradient mesh (CSS-generated)
- [ ] Screenshot mockups for store listings
- [ ] Promotional graphics (1400x560 Chrome, screenshots Firefox)

**Typography:**
- System font stack (no external fonts for performance)
- Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Performance Optimizations

**Critical CSS:**
- Inline above-the-fold CSS in `<head>`
- Defer non-critical CSS

**Asset Optimization:**
- Inline small SVGs (< 2KB)
- Use CSS gradients instead of images
- Minify CSS in production

**Animation Performance:**
- Use `will-change` sparingly (only during animation)
- Debounce scroll listeners
- Use `requestAnimationFrame` for JS animations

### Browser Compatibility

**Target Browsers:**
- Chrome 100+
- Firefox 100+
- Edge 100+
- Brave (Chromium-based)

**CSS Features Used:**
- `backdrop-filter` (with fallback)
- CSS Grid & Flexbox
- CSS Custom Properties (variables)
- CSS `clamp()` for responsive sizing

**Fallbacks:**
```css
/* Fallback for backdrop-filter */
.card {
  background: rgba(255, 255, 255, 0.05);

  /* Modern browsers */
  backdrop-filter: blur(10px);

  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(10px)) {
    background: rgba(21, 26, 35, 0.95);
  }
}
```

---

## Development Timeline

### Week 1: Design System
- **Day 1-2:** Create CSS variable system, document color palette
- **Day 3-4:** Build component library (buttons, cards, toggles)
- **Day 5:** Set up icon library, create animation utilities

### Week 2-3: Website Redesign
- **Day 1-2:** Hero section
- **Day 3-4:** Features section
- **Day 5-6:** Services blocked section
- **Day 7-8:** Social proof + comparison table
- **Day 9-10:** FAQ + footer, testing

### Week 4: Browser Extension Popups
- **Day 1-2:** Chrome popup main view
- **Day 3:** Chrome popup settings + details views
- **Day 4:** Firefox popup (mirror Chrome)
- **Day 5:** Testing and refinement

### Week 5: On-Page Notifications
- **Day 1-2:** Design and implement toast notification
- **Day 3-4:** Test on various websites, fix z-index conflicts
- **Day 5:** Cross-browser testing

### Week 6: Testing & Launch Prep
- **Day 1-2:** Cross-browser testing
- **Day 3:** Accessibility audit
- **Day 4:** Performance optimization
- **Day 5:** Final QA, prepare launch assets

---

## Conclusion

This comprehensive UI/UX design plan transforms TrackStop from a simple Hotjar blocker into a modern, professional privacy tool with stunning 2025 aesthetics. The design leverages:

- **Glassmorphism** for depth and modern appeal
- **Dark mode** as default for privacy tool aesthetic
- **Smooth animations** for delightful interactions
- **Accessible design** with WCAG compliance
- **Performance-first** approach with lightweight CSS

The plan provides complete specifications for:
1. Website redesign with modern sections
2. Browser extension popup with 3 views
3. On-page notification toast
4. Comprehensive design system
5. Implementation timeline

All designs are ready to implement with provided HTML, CSS, and JavaScript code snippets. The result will be a cohesive, professional brand identity that stands out from competitors like uBlock Origin and Ghostery while maintaining simplicity and usability.

**Next Steps:** Begin Phase 1 (Design System Setup) and proceed sequentially through the implementation plan.
