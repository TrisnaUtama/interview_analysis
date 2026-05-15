# Interview Prep SaaS — Complete UI/UX Flow & Implementation Guide

## Overview
End-to-end user journey from dashboard → job submission → interview → results & analytics.

---

## 1. DASHBOARD (Home Screen After Login)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  Interview Prep                              [Profile] [Settings] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐         │
│  │ Interviews: 12│  │ Avg Score: 7.4│  │Active Jobs: 8│         │
│  │ This mo: 5    │  │ ↑ 0.6 from... │  │Practicing..  │         │
│  └───────────────┘  └───────────────┘  └──────────────┘         │
│                                                                   │
│  ┌────────────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │+ Start Interview   │  │+ Add Job   │  │My Resumes        │   │
│  └────────────────────┘  └────────────┘  │Analytics & ...   │   │
│  (Primary CTA - solid)    (Secondary)     (Tertiary links)  │   │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│  Recent Activity                                                  │
│  • Completed: Software Engineer @ TechCorp (Score: 7.8) — 2d ago │
│  • Added resume: Updated_CV_May2024.pdf — 1 week ago             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Elements

**Stats Cards (4 columns, responsive to 2 on mobile)**
- Total Interviews (count)
- Avg Score (0-10, show improvement delta)
- Active Jobs (count)
- Streak / Consistency (optional: "5 consecutive days")

**Primary CTA**
- "Start New Interview" (solid background, prominent) — should be obvious
- Pre-fills with resume + job from recent activity if user taps

**Secondary Navigation**
- "Add Job" (outline button)
- "My Resumes" (subtle link)
- "Analytics & Insights" (subtle link)
- "Settings" (top-right corner)

**Recent Activity Feed**
- Last 3 completed interviews + timestamps
- Last 2 resumes uploaded
- Inline actions: "Retake," "View Results," "Delete"
- Scrollable, show 5-6 items max before "View All"

---

## 2. ADD JOB FLOW

### Step 1: Choose Input Method
Modal/Page with two options:

```
┌────────────────────────────────────────────────────┐
│ Add Job Description                            [X] │
├────────────────────────────────────────────────────┤
│                                                    │
│ ☑ Paste Job Portal Link                          │
│   LinkedIn, Indeed, Glassdoor, etc.              │
│   Auto-crawls & extracts content                 │
│                                                    │
│   [https://linkedin.com/jobs/view/...]           │
│   [Crawl Job ▶]                                  │
│                                                    │
│ ─────────────────────────────────────────────── │
│                                                    │
│ ○ Paste Job Description Manually                 │
│   Copy-paste full JD or use rich text editor     │
│                                                    │
│   [Rich editor with formatting toolbar]          │
│                                                    │
│ ─────────────────────────────────────────────── │
│                                                    │
│ [Back]                      [Continue ▶]        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**UX Notes:**
- Radio buttons for toggling between options
- URL input auto-validates (check domain is legit job board)
- Rich editor for manual entry (support paste + formatting)
- Show "Analyzing..." spinner if paste-URL triggers immediate crawl
- Error states: "Invalid URL" / "Failed to crawl—try pasting text instead"

### Step 2: Processing State
Immediate feedback while AI analyzes:

```
┌────────────────────────────────────────────────────┐
│ Analyzing Job Description                          │
├────────────────────────────────────────────────────┤
│                                                    │
│ [████░░░░░] 60%                                   │
│                                                    │
│ → Extracting skills and requirements...           │
│ → Identifying seniority level...                  │
│ → Matching against your resume...                │
│                                                    │
│ Estimated time: 10 seconds                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Completion State:**
```
┌────────────────────────────────────────────────────┐
│ ✓ Ready to Start Interview                        │
├────────────────────────────────────────────────────┤
│                                                    │
│ Senior Software Engineer @ TechCorp               │
│ • 18 skills extracted (8 matched to your resume) │
│ • Seniority: Mid-to-Senior                        │
│ • Match Score: 78%                                │
│                                                    │
│ Skill Gaps (to practice):                         │
│ • React Hooks                                     │
│ • System Design (microservices)                   │
│                                                    │
│ [Start Interview ▶]                              │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 3. SELECT INTERVIEW TYPE & RESUME

### Page Layout

```
┌────────────────────────────────────────────────────────────┐
│ Start Interview Setup                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Choose Resume              Interview Type      Duration   │
│                                                            │
│ ☑ Updated_CV_May2024.pdf  ☑ HR Interview      30 min    │
│   Senior SWE profile         Behavioral, soft skills     │
│   8 years experience                                      │
│                            ○ Technical          60 min   │
│ ○ Resume_Junior.pdf         Coding, system design       │
│   Junior SWE profile                                      │
│   1 year experience         Match Score: 78%             │
│                             Resume reviewed               │
│                                                            │
│                          [Start Interview ▶]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key UX:**
- Left column: resume selection (radio buttons)
  - Show parsed profile summary (seniority, key skills, years exp)
  - Ability to switch resumes mid-flow
- Middle column: interview type choice (radio buttons)
  - HR: Focus on behavioral, culture fit, soft skills
  - Technical: Coding, system design, problem-solving
  - (Optional 3rd: Behavioral-only for non-tech roles)
- Right column: quick info
  - Duration selector (15/30/60 min)
  - Match score vs job
  - "Resume analyzed ✓" indicator

---

## 4. INTERVIEW INTERFACE (Main Audio/Visual Flow)

### Top Section: Progress Bar + Timer

```
┌─────────────────────────────────────────────────────────────┐
│ Question 4 of 6  [████░░░░] 67%                Time: 12:34  │
└─────────────────────────────────────────────────────────────┘
```

**Visual Design:**
- Gray background, white progress bar
- Color-coded: blue for progress, amber/red if time running out
- Show time remaining prominently (larger font)
- Pause button on the right to freeze timer

### Main Content: Question Display

```
┌─────────────────────────────────────────────────────────────┐
│ Question (HR) — Behavioral                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tell me about a time you had conflict with a team          │
│ member. How did you resolve it?                            │
│                                                             │
│ AI is listening... 🎤 Recording (2:15 elapsed)            │
│                                                             │
│ ┌─────────────────────┐                                    │
│ │ ⬤ Stop Recording    │  Your answer will be analyzed     │
│ └─────────────────────┘                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Visual Feedback:**
- Waveform animation while recording (optional, use for brand feel)
- Large red "recording" indicator
- Timer showing answer duration
- Clean typography, dark text on light bg

### Control Buttons (Below Question)

```
┌───────────┬──────────────┬────────────┬──────────────┐
│ Recording │ Skip Question│ Repeat Q   │ Pause        │
│   ⬤      │              │            │              │
└───────────┴──────────────┴────────────┴──────────────┘
```

**Button Behavior:**
- **Recording:** Red, shows elapsed time, tap to stop
- **Skip Question:** Gray outline. Skipped questions appear in feedback. Limit: skip max 2 per interview
- **Repeat:** Replay question audio
- **Pause:** Save progress, allow user to come back later (state persists in DB)

### Right Sidebar: Candidate Profile Snapshot

```
┌──────────────────────────────┐
│ Your Profile                 │
├──────────────────────────────┤
│                              │
│ Senior Software Engineer     │
│ • 8 years exp                │
│ • React, Node.js, AWS        │
│ • Match: 78%                 │
│                              │
│ [Edit Profile ▶]             │
│                              │
└──────────────────────────────┘
```

---

## 5. RESULTS & FEEDBACK PAGE

### Immediate Results (First View)

```
┌──────────────────┬────────────────────────────────────────┐
│ Overall: 7.4/10  │ Score Breakdown                        │
│ ↑ +0.8 vs last   ├────────────────────────────────────────┤
│                  │ Technical:    [████████░] 8.1/10      │
│ ✓ Strong Yes     │ Communication:[██████░░░] 6.8/10      │
│                  │ Confidence:   [████████░] 7.9/10      │
│ Hiring Rec:      │ Relevance:    [███████░░] 7.2/10      │
│ Move to next     │                                        │
│ round            │ (2 key skills gap: React Hooks)       │
│                  │                                        │
└──────────────────┴────────────────────────────────────────┘
```

### Tabbed Feedback Section

**Tabs:** Strengths | Areas to Improve | Red Flags | Q&A Recap

#### Tab 1: Strengths
```
✓ Strong problem-solving approach
  You structured answers logically, breaking down complex 
  problems. Interviewers love this.

✓ Good recovery from difficult questions
  Asked clarifying questions instead of guessing. Shows 
  maturity. This is a PLUS signal.

✓ Relevant experience highlighted
  Mentioned 3+ projects matching job requirements. Shows 
  research and preparation.
```

#### Tab 2: Areas to Improve
```
⚠ Conciseness: Some answers too long
  Avg: 2m 15s | Target: 1m 30s for behavioral
  → Practice STAR method in <90s
  [Practice Drill →]

⚠ Technical gaps: React Hooks not covered
  Job requires React + hooks. Your answer lacked depth.
  → Review Hooks docs & retake
  [Study Guide →]

△ Speak with more confidence
  Used filler words ("um," "uh") 12 times.
  → Practice: Record yourself daily
  [Tips & Exercises →]
```

#### Tab 3: Red Flags (if any)
```
🚩 None detected

(Or, if issues found:)
🚩 Salary expectations unclear
  You avoided the salary question. This can be seen as 
  evasive. Practice a thoughtful range instead.

🚩 Limited examples in technical questions
  Gave 1 example instead of 2-3. Shows less depth.
```

#### Tab 4: Q&A Recap
```
Q1: Tell me about yourself
A: [Play ▶] (1m 34s)
   Covered: background, tech stack, motivation
   Score: 7.2/10

Q2: Most difficult project?
A: [Play ▶] (2m 08s)
   Used STAR method well. Clear action. Good result.
   Score: 8.1/10
   [Follow-up asked] Did you lead this project?

(… more Q&As, scrollable)
```

### Next Steps / CTA Section

```
┌───────────┬──────────────┬──────────────┬──────────────┐
│ 📄 Export │ 🔄 Retake    │ 📜 Transcript│ ✚ New        │
│ as PDF    │ Interview    │ Full Q&A     │ Interview    │
│ (Share)   │ (Fresh Q's)  │ (Timestamps) │ (Primary)    │
└───────────┴──────────────┴──────────────┴──────────────┘
```

Progress indicator:
```
This Month: 5 interviews | Avg: 6.8 → 7.4 ↑ | Recommended for 3 roles
```

---

## 6. ANALYTICS & PROGRESS DASHBOARD

### Layout

```
┌────────────────────────────────┬─────────────────────────┐
│ Score Trend (8 weeks)          │ Summary Stats            │
│                                │                         │
│  8├     ╱                       │ Total: 12               │
│   │    ╱╱ ← Upward trend      │ Avg: 7.4/10            │
│  7├   ╱╱╱╱                      │                         │
│   │  ╱╱╱╱╱                      │ Best: Tech (8.1)       │
│  6├ ╱╱                          │ Improve: Comm (6.8→↑)  │
│   │                             │                         │
│  5├                             │                         │
│   └─────────────────────        │                         │
│     W1 W2 W3 W4 W5 W6 W7 W8    │                         │
│                                 │                         │
└────────────────────────────────┴─────────────────────────┘
```

### Detailed Breakdown (Below)

```
By Interview Type
• HR Interviews: 7 total | Avg: 7.1/10
• Technical Interviews: 5 total | Avg: 7.8/10

By Skill
• Technical Depth: 8.1 (strong ↑)
• Communication: 6.8 (improving ↑)
• Confidence: 7.9 (consistent)
• Relevance: 7.2 (needs work)

By Company/Role
• TechCorp positions: 3 interviews
• StartupXYZ roles: 2 interviews
• Consulting firms: 1 interview
```

---

## 7. MOBILE-SPECIFIC ADAPTATIONS

### Dashboard (Mobile)
- Stack all 4 stat cards vertically (no grid)
- Single-column layout
- Larger touch targets (buttons: min 44px height)
- "Start Interview" button full-width, sticky bottom

### Interview Interface (Mobile)
- Full-screen mode (hide nav bar during recording)
- Landscape preferred for better readability
- Buttons stack vertically on portrait view
- Waveform animation (if used) takes full width

### Results (Mobile)
- Tabs: horizontal scroll (Strengths | Areas | Red Flags | Q&A)
- Cards full-width, padding reduced
- CTA buttons: horizontal scroll or full-width stacked

---

## 8. DESIGN TOKENS & CONSISTENCY

### Typography
- **Display (Headlines):** 28px, weight 500 (dashboard title)
- **Heading 2:** 18px, weight 500 (section titles)
- **Heading 3:** 16px, weight 500 (subsections)
- **Body:** 14-16px, weight 400, line-height 1.6
- **Label/Small:** 11-12px, weight 400
- **Mono (code):** Use system mono font, 12px

### Colors (Use CSS Variables)
- **Primary:** `--color-text-primary` (titles, active states)
- **Secondary:** `--color-text-secondary` (muted text)
- **Success:** `--color-text-success` (scores, checkmarks)
- **Warning:** `--color-text-warning` (skill gaps, improvements)
- **Danger:** `--color-text-danger` (red flags, errors)
- **Info:** `--color-text-info` (CTAs, highlights)

### Spacing
- **Margins:** 1rem (16px), 1.5rem (24px), 2rem (32px)
- **Padding (cards):** 1rem-1.25rem
- **Button height:** 44-48px
- **Input height:** 36-40px

### Borders & Shadows
- **Standard border:** 0.5px solid `--color-border-tertiary`
- **Hover border:** 0.5px solid `--color-border-secondary`
- **No shadows** (flat design)
- **Border radius:** 6-8px for cards, 4px for inputs

### Interactive Elements
- **Buttons:** Outline style by default (transparent bg, border)
- **Primary CTA:** Solid background (info color), white text
- **Hover state:** Slightly darker background / border
- **Active state:** Slight scale-down (0.98x), box-shadow
- **Disabled:** Opacity 50%, no cursor change

---

## 9. FLOW STATE & MICRO-INTERACTIONS

### Loading States
- Show progress bar (0-100%) with descriptive text
- Use skeleton loaders for cards (not blur)
- Never show spinners without context ("Analyzing... 60%")

### Success States
- Checkmark icon + color change (green)
- Brief celebration message
- Auto-dismiss after 2-3s or CTA

### Error States
- Red banner at top of page / modal
- Clear explanation + recovery action
- Example: "Failed to crawl job URL — try pasting text instead"

### Empty States
- Illustration (optional but recommended)
- Helpful CTA ("Add your first job" with "➕ Add Job" button)
- Show example if possible

### Transitions
- Page transitions: fade or subtle slide (200-300ms)
- Button hover: background change (150ms)
- Tab switches: fade content (100ms)
- No heavy animations (keep performance high)

---

## 10. ACCESSIBILITY CHECKLIST

- [ ] All buttons have visible focus rings (`outline: 2px solid`)
- [ ] Color not sole indicator (use icons + text)
- [ ] Proper heading hierarchy (h1 > h2 > h3, no skips)
- [ ] Form labels associated with inputs (`<label for="...">`)
- [ ] Alt text on all images / icons
- [ ] Sufficient contrast (WCAG AA min)
- [ ] Keyboard navigation works (tab through all interactive elements)
- [ ] Screen reader: use ARIA labels for icon-only buttons
- [ ] Touch targets: min 44x44px on mobile
- [ ] Captions for interview audio playback (optional but valuable)

---

## 11. IMPLEMENTATION PRIORITY (MVP → V2)

### MVP (Week 1-2)
1. Dashboard with basic stats
2. Add Job (URL + manual)
3. Interview selection (type + resume)
4. Interview interface (simple, no visuals)
5. Results page (score + feedback tabs)

### V1.1 (Week 3-4)
1. Analytics dashboard (chart + stats)
2. Mobile optimization
3. Resume management ("My Resumes" page)
4. Progress tracking (improve over time)

### V2 (Future)
1. Video recording (optional for HR/non-tech)
2. AI-powered interview generation (dynamic questions based on performance)
3. Collaborative mode (peer reviews)
4. Integration with job boards (auto-import)
5. Mock interview with real engineers (paid add-on)

---

## 12. DATABASE UPDATES NEEDED

No major schema changes needed, but add:

```sql
-- Resume-job matching (from earlier recommendation)
CREATE TABLE resume_job_matches (
    id UUID PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id),
    job_id UUID REFERENCES jobs(id),
    match_score FLOAT,
    matched_skills JSONB,
    skill_gaps JSONB,
    UNIQUE(resume_id, job_id)
);

-- User analytics snapshot (for dashboard query efficiency)
CREATE TABLE user_practice_analytics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    total_interviews INT,
    avg_overall_score FLOAT,
    avg_technical_score FLOAT,
    avg_communication_score FLOAT,
    improvement_trajectory JSONB,
    last_updated TIMESTAMPTZ
);
```

---

## 13. API ENDPOINTS (Backend Reference)

```
Dashboard:
GET /api/users/me/dashboard → stats + recent activity

Add Job:
POST /api/jobs → create job
POST /api/jobs/{id}/descriptions → add JD
GET /api/jobs/{id}/analysis-status → poll for completion

Interview Selection:
GET /api/users/me/resumes → list resumes
POST /api/interviews → create interview session

During Interview:
GET /api/interviews/{id}/current-question → get next Q
POST /api/interviews/{id}/answers → submit answer
PATCH /api/interviews/{id} → pause/resume

Results:
GET /api/interviews/{id}/analysis → full feedback
POST /api/interviews/{id}/export → PDF generation

Analytics:
GET /api/users/me/analytics → dashboard data
```

---

## 14. USER FLOW SUMMARY (One-Liner Per Step)

1. **Login** → Redirects to Dashboard
2. **Dashboard** → View stats, choose action (Start Interview / Add Job / View Analytics)
3. **Add Job** → Choose input method (URL or manual) → AI analyzes → ready to interview
4. **Select Interview** → Pick resume + type + duration → confirmation
5. **Interview** → AI asks 6 questions, user responds via audio → progress tracked
6. **Results** → See score breakdown + strengths/gaps + next steps
7. **Analytics** → Track progress over weeks, identify trends
8. **Repeat** → Retake same role or start new interview

---

## 15. OPEN QUESTIONS FOR REFINEMENT

- Should users be able to **schedule** interviews (mock later)?
- Do you want **real-time feedback** (after each Q) or batch feedback (after all)?
- Should there be **difficulty levels** (junior/mid/senior auto-adjust questions)?
- Should users **record video** or just audio?
- Should you show **hints/tips** before answer evaluation?

---

End of flow document. Ready to code? 🚀