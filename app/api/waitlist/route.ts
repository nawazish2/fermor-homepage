import { normalizeEmail } from "@/lib/validate-email";

// Stub: validates and acknowledges. Nothing is stored.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON body with an email." }, { status: 400 });
  }
  const email = normalizeEmail((body as { email?: unknown } | null)?.email);
  if (!email) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
