var SUPA_URL="https://wmgeruhdfcsjarktuzpd.supabase.co";
var SUPA_KEY="sb_publishable_q7dolXz8rixOUnsxNzdheQ_zSM86bPa";
var db=supabase.createClient(SUPA_URL,SUPA_KEY);
var cats=["All","Electronics","Furniture","Clothing","Tools","Vehicles","Home","Other"];
var icons={Electronics:"\u{1F4F1}",Furniture:"\u{1F6CB}",Clothing:"\u{1F455}",Tools:"\u{1F527}",Vehicles:"\u{1F6B2}",Home:"\u{1F3E0}",Other:"\u{1F4E6}"};
var items=[],cat="All",cur=null,user=null;
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function chips(){$("chips").innerHTML=cats.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join("")}
function grid(){
 var q=$("q").value.toLowerCase();
 var list=items.filter(function(i){return (cat==="All"||i.c===cat)&&(i.t+i.d+i.l).toLowerCase().indexOf(q)>-1});
 $("grid").innerHTML=list.length?list.map(function(i){var k=items.indexOf(i);return '<button class="item" data-k="'+k+'"><div class="ph">'+(icons[i.c]||icons.Other)+'</div><div class="b"><b>$'+esc(Number(i.p))+'</b>'+esc(i.t)+'<br><small>'+esc(i.l)+'</small></div></button>'}).join(""):'<p>No listings yet. Sign in on the Sell tab and post the first one.</p>';
}
async function load(){
 var r=await db.from("listings").select("*").order("created_at",{ascending:false});
 if(r.error){$("grid").innerHTML="<p>Could not load listings. Please try again.</p>";return}
 items=r.data.map(function(x){return{id:x.id,u:x.user_id,t:x.title,p:x.price,c:x.category,l:x.area||"Nearby",d:x.description||"No description."}});
 grid();
}
function authUI(){
 var box=$("authbox");
 if(!box){box=document.createElement("div");box.id="authbox";$("post").insertBefore(box,$("post").firstChild)}
 ["pt","pp","pc","pl","pd","pb"].forEach(function(i){$(i).style.display=user?"":"none"});
 if(user){
  box.innerHTML='<p class="note">Signed in as '+esc(user.email)+'</p><button class="btn alt" id="so" style="margin-bottom:12px">Sign out</button>';
  $("so").onclick=function(){db.auth.signOut()};
 }else{
  box.innerHTML='<h2>Sign in to sell</h2><input id="ae" type="email" placeholder="Email"><input id="ap" type="password" placeholder="Password (6 or more characters)"><div class="row"><button class="btn" id="si">Sign in</button><button class="btn alt" id="su">Create account</button></div><p id="am"></p>';
  $("si").onclick=async function(){var r=await db.auth.signInWithPassword({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:""};
  $("su").onclick=async function(){var r=await db.auth.signUp({email:$("ae").value.trim(),password:$("ap").value});$("am").textContent=r.error?r.error.message:(r.data.session?"":"Check your email to confirm your account.")};
 }
}
$("chips").onclick=function(e){if(e.target.dataset.c){cat=e.target.dataset.c;chips();grid()}};
$("q").oninput=grid;
$("grid").onclick=function(e){var b=e.target.closest(".item");if(!b)return;cur=items[b.dataset.k];
 $("sp").textContent=icons[cur.c]||icons.Other;$("st").textContent=cur.t;$("sprice").textContent="$"+cur.p;$("sl").textContent=cur.l;$("sd").textContent=cur.d;
 $("msgs").innerHTML='<div class="m">Messaging is coming soon.</div>';
 var old=$("del");if(old)old.remove();
 if(user&&cur.u===user.id){var b2=document.createElement("button");b2.id="del";b2.className="btn alt";b2.textContent="Delete my listing";
  b2.onclick=async function(){if(!confirm("Delete this listing?"))return;var r=await db.from("listings").delete().eq("id",cur.id);if(r.error){alert(r.error.message);return}$("sheet").classList.remove("on");load()};
  $("sd").after(b2)}
 $("sheet").classList.add("on");window.scrollTo(0,0)};
$("back").onclick=function(){$("sheet").classList.remove("on")};
$("ms").onclick=function(){var v=$("mi").value.trim();if(!v)return;$("mi").value="";
 var d=document.createElement("div");d.className="m";d.textContent="Messaging is coming soon, so this message was not sent.";$("msgs").appendChild(d)};
$("pc").innerHTML=cats.slice(1).map(function(c){return "<option>"+c+"</option>"}).join("");
$("pb").onclick=async function(){var t=$("pt").value.trim(),p=$("pp").value;
 if(!user){alert("Sign in first.");return}
 if(!t||!p){alert("Add an item name and a price.");return}
 var r=await db.from("listings").insert({title:t,price:Number(p),category:$("pc").value,area:$("pl").value.trim()||null,description:$("pd").value.trim()||null});
 if(r.error){alert("Could not post: "+r.error.message);return}
 ["pt","pp","pl","pd"].forEach(function(i){$(i).value=""});cat="All";chips();await load();show("browse")};
function show(t){document.querySelectorAll(".tab").forEach(function(e){e.classList.toggle("on",e.id===t)});
 document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});window.scrollTo(0,0)}
document.querySelector("nav").onclick=function(e){var b=e.target.closest("button");if(b)show(b.dataset.t)};
db.auth.onAuthStateChange(function(ev,s){user=s?s.user:null;authUI()});
chips();authUI();load();
