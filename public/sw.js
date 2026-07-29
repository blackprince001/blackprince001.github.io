const READING_COVER_CACHE = "blackprince-reading-covers-v1";

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isReadingCover =
    event.request.method === "GET"
    && url.origin === self.location.origin
    && url.pathname.startsWith("/images/books/");

  if (!isReadingCover) return;

  event.respondWith(
    caches.open(READING_COVER_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    }),
  );
});
