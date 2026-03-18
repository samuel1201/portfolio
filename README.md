# Samuel Wang Portfolio

Personal portfolio website for job applications and interviews.

## Stack

- React + TypeScript + Vite
- GSAP + ScrollTrigger
- Lenis smooth scrolling

## What This Site Emphasizes

- Clear design-to-development thinking
- Production-oriented UI and interaction design
- Cross-functional collaboration mindset

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content Notes

- Contact links are managed in `src/data/profile.ts`
- Project and photography assets can be replaced later without layout changes

## Recent Updates (2026-03)

- Replaced project content with real portfolio cases, including title, tags, and tailored descriptions
- Migrated project cover images to local static assets under `public/images/projects/`
- Added a featured portfolio entry linked to `public/samuel_portfolio.pdf`
- Refined typography hierarchy and section spacing for better visual consistency across Hero, Resume, Graphic, Photography, and Contact
- Improved responsive behavior for projects:
  - Horizontal card browsing for tablet/mobile (`<= 1023px`)
  - Dot indicators and next-card control for easier navigation
  - Cleaner touch-first interactions and reduced visual noise on smaller screens
- Updated contact icon usage to use `public/behance.svg`
- Photography section polish:
  - Replaced placeholders with 8 local photo assets under `public/images/photography/`
  - Added full-section blurred photo backdrop with dark scrim tuning for readability
  - Refined desktop horizontal pin behavior and reduced excessive edge hold time
- Resume section polish:
  - Added real profile photo and optimized asset (`samuel_pic.png` -> `samuel_pic.jpg`)
  - Implemented desktop sticky portrait behavior with responsive scaling on resize
- Contact and metadata updates:
  - Fixed Behance icon to inherit hover color via inline SVG
  - Added CV link in `src/data/profile.ts`
  - Updated `index.html` metadata (`lang="zh-Hant"`, OG/Twitter image, locale, favicon)
- Stability and cleanup:
  - Replaced resize hard reload with `ScrollTrigger.refresh()` debounce
  - Removed obsolete fixed-nav CSS after navigation removal
