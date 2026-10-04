import {
  getSnakeHighScore,
  submitSnakeHighScore,
} from "./supabase-snake-score.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export async function handleSnakeScoreRequest(req, res, env) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.method === "GET") {
      const highScore = await getSnakeHighScore(env);
      sendJson(res, 200, { highScore });
      return;
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const highScore = await submitSnakeHighScore(body.score, env);
      sendJson(res, 200, { highScore });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (err) {
    console.error("[snake-score-api]", err);
    sendJson(res, 500, {
      error: err.message || "Snake score failed.",
    });
  }
}

export function createSnakeScoreMiddleware(env) {
  return (req, res) => {
    handleSnakeScoreRequest(req, res, env);
  };
}
