export async function fetchSnakeHighScore() {
  const res = await fetch("/api/snake-score");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  return Number(data.highScore ?? 0);
}

export async function submitSnakeScore(score) {
  const res = await fetch("/api/snake-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  return Number(data.highScore ?? 0);
}
