import {
  getSnakeHighScore,
  submitSnakeHighScore,
} from "../server/supabase-snake-score.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      const highScore = await getSnakeHighScore(process.env);
      return res.status(200).json({ highScore });
    }

    if (req.method === "POST") {
      const highScore = await submitSnakeHighScore(
        req.body?.score,
        process.env,
      );
      return res.status(200).json({ highScore });
    }

    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("[api/snake-score]", err);
    return res.status(500).json({
      error: err.message || "Snake score failed.",
    });
  }
}
