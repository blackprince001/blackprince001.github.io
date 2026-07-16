const publicPathAttributes = new Set(["src", "srcs", "url", "image", "poster"]);

function normalize(value) {
  return value.replace(/(["'])\.\.\//g, "$1/");
}

function visit(node) {
  if (!node || typeof node !== "object") return;

  if ((node.type === "image" || node.type === "link") && typeof node.url === "string") {
    node.url = node.url.replace(/^\.\.\//, "/");
  }

  if (node.type === "html" && typeof node.value === "string") {
    node.value = normalize(node.value);
  }

  if (node.type === "mdxJsxAttribute" && publicPathAttributes.has(node.name)) {
    if (typeof node.value === "string") node.value = node.value.replace(/^\.\.\//, "/");
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === "data") continue;
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") visit(value);
  }
}

export default function remarkNormalizePublicPaths() {
  return (tree) => visit(tree);
}
