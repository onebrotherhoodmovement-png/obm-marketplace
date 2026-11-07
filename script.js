var SUPA_URL="https://wmgeruhdfcsjarktuzpd.supabase.co";
var SUPA_KEY="sb_publishable_q7dolXz8rixOUnsxNzdheQ_zSM86bPa";
var db=supabase.createClient(SUPA_URL,SUPA_KEY);
var SEP=" \u203A ";
var TAX=[
["Electronics & Media","\u{1F4F1}",["Audio & Speakers","Cell phones & Accessories","Cameras & Photography","TVs & Media players","Video games & Consoles","Computers & Accessories","Books, Movies, & Music","Wearables","Drones","Virtual reality","3D Printers & Supplies","Other - Electronics & Media"]],
["Home & Garden","\u{1F3E0}",["Furniture","Household","Appliances","Kitchen & Dining","Bathroom","Tools & Machinery","Home improvement","Lawn & Garden","Home decor","Other - Home & Garden"]],
["Clothing, Shoes, & Accessories","\u{1F455}",["Women's clothing","Men's clothing","Women's shoes","Men's shoes","Jewelry & Accessories","Girls' clothing","Boys' clothing","Baby & Toddler girl clothing","Baby & Toddler boy clothing","Baby & Toddler accessories","Girls' shoes","Girls' accessories","Boys' shoes","Boys' accessories","Other - Clothing, Shoes, & Accessories"]],
["Baby & Kids","\u{1F37C}",["Girls' accessories","Boys' accessories","Bathing & Skincare","Car seats & Accessories","Diapering","Feeding","Baby gear","Health & Baby care","Nursery furniture & Decor","Potty training","Pregnancy & Maternity","Baby safety","Strollers & Accessories","Baby toys","Other - Baby & Kids"]],
["Vehicles","\u{1F697}",["Cars & Trucks","Motorcycles & Powersports","RVs & Campers","Trailers","Boats & Watercraft","Auto parts","Tires & Wheels","Car audio & Electronics","Other - Vehicles"]],
["Toys, Games, & Hobbies","\u{1F9E9}",["Toys","Games & Puzzles","Outdoor toys & Games","Stuffed animals & Plush","Dress up & Pretend","Trading cards","Musical instruments","Other - Toys, Games, & Hobbies"]],
["Sports & Outdoors","\u{1F3C0}",["Exercise","Yoga & Pilates","Mixed martial arts & Boxing","Bikes & Cycling","Skateboarding","Fishing","Camping & Hiking","Water sports","Ice & Snow sports","Lawn games","Team sports","Golf","Fan shop","Other - Sports & Outdoors"]],
["Collectibles & Art","\u{1F3FA}",["Art","Antiques","Coins & Currency","Memorabilia","Other - Collectibles & Art"]],
["Pet supplies","\u{1F415}",["Pet collars & Leashes","Pet clothing, Accessories, & Shoes","Pet toys","Pet feeding","Pet bedding","Pet furniture","Pet carriers & Houses","Pet health & Wellness","Training","Pet gates & Fences","Other - Pet supplies"]],
["Health & Beauty","\u{1F49C}",["Hair care","Bath & Body","Makeup & Cosmetics","Skincare","Fragrance","Personal care","Tools & Accessories","Other - Health & Beauty"]],
["Wedding","\u{1F48D}",["Jewelry","Invitations & Paper","Gifts & Mementos","Decorations","Accessories","Clothing","Shoes","Other - Wedding"]],
["Business equipment","\u{1F4BC}",["Farming & Agriculture","Building materials & Supplies","Cleaning & Janitorial supplies","Electrical equipment & Supplies","Facility maintenance & Safety","Fasteners & Hardware","HVAC","Light industrial equipment & Tools","Material handling","Office equipment & Supplies","Restaurant & Food service equipment","Printing & Graphic arts","Retail & Services","Industrial fuel & Energy equipment","Other - Business equipment"]],
["Food & Farm","\u{1F969}",["Meat & Seafood","Produce","Baked goods","Farm animals & Livestock","Other - Food & Farm"]],
["Tickets","\u{1F3AB}",["Concerts","Sports","Theater","Theme parks","Other - Tickets"]],
["General","\u{1F4E6}",["Free stuff","Miscellaneous","Other - General"]]
];
var cats=["All"].concat(TAX.map(function(t){return t[0]}));
var icons={};TAX.forEach(function(t){icons[t[0]]=t[1]});icons.Other=icons.General;
var LEGACY={"Electronics":"Electronics & Media"+SEP+"Other - Electronics & Media","Furniture":"Home & Garden"+SEP+"Furniture","Clothing":"Clothing, Shoes, & Accessories"+SEP+"Other - Clothing, Shoes, & Accessories","Tools":"Home & Garden"+SEP+"Tools & Machinery","Vehicles":"Vehicles"+SEP+"Other - Vehicles","Home":"Home & Garden"+SEP+"Other - Home & Garden","Other":"General"+SEP+"Other - General"};
function normCat(c){c=c||"";if(LEGACY[c])return LEGACY[c];return c||("General"+SEP+"Other - General")}
function mainOf(c){return String(c||"").split(SEP)[0]}
function subOf(c){var a=String(c||"").split(SEP);return a[1]||""}
function catOptions(){return TAX.map(function(t){return '<optgroup label="'+esc(t[0])+'">'+t[2].map(function(x){var v=t[0]+SEP+x;return '<option value="'+esc(v)+'">'+esc(x)+'</option>'}).join("")+'</optgroup>'}).join("")}
var ratings=[],ratingsOK=false;
function rStat(u){var a=ratings.filter(function(r){return r.ratee_id===u&&blocked.indexOf(r.rater_id)<0});if(!a.length)return null;var t=0;a.forEach(function(r){t+=r.stars});return{n:a.length,avg:t/a.length}}
function rTxt(u){var x=rStat(u);return x?" \u2605 "+x.avg.toFixed(1)+" ("+x.n+")":""}
function stars(n){return "\u2605\u2605\u2605\u2605\u2605".slice(0,n)+"\u2606\u2606\u2606\u2606\u2606".slice(0,5-n)}
function hasRated(ratee,lid){return !!user&&ratings.some(function(r){return r.rater_id===user.id&&r.ratee_id===ratee&&String(r.listing_id)===String(lid)})}
function rateBox(ratee,lid,anchor){
 var old=$("ratebox");if(old)old.remove();
 var b=document.createElement("div");b.id="ratebox";b.className="m";b.style.margin="0 0 10px";var v=0;
 b.innerHTML='<h3>Rate '+esc(nameOf(ratee))+'</h3><div id="rstars" style="font-size:34px;letter-spacing:6px;cursor:pointer;color:var(--gold)" role="group" aria-label="Stars"></div><textarea id="rcm" rows="2" maxlength="300" placeholder="Optional: how did it go? (300 characters)"></textarea><div class="row"><button class="btn" id="rsub" type="button">Submit rating</button><button class="btn alt" id="rcan" type="button">Cancel</button></div><p id="rmsg"></p>';
 anchor(b);
 function draw(){$("rstars").innerHTML=[1,2,3,4,5].map(function(i){return '<span data-v="'+i+'" role="button" aria-label="'+i+' star'+(i>1?"s":"")+'">'+(i<=v?"\u2605":"\u2606")+'</span>'}).join("")}
 draw();$("rstars").onclick=function(e){var t=e.target.closest("[data-v]");if(t){v=+t.dataset.v;draw()}};
 $("rcan").onclick=function(){b.remove()};
 $("rsub").onclick=async function(){
  if(!v){$("rmsg").textContent="Tap a star first.";return}
  $("rsub").disabled=true;$("rmsg").textContent="Saving...";
  var row={ratee_id:ratee,listing_id:String(lid),stars:v,comment:$("rcm").value.trim()||null};
  var r=await db.from("ratings").insert(row).select().single();
  if(r.error){$("rsub").disabled=false;$("rmsg").textContent=r.error.code==="23505"?"You already rated this one.":r.error.message;return}
  ratings.unshift(r.data);b.remove();alert("Thank you. Your rating was saved.");
  if(cur){fillSheet();loadMsgs()}
 }
}
async function rateSetup(){
 var o=$("ratebtn");if(o)o.remove();var o2=$("ratebox");if(o2)o2.remove();
 if(!ratingsOK||!user||!cur||!cur.sold)return;
 var cid=cur.id;
 if(cur.u!==user.id){
  if(hasRated(cur.u,cid))return;
  var c=await db.from("messages").select("id",{count:"exact",head:true}).eq("listing_id",cid).eq("buyer_id",user.id);
  if(c.error||!c.count||!cur||cur.id!==cid||$("ratebtn"))return;
  var b=document.createElement("button");b.id="ratebtn";b.className="btn alt";b.style.marginBottom="8px";b.textContent="Rate "+nameOf(cur.u);
  b.onclick=function(){rateBox(cur.u,cur.id,function(x){$("msgs").before(x)})};
  $("msgs").before(b);
 }
}
function drawReviews(uid){
 var rv=$("sellrev");if(!rv){rv=document.createElement("div");rv.id="sellrev";$("sellp").after(rv)}
 var a=ratings.filter(function(r){return r.ratee_id===uid&&blocked.indexOf(r.rater_id)<0});
 var st=rStat(uid);
 if(!a.length){rv.innerHTML='<p class="note">No ratings yet.</p>';return}
 rv.innerHTML='<h3>'+esc(rTxt(uid).trim())+'</h3>'+a.slice(0,30).map(function(r){return '<div class="m" style="margin:0 0 8px"><b style="color:var(--gold)">'+stars(r.stars)+'</b> '+esc(r.comment||"")+'<br><small>'+esc(nameOf(r.rater_id))+' \u00B7 '+new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})+(user&&r.rater_id!==user.id?' \u00B7 <a href="#" data-rr="'+esc(r.id)+'" style="color:inherit">Report</a>':'')+'</small></div>'}).join("");
 rv.onclick=async function(e){var t=e.target.closest("[data-rr]");if(!t)return;e.preventDefault();var why=prompt("What is wrong with this review?");if(!why||!why.trim())return;var r=await db.from("review_reports").insert({rating_id:t.dataset.rr,reason:why.trim().slice(0,500)});alert(r.error?(r.error.code==="23505"?"You already reported this review.":"Could not send: "+r.error.message):"Thank you. The OBM team will review it.")}
}
var profilesOK=false,names={},OWNER="onebrotherhoodmovement@gmail.com",RESERVED=/(^|[^a-z0-9])obm([^a-z0-9]|$)|one\s*brotherhood|admin|official|moderator|odessa\s*meats/i;
function nameOf(u){return names[u]||("Brother "+String(u||"").slice(0,4))}
var blocked=[],blkFor="",myArea="",onlyArea=false;try{myArea=localStorage.getItem("obm-area")||""}catch(e){}
var items=[],cat="All",sub="",cur=null,user=null,thread=null;
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function money(n){return "$"+Number(n).toLocaleString("en-US")}
function thumb(i){return i.img?'<img src="'+esc(i.img)+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">':(icons[mainOf(i.c)]||icons.Other)}
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
function ddSync(){var d=$("catsel");if(!d){d=document.createElement("select");d.id="catsel";d.setAttribute("aria-label","Category");
 d.innerHTML='<option value="">All categories</option>'+TAX.map(function(t){return '<optgroup label="'+esc(t[0])+'"><option value="'+esc(t[0])+'">All '+esc(t[0])+'</option>'+t[2].map(function(x){return '<option value="'+esc(t[0]+SEP+x)+'">'+esc(x)+'</option>'}).join("")+'</optgroup>'}).join("");
 d.onchange=function(){var v=d.value;cat=v?mainOf(v):"All";sub=v?subOf(v):"";chips();grid()};$("chips").before(d)}
 d.value=cat==="All"?"":(sub?cat+SEP+sub:cat)}
function chips(){ddSync();$("chips").innerHTML=cats.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("");
 var sc=$("subchips");if(!sc){sc=document.createElement("div");sc.id="subchips";sc.className="chips";$("chips").after(sc)}
 var t=TAX.filter(function(x){return x[0]===cat})[0];
 if(!t){sc.innerHTML="";sc.style.display="none";return}
 sc.style.display="";sc.innerHTML='<button class="chip'+(sub===""?' on':'')+'" data-s="">All '+esc(cat)+'</button>'+t[2].map(function(x){return '<button class="chip'+(sub===x?' on':'')+'" data-s="'+esc(x)+'">'+esc(x)+'</button>'}).join("")}
function isNear(i){var a=myArea.trim().toLowerCase(),l=String(i.l||"").trim().toLowerCase();if(!a||!l||l==="nearby")return false;return l.indexOf(a)>-1||a.indexOf(l)>-1}
function nearUI(){if($("nearbox"))return;var d=document.createElement("div");d.id="nearbox";d.style.cssText="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 10px";
 d.innerHTML='<input id="area" placeholder="Your city or ZIP (show nearby first)" style="flex:1;min-width:180px;margin:0"><label style="display:flex;gap:6px;align-items:center;font-size:14px"><input type="checkbox" id="onlyarea" style="width:auto;margin:0">Only my area</label>';
 $("q").after(d);$("area").value=myArea;
 $("area").oninput=function(){myArea=$("area").value;try{localStorage.setItem("obm-area",myArea)}catch(e){}grid()};
 $("onlyarea").onchange=function(){onlyArea=$("onlyarea").checked;grid()}}
function grid(){
 nearUI();
 var q=$("q").value.toLowerCase();
 var list=items.filter(function(i){return (cat==="All"||mainOf(i.c)===cat)&&(!sub||subOf(i.c)===sub)&&(!(onlyArea&&myArea.trim())||isNear(i))&&(i.t+i.d+i.l+" "+i.c).toLowerCase().indexOf(q)>-1});
 list=sortSold(list);if(myArea.trim())list=list.map(function(i,k){return{i:i,k:k}}).sort(function(a,b){return ((isNear(b.i)?1:0)-(isNear(a.i)?1:0))||(a.k-b.k)}).map(function(o){return o.i});
 $("grid").innerHTML=list.length?list.map(card).join(""):(onlyArea&&myArea.trim()?'<p>No listings in your area yet. Untick "Only my area" to see everything.</p>':'<p>No listings yet. Sign in on the Account tab, then tap Post to list the first one.</p>');
}
async function load(){
 var pr=await db.from("profiles").select("user_id,display_name").limit(3000);profilesOK=!pr.error;if(!pr.error){names={};pr.data.forEach(function(x){names[x.user_id]=x.display_name});var dn0=$("dn");if(dn0&&user&&document.activeElement!==dn0&&!dn0.value)dn0.value=names[user.id]||""}
 var rr=await db.from("ratings").select("id,rater_id,ratee_id,listing_id,stars,comment,created_at").order("created_at",{ascending:false}).limit(5000);ratingsOK=!rr.error;if(!rr.error)ratings=rr.data;
 var r=await db.from("listings").select("*").order("created_at",{ascending:false});
 if(r.error){$("grid").innerHTML="<p>Could not load listings. Please try again.</p>";return}
 items=r.data.map(function(x){return{id:x.id,u:x.user_id,sold:!!x.sold,at:x.created_at,t:x.title,p:x.price,c:normCat(x.category),l:x.area||"Nearby",d:x.description||"No description.",img:(Array.isArray(x.image_urls)&&x.image_urls.length?x.image_urls[0]:x.image_url),imgs:(Array.isArray(x.image_urls)&&x.image_urls.length?x.image_urls:(x.image_url?[x.image_url]:[]))}}).filter(function(i){return blocked.indexOf(i.u)<0});
 grid();
}
async function loadBlocks(){
 if(!user){blocked=[];return}
 var r=await db.from("blocks").select("blocked_id");
 blocked=r.error?[]:r.data.map(function(x){return x.blocked_id});
 await load();drawBlocked();
}
function drawBlocked(){
 var bx=$("blkbox");if(bx)bx.remove();
 if(!user||!blocked.length||!$("authbox"))return;
 bx=document.createElement("div");bx.id="blkbox";bx.style.margin="0 0 14px";
 bx.innerHTML='<h3>Blocked sellers</h3>'+blocked.map(function(id){return '<div class="row" style="align-items:center;margin-bottom:6px"><span style="flex:1">'+esc(nameOf(id))+'</span><button class="btn alt" type="button" data-u="'+esc(id)+'" style="flex:0 0 auto;width:auto;padding:8px 14px">Unblock</button></div>'}).join("");
 $("authbox").after(bx);
 bx.onclick=async function(e){var b=e.target.closest("button");if(!b)return;b.disabled=true;var r=await db.from("blocks").delete().eq("blocked_id",b.dataset.u);if(r.error){b.disabled=false;alert("Could not unblock: "+r.error.message);return}blocked=blocked.filter(function(x){return x!==b.dataset.u});await load();drawBlocked()}
}
async function blockSeller(){
 if(!user||!cur||cur.u===user.id)return;
 if(!confirm("Block this seller? You will no longer see their listings or messages. You can unblock them any time in Account."))return;
 var r=await db.from("blocks").insert({blocked_id:cur.u});
 if(r.error&&r.error.code!=="23505"){alert("Could not block: "+r.error.message);return}
 if(blocked.indexOf(cur.u)<0)blocked.push(cur.u);
 $("back").onclick();await load();drawBlocked();alert("Seller blocked.");
}
function authUI(){
 var uid=user?user.id:"";if(uid!==blkFor){blkFor=uid;if(uid)loadBlocks();else{blocked=[];drawBlocked();load()}}
 var box=$("authbox");
 if(!box){box=document.createElement("div");box.id="authbox";$("account").insertBefore(box,$("account").firstChild)}
 ["pt","pp","pc","pl","pd","pf","pb"].forEach(function(i){$(i).style.display=user?"":"none"});
 if(recovering&&user){
  box.innerHTML='<h2>Set a new password</h2><p class="note">Choose a new password for '+esc(user.email)+'.</p><input id="np" type="password" placeholder="New password (6 or more characters)" autocomplete="new-password"><button class="btn" id="npb" type="button">Save new password</button><p id="npm"></p>';
  $("npb").onclick=async function(){var p=$("np").value;if(p.length<6){$("npm").textContent="Use at least 6 characters.";return}$("npb").disabled=true;var r=await db.auth.updateUser({password:p});if(r.error){$("npb").disabled=false;$("npm").textContent=r.error.message;return}recovering=false;alert("Your password was updated.");authUI()};
 }else if(user){
  box.innerHTML='<h2>Account</h2><p class="note">Signed in as '+esc(user.email)+'</p><h3>Display name</h3><p class="note">Buyers and sellers see this name instead of your email.</p><input id="dn" maxlength="30" placeholder="Your name (2 to 30 characters)" value="'+esc(names[user.id]||"")+'"><button class="btn" id="dns" type="button" style="margin-bottom:12px">Save name</button><p id="dnm"></p><button class="btn alt" id="so" style="margin-bottom:12px">Sign out</button>';
  $("so").onclick=function(){db.auth.signOut()};
  $("dns").onclick=async function(){var v=$("dn").value.trim().replace(/\s+/g," ");
   if(v.length<2||v.length>30){$("dnm").textContent="Use 2 to 30 characters.";return}
   if(RESERVED.test(v)&&user.email!==OWNER){$("dnm").textContent="That name is reserved. Please choose another.";return}
   $("dns").disabled=true;$("dnm").textContent="Saving...";
   var r=await db.from("profiles").upsert({user_id:user.id,display_name:v},{onConflict:"user_id"});
   $("dns").disabled=false;
   if(r.error){$("dnm").textContent=r.error.code==="23505"?"That name is already taken. Try another.":r.error.message;return}
   names[user.id]=v;$("dnm").textContent="Saved. You show as "+v+".";grid()};
 }else{
  box.innerHTML='<h2>Sign in to sell or message</h2><input id="ae" type="email" placeholder="Email"><input id="ap" type="password" placeholder="Password (6 or more characters)"><div class="row"><button class="btn" id="si">Sign in</button><button class="btn alt" id="su">Create account</button></div><button class="btn alt" id="fp" type="button" style="margin-top:10px">Forgot password?</button><p id="am"></p>';
  $("fp").onclick=async function(){var e=$("ae").value.trim();if(!e){$("am").textContent="Type your email above first, then tap Forgot password.";return}$("fp").disabled=true;var r=await db.auth.resetPasswordForEmail(e,{redirectTo:location.origin+"/"});setTimeout(function(){if($("fp"))$("fp").disabled=false},30000);$("am").textContent=r.error?(/rate|seconds|too many/i.test(r.error.message||"")?"Please wait a minute before asking again.":r.error.message):"If that email has an account, we sent a link to reset your password. Check your inbox and spam folder."};
  $("si").onclick=async function(){var r=await db.auth.signInWithPassword({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:""};
  $("su").onclick=async function(){var r=await db.auth.signUp({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:(r.data.session?"":"Check your email to confirm your account.")};
 }
}
function note(t){var d=document.createElement("div");d.className="m";d.textContent=t;$("msgs").appendChild(d)}
async function loadMsgs(){
 if(!cur)return;
 var row=$("mi").parentNode;
 if(!user){$("msgs").innerHTML="";note("Sign in on the Account tab to message the seller.");row.style.display="none";return}
 var owner=user.id===cur.u;
 row.style.display=(owner&&!thread)?"none":"";
 var q=db.from("messages").select("*").eq("listing_id",cur.id).order("created_at");
 if(!owner)q=q.eq("buyer_id",user.id);else if(thread)q=q.eq("buyer_id",thread);
 var r=await q;
 if(r.error){$("msgs").innerHTML="";note("Could not load messages.");return}
 var rows=owner?r.data.filter(function(m){return blocked.indexOf(m.buyer_id)<0}):r.data;markSeen(rows,owner);
 $("msgs").innerHTML="";
 if(owner&&!thread){
  var seen={},n=0,ids=[];
  rows.forEach(function(m){if(!seen[m.buyer_id]){seen[m.buyer_id]=++n;ids.push(m.buyer_id)}});
  if(!ids.length){note("No messages yet.");return}
  note("Buyers who messaged you:");
  ids.forEach(function(id){var b=document.createElement("button");b.className="btn alt";b.textContent=(names[id]||("Buyer "+seen[id]))+rTxt(id);b.onclick=function(){thread=id;loadMsgs()};$("msgs").appendChild(b)});
  return;
 }
 if(owner&&thread&&cur.sold&&ratingsOK&&!hasRated(thread,cur.id)){var rb2=document.createElement("button");rb2.className="btn alt";rb2.textContent="Rate "+nameOf(thread);rb2.onclick=function(){rateBox(thread,cur.id,function(x){$("msgs").before(x)})};$("msgs").appendChild(rb2)}
 if(owner){var bk=document.createElement("button");bk.className="btn alt";bk.textContent="All buyers";bk.onclick=function(){thread=null;loadMsgs()};$("msgs").appendChild(bk)}
 if(!rows.length)note("No messages yet. Say hello and ask where to meet.");
 rows.forEach(function(m){var d=document.createElement("div");d.className="m"+(m.sender_id===user.id?" me":"");d.textContent=m.body;$("msgs").appendChild(d)});
}
function fillSheet(){
 var sp=$("sp");sp.style.position="relative";sp.innerHTML=gal(cur);sp.style.cursor=cur.imgs.length?"zoom-in":"";if(cur.imgs.length)sp.insertAdjacentHTML("beforeend",'<span style="position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.75);color:#fff;font-size:13px;padding:3px 10px;border-radius:99px;pointer-events:none">Tap to zoom</span>');var gl=$("gal");if(gl){gl.onscroll=function(){var n=Math.round(gl.scrollLeft/gl.clientWidth)+1;$("gc").textContent=n+" / "+cur.imgs.length}}$("st").textContent=cur.t;$("sprice").textContent=money(cur.p);$("sl").textContent=cur.l;$("sd").textContent=cur.d;
 ["edt","del","rep","blk","editbox"].forEach(function(id){var o=$(id);if(o)o.remove()});
 if(user&&cur.u===user.id){
  var be=document.createElement("button");be.id="edt";be.className="btn alt";be.style.marginBottom="8px";be.textContent="Edit my listing";be.onclick=openEdit;
  var bd=document.createElement("button");bd.id="del";bd.className="btn alt";bd.style.marginBottom="8px";bd.textContent="Delete my listing";bd.onclick=delListing;
  $("sd").after(be);be.after(bd);
 }else if(user){
  var br=document.createElement("button");br.id="rep";br.className="btn alt";br.style.marginBottom="8px";br.textContent="Report listing";br.onclick=reportListing;
  var bb=document.createElement("button");bb.id="blk";bb.className="btn alt";bb.style.marginBottom="8px";bb.textContent="Block this seller";bb.onclick=blockSeller;
  $("sd").after(br);br.after(bb);
 }
 var sb0=$("sby");if(sb0)sb0.remove();
 var sby=document.createElement("p");sby.id="sby";sby.className="note";sby.style.margin="0 0 8px";sby.textContent="Sold by "+nameOf(cur.u)+rTxt(cur.u);$("sd").before(sby);
 sheetExtras();
 rateSetup();
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
 $("ec").innerHTML=catOptions();
 $("et").value=cur.t;$("ep").value=cur.p;$("ec").value=cur.c;if(!$("ec").value)$("ec").value="General"+SEP+"Other - General";$("el").value=cur.l==="Nearby"?"":cur.l;$("ed").value=cur.d==="No description."?"":cur.d;
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
$("chips").onclick=function(e){var b=e.target.closest("button");if(b&&b.dataset.c!==undefined){cat=b.dataset.c;sub="";chips();grid()}};
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#subchips button");if(b){sub=b.dataset.s||"";chips();grid()}});
$("q").oninput=grid;
function gridClick(e){
 var h=e.target.closest(".heart");
 if(h){e.preventDefault();e.stopPropagation();favToggle(h.dataset.id);refreshViews();return}
 var b=e.target.closest(".item");if(!b)return;var it=items[b.dataset.k];
 history.pushState(null,"","#listing-"+it.id);openedByPush=true;openListing(it)}
$("grid").onclick=gridClick;
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
$("pc").innerHTML='<option value="">Choose a category</option>'+catOptions();
var pfBox=document.createElement("div");pfBox.id="pf";$("pb").before(pfBox);var pm=photoMgr(pfBox,[]);
$("pb").onclick=async function(){var t=$("pt").value.trim(),p=$("pp").value;
 if(profilesOK&&!names[user.id]){alert("Please choose a display name first. Go to Account, type your name, and tap Save name.");show("account");return}
 if(!user){alert("Sign in first.");return}
 if(!t||!p){alert("Add an item name and a price.");return}
 if(!$("pc").value){alert("Choose a category.");return}
 var b=$("pb");b.disabled=true;b.textContent="Posting...";
 var urls;try{urls=await uploadAll(pm)}catch(err){alert("Photo upload failed: "+err.message);b.disabled=false;b.textContent="Post listing";return}
 var row={title:t,price:Number(p),category:$("pc").value,area:$("pl").value.trim()||null,description:$("pd").value.trim()||null,image_url:urls[0]||null,image_urls:urls};
 var r=await saveRow(function(o){return db.from("listings").insert(o)},row);
 b.disabled=false;b.textContent="Post listing";
 if(r.error){await rmPhotos(urls);alert("Could not post: "+r.error.message);return}
 ["pt","pp","pl","pd"].forEach(function(i){$(i).value=""});$("pc").value="";pm.reset();cat="All";sub="";chips();await load();show("browse")};
function show(t,np){document.querySelectorAll(".tab").forEach(function(e){e.classList.toggle("on",e.id===t)});
 document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b.dataset.t===(NAVMAP[t]||t))});window.scrollTo(0,0);
 if(t==="saved")renderSaved();
 curTab=t;if(t==="inbox")renderInbox();if(t==="mine")renderMine();updateFab();
 if(!np&&location.hash!=="#"+t)history.pushState(null,"","#"+t)}
document.querySelector("nav").onclick=function(e){var b=e.target.closest("button");if(b){if($("sheet").classList.contains("on")){hideSheet();openedByPush=false}show(b.dataset.t);if(b.dataset.t==="browse"){cat="All";sub="";$("q").value="";chips();grid();window.scrollTo(0,0)}}};
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
function validTab(t){var e=document.getElementById(t);return !!(e&&e.classList.contains("tab"))}
function hideSheet(){$("sheet").classList.remove("on");cur=null;thread=null;updateFab()}
function openListing(it,tb){cur=it;thread=tb||null;fillSheet();$("sheet").classList.add("on");updateFab();window.scrollTo(0,0);loadMsgs()}
function route(pop){
 if(recovering){show("account",true);return}
 if(lbOpen&&!(history.state&&history.state.lb)){lbHide();return}
 var h=location.hash.slice(1);
 if(h.indexOf("listing-")===0){
  var id=h.slice(8),it=items.filter(function(x){return String(x.id)===id})[0];
  if(it){if(!cur||String(cur.id)!==id){if(pop===true)openedByPush=true;openListing(it)}return}
 }
 if(h.indexOf("seller-")===0){openedByPush=false;showSeller(h.slice(7),true);return}
 openedByPush=false;hideSheet();show(validTab(h)?h:"browse",true);
}
window.addEventListener("popstate",function(){route(true)});
var recovering=false;
db.auth.onAuthStateChange(function(ev,s){user=s?s.user:null;if(ev==="PASSWORD_RECOVERY"){recovering=true;setTimeout(function(){if(typeof show==="function")show("account")},0)}if(ev==="SIGNED_OUT")recovering=false;authUI()});

var sellerUid=null,sellerPushed=false;
(function(){var st=document.createElement("style");st.textContent=".item .ph{position:relative}.heart{position:absolute;top:8px;right:8px;width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer}.heart.on{color:#ff6b6b}.soldb{position:absolute;left:8px;top:8px;background:#b3261e;color:#fff;font-weight:700;font-size:12px;padding:3px 9px;border-radius:6px}.item.sold .ph img{opacity:.45}";document.head.appendChild(st)})();
function favGet(){try{return JSON.parse(localStorage.getItem("obm-fav")||"[]")}catch(e){return[]}}
function favHas(id){return favGet().indexOf(String(id))>-1}
function favToggle(id){var a=favGet(),k=a.indexOf(String(id));if(k>-1)a.splice(k,1);else a.push(String(id));try{localStorage.setItem("obm-fav",JSON.stringify(a))}catch(e){alert("Could not save on this device.")}return k===-1}
function sortSold(l){return l.slice().sort(function(a,b){return (a.sold?1:0)-(b.sold?1:0)})}
function card(i){
 var k=items.indexOf(i),f=favHas(i.id);
 return '<button class="item'+(i.sold?' sold':'')+'" data-k="'+k+'"><div class="ph">'+thumb(i)+(i.sold?'<span class="soldb">SOLD</span>':'')+'<span class="heart'+(f?' on':'')+'" role="button" aria-label="'+(f?'Remove from saved':'Save listing')+'" data-id="'+esc(i.id)+'">'+(f?'\u2665':'\u2661')+'</span></div><div class="b"><b>'+money(i.p)+'</b>'+esc(i.t)+'<br><small>'+esc(i.l)+(isNear(i)?' \u00B7 <b style="color:var(--gold)">Near you</b>':'')+'</small></div></button>';
}
function renderSaved(){
 var ids=favGet(),list=items.filter(function(i){return ids.indexOf(String(i.id))>-1});
 $("savedgrid").innerHTML=list.length?sortSold(list).map(card).join(""):'<p>No saved listings yet. Tap the heart on a listing to save it.</p>';
}
function refreshViews(){
 grid();
 if($("saved").classList.contains("on"))renderSaved();
 if($("seller").classList.contains("on"))showSeller(sellerUid,true);
 if(cur&&$("fav"))favLabel();
}
function favLabel(){$("fav").textContent=favHas(cur.id)?"\u2665 Saved":"\u2661 Save"}
function showSeller(uid,fromRoute){
 hideSheet();
 var list=items.filter(function(i){return i.u===uid}),mine=user&&user.id===uid;
 $("sellh").textContent=mine?"My listings":nameOf(uid)+"\u2019s listings"+rTxt(uid);
 var first=list.map(function(i){return i.at}).filter(Boolean).sort()[0],sold=list.filter(function(i){return i.sold}).length;
 $("sellp").textContent=list.length+" listing"+(list.length===1?"":"s")+(sold?" \u00B7 "+sold+" sold":"")+(first?" \u00B7 Selling since "+new Date(first).toLocaleDateString("en-US",{month:"short",year:"numeric"}):"");
 sellerUid=uid;drawReviews(uid);
 $("sellgrid").innerHTML=list.length?sortSold(list).map(card).join(""):"<p>No listings from this seller.</p>";
 show("seller",true);
 if(!fromRoute){history.pushState(null,"","#seller-"+uid);sellerPushed=true}
}
async function toggleSold(){
 var v=!cur.sold,r=await db.from("listings").update({sold:v}).eq("id",cur.id);
 if(r.error){alert(/sold/i.test(r.error.message||"")?"The Sold feature needs a one-time database step first.":r.error.message);return}
 cur.sold=v;grid();fillSheet();
}
async function shareListing(){
 var url=location.origin+location.pathname+"#listing-"+cur.id,data={title:cur.t,text:cur.t+" for "+money(cur.p)+" on OBM Marketplace",url:url};
 try{
  if(navigator.share){await navigator.share(data)}
  else if(navigator.clipboard){await navigator.clipboard.writeText(url);alert("Link copied.")}
  else{prompt("Copy this link:",url)}
 }catch(e){}
}
function sheetExtras(){
 ["acts","sellbtn","sldbtn"].forEach(function(id){var o=$(id);if(o)o.remove()});
 if(cur.sold)$("st").textContent="SOLD \u00B7 "+cur.t;
 var a=$("sd"),mine=user&&cur.u===user.id;
 var acts=document.createElement("div");acts.id="acts";acts.className="row";acts.style.marginBottom="8px";
 acts.innerHTML='<button class="btn alt" id="shr" type="button">Share</button><button class="btn alt" id="fav" type="button"></button>';
 var sb=document.createElement("button");sb.id="sellbtn";sb.className="btn alt";sb.style.marginBottom="8px";sb.textContent=mine?"My listings":"More from "+nameOf(cur.u);sb.onclick=function(){showSeller(cur.u)};
 if(mine){var so=document.createElement("button");so.id="sldbtn";so.className="btn alt";so.style.marginBottom="8px";so.textContent=cur.sold?"Mark as available":"Mark as sold";so.onclick=toggleSold;a.after(so)}
 a.after(sb);a.after(acts);
 $("shr").onclick=shareListing;
 $("fav").onclick=function(){favToggle(cur.id);favLabel();refreshViews()};
 favLabel();
}
(function(){
 var post=$("post"),nav=document.querySelector("nav");
 var sv=document.createElement("section");sv.className="tab";sv.id="saved";
 sv.innerHTML='<h2>Saved</h2><p class="note">Saved on this device. Tap the heart on any listing to save it.</p><div class="grid" id="savedgrid"></div>';
 var se=document.createElement("section");se.className="tab";se.id="seller";
 se.innerHTML='<button class="btn alt" id="sellback" type="button" style="width:auto;margin-bottom:12px">Back</button><h2 id="sellh"></h2><p class="note" id="sellp"></p><div class="grid" id="sellgrid"></div>';
 post.after(sv);post.after(se);
 var ib=document.createElement("section");ib.className="tab";ib.id="inbox";
 ib.innerHTML='<h2>Inbox</h2><p class="note" id="inboxp"></p><div id="inboxlist"></div>';
 var mn=document.createElement("section");mn.className="tab";mn.id="mine";
 mn.innerHTML='<h2>My listings</h2><p class="note" id="minep"></p><div class="grid" id="minegrid"></div>';
 var ac=document.createElement("section");ac.className="tab";ac.id="account";
 ac.innerHTML='<div id="acctlinks" style="margin-top:8px"><button class="btn alt" id="lnkSaved" type="button" style="margin-bottom:10px">\u2665 Saved listings</button><button class="btn alt" id="lnkSafe" type="button" style="margin-bottom:10px">\u{1F6E1} Safety and rules</button><button class="btn alt" id="lnkMain" type="button" style="margin-bottom:10px">OBM main site</button><button class="btn" id="lnkInstall" type="button" style="margin-bottom:10px;display:none">Install the app</button><button class="btn alt" id="lnkPriv" type="button" style="margin-bottom:10px">Privacy policy</button><button class="btn alt" id="lnkTerms" type="button">Terms of use</button></div>';
 post.after(ac);post.after(mn);post.after(ib);
 nav.innerHTML='<button class="on" data-t="browse"><i>\u{1F3E0}</i>Home</button><button data-t="inbox"><i>\u{1F4AC}<span id="badge" class="badge" style="display:none"></span></i>Inbox</button><button data-t="post"><i>\uFF0B</i>Post</button><button data-t="mine"><i>\u{1F4CB}</i>Listings</button><button data-t="account"><i>\u{1F464}</i>Account</button>';
 $("lnkSaved").onclick=function(){show("saved")};$("lnkSafe").onclick=function(){show("safety")};$("lnkMain").onclick=function(){location.href="https://www.onebrotherhoodmovement.com"};
 $("lnkPriv").onclick=function(){location.href="privacy.html"};$("lnkTerms").onclick=function(){location.href="terms.html"};
 var standalone=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
 var ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 if(!standalone&&ios){$("lnkInstall").style.display="";$("lnkInstall").textContent="Add to Home Screen";$("lnkInstall").onclick=function(){alert("Tap the Share button in Safari, then tap Add to Home Screen.")}}
 window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.obmInstall=e;if(!standalone){$("lnkInstall").style.display="";$("lnkInstall").onclick=function(){var p=window.obmInstall;if(!p)return;p.prompt();p.userChoice.then(function(){$("lnkInstall").style.display="none";window.obmInstall=null})}}});
 $("minegrid").onclick=gridClick;
 var fab=document.createElement("button");fab.id="fab";fab.type="button";fab.setAttribute("aria-label","Post an item");fab.innerHTML="\uFF0B Post";fab.onclick=function(){show("post")};document.body.appendChild(fab);
 $("savedgrid").onclick=gridClick;$("sellgrid").onclick=gridClick;
 $("sellback").onclick=function(){if(sellerPushed){sellerPushed=false;history.back()}else{history.replaceState(null,"","#browse");show("browse",true)}};
})();

var NAVMAP={saved:"account",safety:"account",seller:"browse"},curTab="browse",threadsCache=[];
(function(){var st=document.createElement("style");st.textContent="nav button i{position:relative}.badge{position:absolute;top:-6px;left:58%;min-width:18px;height:18px;border-radius:9px;background:#e0526b;color:#fff;font-size:11px;font-weight:700;line-height:18px;padding:0 5px;font-style:normal;text-align:center}#fab{position:fixed;right:16px;bottom:calc(78px + env(safe-area-inset-bottom,0px));z-index:4;display:flex;align-items:center;gap:6px;background:#fff;color:#111;border:0;border-radius:30px;padding:14px 22px;font-weight:700;font-size:17px;box-shadow:0 4px 14px rgba(0,0,0,.4)}main{padding-bottom:150px}.thread{display:block;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;margin-bottom:10px}.thread.unread{border-color:var(--gold);border-left-width:5px}.thread b{display:block}.thread small{color:var(--mute)}.thread span.new{background:var(--gold);color:#17140f;font-size:11px;font-weight:700;padding:2px 7px;border-radius:6px;margin-left:6px}";document.head.appendChild(st)})();
function updateFab(){var f=$("fab");if(!f)return;f.style.display=(["browse","mine","seller","saved"].indexOf(curTab)>-1&&!$("sheet").classList.contains("on"))?"flex":"none"}
function seenGet(){try{return JSON.parse(localStorage.getItem("obm-seen")||"null")}catch(e){return null}}
function seenSet(o){try{localStorage.setItem("obm-seen",JSON.stringify(o))}catch(e){}}
function markSeen(rows,owner){
 if(!rows.length||!user)return;
 var buyer=owner?thread:user.id;if(!buyer)return;
 var s=seenGet()||{},k=cur.id+"|"+buyer,last=rows[rows.length-1].created_at;
 if(s[k]===last)return;
 s[k]=last;seenSet(s);inboxRefresh();
}
async function inboxFetch(){
 var mine=items.filter(function(i){return i.u===user.id}).map(function(i){return i.id});
 var f="buyer_id.eq."+user.id;if(mine.length)f+=",listing_id.in.("+mine.join(",")+")";
 var r=await db.from("messages").select("*").or(f).order("created_at",{ascending:false}).limit(400);
 if(r.error)return null;
 var T={},order=[];
 r.data.filter(function(m){return blocked.indexOf(m.buyer_id)<0&&blocked.indexOf(m.sender_id)<0}).forEach(function(m){var k=m.listing_id+"|"+m.buyer_id;if(!T[k]){T[k]={k:k,lid:m.listing_id,buyer:m.buyer_id,last:m,n:0};order.push(k)}T[k].n++});
 return order.map(function(k){return T[k]});
}
function isUnread(t,seen){return t.last.sender_id!==user.id&&(!seen[t.k]||t.last.created_at>seen[t.k])}
function setBadge(n){var b=$("badge");if(!b)return;b.textContent=n>9?"9+":String(n);b.style.display=n?"":"none"}
async function inboxRefresh(){
 if(!user){setBadge(0);return}
 var th=await inboxFetch();if(!th)return;
 threadsCache=th;
 var seen=seenGet();
 if(!seen){seen={};th.forEach(function(t){seen[t.k]=t.last.created_at});seenSet(seen)}
 setBadge(th.filter(function(t){return isUnread(t,seen)}).length);
 if($("inbox").classList.contains("on"))drawInbox();
}
function ago(ts){var s=(Date.now()-new Date(ts).getTime())/1000;if(s<60)return"just now";if(s<3600)return Math.floor(s/60)+" min ago";if(s<86400)return Math.floor(s/3600)+" hr ago";if(s<604800)return Math.floor(s/86400)+" d ago";return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function drawInbox(){
 var L=$("inboxlist");
 if(!user){$("inboxp").textContent="Sign in on the Account tab to see your messages.";L.innerHTML="";return}
 $("inboxp").style.display=threadsCache.length?"none":"";
 $("inboxp").textContent="No messages yet. Message a seller from any listing to start a conversation.";
 var seen=seenGet()||{};
 L.innerHTML=threadsCache.map(function(t,i){
  var it=items.filter(function(x){return String(x.id)===String(t.lid)})[0],un=isUnread(t,seen),mine=it&&it.u===user.id;
  return '<button class="thread'+(un?' unread':'')+'" data-i="'+i+'"><b>'+esc(it?it.t:"Removed listing")+(un?'<span class="new">NEW</span>':'')+'</b><small>'+(mine?"Message from "+nameOf(t.buyer):"Your chat with "+nameOf(it?it.u:""))+' \u00B7 '+ago(t.last.created_at)+'</small><br><span>'+esc(String(t.last.body).slice(0,90))+'</span></button>';
 }).join("");
}
async function renderInbox(){
 if(!user){drawInbox();return}
 $("inboxp").style.display="";$("inboxp").textContent="Loading...";$("inboxlist").innerHTML="";
 await inboxRefresh();drawInbox();
}
function renderMine(){
 if(!user){$("minep").style.display="";$("minep").textContent="Sign in on the Account tab to see your listings.";$("minegrid").innerHTML="";return}
 var list=items.filter(function(i){return i.u===user.id}),sold=list.filter(function(i){return i.sold}).length;
 $("minep").style.display="";
 $("minep").textContent=list.length?list.length+" listing"+(list.length===1?"":"s")+(sold?" \u00B7 "+sold+" sold":"")+". Open one to edit, delete, or mark it sold.":"You haven\u2019t posted anything yet. Tap Post to list your first item.";
 $("minegrid").innerHTML=sortSold(list).map(card).join("");
}
(function(){
 $("inboxlist").onclick=function(e){
  var b=e.target.closest(".thread");if(!b)return;
  var t=threadsCache[Number(b.dataset.i)],it=items.filter(function(x){return String(x.id)===String(t.lid)})[0];
  if(!it){alert("This listing was removed.");return}
  history.pushState(null,"","#listing-"+it.id);openedByPush=true;
  openListing(it,user.id===it.u?t.buyer:null);
 };
 var _auth=authUI;
 authUI=function(){
  _auth();
  var g=$("postgate");
  if(!g){g=document.createElement("div");g.id="postgate";$("post").insertBefore(g,$("post").firstChild)}
  g.innerHTML=user?"":'<p class="note">Sign in on the Account tab to post an item.</p><button class="btn" id="gosign" type="button" style="margin-bottom:14px">Go to Account</button>';
  if(!user&&$("gosign"))$("gosign").onclick=function(){show("account")};
  if($("mine").classList.contains("on"))renderMine();
  if($("inbox").classList.contains("on"))renderInbox();
  inboxRefresh();
 };
 setInterval(function(){if(user)inboxRefresh()},30000);
})();

(function(){
 var h=document.head;
 function L(rel,href){var l=document.createElement("link");l.rel=rel;l.href=href;h.appendChild(l)}
 function M(n,c){var m=document.createElement("meta");m.name=n;m.content=c;h.appendChild(m)}
 if(!document.querySelector('link[rel="manifest"]'))L("manifest","manifest.json");
 if(!document.querySelector('link[rel="apple-touch-icon"]'))L("apple-touch-icon","icon-512.png");
 if(!document.querySelector('meta[name="theme-color"]'))M("theme-color","#0C0B0A");
 M("apple-mobile-web-app-capable","yes");M("apple-mobile-web-app-title","OBM Exchange");
 if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(function(){});
})();

(function(){
 var standalone=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;
 if(standalone)return;
 try{var t=Number(localStorage.getItem("obm-ibar")||0);if(t&&Date.now()-t<7*86400000)return}catch(e){}
 var ua=navigator.userAgent,ios=/iphone|ipad|ipod/i.test(ua),android=/android/i.test(ua);
 if(!ios&&!android)return;
 var bar=null,shown=false;
 function hide(save){if(bar){bar.remove();bar=null}if(save){try{localStorage.setItem("obm-ibar",String(Date.now()))}catch(e){}}}
 function show(kind){
  if(shown)return;shown=true;
  bar=document.createElement("div");bar.id="ibar";bar.setAttribute("role","region");bar.setAttribute("aria-label","Install the app");
  bar.style.cssText="display:flex;align-items:center;gap:10px;background:#D9A521;color:#0C0B0A;padding:10px 12px;font:600 15px/1.3 system-ui,sans-serif";
  bar.innerHTML='<img src="icon-512.png" alt="" width="40" height="40" style="border-radius:9px;flex:none"><div style="flex:1;min-width:0">Get the OBM Exchange app<br><span style="font-weight:400;font-size:13px">Opens in one tap. Free.</span></div><button id="ibgo" type="button" style="flex:none;background:#0C0B0A;color:#F4CA69;border:0;border-radius:99px;padding:11px 18px;font:700 15px system-ui,sans-serif;cursor:pointer">'+(kind==="ios"?"How":"Install")+'</button><button id="ibx" type="button" aria-label="Dismiss" style="flex:none;background:none;border:0;color:#0C0B0A;font-size:28px;line-height:1;width:40px;height:40px;cursor:pointer;padding:0">×</button>';
  document.body.insertBefore(bar,document.body.firstChild);
  document.getElementById("ibx").onclick=function(){hide(true)};
  document.getElementById("ibgo").onclick=function(){
   if(kind==="prompt"&&window.obmInstall){var p=window.obmInstall;p.prompt();p.userChoice.then(function(){window.obmInstall=null;hide(true)});return}
   if(kind==="ios")alert("To install on iPhone:\n\n1. Tap the Share button at the bottom of Safari (the square with an arrow).\n2. Scroll down and tap Add to Home Screen.\n3. Tap Add.");
   else alert("To install on Android:\n\n1. Tap the three dots at the top right of Chrome.\n2. Tap Install app (or Add to Home screen).\n3. Tap Install.");
  };
 }
 window.addEventListener("beforeinstallprompt",function(){setTimeout(function(){if(window.obmInstall)show("prompt")},50)});
 window.addEventListener("appinstalled",function(){hide(true)});
 if(ios)setTimeout(function(){show("ios")},1500);
 else setTimeout(function(){if(!shown)show("manual")},4000);
})();
(function(){var st=document.createElement("style");st.textContent="#catsel{display:none}@media(min-width:900px){header{text-align:center;padding:22px 16px 18px}header h1{font-size:30px}header p{font-size:14px}#catsel{display:block;width:100%;max-width:420px;padding:12px 14px;margin:0 0 12px;font-size:16px;border-radius:10px}#chips,#subchips{display:none!important}main{max-width:1100px}.grid{grid-template-columns:repeat(4,1fr);gap:16px}.item .ph{height:170px}#post,#account,#inbox,#safety{max-width:720px;margin-left:auto;margin-right:auto}nav{max-width:720px;margin:0 auto;border-radius:12px 12px 0 0}#fab{right:max(16px,calc((100vw - 1100px)/2 + 16px))}.sheet{padding-left:max(16px,calc((100% - 1040px)/2));padding-right:max(16px,calc((100% - 1040px)/2))}.sheet #sp{float:left;width:58%;height:540px;margin:12px 0 0;font-size:96px}.sheet #sp img{object-fit:contain!important;background:#0c0b08}.sheet>*:not(#back):not(#sp){margin-left:calc(60% + 24px)}.sheet>.btn:not(#back){width:calc(40% - 24px)}.sheet>#back{margin-bottom:0}}";document.head.appendChild(st)})();
if(!location.hash)history.replaceState(null,"","#browse");
chips();authUI();load().then(function(){route();updateFab();inboxRefresh()});
