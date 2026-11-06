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
  m.items.forEach(function(it,i){
   var w=document.createElement("div");w.style.cssText="position:relative;width:88px;height:88px";
   var im=document.createElement("img");im.src=it.url||it.preview;im.alt="Photo "+(i+1);im.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:10px";
   var x=document.createElement("button");x.type="button";x.textContent="\u00D7";x.setAttribute("aria-label","Remove photo "+(i+1));
   x.style.cssText="position:absolute;top:-10px;right:-10px;width:36px;height:36px;border-radius:50%;border:2px solid #fff;background:#000;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:0";
   x.onclick=function(){var r=m.items.splice(i,1)[0];if(r.url)m.gone.push(r.url);if(r.preview)URL.revokeObjectURL(r.preview);msg.textContent="";draw()};
   w.appendChild(im);w.appendChild(x);
   if(i===0){var cv=document.createElement("span");cv.textContent="Cover";cv.style.cssText="position:absolute;left:4px;bottom:4px;background:rgba(0,0,0,.75);color:#fff;font-size:11px;padding:2px 7px;border-radius:6px";w.appendChild(cv)}
   strip.appendChild(w);
  });
  add.textContent=m.items.length?"Add more photos ("+m.items.length+" of "+MAXP+")":"Add photos (up to "+MAXP+")";
  add.style.display=m.items.length>=MAXP?"none":"";
 }
 add.onclick=function(){inp.click()};
 inp.onchange=async function(){
  var files=[].slice.call(inp.files);inp.value="";
  if(!files.length)return;
  msg.textContent="Preparing photos...";
  var skipped=0,bad="";
  for(var k=0;k<files.length;k++){
   if(m.items.length>=MAXP){skipped++;continue}
   var b=await shrink(files[k]);
   if(!b){bad=files[k].name;continue}
   m.items.push({blob:b,preview:URL.createObjectURL(b)});
  }
  msg.textContent=skipped?"Only "+MAXP+" photos per listing.":(bad?"Could not use "+bad+". Try a different photo.":"");
  draw();
 };
 m.reset=function(){m.items.forEach(function(it){if(it.preview)URL.revokeObjectURL(it.preview)});m.items=[];m.gone=[];msg.textContent="";draw()};
 draw();
 return m;
}
async function uploadAll(m){
 var out=[],made=[];
 for(var k=0;k<m.items.length;k++){
  var it=m.items[k];
  if(it.url){out.push(it.url);continue}
  var t=it.blob.type,ext=t==="image/png"?"png":t==="image/webp"?"webp":"jpg";
  var path=user.id+"/"+Date.now()+"-"+k+"-"+Math.random().toString(36).slice(2,7)+"."+ext;
  var up=await db.storage.from("listing-photos").upload(path,it.blob,{contentType:t});
  if(up.error){if(made.length){try{await db.storage.from("listing-photos").remove(made)}catch(e){}}throw up.error}
  made.push(path);out.push(db.storage.from("listing-photos").getPublicUrl(path).data.publicUrl);
 }
 return out;
}
async function rmPhotos(u){
 var p=(u||[]).filter(function(x){return x&&x.indexOf("/listing-photos/")>-1}).map(function(x){return x.split("/listing-photos/")[1]});
 if(p.length){try{await db.storage.from("listing-photos").remove(p)}catch(e){}}
}
async function saveRow(fn,row){
 var r=await fn(row);
 if(r.error&&/image_urls/.test(r.error.message||"")){var o=Object.assign({},row);delete o.image_urls;r=await fn(o)}
 return r;
}
function gal(i){
 var a=i.imgs||[];
 if(a.length<2)return thumb(i);
 return '<div id="gal" style="display:flex;width:100%;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch">'+a.map(function(u,k){return '<img src="'+esc(u)+'" alt="Photo '+(k+1)+' of '+a.length+'" style="flex:0 0 100%;width:100%;height:100%;object-fit:cover;scroll-snap-align:start">'}).join("")+'</div><span id="gc" style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.75);color:#fff;font-size:13px;padding:3px 10px;border-radius:99px">1 / '+a.length+'</span>';
}
function chips(){$("chips").innerHTML=cats.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join("")}
function grid(){
 var q=$("q").value.toLowerCase();
 var list=items.filter(function(i){return (cat==="All"||i.c===cat)&&(i.t+i.d+i.l).toLowerCase().indexOf(q)>-1});
 $("grid").innerHTML=list.length?list.map(function(i){var k=items.indexOf(i);return '<button class="item" data-k="'+k+'"><div class="ph">'+thumb(i)+'</div><div class="b"><b>'+money(i.p)+'</b>'+esc(i.t)+'<br><small>'+esc(i.l)+'</small></div></button>'}).join(""):'<p>No listings yet. Sign in on the Sell tab and post the first one.</p>';
}
async function load(){
 var r=await db.from("listings").select("*").order("created_at",{ascending:false});
 if(r.error){$("grid").innerHTML="<p>Could not load listings. Please try again.</p>";return}
 items=r.data.map(function(x){return{id:x.id,u:x.user_id,t:x.title,p:x.price,c:x.category,l:x.area||"Nearby",d:x.description||"No description.",img:(Array.isArray(x.image_urls)&&x.image_urls.length?x.image_urls[0]:x.image_url),imgs:(Array.isArray(x.image_urls)&&x.image_urls.length?x.image_urls:(x.image_url?[x.image_url]:[]))}});
 grid();
}
function authUI(){
 var box=$("authbox");
 if(!box){box=document.createElement("div");box.id="authbox";$("post").insertBefore(box,$("post").firstChild)}
 ["pt","pp","pc","pl","pd","pf","pb"].forEach(function(i){$(i).style.display=user?"":"none"});
 if(user){
  box.innerHTML='<p class="note">Signed in as '+esc(user.email)+'</p><button class="btn alt" id="so" style="margin-bottom:12px">Sign out</button>';
  $("so").onclick=function(){db.auth.signOut()};
 }else{
  box.innerHTML='<h2>Sign in to sell or message</h2><input id="ae" type="email" placeholder="Email"><input id="ap" type="password" placeholder="Password (6 or more characters)"><div class="row"><button class="btn" id="si">Sign in</button><button class="btn alt" id="su">Create account</button></div><p id="am"></p>';
  $("si").onclick=async function(){var r=await db.auth.signInWithPassword({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:""};
  $("su").onclick=async function(){var r=await db.auth.signUp({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:(r.data.session?"":"Check your email to confirm your account.")};
 }
}
function note(t){var d=document.createElement("div");d.className="m";d.textContent=t;$("msgs").appendChild(d)}
async function loadMsgs(){
 if(!cur)return;
 var row=$("mi").parentNode;
 if(!user){$("msgs").innerHTML="";note("Sign in on the Sell tab to message the seller.");row.style.display="none";return}
 var owner=user.id===cur.u;
 row.style.display=(owner&&!thread)?"none":"";
 var q=db.from("messages").select("*").eq("listing_id",cur.id).order("created_at");
 if(!owner)q=q.eq("buyer_id",user.id);else if(thread)q=q.eq("buyer_id",thread);
 var r=await q;
 if(r.error){$("msgs").innerHTML="";note("Could not load messages.");return}
 var rows=r.data;
 $("msgs").innerHTML="";
 if(owner&&!thread){
  var seen={},n=0,ids=[];
  rows.forEach(function(m){if(!seen[m.buyer_id]){seen[m.buyer_id]=++n;ids.push(m.buyer_id)}});
  if(!ids.length){note("No messages yet.");return}
  note("Buyers who messaged you:");
  ids.forEach(function(id){var b=document.createElement("button");b.className="btn alt";b.textContent="Buyer "+seen[id];b.onclick=function(){thread=id;loadMsgs()};$("msgs").appendChild(b)});
  return;
 }
 if(owner){var bk=document.createElement("button");bk.className="btn alt";bk.textContent="All buyers";bk.onclick=function(){thread=null;loadMsgs()};$("msgs").appendChild(bk)}
 if(!rows.length)note("No messages yet. Say hello and ask where to meet.");
 rows.forEach(function(m){var d=document.createElement("div");d.className="m"+(m.sender_id===user.id?" me":"");d.textContent=m.body;$("msgs").appendChild(d)});
}
function fillSheet(){
 var sp=$("sp");sp.style.position="relative";sp.innerHTML=gal(cur);sp.style.cursor=cur.imgs.length?"zoom-in":"";if(cur.imgs.length)sp.insertAdjacentHTML("beforeend",'<span style="position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.75);color:#fff;font-size:13px;padding:3px 10px;border-radius:99px;pointer-events:none">Tap to zoom</span>');var gl=$("gal");if(gl){gl.onscroll=function(){var n=Math.round(gl.scrollLeft/gl.clientWidth)+1;$("gc").textContent=n+" / "+cur.imgs.length}}$("st").textContent=cur.t;$("sprice").textContent=money(cur.p);$("sl").textContent=cur.l;$("sd").textContent=cur.d;
 ["edt","del","rep","editbox"].forEach(function(id){var o=$(id);if(o)o.remove()});
 if(user&&cur.u===user.id){
  var be=document.createElement("button");be.id="edt";be.className="btn alt";be.style.marginBottom="8px";be.textContent="Edit my listing";be.onclick=openEdit;
  var bd=document.createElement("button");bd.id="del";bd.className="btn alt";bd.style.marginBottom="8px";bd.textContent="Delete my listing";bd.onclick=delListing;
  $("sd").after(be);be.after(bd);
 }else if(user){
  var br=document.createElement("button");br.id="rep";br.className="btn alt";br.style.marginBottom="8px";br.textContent="Report listing";br.onclick=reportListing;
  $("sd").after(br);
 }
}
async function delListing(){
 if(!confirm("Delete this listing?"))return;
 var r=await db.from("listings").delete().eq("id",cur.id);
 if(r.error){alert(r.error.message);return}
 await rmPhotos(cur.imgs);
 if(openedByPush){history.back()}else{hideSheet();history.replaceState(null,"","#browse")}
 load();
}
function openEdit(){
 if($("editbox")){$("editbox").remove();return}
 var box=document.createElement("div");box.id="editbox";box.style.margin="0 0 12px";
 box.innerHTML='<input id="et" placeholder="Item name"><input id="ep" type="number" inputmode="numeric" placeholder="Price in dollars"><select id="ec"></select><input id="el" placeholder="Your area"><textarea id="ed" rows="3" placeholder="Description"></textarea><p class="note">Photos</p><div id="epf"></div><div class="row"><button class="btn" id="es">Save changes</button><button class="btn alt" id="ex">Cancel</button></div>';
 $("del").after(box);
 $("ec").innerHTML=cats.slice(1).map(function(c){return "<option>"+c+"</option>"}).join("");
 $("et").value=cur.t;$("ep").value=cur.p;$("ec").value=cur.c;$("el").value=cur.l==="Nearby"?"":cur.l;$("ed").value=cur.d==="No description."?"":cur.d;
 var em=photoMgr($("epf"),cur.imgs||[]);
 $("ex").onclick=function(){box.remove()};
 $("es").onclick=async function(){
  var t=$("et").value.trim(),p=$("ep").value;
  if(!t||!p){alert("Add an item name and a price.");return}
  var sb=$("es");sb.disabled=true;sb.textContent="Saving...";
  var urls;try{urls=await uploadAll(em)}catch(err){alert("Photo upload failed: "+err.message);sb.disabled=false;sb.textContent="Save changes";return}
  var row={title:t,price:Number(p),category:$("ec").value,area:$("el").value.trim()||null,description:$("ed").value.trim()||null,image_url:urls[0]||null,image_urls:urls};
  var r=await saveRow(function(o){return db.from("listings").update(o).eq("id",cur.id)},row);
  if(r.error){alert("Could not save: "+r.error.message);sb.disabled=false;sb.textContent="Save changes";return}
  await rmPhotos(em.gone);
  var id=cur.id;await load();
  cur=items.filter(function(x){return x.id===id})[0]||cur;
  fillSheet();
 };
}
async function reportListing(){
 var why=prompt("What is wrong with this listing? (for example scam, banned item, or fake)");
 if(why===null)return;
 why=why.trim();
 if(!why){alert("Please add a short reason.");return}
 var r=await db.from("reports").insert({listing_id:cur.id,reason:why.slice(0,500)});
 if(r.error){alert(r.error.code==="23505"?"You already reported this listing. Thank you.":"Could not send report: "+r.error.message);return}
 alert("Thank you. Your report was sent to the OBM team.");
}
var rb=document.querySelector("#safety .btn.alt");
if(rb)rb.onclick=function(){alert("To report a listing, open it and tap Report listing.")};
$("chips").onclick=function(e){if(e.target.dataset.c){cat=e.target.dataset.c;chips();grid()}};
$("q").oninput=grid;
$("grid").onclick=function(e){var b=e.target.closest(".item");if(!b)return;var it=items[b.dataset.k];
 history.pushState(null,"","#listing-"+it.id);openedByPush=true;openListing(it)};
$("back").onclick=function(){
 if(openedByPush){history.back()}
 else{hideSheet();history.replaceState(null,"","#browse");show("browse",true)}
};
$("ms").onclick=async function(){var v=$("mi").value.trim();
 if(!v||!user||!cur)return;
 var owner=user.id===cur.u,buyer=owner?thread:user.id;
 if(!buyer)return;
 if(v.length>1000){alert("Keep messages under 1000 characters.");return}
 var r=await db.from("messages").insert({listing_id:cur.id,buyer_id:buyer,sender_id:user.id,body:v});
 if(r.error){alert("Could not send: "+r.error.message);return}
 $("mi").value="";
 await loadMsgs();
 if(/zelle|cash ?app|gift ?card|venmo|deposit|western union/i.test(v)){note("Safety reminder: never send money before you meet. Pay in person after you check the item.")}
};
setInterval(function(){if($("sheet").classList.contains("on")&&cur)loadMsgs()},8000);
$("pc").innerHTML='<option value="">Choose a category</option>'+cats.slice(1).map(function(c){return "<option>"+c+"</option>"}).join("");
var pfBox=document.createElement("div");pfBox.id="pf";$("pb").before(pfBox);var pm=photoMgr(pfBox,[]);
$("pb").onclick=async function(){var t=$("pt").value.trim(),p=$("pp").value;
 if(!user){alert("Sign in first.");return}
 if(!t||!p){alert("Add an item name and a price.");return}
 if(!$("pc").value){alert("Choose a category.");return}
 var b=$("pb");b.disabled=true;b.textContent="Posting...";
 var urls;try{urls=await uploadAll(pm)}catch(err){alert("Photo upload failed: "+err.message);b.disabled=false;b.textContent="Post listing";return}
 var row={title:t,price:Number(p),category:$("pc").value,area:$("pl").value.trim()||null,description:$("pd").value.trim()||null,image_url:urls[0]||null,image_urls:urls};
 var r=await saveRow(function(o){return db.from("listings").insert(o)},row);
 b.disabled=false;b.textContent="Post listing";
 if(r.error){await rmPhotos(urls);alert("Could not post: "+r.error.message);return}
 ["pt","pp","pl","pd"].forEach(function(i){$(i).value=""});$("pc").value="";pm.reset();cat="All";chips();await load();show("browse")};
function show(t,np){document.querySelectorAll(".tab").forEach(function(e){e.classList.toggle("on",e.id===t)});
 document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});window.scrollTo(0,0);
 if(!np&&location.hash!=="#"+t)history.pushState(null,"","#"+t)}
document.querySelector("nav").onclick=function(e){var b=e.target.closest("button");if(b){if($("sheet").classList.contains("on")){hideSheet();openedByPush=false}show(b.dataset.t)}};
var openedByPush=false;

var lb=null,lbI=[],lbK=0,lbOpen=false,Z={s:1,x:0,y:0};
function lbBtn(id,label,txt,css){return '<button id="'+id+'" type="button" aria-label="'+label+'" style="position:absolute;width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.2);color:#fff;font-size:28px;line-height:1;cursor:pointer;padding:0;'+css+'">'+txt+'</button>'}
function lbApply(){var im=$("lbi");im.style.transform="translate("+Z.x+"px,"+Z.y+"px) scale("+Z.s+")"}
function lbClamp(){
 var im=$("lbi"),st=$("lbs");
 if(Z.s<=1){Z.s=1;Z.x=0;Z.y=0;return}
 if(Z.s>5)Z.s=5;
 var mx=Math.max(0,(im.clientWidth*Z.s-st.clientWidth)/2),my=Math.max(0,(im.clientHeight*Z.s-st.clientHeight)/2);
 Z.x=Math.max(-mx,Math.min(mx,Z.x));Z.y=Math.max(-my,Math.min(my,Z.y));
}
function lbShow(){
 Z={s:1,x:0,y:0};
 var im=$("lbi");im.src=lbI[lbK];im.alt="Photo "+(lbK+1)+" of "+lbI.length;lbApply();
 var many=lbI.length>1;
 $("lbc").textContent=many?(lbK+1)+" / "+lbI.length:"";
 $("lbv").style.display=many?"":"none";$("lbn").style.display=many?"":"none";
}
function lbGo(d){if(lbI.length<2)return;lbK=(lbK+d+lbI.length)%lbI.length;lbShow()}
function lbZoom(f){Z.s=Z.s*f;lbClamp();lbApply()}
function lbHide(){if(!lb)return;lb.style.display="none";document.body.style.overflow="";lbOpen=false}
function closeLB(){if(!lbOpen)return;if(history.state&&history.state.lb)history.back();else lbHide()}
function lbBuild(){
 lb=document.createElement("div");lb.id="lb";lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-label","Photo viewer");
 lb.style.cssText="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.96);display:none;user-select:none;-webkit-user-select:none";
 lb.innerHTML='<div id="lbs" style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;display:flex;align-items:center;justify-content:center;touch-action:none"><img id="lbi" alt="" draggable="false" style="max-width:100%;max-height:100%;transform-origin:center center;will-change:transform;-webkit-user-drag:none"></div>'
  +lbBtn("lbx","Close photo viewer","\u00D7","top:calc(14px + env(safe-area-inset-top,0px));right:14px")
  +'<div id="lbc" style="position:absolute;top:calc(26px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);color:#fff;font-size:15px"></div>'
  +lbBtn("lbv","Previous photo","\u2039","top:50%;left:10px;margin-top:-24px")
  +lbBtn("lbn","Next photo","\u203A","top:50%;right:10px;margin-top:-24px")
  +lbBtn("lbm","Zoom out","\u2212","bottom:calc(18px + env(safe-area-inset-bottom,0px));left:calc(50% - 56px)")
  +lbBtn("lbp","Zoom in","+","bottom:calc(18px + env(safe-area-inset-bottom,0px));left:calc(50% + 8px)");
 document.body.appendChild(lb);
 $("lbx").onclick=closeLB;$("lbv").onclick=function(){lbGo(-1)};$("lbn").onclick=function(){lbGo(1)};
 $("lbm").onclick=function(){lbZoom(1/1.6)};$("lbp").onclick=function(){lbZoom(1.6)};
 var st=$("lbs"),P={},g=null,lastTap=0;
 function dist(){var k=Object.keys(P);var a=P[k[0]],b=P[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
 st.addEventListener("pointerdown",function(e){
  try{st.setPointerCapture(e.pointerId)}catch(x){}
  P[e.pointerId]={x:e.clientX,y:e.clientY};
  var n=Object.keys(P).length;
  if(n===2){g={mode:"pinch",d0:dist(),s0:Z.s}}
  else if(n===1){g={mode:"pan",x0:e.clientX,y0:e.clientY,tx:Z.x,ty:Z.y,moved:0,t:Date.now()}}
 });
 st.addEventListener("pointermove",function(e){
  if(!P[e.pointerId]||!g)return;
  P[e.pointerId]={x:e.clientX,y:e.clientY};
  if(g.mode==="pinch"&&Object.keys(P).length>=2){Z.s=g.s0*dist()/g.d0;lbClamp();lbApply()}
  else if(g.mode==="pan"){
   var dx=e.clientX-g.x0,dy=e.clientY-g.y0;g.moved=Math.max(g.moved,Math.hypot(dx,dy));
   if(Z.s>1){Z.x=g.tx+dx;Z.y=g.ty+dy;lbClamp();lbApply()}
  }
 });
 function up(e){
  if(!P[e.pointerId])return;
  var was=g;delete P[e.pointerId];
  if(Object.keys(P).length>0){if(was&&was.mode==="pinch"){var k=Object.keys(P)[0];g={mode:"pan",x0:P[k].x,y0:P[k].y,tx:Z.x,ty:Z.y,moved:99,t:Date.now()}}return}
  g=null;
  if(!was||was.mode!=="pan")return;
  var dx=e.clientX-was.x0,dy=e.clientY-was.y0;
  if(Z.s===1&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){lbGo(dx<0?1:-1);return}
  if(was.moved<10){
   var now=Date.now();
   if(now-lastTap<320){
    lastTap=0;
    if(Z.s>1){Z.s=1}
    else{var r=st.getBoundingClientRect(),ox=e.clientX-(r.left+r.width/2),oy=e.clientY-(r.top+r.height/2);Z.s=2.5;Z.x=-ox*1.5;Z.y=-oy*1.5}
    lbClamp();lbApply();
   }else lastTap=now;
  }
 }
 st.addEventListener("pointerup",up);st.addEventListener("pointercancel",up);
 st.addEventListener("wheel",function(e){e.preventDefault();lbZoom(e.deltaY<0?1.2:1/1.2)},{passive:false});
 document.addEventListener("keydown",function(e){
  if(!lbOpen)return;
  if(e.key==="Escape")closeLB();else if(e.key==="ArrowLeft")lbGo(-1);else if(e.key==="ArrowRight")lbGo(1);
  else if(e.key==="+"||e.key==="=")lbZoom(1.6);else if(e.key==="-")lbZoom(1/1.6);
 });
}
function openLB(imgs,k){
 if(!imgs||!imgs.length)return;
 if(!lb)lbBuild();
 lbI=imgs;lbK=k||0;lbShow();
 lb.style.display="block";document.body.style.overflow="hidden";
 history.pushState({lb:1},"",location.href);lbOpen=true;
 $("lbx").focus();
}
$("sp").onclick=function(e){
 if(!cur||!cur.imgs||!cur.imgs.length)return;
 var im=e.target.closest("img"),k=0;
 if(im){var all=[].slice.call($("sp").querySelectorAll("img"));k=Math.max(0,all.indexOf(im))}
 openLB(cur.imgs,k);
};
function validTab(t){return !!document.querySelector('nav button[data-t="'+t+'"]')}
function hideSheet(){$("sheet").classList.remove("on");cur=null;thread=null}
function openListing(it){cur=it;thread=null;fillSheet();$("sheet").classList.add("on");window.scrollTo(0,0);loadMsgs()}
function route(){
 if(lbOpen&&!(history.state&&history.state.lb)){lbHide();return}
 var h=location.hash.slice(1);
 if(h.indexOf("listing-")===0){
  var id=h.slice(8),it=items.filter(function(x){return String(x.id)===id})[0];
  if(it){if(!cur||String(cur.id)!==id)openListing(it);return}
 }
 openedByPush=false;hideSheet();show(validTab(h)?h:"browse",true);
}
window.addEventListener("popstate",route);
db.auth.onAuthStateChange(function(ev,s){user=s?s.user:null;authUI()});
if(!location.hash)history.replaceState(null,"","#browse");
chips();authUI();load().then(route);
