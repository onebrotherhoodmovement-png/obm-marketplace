const OFFLINE='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;background:#0C0B0A;color:#F5F1E8;text-align:center;padding:60px 20px"><h2>You are offline</h2><p>Connect to the internet and try again.</p></body>';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>new Response(OFFLINE,{headers:{'content-type':'text/html'}})))}
});
