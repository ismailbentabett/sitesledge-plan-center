# Acceptance Tests — SiteSledge Command Center

## Milestone 1 — Foundation

### Phase 2: Audit & Cleanup
- [ ] next-auth removed from package.json
- [ ] next-auth route deleted
- [ ] bcryptjs removed from package.json
- [ ] NEXTAUTH_SECRET and NEXTAUTH_URL removed from .env and .env.example
- [ ] ADMIN_PASSWORD added to docker-compose.yml
- [ ] CURRENT_STATE.md created and accurate
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes

### Phase 3: Planning Docs
- [ ] All 9 doc files created in /docs
- [ ] PRODUCT_SPEC covers all 26 modules
- [ ] MODULE_MAP has routes and models for each module
- [ ] DATA_MODEL covers existing + all planned models
- [ ] ROUTES_AND_PAGES matches sidebar structure
- [ ] API_SPEC covers all existing + planned routes
- [ ] UI_SPEC defines shared components
- [ ] BUILD_PHASES lists all phases in order
- [ ] ACCEPTANCE_TESTS has criteria for each phase

### Phase 4: Plan Review
- [ ] No missing modules
- [ ] No SaaS logic in any doc
- [ ] No signup/registration assumed
- [ ] DATA_MODEL matches CURRENT_STATE.md existing models
- [ ] ROUTES_AND_PAGES has no broken links
- [ ] DECISIONS.md logs all architecture decisions

### Phase 5: Script Verification
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm typecheck` passes with zero errors
- [ ] `pnpm build` passes with zero errors

## Milestone 2 — Core Planning Hub

### Phase 6: Password Gate
- [ ] Visiting any protected route while locked redirects to /login
- [ ] Wrong password shows error
- [ ] Correct password unlocks the app
- [ ] Refresh keeps access (cookie persists)
- [ ] Logout locks the app again
- [ ] Whiteboard routes remain accessible after unlock
- [ ] No signup or registration pages exist

### Phase 7: App Shell & Sidebar
- [ ] Sidebar appears on all protected pages
- [ ] Dashboard link works
- [ ] All Phase 1 sidebar links work (no 404s)
- [ ] Active route is visually highlighted
- [ ] Logout works from sidebar
- [ ] Mobile does not break
- [ ] Existing whiteboard still works

### Phase 8: Command Dashboard
- [ ] /dashboard loads after unlock
- [ ] Shows real data from DB (not hardcoded numbers)
- [ ] Shows empty states where no data exists
- [ ] MRR widget shows current MRR or "Not set"
- [ ] Active clients shows count or 0
- [ ] Recent decisions widget shows latest 3-5 or empty state
- [ ] Pinned notes appear or empty state
- [ ] Weekly priority shows or "Not set"
- [ ] Build passes

### Phase 9: Shared CRUD Foundation
- [ ] PageHeader component exists and works
- [ ] EmptyState component exists and works
- [ ] StatusBadge component exists and works
- [ ] Zod validation pattern is reusable
- [ ] Date formatting utility exists
- [ ] Currency formatting utility exists
- [ ] No breaking changes to existing pages

### Phase 10: Business Model Planner
- [ ] /business-model loads
- [ ] Can create business model if none exists
- [ ] Can edit existing business model
- [ ] Refresh preserves saved data
- [ ] Dashboard can read business model focus
- [ ] No localStorage persistence
- [ ] Build passes

### Phase 11: Niche Research Hub
- [ ] /niches loads with list
- [ ] Can create niche
- [ ] Can edit niche
- [ ] Can delete niche (with confirmation)
- [ ] Opportunity score calculates correctly
- [ ] Can sort by opportunity score
- [ ] Can mark status (Researching, Testing, Active, Paused, Rejected)
- [ ] Refresh preserves records
- [ ] Build passes

### Phase 12: Offer Builder
- [ ] /offers loads with list
- [ ] Can create offer
- [ ] Can edit offer
- [ ] Can delete offer
- [ ] Can link offer to niche
- [ ] Can mark active offer
- [ ] Dashboard shows active offer
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 13: Financial Model
- [ ] /financial-model loads
- [ ] Can create scenario
- [ ] Can edit assumptions
- [ ] Calculations update correctly (MRR, ARR, profit, etc.)
- [ ] Can duplicate scenario
- [ ] Default scenarios available if none exist
- [ ] Refresh preserves scenario
- [ ] Dashboard shows financial summary
- [ ] Build passes

### Phase 14: Weekly Planning Room
- [ ] /weekly-planning loads
- [ ] Can create weekly plan
- [ ] Can edit weekly plan
- [ ] Can delete weekly plan
- [ ] Latest plan appears on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 15: Notes
- [ ] /notes loads with list
- [ ] Can create note
- [ ] Can edit note
- [ ] Can pin/unpin note
- [ ] Pinned notes appear on dashboard
- [ ] Can search by title/body
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 16: Decision Log
- [ ] /decisions loads with list
- [ ] Can create decision
- [ ] Can edit decision
- [ ] Can update status
- [ ] Recent decisions appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 17: Whiteboard Cleanup
- [ ] /whiteboards list page works
- [ ] Can create new whiteboard from list
- [ ] Can rename whiteboard
- [ ] Can delete whiteboard
- [ ] Existing whiteboards still open and render
- [ ] Can draw and save
- [ ] Refresh restores drawings
- [ ] Save status indicator works (Saved/Saving/Unsaved/Error)
- [ ] Whiteboard route works inside app shell
- [ ] Build passes

### Phase 18: Phase 1 Audit
- [ ] All Phase 2 acceptance tests pass
- [ ] No signup exists
- [ ] No registration exists
- [ ] No public account system exists
- [ ] No tldraw is used
- [ ] No localStorage as main database
- [ ] All forms validate with Zod
- [ ] All delete actions have confirmation
- [ ] All empty states are clear
- [ ] Build passes

## Milestone 3 — Sales & Growth

### Phase 20: Outreach Planner
- [ ] Can create campaign
- [ ] Can edit campaign
- [ ] Rates calculate correctly (reply, positive reply, booked, close)
- [ ] Active campaigns appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 21: Script Library
- [ ] Can create script
- [ ] Can edit script
- [ ] Can delete script
- [ ] Can link script to offer/niche
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 22: Sales Pipeline
- [ ] Can create prospect
- [ ] Can move prospect between statuses
- [ ] Can edit prospect
- [ ] Active prospect count appears on dashboard
- [ ] Follow-ups due appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 23: Experiment Tracker
- [ ] Can create experiment
- [ ] Can edit experiment
- [ ] Can mark decision (Scale/Keep Testing/Kill/Modify)
- [ ] Running experiments appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 24: Funnel Planner
- [ ] Can create funnel
- [ ] Can edit funnel stages
- [ ] Can link to niche and offer
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 25: Phase 2 Audit
- [ ] All Milestone 3 acceptance tests pass
- [ ] Dashboard reflects campaigns, prospects, follow-ups, experiments
- [ ] No fake metrics
- [ ] No broken sidebar links
- [ ] Build passes

## Milestone 4 — Fulfillment & Operations

### Phase 27: Client Tracker
- [ ] Can create client
- [ ] Can edit client
- [ ] Active clients affect dashboard MRR
- [ ] Churn-risk clients appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 28: Fulfillment Tracker
- [ ] Can create task for client
- [ ] Can update status
- [ ] Overdue tasks appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 29: SOP Library
- [ ] Can create SOP
- [ ] Can edit SOP
- [ ] Can filter by category/status
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 30: VA Task System
- [ ] Can create VA task
- [ ] Can assign by name
- [ ] Can update status
- [ ] Overdue tasks appear
- [ ] No VA login/account system exists
- [ ] Build passes

### Phase 31: Automation Map
- [ ] Can create automation template
- [ ] Can edit setup/testing steps
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 32: Website Template Library
- [ ] Can create template
- [ ] Can link to niche
- [ ] Can edit sections
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 33: Review System Planner
- [ ] Can create review tracker
- [ ] Can update review count/rating
- [ ] Review risk clients appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 34: Churn & Retention Planner
- [ ] Can create retention playbook
- [ ] Can mark client as at risk
- [ ] At-risk clients appear on dashboard
- [ ] Refresh preserves data
- [ ] Build passes

### Phase 35: Phase 3 Audit
- [ ] All Milestone 4 acceptance tests pass
- [ ] Dashboard uses real client/MRR/task/churn data
- [ ] No fake data
- [ ] No public accounts
- [ ] No broken routes
- [ ] Whiteboard still works
- [ ] Build passes

## Milestone 5 — Data & Metrics

### Phase 37: CSV Import
- [ ] Can upload CSV
- [ ] Can preview rows
- [ ] Can save import batch
- [ ] Import history appears
- [ ] Raw records stored
- [ ] Build passes

### Phase 38: Metrics Dashboard
- [ ] Metrics page loads
- [ ] Uses real data
- [ ] Empty states when data missing
- [ ] Dashboard and metrics are consistent
- [ ] Build passes

### Phase 39: Reports
- [ ] Can generate weekly business review
- [ ] Report uses real database records
- [ ] Missing data handled clearly
- [ ] Build passes

### Phase 40: Integration Placeholders
- [ ] Integrations page loads
- [ ] Providers listed
- [ ] Notes/status can be saved
- [ ] No real external API calls
- [ ] Build passes

## Milestone 6 — Polish & Ship

### Phase 41: Full App Audit
- [ ] All 26 routes load without errors
- [ ] All CRUD pages persist data
- [ ] All forms validate
- [ ] All delete actions safe
- [ ] Dashboard uses real data
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No build errors

### Phase 42: UI Polish
- [ ] Sidebar consistent across all pages
- [ ] Page headers consistent
- [ ] Empty states on all list pages
- [ ] Form spacing consistent
- [ ] Buttons consistent
- [ ] Loading states present
- [ ] Error states clear
- [ ] Mobile basic usability works

### Phase 43: Docker Hardening
- [ ] `docker compose up` works
- [ ] PostgreSQL data persists
- [ ] ADMIN_PASSWORD documented
- [ ] Health checks work
- [ ] Production build works

### Phase 44: Documentation
- [ ] README.md covers setup, features, env vars
- [ ] OPERATOR_MANUAL.md explains weekly usage
- [ ] All docs up to date

### Phase 45: Final Acceptance
- [ ] All 30 checklist items pass
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
