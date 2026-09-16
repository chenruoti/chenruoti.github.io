const tripStops = [
 {id:"queenstown",name:"Queenstown",lat:-45.0312,lng:168.6626,days:[2,3,4,5],note:"Shotover Jet、Real Country / Milford 基地、湖畔"},
 {id:"shotover",name:"Shotover Jet",lat:-44.9956,lng:168.6824,days:[2],note:"10/29 下午暫定活動"},
 {id:"kingston",name:"Kingston / Real Country",lat:-45.3318,lng:168.7142,days:[3],note:"剪羊毛、牧羊犬、農場體驗"},
 {id:"teanau",name:"Te Anau",lat:-45.4145,lng:167.7180,days:[4],note:"Milford Sound 路線停留"},
 {id:"milford",name:"Milford Sound",lat:-44.6716,lng:167.9256,days:[4],note:"峽灣 Cruise"},
 {id:"arrowtown",name:"Arrowtown",lat:-44.9380,lng:168.8354,days:[5],note:"可選停留"},
 {id:"wanaka",name:"Wānaka",lat:-44.6967,lng:169.1367,days:[5,6],note:"湖畔、小鎮"},
 {id:"lindis",name:"Lindis Pass",lat:-44.5897,lng:169.6532,days:[6],note:"北上景觀公路"},
 {id:"pukaki",name:"Lake Pukaki",lat:-44.1062,lng:170.1736,days:[6,7],note:"Mt Cook 路線景觀"},
 {id:"mtcook",name:"Aoraki / Mt Cook",lat:-43.7340,lng:170.0967,days:[6,7],note:"Tasman Lake、Hooker Valley"},
 {id:"tekapo",name:"Lake Tekapo",lat:-44.0047,lng:170.4771,days:[7,8],note:"教堂、泡湯、星空"},
 {id:"chc",name:"Christchurch",lat:-43.5321,lng:172.6362,days:[8,9,10,12,13],note:"市區、Akaroa 基地、最後採買"},
 {id:"akaroa",name:"Akaroa",lat:-43.8037,lng:172.9681,days:[9],note:"Hector's Dolphin Cruise"},
 {id:"kaikoura",name:"Kaikōura",lat:-42.4008,lng:173.6814,days:[10,11,12],note:"海豹、Whale Watching、半島步道"}
];
const dayRoutes = {2:["queenstown","shotover","queenstown"],3:["queenstown","kingston","queenstown"],4:["queenstown","teanau","milford","queenstown"],5:["queenstown","arrowtown","wanaka"],6:["wanaka","lindis","pukaki","mtcook"],7:["mtcook","pukaki","tekapo"],8:["tekapo","chc"],9:["chc","akaroa","chc"],10:["chc","kaikoura"],11:["kaikoura"],12:["kaikoura","chc"],13:["chc"]};
const map = L.map("trip-map",{scrollWheelZoom:false}).setView([-44.45,170.3],6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  maxZoom:19, attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

let mapLayers = [];
function clearTripLayers(){ mapLayers.forEach(l=>map.removeLayer(l)); mapLayers=[]; }
function pinIcon(label){
 return L.divIcon({className:"",html:`<div class="custom-pin">${label}</div>`,iconSize:[30,30],iconAnchor:[15,15]});
}
function gm(name){ return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+" New Zealand"); }
function drawMap(day="all"){
 clearTripLayers();
 const ids = day==="all" ? [...new Set(Object.values(dayRoutes).flat())] : (dayRoutes[day]||[]);
 const shown = tripStops.filter(s=>ids.includes(s.id));
 shown.forEach((s,i)=>{
   const dayText=s.days.map(d=>"D"+d).join(" · ");
   const m=L.marker([s.lat,s.lng],{icon:pinIcon(day==="all" ? (i+1) : day)}).addTo(map)
    .bindPopup(`<strong>${s.name}</strong><br>${dayText}<br>${s.note}<br><a target="_blank" rel="noopener" href="${gm(s.name)}">Google Maps ↗</a>`);
   mapLayers.push(m);
 });
 if(day==="all"){
   const master=["queenstown","shotover","queenstown","kingston","queenstown","teanau","milford","queenstown","arrowtown","wanaka","lindis","pukaki","mtcook","pukaki","tekapo","chc","akaroa","chc","kaikoura","chc"];
   const pts=master.map(id=>tripStops.find(s=>s.id===id)).filter(Boolean).map(s=>[s.lat,s.lng]);
   const line=L.polyline(pts,{weight:4,opacity:.7,dashArray:"8 8"}).addTo(map); mapLayers.push(line);
 } else {
   const pts=(dayRoutes[day]||[]).map(id=>tripStops.find(s=>s.id===id)).filter(Boolean).map(s=>[s.lat,s.lng]);
   if(pts.length>1){const line=L.polyline(pts,{weight:5,opacity:.75,dashArray:"8 8"}).addTo(map);mapLayers.push(line);}
 }
 if(shown.length){ map.fitBounds(L.latLngBounds(shown.map(s=>[s.lat,s.lng])).pad(.18),{maxZoom:10}); }
}
drawMap("all");
document.querySelectorAll(".map-filter").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".map-filter").forEach(x=>x.classList.remove("active"));
 b.classList.add("active"); drawMap(b.dataset.mapDay);
}));

const chips=[...document.querySelectorAll('.day-chip')];
chips.forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelector('#day-'+btn.dataset.target).scrollIntoView({behavior:'smooth',block:'start'});
}));
const cards=[...document.querySelectorAll('.day-card')];
const obs=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  chips.forEach(c=>c.classList.toggle('active',c.dataset.target===visible.target.dataset.day));
},{rootMargin:'-80px 0px -60% 0px',threshold:[0,.2,.5]});
cards.forEach(c=>obs.observe(c));

/* ===== Tabs ===== */
const appTabs=[...document.querySelectorAll(".app-tab")];
appTabs.forEach(btn=>btn.addEventListener("click",()=>{
  appTabs.forEach(x=>x.classList.toggle("active",x===btn));
  document.querySelector("#tab-itinerary").hidden=btn.dataset.tab!=="itinerary";
  document.querySelector("#tab-expenses").hidden=btn.dataset.tab!=="expenses";
  if(btn.dataset.tab==="itinerary" && window.map){ setTimeout(()=>map.invalidateSize(),80); }
  window.scrollTo({top:document.querySelector(".wrap").offsetTop-10,behavior:"smooth"});
}));

/* ===== Expenses ===== */
const EXP_KEY="chen-nz-trip-expenses-v2", FX_KEY="chen-nz-trip-fx-v1";
let expenses=[];
try{expenses=JSON.parse(localStorage.getItem(EXP_KEY)||"[]");}catch(e){expenses=[];}
const fx=document.querySelector("#fx-rate");
fx.value=localStorage.getItem(FX_KEY)||"18";

const money=(n,d=0)=>Number(n||0).toLocaleString("zh-TW",{minimumFractionDigits:d,maximumFractionDigits:d});
function saveExpenses(){localStorage.setItem(EXP_KEY,JSON.stringify(expenses));}
function renderExpenses(){
  const rate=Math.max(Number(fx.value)||18,.0001);
  const nz=expenses.filter(x=>x.currency==="NZD").reduce((a,x)=>a+Number(x.amount),0);
  const tw=expenses.filter(x=>x.currency==="TWD").reduce((a,x)=>a+Number(x.amount),0);
  const totalNZ=nz+(tw/rate), totalTW=tw+(nz*rate);
  document.querySelector("#sum-nzd").textContent="NZ$"+money(nz,2);
  document.querySelector("#sum-twd").textContent="NT$"+money(tw);
  document.querySelector("#total-nzd").textContent="NZ$"+money(totalNZ,2);
  document.querySelector("#total-twd").textContent="NT$"+money(totalTW);

  const list=document.querySelector("#expense-list");
  if(!expenses.length){list.innerHTML='<div class="empty-expense">還沒有支出 ✨<br>先記下第一筆旅費吧！</div>';return;}
  list.innerHTML=[...expenses].reverse().map(x=>{
    const twd=x.currency==="NZD" ? Number(x.amount)*rate : Number(x.amount);
    return `<div class="expense-row">
      <div><strong>${x.day.split(" · ")[0]}</strong><div class="small">${x.day.split(" · ")[1]||""}</div></div>
      <div class="category-col"><span class="cat">${x.cat}</span></div>
      <div><strong>${x.note||x.cat}</strong><div class="small">${x.currency}</div></div>
      <div class="money">${x.currency==="NZD"?"NZ$":"NT$"}${money(x.amount,x.currency==="NZD"?2:0)}</div>
      <div class="money twd small">≈ NT$${money(twd)}</div>
      <button class="delete-expense" type="button" data-id="${x.id}" title="刪除">×</button>
    </div>`;
  }).join("");
  list.querySelectorAll(".delete-expense").forEach(b=>b.addEventListener("click",()=>{
    expenses=expenses.filter(x=>String(x.id)!==b.dataset.id);saveExpenses();renderExpenses();
  }));
}
document.querySelector("#expense-form").addEventListener("submit",e=>{
  e.preventDefault();
  const amount=Number(document.querySelector("#expense-amount").value);
  if(!amount||amount<0)return;
  expenses.push({
    id:Date.now(),day:document.querySelector("#expense-day").value,
    cat:document.querySelector("#expense-cat").value,
    currency:document.querySelector("#expense-currency").value,
    amount, note:document.querySelector("#expense-note").value.trim()
  });
  saveExpenses();e.target.reset();renderExpenses();
});
fx.addEventListener("input",()=>{localStorage.setItem(FX_KEY,fx.value);renderExpenses();});
document.querySelector("#clear-expenses").addEventListener("click",()=>{
  if(confirm("確定要清空所有旅費紀錄嗎？")){expenses=[];saveExpenses();renderExpenses();}
});
document.querySelector("#export-expenses").addEventListener("click",()=>{
  const rows=[["日期","分類","幣別","金額","備註"],...expenses.map(x=>[x.day,x.cat,x.currency,x.amount,x.note])];
  const csv="\ufeff"+rows.map(r=>r.map(v=>`"${String(v??"").replaceAll('"','""')}"`).join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="NZ_Trip_Expenses.csv";a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
});
renderExpenses();
