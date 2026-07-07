# DevTrack

DevTrack is a production-ready personal engineering career companion for tracking daily work, learning, feedback, achievements, challenges, reviews, and reports.

## Phase 1 Scope

- Monorepo setup with `apps/web` and `apps/api`
- Vue 3, Vite, TypeScript, TailwindCSS frontend foundation
- NestJS, Prisma, PostgreSQL backend foundation
- JWT authentication module
- Normalized Prisma schema for core product entities
- App layout, sidebar, dashboard shell, and reusable design-system components

## Commands

```bash
npm install
npm run dev:web
npm run dev:api
```

Copy `apps/api/.env.example` to `apps/api/.env` and configure `DATABASE_URL` before running Prisma migrations.
