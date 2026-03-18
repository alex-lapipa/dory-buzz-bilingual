import type { VercelRequest, VercelResponse } from "@vercel/node";

const SBP    = "sbp_e6fa2634a8f24038346a53da90248f2f0d7f84cf";
const PRJ    = "zrdywdregcrykmbiytvl";
const SECRET = "mochi-bee-setup-2026";
const RAW    = "https://raw.githubusercontent.com/alex-lapipa/dory-buzz-bilingual/main";

const FN_PATHS: Record<string, string> = {
  "mochi-master-orchestrator": "supabase/functions/mochi_master_orchestrator/index.ts",
  "mochi-embed":               "supabase/functions/mochi_embed/index.ts",
};

async function fetchCode(slug: string): Promise<string> {
  const res = await fetch(`${RAW}/${FN_PATHS[slug]}`);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${FN_PATHS[slug]}`);
  return res.text();
}

async function deployFn(slug: string): Promise<object> {
  // 1. Fetch code
  const code = await fetchCode(slug);

  // 2. Check if function already exists on Supabase
  const listRes = await fetch(
    `https://api.supabase.com/v1/projects/${PRJ}/functions`,
    { headers: { Authorization: `Bearer ${SBP}` } }
  );
  const existing: any[] = listRes.ok ? await listRes.json() : [];
  const exists = Array.isArray(existing) && existing.some((f: any) => f.slug === slug);
  const method = exists ? "PATCH" : "POST";
  const url    = exists
    ? `https://api.supabase.com/v1/projects/${PRJ}/functions/${slug}`
    : `https://api.supabase.com/v1/projects/${PRJ}/functions`;

  // 3. Build multipart body as a plain string — no Buffer, no Blob, no FormData
  const boundary = "MochiBee" + Date.now();
  const CRLF     = "\r\n";
  const meta     = JSON.stringify({ slug, name: slug, verify_jwt: false });

  const bodyStr = (
    "--" + boundary + CRLF +
    "Content-Disposition: form-data; name=\"metadata\"" + CRLF +
    "Content-Type: application/json" + CRLF + CRLF +
    meta + CRLF +
    "--" + boundary + CRLF +
    "Content-Disposition: form-data; name=\"file\"; filename=\"index.ts\"" + CRLF +
    "Content-Type: application/typescript" + CRLF + CRLF +
    code + CRLF +
    "--" + boundary + "--" + CRLF
  );

  // 4. Deploy
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${SBP}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: bodyStr,
  });

  const text = await res.text();
  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch (_) { parsed = { raw: text.slice(0, 400) }; }

  return { slug, method, status: res.status, ok: res.ok, response: parsed };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const secret = (req.headers["x-setup-secret"] as string) ?? (req.query["secret"] as string);
    if (secret !== SECRET) return res.status(401).json({ error: "Unauthorized" });

    const target = req.query["fn"] as string | undefined;
    const slugs  = target ? [target] : Object.keys(FN_PATHS);

    const results = [];
    for (const slug of slugs) {
      try {
        const r = await deployFn(slug);
        results.push(r);
      } catch (e: any) {
        results.push({ slug, ok: false, error: e.message });
      }
    }

    const passed = results.filter((r: any) => r.ok).length;
    return res.status(200).json({ summary: `${passed}/${results.length} functions deployed`, results });
  } catch (e: any) {
    return res.status(500).json({ error: e.message, stack: e.stack?.split("\n").slice(0, 5) });
  }
}
