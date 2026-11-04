import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  Kanban,
  Building2,
  FolderKanban,
  MessagesSquare,
  Bell,
  ShieldCheck,
  Users,
  ArrowRight,
  Check,
  ChevronDown,
  Briefcase,
  Rocket,
  Wrench,
  Building
} from 'lucide-react';
import AuthRedirect from '@/components/home/AuthRedirect';
import InstallAppButton from '@/components/pwa/InstallAppButton';
import { BoardMock, ChatMock, ProgressMock } from '@/components/landing/ProductMockups';
import ScreenshotFrame from '@/components/landing/ScreenshotFrame';
import Reveal from '@/components/landing/Reveal';
import AnimatedText from '@/components/landing/AnimatedText';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Parallax from '@/components/landing/Parallax';
import TiltCard from '@/components/landing/TiltCard';
import SpotlightCard from '@/components/landing/SpotlightCard';
import FeatureMarquee from '@/components/landing/FeatureMarquee';
import AuthBackdrop from '@/components/auth/AuthBackdrop';
import { findScreenshot } from '@/lib/screenshots';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: '/' }
};

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '#faq', label: 'FAQ' }
];

const features = [
  {
    icon: Building2,
    title: 'Workspaces for every team',
    text: 'Create a workspace for your team or client, add projects and invite people. Each workspace is private to the people in it.'
  },
  {
    icon: FolderKanban,
    title: 'Projects with live progress',
    text: 'Every project shows its to-do, in-progress and completed counts and a progress bar, so status is clear at a glance.'
  },
  {
    icon: Kanban,
    title: 'Kanban task boards',
    text: 'Move tasks across To Do, In Progress, In Review, Done and Blocked. Set priority, due date, assignee and labels.'
  },
  {
    icon: MessagesSquare,
    title: 'Project chat',
    text: 'Each project has its own real-time chat with typing indicators, so decisions stay next to the work.'
  },
  {
    icon: Bell,
    title: 'Notifications that matter',
    text: 'Get alerted when a task is assigned to you, changes status or gets a comment. Nothing else.'
  },
  {
    icon: ShieldCheck,
    title: 'Invite only, private by design',
    text: 'You add people by email or a shareable link. There is no list of other users to browse, and a project can be made private so only its team sees it.'
  }
];

const steps = [
  { title: 'Create your account', text: 'Sign up with your email and confirm it with a 6-digit code. You start with a workspace of your own.' },
  { title: 'Create a project', text: 'Add a project, set its dates and start adding tasks right away.' },
  { title: 'Invite your team', text: 'Send an invitation by email or share a link. Only people you invite can join.' },
  { title: 'Track work to done', text: 'Assign tasks, move them across the board and talk it through in chat.' }
];

const useCases = [
  {
    icon: Rocket,
    title: 'Product and software teams',
    text: 'Plan releases, track bugs and features on a board, and keep review notes in task comments.',
    image: 'use-case-product-teams',
    alt: 'PulsePM Kanban board used to plan a software release'
  },
  {
    icon: Briefcase,
    title: 'Agencies and client work',
    text: 'Give each client a workspace and project. Share progress without mixing up teams.',
    image: 'use-case-agencies',
    alt: 'PulsePM workspaces and projects organised per client'
  },
  {
    icon: Building,
    title: 'Operations and internal projects',
    text: 'Run office moves, hiring plans or campaigns with owners, due dates and clear status.',
    image: 'use-case-operations',
    alt: 'PulsePM project list showing task progress for internal projects'
  },
  {
    icon: Wrench,
    title: 'Small businesses and startups',
    text: 'Replace scattered chats and spreadsheets with one place that shows who is doing what.',
    image: 'use-case-startups',
    alt: 'PulsePM dashboard showing task counts and recent activity'
  }
];

const roles = [
  {
    name: 'Workspace owner',
    text: 'Everyone who creates a workspace owns it.',
    items: ['Create projects and tasks', 'Invite and remove people by email or link', 'Choose who works on each project', 'Download project reports']
  },
  {
    name: 'Member',
    text: 'People you invite to your workspace.',
    items: ['See the workspace projects (and private ones they are added to)', 'Create tasks and update their status', 'Comment, upload files and join project chat']
  }
];

const faqs = [
  {
    q: 'What is PulsePM?',
    a: 'PulsePM is a web app for planning projects, tracking tasks on a Kanban board and chatting with your team in real time. Work is organised into workspaces, and each workspace holds projects and tasks.'
  },
  {
    q: 'Who can create workspaces and projects?',
    a: 'Anyone with an account. When you sign up you get a workspace of your own and can start a project straight away. You can create more workspaces for other teams or clients.'
  },
  {
    q: 'How do I add my team?',
    a: 'Open your workspace, choose Invite and manage team, and send an invitation by email or copy the invite link. People join your workspace when they open it and can see your open projects. Add them to a project team to assign them work. You never see a list of other PulsePM users.'
  },
  {
    q: 'Can other companies see my projects?',
    a: 'No. Workspaces are separate. Only the people in your workspace can see its projects, and you can mark any project private so only its team sees it. These rules are enforced on the server.'
  },
  {
    q: 'Why do I need to verify my email?',
    a: 'When you sign up we send a 6-digit code to your email. Your account is created only after you enter it, which keeps fake sign-ups out and makes sure password resets reach you.'
  },
  {
    q: 'What if I forget my password?',
    a: 'Choose "Forgot?" on the sign in page and enter your email. We send a 6-digit code that lets you set a new password. Codes expire after 10 minutes.'
  },
  {
    q: 'What task statuses are there?',
    a: 'Tasks move through To Do, In Progress, In Review, Done and Blocked. Each task also has a priority (low, medium, high or urgent), an optional due date, an assignee and labels.'
  },
  {
    q: 'Can I chat with my team and share files?',
    a: 'Yes. Every project has its own live chat. Tasks have comments and file attachments, and you can add a profile photo to your account.'
  },
  {
    q: 'How do I know when something changes?',
    a: 'PulsePM sends notifications when a task is assigned to you, when its status changes and when someone comments. The dashboard also shows counts of to-do, in-progress, completed and overdue tasks.'
  }
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description
    },
    {
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: siteConfig.description,
      url: siteConfig.url
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  ]
};

// The hero headline, split into words so each one can animate in. "Track every task." gets the moving gradient.
const heroWords = [
  { text: 'Plan the work.', highlight: false },
  { text: 'Track every task.', highlight: true },
  { text: 'Talk it through.', highlight: false }
].flatMap((part) => part.text.split(' ').map((word) => ({ word, highlight: part.highlight })));

const sectionHeading = 'text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-brand-400';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-[#08102b] to-slate-950 text-slate-200 scroll-smooth overflow-x-clip">
      {/* Light colour washes down the page, so the dark background is not one flat colour */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[16%] -right-40 h-[560px] w-[560px] rounded-full bg-sky-500/[0.12] blur-[140px]" />
        <div className="absolute top-[38%] -left-48 h-[600px] w-[600px] rounded-full bg-indigo-500/[0.14] blur-[150px]" />
        <div className="absolute top-[60%] -right-44 h-[560px] w-[560px] rounded-full bg-violet-500/[0.12] blur-[150px]" />
        <div className="absolute top-[82%] -left-32 h-[520px] w-[520px] rounded-full bg-brand-500/[0.18] blur-[140px]" />
      </div>
      <ScrollProgress />
      <AuthRedirect />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <nav aria-label="Main" className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-lg shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center">
              <Kanban className="w-5 h-5" aria-hidden="true" />
            </span>
            PulsePM
          </Link>
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:gap-3">
            <InstallAppButton variant="ghost" label="Install app" className="hidden lg:inline-flex !px-3 !py-2" />
            <Link href="/login" className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
        {/* Phones: the section links scroll sideways under the logo row */}
        <ul className="md:hidden flex items-center gap-6 overflow-x-auto px-6 pb-3 text-sm font-medium text-slate-400 whitespace-nowrap">
          {navLinks.map((l) => (
            <li key={l.href} className="shrink-0">
              <a href={l.href} className="hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <AuthBackdrop soft />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,82,204,0.14),transparent)] animate-glow-pulse motion-reduce:animate-none"
          />
          <div className="relative max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/70 text-xs font-medium text-slate-300 animate-fade-up motion-reduce:animate-fade-only">
                <span className="relative flex w-1.5 h-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </span>
                Project management and team chat in one place
              </p>
              <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] text-balance">
                {heroWords.map((w, i) => (
                  <Fragment key={i}>
                    <span
                      className="inline-block animate-word-in motion-reduce:animate-fade-only"
                      style={{ animationDelay: `${150 + i * 90}ms` }}
                    >
                      {w.highlight ? (
                        <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x motion-reduce:animate-none">
                          {w.word}
                        </span>
                      ) : (
                        w.word
                      )}
                    </span>
                    {i < heroWords.length - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </h1>
              <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-up motion-reduce:animate-fade-only [animation-delay:200ms]">
                PulsePM gives your team workspaces, Kanban boards and live project chat, so everyone knows what to do
                next and where each project stands.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 animate-fade-up motion-reduce:animate-fade-only [animation-delay:300ms]">
                <Link
                  href="/register"
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine motion-reduce:animate-none"
                  />
                  <span className="relative inline-flex items-center gap-2">
                    Create your account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold rounded-xl transition-colors"
                >
                  See what it does
                </a>
                <InstallAppButton label="Install the web app" variant="outline" />
              </div>
              <p className="mt-5 text-xs text-slate-500 animate-fade-up motion-reduce:animate-fade-only [animation-delay:400ms]">
                Sign up takes under a minute. We confirm your email with a 6-digit code.
              </p>
            </div>

            <div className="mt-14 max-w-5xl mx-auto animate-fade-up motion-reduce:animate-fade-only [animation-delay:500ms]">
              <div className="animate-float motion-reduce:animate-none">
                <TiltCard>
                  <ScreenshotFrame
                    name="hero-board"
                    alt="PulsePM Kanban board with To Do, In Progress, In Review and Done columns"
                    priority
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    fallback={<BoardMock />}
                  />
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        <FeatureMarquee />

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <AnimatedText as="p" className={eyebrow} text="What it does" />
            <AnimatedText
              as="h2"
              id="features-heading"
              className={`mt-3 ${sectionHeading}`}
              text="Everything a team needs to ship work"
              delay={80}
            />
            <AnimatedText
              as="p"
              className="mt-4 text-slate-400 leading-relaxed"
              text="Six tools that work together, so you do not need a separate app for tasks, chat and alerts."
              delay={350}
              stagger={16}
            />
          </div>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} variant="flip" delay={(i % 3) * 140}>
                <SpotlightCard className="h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600 hover:shadow-xl hover:shadow-black/30">
                  <div className="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white text-base">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Product tour: progress */}
        <section aria-labelledby="progress-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedText as="p" className={eyebrow} text="Project health" />
              <AnimatedText
                as="h2"
                id="progress-heading"
                className={`mt-3 ${sectionHeading}`}
                text="See where every project stands"
                delay={80}
              />
              <AnimatedText
                as="p"
                className="mt-4 text-slate-400 leading-relaxed"
                text="Each project card shows how many tasks are to do, in progress and completed, with a progress bar that fills as work gets done. The dashboard adds overdue tasks and recent activity."
                delay={350}
                stagger={16}
              />
              <Reveal as="div" variant="left" delay={500}>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {['To-do, in-progress and completed counts per project', 'Overdue task count on the dashboard', 'Activity feed of recent changes'].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal variant="right" delay={150}>
              <Parallax>
                <ScreenshotFrame
                  name="feature-projects"
                  alt="PulsePM project cards showing to do, in progress and completed task counts with progress bars"
                  fallback={<ProgressMock />}
                />
              </Parallax>
            </Reveal>
          </div>
        </section>

        {/* Product tour: chat */}
        <section aria-labelledby="chat-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="order-2 lg:order-1" variant="left" delay={150}>
              <Parallax>
                <ScreenshotFrame
                  name="feature-chat"
                  alt="PulsePM project chat with team messages and online members"
                  fallback={<ChatMock />}
                />
              </Parallax>
            </Reveal>
            <div className="order-1 lg:order-2">
              <AnimatedText as="p" className={eyebrow} text="Team chat" />
              <AnimatedText
                as="h2"
                id="chat-heading"
                className={`mt-3 ${sectionHeading}`}
                text="Keep the conversation with the work"
                delay={80}
              />
              <AnimatedText
                as="p"
                className="mt-4 text-slate-400 leading-relaxed"
                text="Talk about a project in its own chat, comment on individual tasks and attach files. Everything about a piece of work stays in one place instead of scattered across inboxes."
                delay={350}
                stagger={16}
              />
              <Reveal as="div" variant="right" delay={500}>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {['Real-time messages and typing indicators', 'Comments and file attachments on every task', 'Alerts when you are assigned or mentioned'].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <AnimatedText as="p" className={eyebrow} text="How it works" />
            <AnimatedText
              as="h2"
              id="how-heading"
              className={`mt-3 ${sectionHeading}`}
              text="From sign up to done in four steps"
              delay={80}
            />
          </div>
          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} variant="scale" delay={i * 150}>
                <div className="group h-full relative bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600">
                  <span className="relative w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-brand-500 animate-ring-out motion-reduce:animate-none"
                      style={{ animationDelay: `${i * 700}ms` }}
                    />
                    <span className="relative">{i + 1}</span>
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Roles */}
        <section aria-labelledby="roles-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <AnimatedText as="p" className={eyebrow} text="People and access" />
            <AnimatedText
              as="h2"
              id="roles-heading"
              className={`mt-3 ${sectionHeading}`}
              text="The right access for everyone"
              delay={80}
            />
            <AnimatedText
              as="p"
              className="mt-4 text-slate-400 leading-relaxed"
              text="Two simple roles keep work organised. Permissions are checked on the server, so they cannot be bypassed from the browser."
              delay={350}
              stagger={16}
            />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {roles.map((r, i) => (
              <Reveal key={r.name} variant={i % 2 === 0 ? 'left' : 'right'} delay={i * 120} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-brand-400" aria-hidden="true" />
                  <h3 className="font-semibold text-white">{r.name}</h3>
                </div>
                <p className="mt-1 text-sm text-slate-400">{r.text}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" aria-labelledby="use-cases-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <AnimatedText as="p" className={eyebrow} text="Use cases" />
            <AnimatedText
              as="h2"
              id="use-cases-heading"
              className={`mt-3 ${sectionHeading}`}
              text="Built for teams that deliver projects"
              delay={80}
            />
          </div>
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map(({ icon: Icon, title, text, image, alt }, i) => {
              const src = findScreenshot(image);
              return (
                <Reveal as="li" key={title} variant={i % 2 === 0 ? 'left' : 'right'} delay={(i % 2) * 120}>
                  <div className="group h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl hover:shadow-black/30">
                    {src && (
                      <div className="relative aspect-[16/10] bg-slate-950 border-b border-slate-800 overflow-hidden">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex gap-4 p-6">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{text}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <AnimatedText as="p" className={eyebrow} text="FAQ" />
            <AnimatedText
              as="h2"
              id="faq-heading"
              className={`mt-3 ${sectionHeading}`}
              text="Questions people ask before they start"
              delay={80}
            />
          </div>
          <Reveal className="mt-10 divide-y divide-slate-800 border-y border-slate-800" variant="scale" delay={100}>
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="w-5 h-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed pr-8">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </section>

        {/* Final call to action */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <Reveal variant="scale" className="relative overflow-hidden rounded-3xl bg-slate-800 p-px">
            {/* A bright arc that circles the border */}
            <div
              aria-hidden="true"
              className="absolute -inset-[100%] animate-spin-slow motion-reduce:animate-none bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,#3b82f6_320deg,#818cf8_360deg)]"
            />
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-slate-950">
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-brand-600/30 via-slate-900/60 to-indigo-950/80" />
              <div className="relative px-8 py-14 text-center">
                <AnimatedText
                  as="h2"
                  className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
                  text="Give your team one place to work"
                  delay={150}
                />
                <AnimatedText
                  as="p"
                  className="mt-3 text-slate-400 max-w-xl mx-auto"
                  text="Create an account, set up your first workspace and add your first project in a few minutes."
                  delay={450}
                  stagger={16}
                />
                <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="group relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine motion-reduce:animate-none"
                    />
                    <span className="relative inline-flex items-center gap-2">
                      Get started
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                  <Link href="/login" className="px-6 py-3 border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold rounded-xl transition-colors">
                    Sign in
                  </Link>
                  <InstallAppButton label="Install the web app" variant="outline" />
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-lg">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center">
                <Kanban className="w-5 h-5" aria-hidden="true" />
              </span>
              PulsePM
            </Link>
            <p className="mt-3 text-slate-500 max-w-xs leading-relaxed">
              Project management and team chat for teams that want to see progress, not chase it.
            </p>
          </div>
          <nav aria-label="Product">
            <p className="font-semibold text-white mb-3">Product</p>
            <ul className="space-y-2 text-slate-400">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Account">
            <p className="font-semibold text-white mb-3">Account</p>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
              <li><Link href="/register" className="hover:text-white">Create account</Link></li>
              <li><Link href="/forgot-password" className="hover:text-white">Reset password</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-slate-800/80">
          <p className="max-w-6xl mx-auto px-6 py-5 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} PulsePM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
