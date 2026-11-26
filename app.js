const structures=[
 {id:"residential",name:"Residential",full:"Residential home"},
 {id:"business",name:"Business",full:"Commercial business"},
 {id:"highrise",name:"High-rise",full:"High-rise building"}
];
const conditions=[
 {id:"clear",name:"No visible smoke",label:"NO VISIBLE SMOKE"},
 {id:"light-smoke",name:"Light smoke",label:"LIGHT SMOKE"},
 {id:"heavy-smoke",name:"Heavy smoke",label:"HEAVY SMOKE"},
 {id:"fully-engulfed",name:"Fully engulfed",label:"FULLY ENGULFED"}
];
const prompts={
 clear:"You arrive at a structure with no visible smoke or fire from this viewing angle. What information do you need before committing resources?",
 "light-smoke":"Light smoke is visible from the exterior. What observations and additional information will help your crew understand the situation?",
 "heavy-smoke":"A heavy smoke condition is visible. What are your priorities for gathering information, communicating conditions, and managing risk?",
 "fully-engulfed":"Fire is visibly involving a large portion of the structure. What immediate hazards, exposures, life-safety concerns, and command considerations should be discussed?"
};
let structure="residential",condition="clear";
const $=id=>document.getElementById(id);
const all=()=>structures.flatMap(s=>conditions.map(c=>({structure:s.id,condition:c.id})));
let scenarios=all();
function currentIndex(){return scenarios.findIndex(x=>x.structure===structure&&x.condition===condition)}
function select(s,c){structure=s;condition=c;render()}
function render(){
 const s=structures.find(x=>x.id===structure),c=conditions.find(x=>x.id===condition);
 $("sceneTitle").textContent=`${s.name} · ${c.name}`;
 $("sceneLabel").textContent=c.label;
 $("structureMeta").textContent=s.full.toUpperCase()+" STRUCTURE";
 $("scenarioCounter").textContent=String(currentIndex()+1).padStart(2,"0")+" / 12";
 $("sceneImage").src=`assets/${structure}-${condition}.jpg`;
 $("sceneImage").alt=`Illustrative ${s.full.toLowerCase()} with ${c.name.toLowerCase()}`;
 $("discussionPrompt").textContent=prompts[condition];
 document.querySelectorAll("[data-structure]").forEach(b=>b.classList.toggle("selected",b.dataset.structure===structure));
 document.querySelectorAll("[data-condition]").forEach(b=>b.classList.toggle("selected",b.dataset.condition===condition));
 document.querySelectorAll(".thumb").forEach(b=>b.classList.toggle("active",b.dataset.key===structure+"|"+condition));
 $("promptList").hidden=true;$("revealBtn").setAttribute("aria-expanded","false");$("revealBtn").innerHTML='Show discussion prompts <span>＋</span>';
}
document.querySelectorAll("[data-structure]").forEach(b=>b.addEventListener("click",()=>select(b.dataset.structure,condition)));
document.querySelectorAll("[data-condition]").forEach(b=>b.addEventListener("click",()=>select(structure,b.dataset.condition)));
$("previousBtn").addEventListener("click",()=>{let i=(currentIndex()+11)%12;select(scenarios[i].structure,scenarios[i].condition)});
$("nextBtn").addEventListener("click",()=>{let i=(currentIndex()+1)%12;select(scenarios[i].structure,scenarios[i].condition)});
$("randomBtn").addEventListener("click",()=>{let i;do{i=Math.floor(Math.random()*12)}while(i===currentIndex());select(scenarios[i].structure,scenarios[i].condition)});
$("revealBtn").addEventListener("click",()=>{let hidden=$("promptList").hidden;$("promptList").hidden=!hidden;$("revealBtn").setAttribute("aria-expanded",String(hidden));$("revealBtn").innerHTML=hidden?'Hide discussion prompts <span>−</span>':'Show discussion prompts <span>＋</span>'});
function togglePresentation(){document.body.classList.toggle("presentation");}
$("fullscreenBtn").addEventListener("click",async()=>{togglePresentation();if(document.body.classList.contains("presentation")&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen()}catch(e){}}else if(document.fullscreenElement){try{await document.exitFullscreen()}catch(e){}}});
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement)document.body.classList.remove("presentation")});
$("imageExpand").addEventListener("click",()=>{$("lightboxImage").src=$("sceneImage").src;$("lightbox").hidden=false});
$("closeLightbox").addEventListener("click",()=>$("lightbox").hidden=true);
$("lightbox").addEventListener("click",e=>{if(e.target===$("lightbox"))$("lightbox").hidden=true});
$("shareBtn").addEventListener("click",async()=>{if(navigator.share){try{await navigator.share({title:"Fireground Visual Training",text:"Firefighter visual size-up training scenarios",url:location.href})}catch(e){}}else{try{await navigator.clipboard.writeText(location.href);$("shareBtn").querySelector("span").textContent="Link copied"}catch(e){$("shareBtn").querySelector("span").textContent="Copy URL from address bar"}}});
const grid=$("thumbGrid");
scenarios.forEach((x,i)=>{let s=structures.find(z=>z.id===x.structure),c=conditions.find(z=>z.id===x.condition);let b=document.createElement("button");b.className="thumb";b.dataset.key=x.structure+"|"+x.condition;b.innerHTML=`<img src="assets/${x.structure}-${x.condition}.jpg" alt="" loading="lazy"><span>${s.name} · ${c.name}</span>`;b.addEventListener("click",()=>select(x.structure,x.condition));grid.appendChild(b)});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();