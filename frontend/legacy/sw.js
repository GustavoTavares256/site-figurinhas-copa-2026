self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("copa-stickers-v1").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/css/style.css",
        "/js/config.js",
        "/js/api.js",
        "/js/index.js"
      ])
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
