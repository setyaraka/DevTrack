# DevTrack

DevTrack is a production-ready personal engineering career companion for tracking daily work, learning, feedback, achievements, challenges, reviews, and reports.

## Development Roadmap

### Phase 1 – Foundation
Fokus: membangun pondasi aplikasi yang rapi, scalable, dan production-ready.
**Deliverables:**
- **Monorepo/project setup**
- **Frontend:** Vue 3 + Vite + TypeScript
- **Backend:** NestJS + Prisma + PostgreSQL
- **TailwindCSS setup**
- **Libraries:** Vue Router, Pinia, Vue Query, Axios
- **JWT authentication:** Register, Login, Refresh token, Logout
- **Prisma schema awal:** User, DailyJournal, DailyTask, WorkLog, Learning, Feedback, Achievement, Challenge, WeeklyReview, MonthlyReview
- **Layout utama:** Auth layout, App layout, Sidebar, Header, Responsive shell
- **Design system awal:** Button, Input, Select, Textarea, Modal, Card, Badge, Empty state, Loading state
- **Backend base architecture:** Feature modules, DTO validation, Guards, Interceptors, Swagger, Error handling

*Output:* User bisa register, login, masuk ke dashboard kosong, dan aplikasi punya struktur frontend/backend yang siap dikembangkan.

### Phase 2 – Daily Journal, Daily Task, dan Automatic Task Rollover
Fokus: membangun core daily workflow.
**Deliverables:**
- **Daily Journal:** Create/update journal per tanggal, Reflection, Summary, Notes, Markdown support
- **Daily Tasks:** Create task, Update task, Complete/uncomplete task, Delete task, Priority, Order, Due date, Filter by date
- **Automatic Task Rollover:**
  - Detect incomplete tasks from previous day
  - Copy/move unfinished tasks to next day
  - Completed tasks tetap di hari sebelumnya
  - Prevent duplicate rollover
  - Rollover dapat berjalan saat user membuka app atau via backend service
- **UI:** Daily page dengan date picker, Journal editor, Task list, Empty state, Loading state

*Output:* User bisa menjalankan rutinitas harian dan unfinished task tidak hilang saat hari berganti.

### Phase 3 – Career Tracking Modules
Fokus: mencatat bukti kerja, pembelajaran, feedback, achievement, dan challenge.
**Deliverables:**
- **Work Log:** Bug, Feature, Improvement, Research, Meeting, Discussion, Refactor, Documentation, Testing, Impact, Related PR
- **Learning Tracker:** Topic, Description, Understanding level 1-5, Tags
- **Feedback Tracker:** Reviewer, Feedback, Category, Applied status, Date
- **Achievement Tracker (STAR format):** Situation, Task, Action, Result, Impact, Category
- **Challenge Tracker:** Problem, Root cause, Solution, Result, Lessons learned
- **Weekly Review:** Biggest win, Biggest challenge, Lessons learned, Next week goals
- **Monthly Review:** Summary, Reflection, Manager feedback, Personal notes

*Output:* DevTrack mulai terasa sebagai career companion, bukan sekadar task tracker.

### Phase 4 – Dashboard Analytics, Search, Filter, dan Report Generator
Fokus: mengubah data menjadi insight.
**Deliverables:**
- **Dashboard analytics cards:** Total Tasks, Completed Tasks, Completion Rate, Bugs Solved, Features Delivered, Improvements, Documentation Created, Learning Topics, Achievements, Challenges, Feedback Received
- **Charts:** Weekly Productivity, Monthly Productivity, Task Completion Trend, Learning Progress, Category Distribution
- **Search global/basic:** Tasks, Work logs, Learning, Achievements, Challenges, Feedback
- **Filters:** Date range, Category, Status, Priority, Tags
- **Pagination** untuk list besar
- **Report Generator:** Select date range, Select sections, Preview report, Generate structured report data, Backend dashboard aggregation endpoints

*Output:* User bisa melihat progress, mencari data lama, dan menyiapkan bahan performance review.

### Phase 5 – Export, AI Integration, External Integrations, dan Premium Features
Fokus: fitur lanjutan dan nilai produk yang lebih tinggi.
**Deliverables:**
- **Export:** PDF, Excel, CSV (Overview, Dashboard, Tasks, Work Log, Achievements, Challenges, Learning, Feedback, Weekly Summary, Monthly Summary)
- **AI integration:** Generate weekly summary, Generate monthly review draft, Turn work logs into performance review bullets, Convert achievements into STAR stories, Suggest improvement areas
- **GitHub integration:** Import PR links, Track merged PRs, Associate PRs with work logs
- **Jira integration:** Import tickets, Link tickets to tasks/work logs
- **Premium features:** Dashboard streak, Daily productivity score, Weekly completion percentage, Achievement badges, Advanced report templates, AI-assisted promotion packet, AI-assisted interview story generator

*Output:* DevTrack menjadi produk SaaS yang lebih kuat, dengan export profesional, integrasi kerja nyata, dan fitur AI bernilai tinggi.


## Commands

```bash
npm install
npm run dev:web
npm run dev:api
```

Copy `apps/api/.env.example` to `apps/api/.env` and configure `DATABASE_URL` before running Prisma migrations.
