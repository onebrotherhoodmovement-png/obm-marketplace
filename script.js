var cats=["All","Electronics","Furniture","Clothing","Tools","Vehicles","Home","Other"];
var icons={Electronics:"\u{1F4F1}",Furniture:"\u{1F6CB}",Clothing:"\u{1F455}",Tools:"\u{1F527}",Vehicles:"\u{1F6B2}",Home:"\u{1F3E0}",Other:"\u{1F4E6}"};
var items=[
{t:"Mountain bike",p:120,c:"Vehicles",l:"Raleigh",d:"Adult size, new tires, runs great."},
{t:"Leather couch",p:250,c:"Furniture",l:"Durham",d:"Brown, three seats, from a smoke-free home."},
{t:"Cordless drill set",p:60,c:"Tools",l:"Cary",d:"Drill, two batteries, charger, and case."},
{t:"Winter coat",p:35,c:"Clothing",l:"Raleigh",d:"Men\u2019s large, barely worn."},
{t:"Smart TV 50 inch",p:180,c:"Electronics",l:"Garner",d:"Works perfectly. Remote included."},
{t:"Dining table",p:90,c:"Home",l:"Durham",d:"Solid wood, seats six."}
];
var cat="All",cur=null;
function $(i){return document.getElementById(i)}
function chips(){$("chips").innerHTML=cats.map(function(c){return '<button class="chip'+(c===cat?' on':'')+'" data-c="'+c+'">'+c+'</button>'}).join("")}
function grid(){
 var q=$("q").value.toLowerCase();
 var list=items.filter(function(i){return (cat==="All"||i.c===cat)&&(i.t+i.d+i.l).toLowerCase().indexOf(q)>-1});
 $("grid").innerHTML=list.length?list.map(function(i){var k=items.indexOf(i);return '<button class="item" data-k="'+k+'"><div class="ph">'+icons[i.c]+'</div><div class="b"><b>$'+i.p+'</b>'+i.t+'<br><small>'+i.l+'</small></div></button>'}).join(""):'<p>No items match. Try another search or category.</p>';
}
$("chips").onclick=function(e){if(e.target.dataset.c){cat=e.target.dataset.c;chips();grid()}};
$("q").oninput=grid;
$("grid").onclick=function(e){var b=e.target.closest(".item");if(!b)return;cur=items[b.dataset.k];
 $("sp").textContent=icons[cur.c];$("st").textContent=cur.t;$("sprice").textContent="$"+cur.p;$("sl").textContent=cur.l;$("sd").textContent=cur.d;
 $("msgs").innerHTML='<div class="m">Hi, is this still available?</div>';$("sheet").classList.add("on");window.scrollTo(0,0)};
$("back").onclick=function(){$("sheet").classList.remove("on")};
function add(t,me){var d=document.createElement("div");d.className="m"+(me?" me":"");d.textContent=t;$("msgs").appendChild(d)}
$("ms").onclick=function(){var v=$("mi").value.trim();if(!v)return;add(v,true);$("mi").value="";
 if(/zelle|cash ?app|gift ?card|venmo|deposit/i.test(v)){add("Safety reminder: don\u2019t send money before you meet. Pay in person after you check the item.")}
 else{setTimeout(function(){add("Yes, it\u2019s available. Where is a good public place to meet?")},600)}};
$("pc").innerHTML=cats.slice(1).map(function(c){return "<option>"+c+"</option>"}).join("");
$("pb").onclick=function(){var t=$("pt").value.trim(),p=$("pp").value;
 if(!t||!p){alert("Add an item name and a price.");return}
 items.unshift({t:t,p:p,c:$("pc").value,l:$("pl").value||"Nearby",d:$("pd").value||"No description."});
 ["pt","pp","pl","pd"].forEach(function(i){$(i).value=""});cat="All";chips();grid();show("browse")};
function show(t){document.querySelectorAll(".tab").forEach(function(e){e.classList.toggle("on",e.id===t)});
 document.querySelectorAll("nav button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});window.scrollTo(0,0)}
document.querySelector("nav").onclick=function(e){var b=e.target.closest("button");if(b)show(b.dataset.t)};
chips();grid();
