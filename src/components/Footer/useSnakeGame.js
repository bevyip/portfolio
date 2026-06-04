export const GRID_PRESETS = {
  default: { cols: 42, rows: 8, tickMs: 150 },
  compact: { cols: 9, rows: 12, tickMs: 165 },
};

export const INITIAL_SNAKE_LENGTH = 3;

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function getGrid(game) {
  return game.grid ?? GRID_PRESETS.default;
}

function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function cellsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function spawnFood(snake, cols, rows) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) openCells.push({ x, y });
    }
  }

  if (openCells.length === 0) return null;
  return openCells[Math.floor(Math.random() * openCells.length)];
}

export function createInitialGameState(grid = GRID_PRESETS.default) {
  const y = Math.floor(grid.rows / 2);
  const headX = Math.floor(grid.cols * 0.2);
  const snake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, index) => ({
    x: headX - index,
    y,
  }));

  return {
    snake,
    direction: DIRECTIONS.right,
    pendingDirection: null,
    food: spawnFood(snake, grid.cols, grid.rows),
    score: 0,
    status: "idle",
    grid,
  };
}

export function getDirectionVector(name) {
  return DIRECTIONS[name] ?? null;
}

export function queueDirection(game, directionName) {
  const next = getDirectionVector(directionName);
  if (!next) return game;

  if (isOpposite(game.direction, next)) return game;

  return {
    ...game,
    pendingDirection: next,
  };
}

export function stepGame(game) {
  if (game.status !== "playing") return game;

  const { cols, rows } = getGrid(game);
  let direction = game.pendingDirection ?? game.direction;
  if (
    game.pendingDirection &&
    isOpposite(game.direction, game.pendingDirection)
  ) {
    direction = game.direction;
  }
  const head = game.snake[0];
  const nextX = head.x + direction.x;
  const nextY = head.y + direction.y;

  if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) {
    return {
      ...game,
      direction,
      pendingDirection: null,
      status: "over",
    };
  }

  const nextHead = { x: nextX, y: nextY };
  const willGrow = game.food && cellsEqual(nextHead, game.food);
  const bodyToCheck = willGrow
    ? game.snake
    : game.snake.slice(0, game.snake.length - 1);

  if (bodyToCheck.some((segment) => cellsEqual(segment, nextHead))) {
    return {
      ...game,
      direction,
      pendingDirection: null,
      status: "over",
    };
  }

  const snake = [nextHead, ...game.snake];
  if (!willGrow) snake.pop();

  let score = game.score;
  let food = game.food;

  if (willGrow) {
    score += 1;
    food = spawnFood(snake, cols, rows);
    if (!food) {
      return {
        snake,
        direction,
        pendingDirection: null,
        food: null,
        score,
        status: "over",
        grid: game.grid,
      };
    }
  }

  return {
    snake,
    direction,
    pendingDirection: null,
    food,
    score,
    status: "playing",
    grid: game.grid,
  };
}

export function startGame(game, grid = getGrid(game)) {
  if (game.status === "playing") return game;
  if (game.status === "over") {
    return { ...createInitialGameState(grid), status: "playing" };
  }
  return { ...game, status: "playing" };
}
