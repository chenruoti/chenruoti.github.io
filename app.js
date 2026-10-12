const tripStops = [
 {id:"queenstown",name:"Queenstown",lat:-45.0312,lng:168.6626,days:[1,2,3,4,5,6],note:"10/29～11/2 住宿基地；Arrowtown、Milford、Wānaka 當日來回"},
 {id:"arrowtown",name:"Arrowtown",lat:-44.9380,lng:168.8354,days:[2],note:"Buckingham Street、華人歷史聚落、Arrow River"},
 {id:"milford",name:"Milford Sound",lat:-44.6716,lng:167.9256,days:[3],note:"Coach + Cruise；不建議自駕"},
 {id:"wanaka",name:"Wānaka",lat:-44.6967,lng:169.1367,days:[4],note:"11/1 Queenstown 當日來回，不住宿"},
 {id:"cromwell",name:"Cromwell",lat:-45.0385,lng:169.2000,days:[6],note:"11/3 自駕北上途經"},
 {id:"lindis",name:"Lindis Pass",lat:-44.5897,lng:169.6532,days:[6],note:"Queenstown → Mt Cook 景觀公路"},
 {id:"omarama",name:"Omarama",lat:-44.4882,lng:169.9677,days:[6],note:"途中休息"},
 {id:"mtcook",name:"Aoraki / Mt Cook",lat:-43.7340,lng:170.0967,days:[6,7],note:"Tasman Valley、Hooker Valley"},
 {id:"tasman",name:"Tasman Valley",lat:-43.6975,lng:170.1630,days:[6],note:"Tasman Glacier View、Tasman Lake"},
 {id:"hooker",name:"Hooker Valley Track",lat:-43.7193,lng:170.0932,days:[7],note:"White Horse Hill 起點"},
 {id:"pukaki",name:"Lake Pukaki",lat:-44.1062,lng:170.1736,days:[7],note:"Mt Cook → Tekapo 路線景觀"},
 {id:"tekapo",name:"Lake Tekapo",lat:-44.0047,lng:170.4771,days:[7,8],note:"教堂、Tekapo Springs、星空"},
 {id:"chc",name:"Christchurch",lat:-43.5321,lng:172.6362,days:[8,9,10,11,12],note:"11/6～11/8 連住三晚；11/7 還車"},
 {id:"kaikoura",name:"Kaikōura",lat:-42.4008,lng:173.6814,days:[8,9],note:"Point Kean 海豹、Whale Watching"},
 {id:"arion",name:"Arion Farm",lat:-43.4678,lng:172.4628,days:[10],note:"餵羊／摸羊；可搭配 Orana Wildlife Park"}
];
const hotelStops = [
 {name:"Sherwood Queenstown",lat:-45.0156,lng:168.6963,days:[1,2,3]},
 {name:"Holiday Inn Queenstown Frankton Road",lat:-45.0164,lng:168.6980,days:[4,5]},
 {name:"Mt Cook Lodge and Motels",lat:-43.735,lng:170.095,days:[6]},
 {name:"Peppers Bluewater Resort",lat:-44.004,lng:170.482,days:[7]},
 {name:"Kaikoura Beach Motel",lat:-42.408,lng:173.684,days:[8]},
 {name:"ibis Christchurch",lat:-43.531,lng:172.635,days:[9,10,11]}
];
const dayRoutes = {
 0:[],
 1:["queenstown"],
 2:["queenstown","arrowtown","queenstown"],
 3:["queenstown","milford","queenstown"],
 4:["queenstown","wanaka","queenstown"],
 5:["queenstown"],
 6:["queenstown","cromwell","lindis","omarama","mtcook","tasman","mtcook"],
 7:["mtcook","hooker","mtcook","pukaki","tekapo"],
 8:["tekapo","chc","kaikoura"],
 9:["kaikoura","chc"],
 10:["chc","arion","chc"],
 11:["chc"],12:["chc"]
};
const map = L.map("trip-map",{scrollWheelZoom:false}).setView([-44.45,170.3],6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
let mapLayers=[];
function clearTripLayers(){mapLayers.forEach(l=>map.removeLayer(l));mapLayers=[];}
function pinIcon(label){return L.divIcon({className:"",html:`<div class="custom-pin">${label}</div>`,iconSize:[30,30],iconAnchor:[15,15]});}
function gm(name){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+" New Zealand");}
function drawMap(day="all"){
 clearTripLayers();
 const ids=day==="all"?[...new Set(Object.values(dayRoutes).flat())]:(dayRoutes[day]||[]);
 const shown=tripStops.filter(s=>ids.includes(s.id));
 shown.forEach((s,i)=>{const dayText=s.days.map(d=>"D"+d).join(" · ");const m=L.marker([s.lat,s.lng],{icon:pinIcon(day==="all"?(i+1):day)}).addTo(map).bindPopup(`<strong>${s.name}</strong><br>${dayText}<br>${s.note}<br><a target="_blank" rel="noopener" href="${gm(s.name)}">Google Maps ↗</a>`);mapLayers.push(m);});
 hotelStops.filter(h=>day==="all"||h.days.includes(Number(day))).forEach(h=>{
  const marker=L.marker([h.lat,h.lng],{icon:L.divIcon({className:"",html:'<div class="custom-pin hotel-pin">🏨</div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(map)
    .bindPopup(`<strong>🏨 ${h.name}</strong><br>${h.days.map(d=>'D'+d).join(' · ')}<br><a href="${gm(h.name)}" target="_blank" rel="noopener">飯店導航 ↗</a>`);
  mapLayers.push(marker);
 });
 if(day==="all"){
  const master=["queenstown","arrowtown","queenstown","milford","queenstown","wanaka","queenstown","cromwell","lindis","omarama","mtcook","tasman","mtcook","hooker","mtcook","pukaki","tekapo","chc","kaikoura","chc","arion","chc"];
  const pts=master.map(id=>tripStops.find(s=>s.id===id)).filter(Boolean).map(s=>[s.lat,s.lng]);
  mapLayers.push(L.polyline(pts,{weight:4,opacity:.7,dashArray:"8 8"}).addTo(map));
 }else{const pts=(dayRoutes[day]||[]).map(id=>tripStops.find(s=>s.id===id)).filter(Boolean).map(s=>[s.lat,s.lng]);if(pts.length>1)mapLayers.push(L.polyline(pts,{weight:5,opacity:.75,dashArray:"8 8"}).addTo(map));}
 if(shown.length)map.fitBounds(L.latLngBounds(shown.map(s=>[s.lat,s.lng])).pad(.18),{maxZoom:10});
}
drawMap("all");
document.querySelectorAll(".map-filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".map-filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");drawMap(b.dataset.mapDay);}));
const chips=[...document.querySelectorAll('.day-chip')];chips.forEach(btn=>btn.addEventListener('click',()=>document.querySelector('#day-'+btn.dataset.target).scrollIntoView({behavior:'smooth',block:'start'})));
const cards=[...document.querySelectorAll('.day-card')];const obs=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;chips.forEach(c=>c.classList.toggle('active',c.dataset.target===visible.target.dataset.day));},{rootMargin:'-80px 0px -60% 0px',threshold:[0,.2,.5]});cards.forEach(c=>obs.observe(c));
const appTabs=[...document.querySelectorAll(".app-tab")];appTabs.forEach(btn=>btn.addEventListener("click",()=>{appTabs.forEach(x=>x.classList.toggle("active",x===btn));document.querySelector("#tab-itinerary").hidden=btn.dataset.tab!=="itinerary";document.querySelector("#tab-expenses").hidden=btn.dataset.tab!=="expenses";if(btn.dataset.tab==="itinerary"&&window.map)setTimeout(()=>map.invalidateSize(),80);window.scrollTo({top:document.querySelector(".wrap").offsetTop-10,behavior:"smooth"});}));
const EXP_KEY="chen-nz-trip-expenses-v3",FX_KEY="chen-nz-trip-fx-v1";let expenses=[];try{expenses=JSON.parse(localStorage.getItem(EXP_KEY)||"[]");}catch(e){expenses=[];}const fx=document.querySelector("#fx-rate");fx.value=localStorage.getItem(FX_KEY)||"18";
const money=(n,d=0)=>Number(n||0).toLocaleString("zh-TW",{minimumFractionDigits:d,maximumFractionDigits:d});function saveExpenses(){localStorage.setItem(EXP_KEY,JSON.stringify(expenses));}
function renderExpenses(){const rate=Math.max(Number(fx.value)||18,.0001),nz=expenses.filter(x=>x.currency==="NZD").reduce((a,x)=>a+Number(x.amount),0),tw=expenses.filter(x=>x.currency==="TWD").reduce((a,x)=>a+Number(x.amount),0),totalNZ=nz+(tw/rate),totalTW=tw+(nz*rate);document.querySelector("#sum-nzd").textContent="NZ$"+money(nz,2);document.querySelector("#sum-twd").textContent="NT$"+money(tw);document.querySelector("#total-nzd").textContent="NZ$"+money(totalNZ,2);document.querySelector("#total-twd").textContent="NT$"+money(totalTW);const list=document.querySelector("#expense-list");if(!expenses.length){list.innerHTML='<div class="empty-expense">還沒有支出 ✨<br>先記下第一筆旅費吧！</div>';return;}list.innerHTML=[...expenses].reverse().map(x=>{const twd=x.currency==="NZD"?Number(x.amount)*rate:Number(x.amount);return `<div class="expense-row"><div><strong>${x.day.split(" · ")[0]}</strong><div class="small">${x.day.split(" · ")[1]||""}</div></div><div class="category-col"><span class="cat">${x.cat}</span></div><div><strong>${x.note||x.cat}</strong><div class="small">${x.currency}</div></div><div class="money">${x.currency==="NZD"?"NZ$":"NT$"}${money(x.amount,x.currency==="NZD"?2:0)}</div><div class="money twd small">≈ NT$${money(twd)}</div><button class="delete-expense" type="button" data-id="${x.id}" title="刪除">×</button></div>`;}).join("");list.querySelectorAll(".delete-expense").forEach(b=>b.addEventListener("click",()=>{expenses=expenses.filter(x=>String(x.id)!==b.dataset.id);saveExpenses();renderExpenses();}));}
document.querySelector("#expense-form").addEventListener("submit",e=>{e.preventDefault();const amount=Number(document.querySelector("#expense-amount").value);if(!amount||amount<0)return;expenses.push({id:Date.now(),day:document.querySelector("#expense-day").value,cat:document.querySelector("#expense-cat").value,currency:document.querySelector("#expense-currency").value,amount,note:document.querySelector("#expense-note").value.trim()});saveExpenses();e.target.reset();renderExpenses();});fx.addEventListener("input",()=>{localStorage.setItem(FX_KEY,fx.value);renderExpenses();});document.querySelector("#clear-expenses").addEventListener("click",()=>{if(confirm("確定要清空所有旅費紀錄嗎？")){expenses=[];saveExpenses();renderExpenses();}});document.querySelector("#export-expenses").addEventListener("click",()=>{const rows=[["日期","分類","幣別","金額","備註"],...expenses.map(x=>[x.day,x.cat,x.currency,x.amount,x.note])];const csv="\ufeff"+rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="NZ_Trip_Expenses.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);});renderExpenses();
