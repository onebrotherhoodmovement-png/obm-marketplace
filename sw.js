const OFFLINE='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:system-ui;background:#0C0B0A;color:#F5F1E8;text-align:center;padding:60px 20px"><h2>You are offline</h2><p>Connect to the internet and try again.</p></body>';

self.addEventListener('install',function(event){
  self.skipWaiting();
});

self.addEventListener('activate',function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET')return;

  const url=new URL(event.request.url);
  const isPage=event.request.mode==='navigate';
  const isAppAsset=url.origin===self.location.origin &&
    (url.pathname==='/script.js' || url.pathname==='/index.html' || url.pathname==='/');

  // Always ask the network for app code rather than returning stale HTTP-cache versions.
  if(isPage || isAppAsset){
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).catch(function(error){
        if(isPage)return new Response(OFFLINE,{headers:{'content-type':'text/html'}});
        throw error;
      })
    );
  }
});
