---
Task ID: 1
Agent: Main
Task: Fix Admin Panel CRUD issues - cannot add, edit, delete, or view details

Work Log:
- Investigated Admin Panel CRUD issues
- Found and fixed 3 critical API bugs:
  1. news POST route missing content field - added to destructuring and create data
  2. services POST route missing content field - added to destructuring and create data
  3. officials GET route ignoring ?all=true parameter - added URL search params parsing
- Fixed mass assignment vulnerability in 11 PUT routes - each now explicitly filters allowed fields
- Fixed default form values in AdminPanel - new items now default to active:true and order:0
- Added active toggle to stats form in AdminPanel
- Added detail view capability with Eye button to all 13 sections in AdminPanel
- Added Detail Dialog with full field display and Edit shortcut button
- Added Refresh button to admin top bar
- Enabled Tambah Data button for all sections including laporan
- Added Eye and RefreshCw icon imports

Stage Summary:
- All API routes now properly support full CRUD operations
- Admin Panel now has: Create, Read (detail), Update, Delete for all sections
- Default form values properly set active=true and order=0 for new items
- Safe field handling in all PUT routes (no mass assignment)
- Stats form now has active/inactive toggle
- Verified lint passes cleanly
