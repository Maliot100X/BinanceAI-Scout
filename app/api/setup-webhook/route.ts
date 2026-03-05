// app/api/setup-webhook/route.ts
// Call this ONCE after deployment: GET /api/setup-webhook
import { NextResponse } from 'next/server';
import { setWebhook, setMyCommands } from '@/lib/telegram';

export async function GET(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const webhookUrl = `${protocol}://${appUrl}/api/telegram/webhook`;

  try {
    const [webhookRes, commandsRes] = await Promise.all([
      setWebhook(webhookUrl),
      setMyCommands(),
    ]);
    return NextResponse.json({
      success: true,
      webhook: webhookRes,
      commands: commandsRes,
      webhookUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
