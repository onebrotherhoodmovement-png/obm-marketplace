var SUPA_URL="https://wmgeruhdfcsjarktuzpd.supabase.co";
var SUPA_KEY="sb_publishable_q7dolXz8rixOUnsxNzdheQ_zSM86bPa";
var db=supabase.createClient(SUPA_URL,SUPA_KEY);
var cats=["All","Electronics","Furniture","Clothing","Tools","Vehicles","Home","Other"];
var icons={Electronics:"\u{1F4F1}",Furniture:"\u{1F6CB}",Clothing:"\u{1F455}",Tools:"\u{1F527}",Vehicles:"\u{1F6B2}",Home:"\u{1F3E0}",Other:"\u{1F4E6}"};
var items=[],cat="All",cur=null,user=null,thread=null;
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function money(n){return "$"+Number(n).toLocaleString("en-US")}
function thumb(i){return i.img?'<img src="'+esc(i.img)+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">':(icons[i.c]||icons.Other)}
var MAXP=6;
function shrink(f){
 return new Promise(function(res){
  var u=URL.createObjectURL(f),im=new Image();
  im.onload=function(){
   var w=im.naturalWidth,h=im.naturalHeight,k=Math.min(1,1600/Math.max(w,h));
   var c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);
   var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
   URL.revokeObjectURL(u);
   c.toBlob(function(b){res(b&&b.size<f.size?b:(f.size<=5242880?f:null))},"image/jpeg",0.82);
  };
  im.onerror=function(){URL.revokeObjectURL(u);res(f.size<=5242880?f:null)};
  im.src=u;
 });
}
function photoMgr(box,urls){
 var m={items:urls.map(function(u){return{url:u}}),gone:[]};
 var inp=document.createElement("input");inp.type="file";inp.accept="image/jpeg,image/png,image/webp";inp.multiple=true;inp.style.display="none";
 var strip=document.createElement("div");strip.style.cssText="display:flex;flex-wrap:wrap;gap:12px;margin:0 0 12px";
 var add=document.createElement("button");add.type="button";add.className="btn alt";add.style.marginBottom="8px";
 var msg=document.createElement("small");msg.style.cssText="display:block;margin:0 0 10px";msg.setAttribute("role","status");
 box.appendChild(strip);box.appendChild(add);box.appendChild(msg);box.appendChild(inp);
 function draw(){
  strip.innerHTML="";
