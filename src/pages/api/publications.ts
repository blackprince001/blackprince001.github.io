import type { APIRoute } from "astro";
import publications from "../../data/publications.json";

export const GET: APIRoute = () => new Response(JSON.stringify(publications), {
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  },
});
