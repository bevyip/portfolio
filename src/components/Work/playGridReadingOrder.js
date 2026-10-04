/** Desktop grid placement for play projects on the homepage. */
export const allPlayPositions = {
  "block-party": { col: 1, rowStart: 1, rowEnd: 3 },
  "floral-jukebox": { col: 3, rowStart: 1, rowEnd: 2 },
  "draw-canvas": { col: 3, rowStart: 2, rowEnd: 4 },
  "picture-distortion": { col: 1, rowStart: 6, rowEnd: 8 },
  "cat-box": { col: 1, rowStart: 10, rowEnd: 11 },
  "sticker-cats": { col: 1, rowStart: 11, rowEnd: 13 },
  "shopify-dap": { col: 2, rowStart: 8, rowEnd: 10 },
  "reflections-of-monet": { col: 1, rowStart: 13, rowEnd: 15 },
  "puzzle-feeder": { col: 1, rowStart: 15, rowEnd: 17 },
  "gravity-text": { col: 2, rowStart: 6, rowEnd: 8 },
  "binary-pool": { col: 2, rowStart: 10, rowEnd: 12 },
  "page-canvas": { col: 2, rowStart: 4, rowEnd: 6 },
  snowflake: { col: 3, rowStart: 7, rowEnd: 8 },
  "neumorphic-buttons": { col: 3, rowStart: 10, rowEnd: 12 },
  "cat-figurine": { col: 2, rowStart: 14, rowEnd: 15 },
  "temple-of-fortune": { col: 2, rowStart: 15, rowEnd: 16 },
  "emotional-canvas": { col: 1, rowStart: 8, rowEnd: 10 },
  "art-gallery": { col: 3, rowStart: 3, rowEnd: 4 },
  "spherical-shopping": { col: 3, rowStart: 4, rowEnd: 6 },
  "im-listening": { col: 2, rowStart: 12, rowEnd: 14 },
  "emoji-ascii-art": { col: 3, rowStart: 6, rowEnd: 7 },
  "five-identical-fishes": { col: 3, rowStart: 8, rowEnd: 9 },
  "starry-night": { col: 3, rowStart: 9, rowEnd: 10 },
  "ascii-filter": { col: 1, rowStart: 4, rowEnd: 6 },
  "whack-a-mouse": { col: 3, rowStart: 12, rowEnd: 13 },
};

export const physicalPlayPositions = {
  "cat-box": { col: 1, rowStart: 1, rowEnd: 2 },
  "cat-figurine": { col: 2, rowStart: 1, rowEnd: 2 },
  "puzzle-feeder": { col: 3, rowStart: 1, rowEnd: 2 },
  "five-identical-fishes": { col: 1, rowStart: 2, rowEnd: 3 },
  "whack-a-mouse": { col: 2, rowStart: 2, rowEnd: 3 },
  "temple-of-fortune": { col: 1, rowStart: 3, rowEnd: 4 },
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
