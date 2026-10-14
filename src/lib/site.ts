export const siteConfig = {
  name: 'PulsePM',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  title: 'PulsePM | Project management and team chat in one place',
  description:
    'PulsePM helps teams plan projects, track tasks on a Kanban board and talk in real time. Organise work in workspaces, assign tasks and see progress at a glance.',
  keywords: [
    'project management software',
    'task management',
    'Kanban board',
    'team collaboration',
    'team chat',
    'workspace management',
    'project tracking',
    'task tracker'
  ]
};
