import { createClient } from "@supabase/supabase-js";

const BUCKET = "site-data";
const SCORE_PATH = "snake-high-score.json";
const MAX_SCORE = 999;

function normalizeSupabaseUrl(url) {
  if (!url) return url;
  return String(url)
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

function getSupabaseAdmin(env = process.env) {
  const url = normalizeSupabaseUrl(env.SUPABASE_URL);
  const key = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local (dev) and your host env vars (production).",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let bucketReady = null;

function ensureBucket(supabase) {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { data } = await supabase.storage.getBucket(BUCKET);
      if (data) return;
      const { error } = await supabase.storage.createBucket(BUCKET, {
        public: false,
      });
      if (error && !/already exists/i.test(error.message || "")) {
        bucketReady = null;
        throw new Error(error.message);
      }
    })();
  }
  return bucketReady;
}

function parseScore(text) {
  try {
    const score = Number(JSON.parse(text)?.score);
    if (!Number.isInteger(score) || score < 0) return 0;
    return Math.min(score, MAX_SCORE);
  } catch {
    return 0;
  }
}

function isMissingObject(error) {
  if (!error) return false;
  const message = `${error.message || ""} ${error.error || ""}`;
  return (
    error.statusCode === 404 ||
    error.status === 404 ||
    /not found|does not exist/i.test(message)
  );
}

async function readScore(env) {
  const url = new URL(
    `/storage/v1/object/${BUCKET}/${SCORE_PATH}`,
    normalizeSupabaseUrl(env.SUPABASE_URL),
  );
  url.searchParams.set("t", String(Date.now()));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
    cache: "no-store",
  });

  if (response.status === 404) return 0;
  if (!response.ok) {
    const message = await response.text();
    if (isMissingObject({ message, status: response.status })) return 0;
    throw new Error(message || "Could not read the high score.");
  }

  return parseScore(await response.text());
}

async function writeScore(supabase, score) {
  const { error } = await supabase.storage.from(BUCKET).upload(
    SCORE_PATH,
    Buffer.from(JSON.stringify({ score })),
    {
      contentType: "application/json",
      cacheControl: "0",
      upsert: true,
    },
  );
  if (error) throw new Error(error.message);
}

export async function getSnakeHighScore(env = process.env) {
  const supabase = getSupabaseAdmin(env);
  await ensureBucket(supabase);
  return readScore(env);
}

export async function submitSnakeHighScore(candidate, env = process.env) {
  const score = Number(candidate);
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) {
    throw new Error(`Score must be a whole number from 1 to ${MAX_SCORE}.`);
  }

  const supabase = getSupabaseAdmin(env);
  await ensureBucket(supabase);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const current = await readScore(env);
    if (score <= current) return current;
    await writeScore(supabase, score);
    const after = await readScore(env);
    if (after >= score) return after;
  }

  return readScore(env);
}
