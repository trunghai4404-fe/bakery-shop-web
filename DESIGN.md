---
name: Kinetic Minimalist
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#584237'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8c7164'
  outline-variant: '#e0c0b1'
  surface-tint: '#9d4300'
  primary: '#9d4300'
  on-primary: '#ffffff'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#ffb690'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#005ac1'
  on-tertiary: '#ffffff'
  tertiary-container: '#6199ff'
  on-tertiary-container: '#00306d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a41'
  on-tertiary-fixed-variant: '#004494'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-card: '#FFFFFF'
  border-low: rgba(226, 232, 240, 0.6)
  active-green: '#22C55E'
  dark-bg: '#0F172A'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is built for a premium sports venue booking experience, blending the high-performance energy of athletic brands with the serene, effortless utility of world-class travel platforms. The brand personality is active, reliable, and sophisticated. 

The design style follows a **Modern/Minimalist** approach with a **Card-based Architecture**. It prioritizes high-quality photography of venues and clean, functional interfaces. By utilizing generous whitespace and a restricted color palette, the system ensures that the "action"—the booking process and the sport itself—remains the focus. The aesthetic is professional yet approachable, avoiding unnecessary clutter to favor a "fast" feel, mirroring the speed and agility of sports.

## Colors

The palette is anchored by a high-energy **Primary Orange**, used strategically for call-to-actions and key interactive states to evoke movement and enthusiasm. This is balanced by a sophisticated **Slate/Neutral Gray** for text and structural elements, ensuring professional legibility. 

The system supports both Light and Dark modes. In Light mode, we utilize a very soft **Light Gray** background to reduce eye strain and provide a subtle contrast against white cards. In Dark mode, the background shifts to a deep Navy-Slate, maintaining depth through tonal layering rather than pure black. A tertiary Blue is reserved for informational links and secondary confirmations, nodding to established travel industry patterns.

## Typography

This design system uses **Inter** exclusively to achieve a systematic, neutral, and highly legible interface across all touchpoints. 

The typographic hierarchy is built on a tight scale to maintain a "clean" look. Display and Headline styles use tighter letter-spacing and heavier weights to create a sense of strength. Body text is optimized for readability with a slightly more generous line height. Label styles are used for navigation, tags, and small metadata, often employing medium-to-semibold weights to ensure they stand out even at small sizes.

## Layout & Spacing

The layout utilizes a **12-column Fluid Grid** for desktop, transitioning to a **4-column grid** for mobile. A consistent **8px spacing scale** (with 4px increments for micro-adjustments) governs all margins, padding, and element gaps.

- **Desktop:** 12 columns, 24px gutters, max-width of 1280px.
- **Tablet:** 8 columns, 24px gutters, 24px side margins.
- **Mobile:** 4 columns, 16px gutters, 16px side margins.

Content is organized primarily in cards, with large margins between sections to create a premium, "breathable" feel similar to luxury hospitality platforms.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

The background uses a subtle off-white (`#F8FAFC`), while primary interactive cards use a pure white surface (`#FFFFFF`). This creates a natural "lift." Shadows are used sparingly to indicate interactivity or focus:
- **Level 1 (Cards):** A very soft, diffused shadow (Y: 2px, Blur: 4px, 4% opacity) to separate content from the background.
- **Level 2 (Dropdowns/Modals):** A more pronounced, deep shadow (Y: 10px, Blur: 20px, 10% opacity) to indicate temporary overlay.

All cards and containers feature a **1px low-opacity border** (`#E2E8F0` at 60%) to provide definition without adding visual weight.

## Shapes

The shape language is defined by **Rounded** corners, creating a friendly and modern silhouette. 

Standard components (Buttons, Inputs, Cards) use a base radius of **0.5rem (8px)**, while larger containers and featured cards use **1rem (16px)** to emphasize their containment. For small elements like Badges or Tags, a **Pill-shape** is preferred to distinguish them from interactive buttons.

## Components

### Buttons
Primary buttons use the Brand Orange with white text, featuring a subtle 2px bottom shadow for a tactile feel. Secondary buttons use a transparent background with a 1px Slate border. All buttons should have a minimum height of 48px for touch-target accessibility on mobile.

### Cards
Cards are the primary container for venue listings. They feature a 16px corner radius, an image-top layout, and a 1px subtle border. Content inside cards should follow the 16px (md) padding rule.

### Input Fields
Inputs use a white background, 8px corner radius, and a 1px border. On focus, the border transitions to Primary Orange with a soft orange outer glow (2px). Labels should sit above the field in `label-md` style.

### Avatars
Circular avatars are used for user profiles and team captains. Use a 2px white border when overlapping avatars in a "stack" view (e.g., "3 spots left").

### Badges & Chips
Use pill-shaped backgrounds. For status (e.g., "Available"), use a light green tint with dark green text. For categories (e.g., "Tennis"), use a light gray tint with slate text.

### Icons
Use **Lucide** style icons with a **1.5px stroke weight**. Icons should be sized at 20px for buttons and 24px for navigation. Always use the "outline" variant to maintain the minimal aesthetic.