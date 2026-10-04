import { playProjects } from "./playProjects";
import { workProjects } from "./workProjects";
import {
  allPlayPositions,
  physicalPlayPositions,
} from "../components/Work/playGridReadingOrder";

export const HOME_FILTERS = [
  { id: "all", label: "All" },
  { id: "creative-tech", label: "Creative Tech" },
  { id: "product-design", label: "Product Design" },
  { id: "fabrication", label: "Fabrication" },
];

const FABRICATION_IDS = new Set([
  "temple-of-fortune",
  ...playProjects
    .filter((project) => project.tags?.includes("Fabrication"))
    .map((project) => project.id),
]);

const PRODUCT_DESIGN_IDS = new Set(
  workProjects
    .filter((project) => !project.archived && project.filter === "product-design")
    .map((project) => project.id),
);

export function isFabricationProject(project) {
  return FABRICATION_IDS.has(project.id);
}

export function getProjectFilter(project) {
  if (PRODUCT_DESIGN_IDS.has(project.id) || project.kind === "work") {
    return "product-design";
  }
  if (isFabricationProject(project)) return "fabrication";
  return "creative-tech";
}

/** Visible work cards for the combined homepage grid (archived studies stay routed). */
export function getHomeWorkProjects() {
  return workProjects
    .filter((project) => !project.archived)
    .map((project) => ({ ...project, kind: "work" }));
}

export function getHomePlayProjects() {
  return playProjects.map((project) => ({ ...project, kind: "play" }));
}

export function getHomeGridProjects(filterId = "all") {
  const work = getHomeWorkProjects();
  const play = getHomePlayProjects();

  if (filterId === "product-design") return work;
  if (filterId === "fabrication") {
    return play.filter((project) => isFabricationProject(project));
  }
  if (filterId === "creative-tech") {
    return play.filter((project) => !isFabricationProject(project));
  }
  return [...work, ...play];
}

/**
 * Combined homepage “All” placement.
 * Reading order: Block Party, Dandi, draw canvas, then current top play,
 * Confido around 8th, then the existing play order.
 */
export const combinedHomePositions = {
  ...allPlayPositions,
  "block-party": { col: 1, rowStart: 1, rowEnd: 2 },
  "dandi-bio-smart-wearable": { col: 2, rowStart: 1, rowEnd: 2 },
  "draw-canvas": { col: 3, rowStart: 1, rowEnd: 3 },
  "floral-jukebox": { col: 1, rowStart: 4, rowEnd: 5 },
  "page-canvas": { col: 2, rowStart: 4, rowEnd: 6 },
  "spherical-shopping": { col: 3, rowStart: 4, rowEnd: 6 },
  "ascii-filter": { col: 1, rowStart: 5, rowEnd: 7 },
  "confido-approval-flow": { col: 2, rowStart: 5, rowEnd: 7 },
};

export const productDesignPositions = {
  "dandi-bio-smart-wearable": { col: 1, rowStart: 1, rowEnd: 2 },
  "confido-approval-flow": { col: 2, rowStart: 1, rowEnd: 2 },
};

/** Creative Tech only: page canvas takes the draw-canvas slot, and the reverse.
 * Art gallery sits in column 2, directly above gravity text. */
const creativeTechPositions = {
  ...allPlayPositions,
  "page-canvas": allPlayPositions["draw-canvas"],
  "draw-canvas": allPlayPositions["page-canvas"],
  "art-gallery": { col: 2, rowStart: 5, rowEnd: 6 },
};

export function getHomeGridPositions(filterId = "all") {
  if (filterId === "product-design") return productDesignPositions;
  if (filterId === "fabrication") return physicalPlayPositions;
  if (filterId === "creative-tech") return creativeTechPositions;
  return combinedHomePositions;
}
