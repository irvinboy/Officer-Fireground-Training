const CACHE="fireground-visual-v1";
const CORE=['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.png', './assets/residential-clear.jpg', './assets/residential-light-smoke.jpg', './assets/residential-heavy-smoke.jpg', './assets/residential-fully-engulfed.jpg', './assets/business-clear.jpg', './assets/business-light-smoke.jpg', './assets/business-heavy-smoke.jpg', './assets/business-fully-engulfed.jpg', './assets/highrise-clear.jpg', './assets/highrise-light-smoke.jpg', './assets/highrise-heavy-smoke.jpg', './assets/highrise-fully-engulfed.jpg'];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached) return cached;
    return fetch(event.request).then(response=>{
      if(response.ok && new URL(event.request.url).origin===location.origin){
        const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }).catch(()=>caches.match("./index.html"));
  }));
});
