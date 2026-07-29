const SOCIAL_IMAGE_ROOT = "/images/og";

export function getSocialImagePath(pathname: string): string {
  const normalizedPath = pathname.split(/[?#]/, 1)[0]?.replace(/\/+$/, "") || "/";

  if (normalizedPath === "/") return `${SOCIAL_IMAGE_ROOT}/home.png`;

  const writingMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
  if (writingMatch) return `${SOCIAL_IMAGE_ROOT}/writing/${writingMatch[1]}.png`;

  const shortMatch = normalizedPath.match(/^\/shorts\/(?!tag\/)([^/]+)$/);
  if (shortMatch) return `${SOCIAL_IMAGE_ROOT}/shorts/${shortMatch[1]}.png`;

  if (normalizedPath.startsWith("/blog")) return `${SOCIAL_IMAGE_ROOT}/writing.png`;
  if (normalizedPath.startsWith("/shorts")) return `${SOCIAL_IMAGE_ROOT}/shorts.png`;
  if (normalizedPath.startsWith("/projects")) return `${SOCIAL_IMAGE_ROOT}/projects.png`;
  if (normalizedPath.startsWith("/publications")) return `${SOCIAL_IMAGE_ROOT}/manuscripts.png`;
  if (normalizedPath.startsWith("/reading")) return `${SOCIAL_IMAGE_ROOT}/reading.png`;

  return `${SOCIAL_IMAGE_ROOT}/default.png`;
}
