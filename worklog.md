---
Task ID: ad-bubbles-feature
Agent: Main Agent
Task: Build Balon Iklan / Floating Banner Advertisement feature

Work Log:
- Created AdBubble Prisma schema with 40+ fields covering all requirements
- Pushed schema to database and regenerated Prisma client
- Created /api/ad-bubbles route (GET list, POST create)
- Created /api/ad-bubbles/[id] route (GET, PUT, DELETE)
- Created /api/ad-bubbles/track route (POST for impression/click tracking)
- Built AdBubbleRenderer.tsx component with:
  - Drag & drop positioning with localStorage persistence
  - 7 position options (top-left, top-right, bottom-left, bottom-right, center-left, center-right, center)
  - 4 display types (floating-bubble, sticky-banner, popup-mini, floating-card)
  - 4 display modes (rounded-bubble, glassmorphism, neumorphism, minimal-clean)
  - 5 animation types (fade, slide, bounce, zoom, none)
  - Content types: image, GIF, video, text/HTML
  - CTA button support
  - Show delay, auto hide, show on scroll, exit intent
  - Device targeting (all, mobile, desktop)
  - Page targeting (targetPages, targetExclude)
  - Schedule filtering (startDate, endDate, showHours)
  - Close/minimize buttons
  - Video mute/unmute toggle
  - Impression and click tracking
  - Dark mode support
  - Lazy loading for media
- Added AdBubbleItem interface to AdminPanel
- Added ad-bubbles state, fetch, and sidebar menu entry
- Built comprehensive admin form with 8 organized sections:
  - Basic Info, Content, Display, Position, Size, Appearance, Animation, Behavior, Scheduling, Targeting, Status
- Built admin list view with stats display (impressions, clicks, CTR)
- Integrated AdBubbleRenderer into main page (/) and dynamic pages (/[slug])
- Added "balon-iklan" to quick-add section map
- Fixed lint errors (moved handleClose before useEffect, used ref for impression tracking, initialized dragOffset from localStorage in useState)
- Restarted dev server to pick up new Prisma model
- Verified API returns 200 with correct data

Stage Summary:
- Complete Balon Iklan feature built with 40+ configurable fields
- 4 display types, 4 display modes, 7 positions, 5 animations
- Admin panel fully integrated with CRUD, stats display
- Frontend renderer with drag & drop, localStorage position persistence
- Impression/click tracking via /api/ad-bubbles/track
- Works on both SPA homepage and SSR dynamic pages
