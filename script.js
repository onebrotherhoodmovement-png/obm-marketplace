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
function chips(){$("chips").innerHTML=cats.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join("")}
function grid(){
 var q=$("q").value.toLowerCase();
 var list=items.filter(function(i){return (cat==="All"||i.c===cat)&&(i.t+i.d+i.l).toLowerCase().indexOf(q)>-1});
 $("grid").innerHTML=list.length?list.map(function(i){var k=items.indexOf(i);return '<button class="item" data-k="'+k+'"><div class="ph">'+thumb(i)+'</div><div class="b"><b>'+money(i.p)+'</b>'+esc(i.t)+'<br><small>'+esc(i.l)+'</small></div></button>'}).join(""):'<p>No listings yet. Sign in on the Sell tab and post the first one.</p>';
}
async function load(){
 var r=await db.from("listings").select("*").order("created_at",{ascending:false});
 if(r.error){$("grid").innerHTML="<p>Could not load listings. Please try again.</p>";return}
 items=r.data.map(function(x){return{id:x.id,u:x.user_id,t:x.title,p:x.price,c:x.category,l:x.area||"Nearby",d:x.description||"No description.",img:x.image_url}});
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
 $("sp").innerHTML=thumb(cur);$("st").textContent=cur.t;$("sprice").textContent=money(cur.p);$("sl").textContent=cur.l;$("sd").textContent=cur.d;
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
 if(cur.img&&cur.img.indexOf("/listing-photos/")>-1){await db.storage.from("listing-photos").remove([cur.img.split("/listing-photos/")[1]])}
 $("sheet").classList.remove("on");load();
}
function openEdit(){
 if($("editbox")){$("editbox").remove();return}
 var box=document.createElement("div");box.id="editbox";box.style.margin="0 0 12px";
 box.innerHTML='<input id="et" placeholder="Item name"><input id="ep" type="number" inputmode="numeric" placeholder="Price in dollars"><select id="ec"></select><input id="el" placeholder="Your area"><textarea id="ed" rows="3" placeholder="Description"></textarea><div class="row"><button class="btn" id="es">Save changes</button><button class="btn alt" id="ex">Cancel</button></div>';
 $("del").after(box);
 $("ec").innerHTML=cats.slice(1).map(function(c){return "<option>"+c+"</option>"}).join("");
 $("et").value=cur.t;$("ep").value=cur.p;$("ec").value=cur.c;$("el").value=cur.l==="Nearby"?"":cur.l;$("ed").value=cur.d==="No description."?"":cur.d;
 $("ex").onclick=function(){box.remove()};
 $("es").onclick=async function(){
  var t=$("et").value.trim(),p=$("ep").value;
  if(!t||!p){alert("Add an item name and a price.");return}
  var r=await db.from("listings").update({title:t,price:Number(p),category:$("ec").value,area:$("el").value.trim()||null,description:$("ed").value.trim()||null}).eq("id",cur.id);
  if(r.error){alert("Could not save: "+r.error.message);return}
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
$("grid").onclick=function(e){var b=e.target.closest(".item");if(!b)return;cur=items[b.dataset.k];thread=null;
 fillSheet();
 $("sheet").classList.add("on");window.scrollTo(0,0);loadMsgs()};
$("back").onclick=function(){$("sheet").classList.remove("on");cur=null;thread=null};
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
var pf=document.createElement("input");pf.type="file";pf.id="pf";pf.accept="image/jpeg,image/png,image/webp";pf.setAttribute("aria-label","Add a photo");$("pb").before(pf);
$("pb").onclick=async function(){var t=$("pt").value.trim(),p=$("pp").value;
 if(!user){alert("Sign in first.");return}
 if(!t||!p){alert("Add an item name and a price.");return}
 if(!$("pc").value){alert("Choose a category.");return}
 var url=null,f=$("pf").files[0];
 if(f){
  if(f.size>5242880){alert("That photo is over 5 MB. Choose a smaller one.");return}
  var ext=f.type==="image/png"?"png":f.type==="image/webp"?"webp":"jpg";
  var path=user.id+"/"+Date.now()+"."+ext;
  var up=await db.storage.from("listing-photos").upload(path,f,{contentType:f.type});
  if(up.error){alert("Photo upload failed: "+up.error.message);return}
  url=db.storage.from("listing-photos").getPublicUrl(path).data.publicUrl;
 }
 var r=await db.from("listings").insert({title:t,price:Number(p),category:$("pc").value,area:$("pl").value.trim()||null,description:$("pd").value.trim()||null,image_url:url});
 if(r.error){alert("Could not post: "+r.error.message);return}
 ["pt","pp","pl","pd","pf"].forEach(function(i){$(i).value=""});$("pc").value="";cat="All";chips();await load();show("browse")};
function show(t){document.querySelectorAll(".tab").forEach(function(e){e.classList.toggle("on",e.id===t)});
 document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});window.scrollTo(0,0)}
document.querySelector("nav").onclick=function(e){var b=e.target.closest("button");if(b)show(b.dataset.t)};
db.auth.onAuthStateChange(function(ev,s){user=s?s.user:null;authUI()});
chips();authUI();load();
