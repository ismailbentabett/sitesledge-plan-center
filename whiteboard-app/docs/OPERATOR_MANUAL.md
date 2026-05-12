# Operator Manual — SiteSledge Command Center

## Weekly Operating Guide

This manual explains how to use each module in your weekly workflow.

---

## Monday: Weekly Planning

1. Open **Weekly Planning** (`/weekly-planning`)
2. Create a new plan for this week
3. Fill in:
   - **Previous Week Review**: What happened last week
   - **What Worked**: Successful actions
   - **What Did Not Work**: Failures and bottlenecks
   - **Main Bottleneck**: The #1 constraint right now
   - **Main Metric**: The metric you're optimizing this week
   - **Weekly Goal**: Specific, measurable target
   - **Top Priorities**: 3-5 priorities for the week
   - **Sales Actions**: Outreach, follow-ups, calls
   - **Fulfillment Actions**: Client setup tasks
   - **System Actions**: Automation, SOP, template work
   - **Delegated Tasks**: What to assign to VAs
   - **Stopped Tasks**: What to stop doing

4. Check the **Command Dashboard** (`/dashboard`) for:
   - Current MRR and active clients
   - Active niche and offer focus
   - This week's priority (from weekly plan)
   - Open follow-ups in pipeline
   - Overdue fulfillment tasks
   - Running experiments

---

## Daily: Sales Pipeline Management

1. Open **Pipeline** (`/pipeline`)
2. Review prospects due for follow-up today
3. Update prospect statuses as you contact them
4. Move prospects through stages: Lead → Contacted → Interested → Booked Call → Closed Won/Lost
5. Add new prospects from your lead scraping

### Outreach Campaigns
1. Open **Outreach** (`/outreach`)
2. Update campaign metrics daily:
   - sentCount, replyCount, positiveReplyCount, bookedCallCount, closedWonCount
3. Kill campaigns with poor reply rates after sufficient volume
4. Scale campaigns with strong metrics

### Scripts
1. Open **Scripts** (`/scripts`)
2. Update script versions based on what's working
3. Link scripts to active offers and niches
4. Retire underperforming scripts

---

## Daily: Fulfillment

1. Open **Fulfillment Tracker** (`/fulfillment`)
2. Review tasks due today or overdue
3. Update task stages as you complete setup steps:
   - Payment Received → Onboarding → Access Collected → Website Started → Website Completed → Review Automation → Missed-Call Text-Back → Database Reactivation → QA → Client Approval → Launched
4. Update QA status for completed tasks

### VA Tasks
1. Open **VA Tasks** (`/va-tasks`)
2. Assign new tasks to VAs by name
3. Review completed tasks and update QA status
4. Archive done tasks

### SOPs
1. Open **SOP Library** (`/sops`)
2. Update SOPs when processes change
3. Create new SOPs for recurring tasks
4. Mark SOPs as Active when ready for VA use

---

## Weekly: Business Review

1. Open **Reports** (`/reports`)
2. Generate **Weekly Business Review** report
3. Review:
   - Financial summary (MRR, active clients)
   - Sales summary (prospects, campaigns)
   - Running experiments
   - Recent decisions
   - Pinned notes

4. Open **Metrics Dashboard** (`/metrics`)
5. Review all aggregated metrics
6. Identify trends and anomalies

---

## Weekly: Experiment Review

1. Open **Experiments** (`/experiments`)
2. Review running experiments
3. Update results and mark decisions:
   - **Scale**: Working well, increase investment
   - **Keep Testing**: Need more data
   - **Kill**: Not working, stop
   - **Modify**: Change approach and retest

---

## Weekly: Financial Review

1. Open **Financial Model** (`/financial-model`)
2. Update your base scenario with actual numbers
3. Compare projections to reality
4. Adjust assumptions if needed

### Financial Records
1. Update monthly financial records with actual MRR, new clients, churned clients
2. Set target MRR for upcoming months

---

## As Needed: Niche & Offer Management

### Niches
1. Open **Niches** (`/niches`)
2. Add new niches for research
3. Score each niche on 12 dimensions (1-5)
4. Mark niches as Active when testing
5. Sort by opportunity score to prioritize

### Offers
1. Open **Offers** (`/offers`)
2. Create offers linked to active niches
3. Define pricing, promise, mechanism, assets, guarantees
4. Write cold email/call versions
5. Mark offers as Active when testing
6. Retire underperforming offers

---

## As Needed: Notes & Decisions

### Notes
1. Open **Notes** (`/notes`)
2. Create quick notes for ideas, research, reminders
3. Pin important notes to surface them on dashboard
4. Tag notes for organization

### Decision Log
1. Open **Decisions** (`/decisions`)
2. Record important business decisions with:
   - Context and options considered
   - Chosen option and reasoning
   - Expected result
   - Set a review date
3. Update decisions when outcomes are known:
   - Validated: Decision proved correct
   - Reversed: Decision was wrong, changed course

---

## As Needed: Whiteboards

1. Open **Whiteboards** (`/whiteboards`)
2. Create whiteboards for visual planning
3. Draw, add text, organize ideas
4. Auto-save is enabled; manual save also available
5. Share whiteboards via public links (read-only)

---

## Client Management

### Adding a New Client
1. Open **Clients** (`/clients`)
2. Click **Add Client**
3. Fill in:
   - Business name, contact name, email, phone
   - Package and monthly price
   - Start date
   - URLs: website, GHL sub-account, Google Business Profile
   - Access notes (credentials, login info)
   - Churn risk assessment

### Monitoring Churn Risk
1. Dashboard shows high churn risk client count
2. Open **Retention** (`/retention`) for playbooks
3. Apply retention plays for at-risk clients

### Review Tracking
1. Open **Reviews** (`/reviews`)
2. Create a tracker per client
3. Set target review count
4. Update current rating and count monthly
5. Flag clients needing review response

---

## Automation & Templates

### Automations
1. Open **Automations** (`/automations`)
2. Document GHL automation workflows
3. Include trigger, action, setup steps, testing steps, failure cases
4. Link to package level (which tier gets this automation)

### Website Templates
1. Open **Website Templates** (`/website-templates`)
2. Create templates for each niche
3. Define pages, hero headline, sections, CTA, SEO keywords
4. Link to niche for quick reference

---

## Data Import

1. Open **Imports** (`/imports`)
2. Create import batch records when importing CSV data
3. Track source, file name, record count, status
4. Update status as processing completes

---

## Integrations (Placeholders)

1. Open **Integrations** (`/integrations`)
2. Add placeholder entries for future system connections
3. Track provider, API key, webhook URL, status
4. No real API connections are active yet

---

## Keyboard Shortcuts & Tips

- **Sidebar**: Always visible on the left. Click any module to navigate.
- **Active route**: Highlighted in the sidebar.
- **Logout**: Button at the bottom of the sidebar.
- **Dark/Light mode**: Toggle in the top bar.
- **Search**: Use your browser's find (Ctrl+F) to search within pages.
- **Filters**: Most list pages have dropdown filters for status, priority, etc.

---

## Troubleshooting

### App won't start
```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
```

### Password not working
- Check `ADMIN_PASSWORD` in your `.env` file
- Restart the dev server after changing `.env`

### Database errors
```bash
# SQLite
pnpm db:push

# PostgreSQL (Docker)
docker compose up -d
pnpm db:migrate
```

### Whiteboard not saving
- Check database connection
- Verify Prisma client is generated: `pnpm db:generate`

---

## Security Notes

- The admin password is stored in plain text in `.env` — protect this file
- Do not commit `.env` to version control
- Integration API keys are stored in the database — encrypt in production
- Public whiteboard share links are accessible without authentication
