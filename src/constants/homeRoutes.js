function normalizePathname(pathname) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Main homepage. */
export function isDefaultHomePath(pathname) {
  return normalizePathname(pathname) === "/";
}

export function isHomePath(pathname) {
  return isDefaultHomePath(pathname);
}
