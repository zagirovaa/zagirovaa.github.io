self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                "index.html",
                "assets/images/icon-192.png",
                "assets/images/icon-512.png",
                "components/AboutModal.js",
                "components/GroupModal.js",
                "components/TaskModal.js",
                "css/style.css",
                "js/app.js",
                "js/Group.js",
                "js/Task.js"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});