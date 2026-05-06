self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("pb").then(cache=>{
      return cache.addAll([
        "index.html",
        "style.css",
        "app.js"
      ]);
    })
  );
});