// The columns of a project's Kanban board.
// Every project has the five built-in columns. The workspace owner can add more (for example "UAT Ready");
// they are stored on the project and shown between "In Review" and "Done".

export interface CustomColumn {
  key: string;
  label: string;
}

export interface BoardColumn {
  /** What a task stores in its status: a built-in value like IN_REVIEW, or the key of an added column */
  status: string;
  title: string;
  /** Tailwind background class for the column's coloured dot */
  colorClass: string;
  /** True for a column the owner added, which can be removed again once it is empty */
  custom: boolean;
}

export const MAX_CUSTOM_COLUMNS = 6;

const BUILT_IN_COLUMNS: BoardColumn[] = [
  { status: 'TODO', title: 'To Do', colorClass: 'bg-slate-400', custom: false },
  { status: 'IN_PROGRESS', title: 'In Progress', colorClass: 'bg-brand-500', custom: false },
  { status: 'IN_REVIEW', title: 'In Review', colorClass: 'bg-amber-500', custom: false },
  { status: 'DONE', title: 'Done', colorClass: 'bg-emerald-500', custom: false },
  { status: 'BLOCKED', title: 'Blocked', colorClass: 'bg-rose-500', custom: false }
];

// Added columns take these colours in the order they were added (the PDF report uses the same order)
const CUSTOM_COLORS = ['bg-violet-500', 'bg-cyan-500', 'bg-pink-500', 'bg-lime-500', 'bg-teal-500', 'bg-fuchsia-500'];

export function getProjectColumns(custom?: CustomColumn[]): BoardColumn[] {
  const added: BoardColumn[] = (custom || []).map((c, i) => ({
    status: c.key,
    title: c.label,
    colorClass: CUSTOM_COLORS[i % CUSTOM_COLORS.length],
    custom: true
  }));
  const doneAt = BUILT_IN_COLUMNS.findIndex((c) => c.status === 'DONE');
  return [...BUILT_IN_COLUMNS.slice(0, doneAt), ...added, ...BUILT_IN_COLUMNS.slice(doneAt)];
}

// A readable name for a status, from the project's columns when they are known
export function statusTitle(columns: BoardColumn[] | undefined, status: string): string {
  const column = columns?.find((c) => c.status === status);
  if (column) return column.title;
  return status.replace(/^CUSTOM_/, '').replace(/_/g, ' ');
}
