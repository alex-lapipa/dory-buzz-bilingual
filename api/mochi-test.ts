import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const info: Record<string, any> = {
    node_version: process.version,
    has_FormData: typeof FormData !== "undefined",
    has_Blob: typeof Blob !== "undefined",
    has_fetch: typeof fetch !== "undefined",
    env_keys: Object.keys(process.env).filter(k => !k.includes("SECRET") && !k.includes("KEY") && !k.includes("TOKEN")).slice(0, 20),
  };

  // Try fetching from GitHub raw
  try {
    const r = await fetch("https://raw.githubusercontent.com/alex-lapipa/dory-buzz-bilingual/main/README.md");
    info.github_raw_status = r.status;
    info.github_raw_ok = r.ok;
    const txt = await r.text();
    info.github_raw_preview = txt.slice(0, 60);
  } catch(e: any) {
    info.github_raw_error = e.message;
  }

  // Try listing Supabase functions
  try {
    const r2 = await fetch("https://api.supabase.com/v1/projects/zrdywdregcrykmbiytvl/functions", {
      headers: { Authorization: "Bearer sbp_e6fa2634a8f24038346a53da90248f2f0d7f84cf" }
    });
    info.supa_fn_list_status = r2.status;
    const body2 = await r2.json();
    info.supa_fn_count = Array.isArray(body2) ? body2.length : body2;
    if (Array.isArray(body2)) {
      info.supa_fn_slugs = body2.map((f: any) => f.slug);
    }
  } catch(e: any) {
    info.supa_fn_error = e.message;
  }

  return res.status(200).json(info);
}
