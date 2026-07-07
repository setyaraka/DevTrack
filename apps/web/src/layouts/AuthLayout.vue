<template>
  <main class="grid min-h-screen bg-white lg:grid-cols-[1fr_520px]">
    <section class="hidden bg-ink-900 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <p class="text-sm font-semibold text-blue-200">DevTrack</p>
        <h1 class="mt-8 max-w-xl text-5xl font-semibold leading-tight">
          Build a durable record of your engineering career.
        </h1>
      </div>
      <p class="max-w-lg text-sm leading-6 text-ink-200">
        Track daily work, learning, feedback, achievements, and review-ready evidence in one
        focused workspace.
      </p>
    </section>
    <section class="flex min-h-screen items-center justify-center px-6 py-10">
      <div class="w-full max-w-sm">
        <RouterView />
      </div>
    </section>
  </main>
</template>
