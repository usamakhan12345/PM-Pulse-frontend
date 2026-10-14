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

const sectionHeading = 'text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-brand-400';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 scroll-smooth">
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

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(0,82,204,0.28),transparent)]"
          />
          <div className="relative max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/70 text-xs font-medium text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Project management and team chat in one place
              </p>
              <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05] text-balance">
                Plan the work. Track every task. Talk it through.
              </h1>
              <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                PulsePM gives your team workspaces, Kanban boards and live project chat, so everyone knows what to do
                next and where each project stands.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
                >
                  Create your account <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold rounded-xl transition-colors"
                >
                  See what it does
                </a>
                <InstallAppButton label="Install the web app" variant="outline" />
              </div>
              <p className="mt-5 text-xs text-slate-500">Sign up takes under a minute. We confirm your email with a 6-digit code.</p>
            </div>

            <div className="mt-14 max-w-5xl mx-auto">
              <ScreenshotFrame
                name="hero-board"
                alt="PulsePM Kanban board with To Do, In Progress, In Review and Done columns"
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                fallback={<BoardMock />}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className={eyebrow}>What it does</p>
            <h2 id="features-heading" className={`mt-3 ${sectionHeading}`}>
              Everything a team needs to ship work
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Six tools that work together, so you do not need a separate app for tasks, chat and alerts.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white text-base">{title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Product tour: progress */}
        <section aria-labelledby="progress-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className={eyebrow}>Project health</p>
              <h2 id="progress-heading" className={`mt-3 ${sectionHeading}`}>
                See where every project stands
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Each project card shows how many tasks are to do, in progress and completed, with a progress bar that
                fills as work gets done. The dashboard adds overdue tasks and recent activity.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {['To-do, in-progress and completed counts per project', 'Overdue task count on the dashboard', 'Activity feed of recent changes'].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ScreenshotFrame
              name="feature-projects"
              alt="PulsePM project cards showing to do, in progress and completed task counts with progress bars"
              fallback={<ProgressMock />}
            />
          </div>
        </section>

        {/* Product tour: chat */}
        <section aria-labelledby="chat-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <ScreenshotFrame
                name="feature-chat"
                alt="PulsePM project chat with team messages and online members"
                fallback={<ChatMock />}
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className={eyebrow}>Team chat</p>
              <h2 id="chat-heading" className={`mt-3 ${sectionHeading}`}>
                Keep the conversation with the work
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Talk about a project in its own chat, comment on individual tasks and attach files. Everything about a
                piece of work stays in one place instead of scattered across inboxes.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {['Real-time messages and typing indicators', 'Comments and file attachments on every task', 'Alerts when you are assigned or mentioned'].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className={eyebrow}>How it works</p>
            <h2 id="how-heading" className={`mt-3 ${sectionHeading}`}>
              From sign up to done in four steps
            </h2>
          </div>
          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <li key={step.title} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <span className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Roles */}
        <section aria-labelledby="roles-heading" className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <p className={eyebrow}>People and access</p>
            <h2 id="roles-heading" className={`mt-3 ${sectionHeading}`}>
              The right access for everyone
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Two simple roles keep work organised. Permissions are checked on the server, so they cannot be bypassed from the
              browser.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {roles.map((r) => (
              <div key={r.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
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
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" aria-labelledby="use-cases-heading" className="scroll-mt-20 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className={eyebrow}>Use cases</p>
            <h2 id="use-cases-heading" className={`mt-3 ${sectionHeading}`}>
              Built for teams that deliver projects
            </h2>
          </div>
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map(({ icon: Icon, title, text, image, alt }) => {
              const src = findScreenshot(image);
              return (
                <li key={title} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                  {src && (
                    <div className="relative aspect-[16/10] bg-slate-950 border-b border-slate-800">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
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
                </li>
              );
            })}
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <p className={eyebrow}>FAQ</p>
            <h2 id="faq-heading" className={`mt-3 ${sectionHeading}`}>
              Questions people ask before they start
            </h2>
          </div>
          <div className="mt-10 divide-y divide-slate-800 border-y border-slate-800">
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
          </div>
        </section>

        {/* Final call to action */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600/30 via-slate-900 to-indigo-950 border border-slate-800 px-8 py-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Give your team one place to work
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Create an account, set up your first workspace and add your first project in a few minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-colors"
              >
                Get started <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="px-6 py-3 border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold rounded-xl transition-colors">
                Sign in
              </Link>
              <InstallAppButton label="Install the web app" variant="outline" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80">
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
