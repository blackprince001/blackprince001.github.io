// Mirror of next.config.js `basePath`. Used to prefix raw <img>/<a> src paths
// that don't go through next/image or next/link (which handle basePath
// automatically). Keep in sync with next.config.{js,mjs}.
//
// This is a user-page repo (blackprince001.github.io) served at the domain
// root, so basePath is empty. If we ever move to a project-page deployment,
// set this to "/<repo-name>" and Next's basePath in next.config to match.
export const BASE_PATH = ""

/**
 * Prefix an absolute public-asset path (e.g. "/featured-projects/foo.png")
 * with the deployment basePath. External URLs and already-prefixed paths
 * are returned unchanged.
 */
export function assetPath(p: string): string {
  if (!p) return p
  if (/^(https?:)?\/\//i.test(p)) return p
  if (p.startsWith(BASE_PATH)) return p
  if (!p.startsWith("/")) return p
  return `${BASE_PATH}${p}`
}
