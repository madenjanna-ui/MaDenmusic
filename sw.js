"use strict";
// Change BUILD whenever any shell file changes. Paths are relative to this Pages project.
const BUILD = "2.8-ae26220d10ac";
const PREFIX = "madenmusic:" + encodeURIComponent(self.registration.scope) + ":";
const SHELL = PREFIX + "shell:" + BUILD;
const MEDIA = PREFIX + "assets:v1";
const CORE = ["index.html", "style.css", "app.js", "songs.js", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png"];
const absolute = path => new URL(path, self.registration.scope).href;
const coreURLs = new Set(CORE.map(absolute));
self.addEventListener("install", event => {
    event.waitUntil((async () => {
        // Fetch every required file before publishing the new cache.
        const entries = [];
        for(const path of CORE){
            const url = absolute(path);
            const response = await fetch(new Request(url, {cache: "reload"}));
            if(!response.ok || response.type === "opaque") throw new Error("Missing shell: " + path);
            entries.push([url, new Response(await response.arrayBuffer(), {status: response.status, headers: response.headers})]);
        }
        const cache = await caches.open(SHELL);
        try{ await Promise.all(entries.map(([url, response]) => cache.put(url, response))); }
        catch(error){ await caches.delete(SHELL); throw error; }
        // No automatic skipWaiting: an open player keeps its current release.
    })());
});
self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        for(const name of await caches.keys()){
            if(name.startsWith(PREFIX) && name !== SHELL && name !== MEDIA) await caches.delete(name);
        }
        await self.clients.claim();
    })());
});
self.addEventListener("message", event => {
    if(event.data?.type === "MADEN_SKIP_WAITING") event.waitUntil(self.skipWaiting());
});
self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);
    if(request.method !== "GET" || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
    // Never intercept audio/range requests: streaming and seeking stay native.
    if(request.headers.has("range") || request.destination === "audio") return;
    if(request.mode === "navigate" || coreURLs.has(url.origin + url.pathname)){
        event.respondWith((async () => {
            const cache = await caches.open(SHELL);
            const key = request.mode === "navigate" ? absolute("index.html") : url.origin + url.pathname;
            return await cache.match(key) || fetch(request);
        })());
        return;
    }
    const relative = url.pathname.slice(new URL(self.registration.scope).pathname.length);
    if(!relative.startsWith("covers/") && !relative.startsWith("lyrics/")) return;
    // Viewed covers and lyrics remain usable offline; audio is not downloaded in bulk.
    event.respondWith((async () => {
        const cache = await caches.open(MEDIA);
        try{
            const fresh = await fetch(request);
            if(!fresh.ok) throw new Error("Asset unavailable");
            try{
                await cache.put(request, fresh.clone());
                const keys = await cache.keys();
                for(const key of keys.slice(0, Math.max(0, keys.length - 180))) await cache.delete(key);
            }catch{ /* Storage quota must never prevent online viewing. */ }
            return fresh;
        }catch(error){
            const cached = await cache.match(request);
            return cached || new Response("Offline", {status: 503});
        }
    })());
});
