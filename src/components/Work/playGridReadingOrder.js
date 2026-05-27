/** Desktop grid placement for “all” play projects (`/` and `/google-creative`). */
export const allPlayPositions = {
  "block-party": { col: 1, rowStart: 1, rowEnd: 4, colSpan: 2 },
  "floral-jukebox": { col: 3, rowStart: 1, rowEnd: 2 },
  "draw-canvas": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 1, rowStart: 6, rowEnd: 8 },
  "cat-box": { col: 1, rowStart: 10, rowEnd: 11 },
  "sticker-cats": { col: 1, rowStart: 11, rowEnd: 13 },
  "words-unseen": { col: 3, rowStart: 10, rowEnd: 12 },
  "reflections-of-monet": { col: 1, rowStart: 13, rowEnd: 15 },
  "puzzle-feeder": { col: 1, rowStart: 15, rowEnd: 17 },
  "gravity-text": { col: 2, rowStart: 6, rowEnd: 8 },
  "binary-pool": { col: 2, rowStart: 8, rowEnd: 10 },
  "page-canvas": { col: 1, rowStart: 4, rowEnd: 6 },
  snowflake: { col: 3, rowStart: 7, rowEnd: 8 },
  "neumorphic-buttons": { col: 2, rowStart: 12, rowEnd: 13 },
  "cat-figurine": { col: 2, rowStart: 13, rowEnd: 14 },
  "temple-of-fortune": { col: 2, rowStart: 14, rowEnd: 15 },
  "emotional-canvas": { col: 1, rowStart: 8, rowEnd: 10 },
  "spherical-shopping": { col: 3, rowStart: 4, rowEnd: 6 },
  "im-listening": { col: 2, rowStart: 10, rowEnd: 12 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "five-identical-fishes": { col: 3, rowStart: 8, rowEnd: 9 },
  "starry-night": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 2, rowStart: 4, rowEnd: 6 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
};

export const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 3, rowStart: 2, rowEnd: 3 },
};

/** Top to bottom, then left to right — matches the curated wide-layout reading order. */
export function comparePlayReadingOrder(a, b, positions) {
  const pa = positions[a.id];
  const pb = positions[b.id];
  if (!pa && !pb) return 0;
  if (!pa) return 1;
  if (!pb) return -1;
  if (pa.rowStart !== pb.rowStart) return pa.rowStart - pb.rowStart;
  if (pa.col !== pb.col) return pa.col - pb.col;
  return (pa.rowEnd ?? 0) - (pb.rowEnd ?? 0);
}

export function sortPlayProjectsByReadingOrder(projects, positions = allPlayPositions) {
  return [...projects].sort((a, b) => comparePlayReadingOrder(a, b, positions));
}

/** Stack projects per grid column (sorted by row), for tight vertical packing without shared row tracks. */
export function groupPlayProjectsByColumn(projects, positions = allPlayPositions) {
  const columns = { 1: [], 2: [], 3: [] };

  for (const project of projects) {
    const pos = positions[project.id];
    if (!pos?.col || !columns[pos.col]) continue;
    columns[pos.col].push(project);
  }

  for (const col of [1, 2, 3]) {
    columns[col].sort((a, b) => {
      const pa = positions[a.id];
      const pb = positions[b.id];
      if (pa.rowStart !== pb.rowStart) return pa.rowStart - pb.rowStart;
      return (pa.rowEnd ?? 0) - (pb.rowEnd ?? 0);
    });
  }

  return columns;
}

/** Column indices that sit beside a multi-column-wide card and need top offset (e.g. col 2 for block party). */
export function getWideSpanLaneColumns(positions = allPlayPositions) {
  const columns = new Set();

  for (const pos of Object.values(positions)) {
    const span = pos.colSpan ?? 1;
    if (span <= 1) continue;
    for (let col = pos.col + 1; col < pos.col + span; col += 1) {
      columns.add(col);
    }
  }

  return columns;
}
