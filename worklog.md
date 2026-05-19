---
Task ID: 1
Agent: Main Agent
Task: Fix submenu/child menu items not creating dynamic pages, Performance measure error, and related issues

Work Log:
- Fixed navbar-menus API POST handler to auto-create PageContent for child menus (was only creating for top-level)
- Fixed navbar-menus DELETE handler to also delete PageContent for child menus
- Renamed DynamicPage component to SlugPage to avoid Performance measure naming conflict
- Added `export const dynamic = "force-dynamic"` to [slug]/page.tsx
- Added try/catch around params access to prevent timing errors
- Added findParentMenu() helper to show parent menu in breadcrumb for child pages
- Fixed SiteHeader mobile menu to properly render dynamic children with <Link> to /${child.slug}
- Updated SiteHeader dynamic menu handling to support expandable dropdowns with children on mobile
- Updated AdminPanel info text to show that sub-menus also auto-create pages
- Added "Dinamis" badge and preview button for child menu items in admin
- Added ExternalLink preview button for top-level dynamic menus in admin
- Created /api/navbar-menus/backfill endpoint to create PageContent for existing child menus
- Ran backfill: 1 new page created for existing child menu
- Added ExternalLink import to AdminPanel
- Verified all img src usages have proper null guards (already safe)
- Lint passes with only 2 pre-existing warnings

Stage Summary:
- Child/sub-menus now auto-create their own dynamic pages when isDynamic=true
- Parent menu context shown in breadcrumb (Beranda > Parent > Child)
- Mobile and desktop navigation properly links to child menu pages
- Performance measure error should be resolved (renamed component + force-dynamic)
- Admin panel shows preview links for dynamic pages and "Dinamis" badges for children
