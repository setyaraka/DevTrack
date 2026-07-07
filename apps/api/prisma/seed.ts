import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'laplace@mailinator.com';
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    const passwordHash = await bcrypt.hash('password', 12);
    user = await prisma.user.create({
      data: {
        email,
        name: 'Laplace',
        passwordHash,
        avatarUrl: '',
        company: 'Acme Software',
        jobTitle: 'Senior Software Engineer',
      },
    });
  }

  const userId = user.id;

  // Delete existing data to prevent duplicate seeds
  await prisma.settings.deleteMany({ where: { userId } });
  await prisma.dailyTask.deleteMany({ where: { userId } });
  await prisma.dailyJournal.deleteMany({ where: { userId } });
  await prisma.workLog.deleteMany({ where: { userId } });
  await prisma.learning.deleteMany({ where: { userId } });
  await prisma.feedback.deleteMany({ where: { userId } });
  await prisma.achievement.deleteMany({ where: { userId } });
  await prisma.challenge.deleteMany({ where: { userId } });
  await prisma.weeklyReview.deleteMany({ where: { userId } });
  await prisma.monthlyReview.deleteMany({ where: { userId } });

  // 1. Settings
  await prisma.settings.create({
    data: {
      userId,
      theme: 'SYSTEM',
      sidebarMode: 'EXPANDED',
      workingDays: JSON.stringify(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
      autoTaskRollover: true,
      rolloverTime: '08:00',
      timezone: 'Asia/Jakarta',
    },
  });

  // Helper to generate dates relative to today
  const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  // 2. Daily Journals & Tasks (last 10 days)
  for (let i = 0; i < 10; i++) {
    const date = getPastDate(i);
    const journal = await prisma.dailyJournal.create({
      data: {
        userId,
        date,
        reflection: `Reflection for day ${i}: completed engineering milestones and resolved team alignment challenges.`,
        summary: `Summary of Day -${i}: daily tasks completed and progress made on Phase 4 dashboard charts.`,
        notes: `Notes for Day -${i}: remember to look into SQL query optimizations next week.`,
      },
    });

    // Create 3 tasks per day
    await prisma.dailyTask.createMany({
      data: [
        {
          userId,
          journalId: journal.id,
          date,
          title: `Build API endpoint for settings - Day -${i}`,
          completed: i > 2, // older than 3 days is completed
          priority: 'HIGH',
        },
        {
          userId,
          journalId: journal.id,
          date,
          title: `Review settings page pull request - Day -${i}`,
          completed: i > 4,
          priority: 'MEDIUM',
        },
        {
          userId,
          journalId: journal.id,
          date,
          title: `Optimize Prisma queries in dashboard - Day -${i}`,
          completed: true,
          priority: 'LOW',
        },
      ],
    });
  }

  // 3. Work Logs
  await prisma.workLog.createMany({
    data: [
      {
        userId,
        title: 'Auth Rollover logic and JWT security fixes',
        description: 'Fixed token refresh race conditions and added automatic rollover interceptor in frontend vue routers.',
        category: 'BUG',
        date: getPastDate(1),
        impact: 'Secured user session tokens and improved app loading stability.',
        relatedPr: 'https://github.com/setyaraka/DevTrack/pull/12',
      },
      {
        userId,
        title: 'Settings page visual layout and dark theme implementation',
        description: 'Designed responsive Notion-like tab menus and wired tailwind darkMode toggles in settings store.',
        category: 'FEATURE',
        date: getPastDate(2),
        impact: 'Delivered customized user workspaces and profile preferences.',
        relatedPr: 'https://github.com/setyaraka/DevTrack/pull/15',
      },
      {
        userId,
        title: 'Optimize Prisma query indexes for performance reviews API',
        description: 'Added composite indexes in schema.prisma and cleaned up unused database select joins.',
        category: 'IMPROVEMENT',
        date: getPastDate(4),
        impact: 'Reduced dashboard overview aggregation loading time by 45%.',
        relatedPr: 'https://github.com/setyaraka/DevTrack/pull/18',
      },
      {
        userId,
        title: 'Refactored state stores to use Pinia composables',
        description: 'Streamlined state actions and split global states into single-purpose feature files.',
        category: 'REFACTOR',
        date: getPastDate(6),
        impact: 'Improved developer code modularity and bundle compiled size.',
      },
    ],
  });

  // 4. Learnings
  await prisma.learning.createMany({
    data: [
      {
        userId,
        topic: 'NestJS Interceptors & Custom Decorators',
        description: 'Mastered request interceptors to format global api response packages and map CurrentUser variables cleanly.',
        understandingLevel: 5,
        tags: ['backend', 'nestjs', 'typescript'],
        createdAt: getPastDate(5),
      },
      {
        userId,
        topic: 'SVG Path Math and Graphing in Vue 3',
        description: 'Learned line chart computing using SVG dynamic viewports and point coordinates maps.',
        understandingLevel: 4,
        tags: ['frontend', 'svg', 'vue3'],
        createdAt: getPastDate(3),
      },
    ],
  });

  // 5. Feedbacks
  await prisma.feedback.createMany({
    data: [
      {
        userId,
        reviewer: 'John Doe (Tech Lead)',
        feedback: 'Excellent work delivering Phase 3 career tracker modules ahead of schedule. Form inputs look clean and intuitive.',
        category: 'CODE_REVIEW',
        applied: true,
        date: getPastDate(3),
      },
      {
        userId,
        reviewer: 'Jane Smith (Product Manager)',
        feedback: 'Appreciate the quick fixes on search bar layout. The reporting preview is useful for monthly review meetings.',
        category: 'TECHNICAL',
        applied: true,
        date: getPastDate(7),
      },
    ],
  });

  // 6. Achievements
  await prisma.achievement.createMany({
    data: [
      {
        userId,
        situation: 'DevTrack app was missing modular settings configuration and profile controls.',
        task: 'Deliver a production-ready Settings module with full validation and custom preferences.',
        action: 'Designed one-to-one Settings relational schemas, built patched APIs, and designed a left-tab sub-layout.',
        result: 'Shipped Settings module with theme preferences, automatic task rollover time options, and secure password checks.',
        impact: 'Unblocked user workspace customization and allowed flexible timezone configurations.',
        category: 'DELIVERY',
        date: getPastDate(2),
      },
    ],
  });

  // 7. Challenges
  await prisma.challenge.createMany({
    data: [
      {
        userId,
        problem: 'Magnifying glass search icon expanded to full viewport due to invalid Tailwind classes.',
        rootCause: 'h-4.5 and w-4.5 size classes are not natively defined in tailwind configs.',
        solution: 'Adjusted size class to h-5 w-5 to enforce SVG bounding boxes inside search forms.',
        result: 'Icon renders properly inside the header bar with correct layout margins.',
        lessonsLearned: 'Always verify custom sizing utilities against tailwind default configs.',
        date: getPastDate(1),
      },
    ],
  });

  // 8. Weekly Reviews (last 2 weeks)
  const monday1 = getPastDate(7);
  const monday2 = getPastDate(14);
  await prisma.weeklyReview.createMany({
    data: [
      {
        userId,
        weekStart: monday1,
        biggestWin: 'Completed all core features for Phase 3 and Phase 4 ahead of timelines.',
        biggestChallenge: 'Mapping and rendering complex SVG graphs without third-party chart libraries.',
        lessonsLearned: 'Native SVG paths offer complete layout control and avoid bulky client-side bundles.',
        nextWeekGoals: 'Implement fully featured Settings configurations and user profile uploads.',
      },
      {
        userId,
        weekStart: monday2,
        biggestWin: 'Setup NestJS API foundation and completed auth register/login endpoints.',
        biggestChallenge: 'Database schema relation structuring for career logs.',
        lessonsLearned: 'Proper Prisma unique indexes prevent duplicate database records.',
        nextWeekGoals: 'Integrate work log tracker and learning star ratings pages.',
      },
    ],
  });

  // 9. Monthly Review
  const monthStart = getPastDate(30);
  monthStart.setUTCDate(1);
  await prisma.monthlyReview.create({
    data: {
      userId,
      monthStart,
      summary: 'Focused on launching DevTrack MVP foundations, including journals, tasks, career metrics, and reports.',
      reflection: 'Grew backend NestJS architecture skills and mastered custom Prisma queries.',
      managerFeedback: 'Highly positive reviews on the weekly progress reports generated by the tool.',
      personalNotes: 'Targets for next month: build team integrations and exportable PDF summaries.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
