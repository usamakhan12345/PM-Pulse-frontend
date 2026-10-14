import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PulsePM project management and team chat';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0f172a',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 22, height: 80, background: '#fff', borderRadius: 6 }} />
            <div style={{ width: 22, height: 56, background: '#fff', borderRadius: 6, opacity: 0.85 }} />
            <div style={{ width: 22, height: 36, background: '#fff', borderRadius: 6, opacity: 0.7 }} />
          </div>
          <div style={{ fontSize: 64, fontWeight: 700 }}>PulsePM</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 48, lineHeight: 1.15 }}>
          Plan projects, track tasks and talk with your team
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 28 }}>
          Workspaces, Kanban boards and real-time chat in one place
        </div>
      </div>
    ),
    size
  );
}
