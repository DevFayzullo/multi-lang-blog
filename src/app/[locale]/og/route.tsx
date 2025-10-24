import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Multi-Language Blog';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%', width: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: 'linear-gradient(135deg,#0B0B0C,#101827)',
          color: 'white', padding: 64
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ marginTop: 16, fontSize: 24, opacity: 0.8 }}>{locale.toUpperCase()}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
