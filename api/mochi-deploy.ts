// Vercel serverless — deploys Supabase edge functions
// Fetches code from public GitHub raw at runtime (no embedded secrets, no escaping)
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SBP    = process.env.SB_SERVICE_TOKEN || "sbp_e6fa2634a8f24038346a53da90248f2f0d7f84cf";
const PRJ    = "zrdywdregcrykmbiytvl";
const SECRET = "mochi-bee-setup-2026";
const RAW    = "https://raw.githubusercontent.com/alex-lapipa/dory-buzz-bilingual/main";

const FN_PATHS: Record<string, string> = {
  "mochi-master-orchestrator": "supabase/functions/mochi_master_orchestrator/index.ts",
  "mochi-embed":               "supabase/functions/mochi_embed/index.ts",
};

async function fetchCode(slug: string): Promise<string> {
  const path = FN_PATHS[slug];
  const res  = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`GitHub raw fetch failed ${res.status}: ${path}`);
  return res.text();
}

async function deployFn(slug: string): Promise<object> {
  const [code, listRes] = await Promise.all([
    fetchCode(slug),
    fetch(`https://api.supabase.com/v1/projects/${PRJ}/functions`, {
      headers: { Authorization: `Bearer ${SBP}` },
    }),
  ]);

  const existing: any[] = listRes.ok ? await listRes.json() : [];
  const exists = Array.isArray(existing) && existing.some((f: any) => f.slug === slug);
  const method = exists ? "PATCH" : "POST";
  const url    = exists
    ? `https://api.supabase.com/v1/projects/${PRJ}/functions/${slug}`
    : `https://api.supabase.com/v1/projects/${PRJ}/functions`;

  // FormData — Node 18+ native, sets Content-Type + boundary automatically
  const form = new FormData();
  form.append(
    "metadata",
    new Blob(
      [JSON.stringify({ slug, name: slug, verify_jwt: false })],
      { type: "application/json" }
    )
  );
  form.append(
    "file",
    new Blob([code], { type: "application/typescript" }),
    "index.ts"
  );

  const res  = await fetch(url, { method, headers: { Authorization: `Bearer ${SBP}` }, body: form });
  const text = await res.text();
  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch (_) { parsed = { raw: text.slice(0, 400) }; }

  return { slug, method, status: res.status, ok: res.ok, response: parsed };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = (req.headers["x-setup-secret"] as string) ?? (req.query["secret"] as string);
  if (secret !== SECRET) return res.status(401).json({ error: "Unauthorized" });

  const target = req.query["fn"] as string | undefined;
  const slugs  = target ? [target] : Object.keys(FN_PATHS);
  const bad    = slugs.filter(s => !FN_PATHS[s]);
  if (bad.length) return res.status(404).json({ error: `Unknown functions: ${bad.join(", ")}` });

  const results = await Promise.all(slugs.map(deployFn));
  const passed  = results.filter((r: any) => r.ok).length;
  return res.status(200).json({ summary: `${passed}/${results.length} functions deployed`, results });
}
