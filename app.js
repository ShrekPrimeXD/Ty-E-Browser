const HOME = "https://duckduckgo.com/";

const address=document.getElementById("address");
const viewport=document.getElementById("viewport");
const progressBar=document.getElementById("progressBar");
const tabsContainer=document.getElementById("tabsContainer");

document.getElementById("themeSwitch").onclick=()=>{document.documentElement.dataset.theme=(document.documentElement.dataset.theme==="dark"?"light":"dark");};

let tabs=[]; let activeTab=null;

function createTab(url){
  const id=Date.now();
  const tab={id,url,favicon:"",history:[url],index:0};
  tabs.push(tab);
  activeTab=id;
  renderTabs();
  navigateTo(url);
}

function closeTab(id){
  tabs=tabs.filter(t=>t.id!==id);
  if(activeTab===id && tabs.length){activeTab=tabs[0].id;navigateTo(tabs[0].url);}
  renderTabs();
}

function switchTab(id){
  activeTab=id;
  const tab=tabs.find(t=>t.id===id);
  navigateTo(tab.url,false);
  renderTabs();
}

let dragged=null;
function makeDraggable(div,id){
  div.draggable=true;
  div.addEventListener("dragstart",()=>{dragged=id;div.classList.add("dragging");});
  div.addEventListener("dragend",()=>{dragged=null;div.classList.remove("dragging");});
  div.addEventListener("dragover",e=>{e.preventDefault();const tabIndex=tabs.findIndex(t=>t.id===id);const dragIndex=tabs.findIndex(t=>t.id===dragged);if(tabIndex!==dragIndex){const temp=tabs[dragIndex];tabs.splice(dragIndex,1);tabs.splice(tabIndex,0,temp);renderTabs();}});
}

function renderTabs(){
  tabsContainer.innerHTML="";
  tabs.forEach(t=>{
    const div=document.createElement("div");
    div.className="tab"+(t.id===activeTab?" active":"");
    const img=document.createElement("img"); img.src=t.favicon; div.appendChild(img);
    div.appendChild(document.createTextNode(new URL(t.url).hostname));
    const close=document.createElement("span"); close.textContent=" ✕"; close.className="tabClose"; close.onclick=e=>{e.stopPropagation();closeTab(t.id)};
    div.appendChild(close);
    div.onclick=()=>switchTab(t.id);
    makeDraggable(div,t.id);
    tabsContainer.appendChild(div);
  });
}

document.getElementById("back").onclick=()=>{let tab=tabs.find(t=>t.id===activeTab);if(tab.index>0){tab.index--;navigateTo(tab.history[tab.index],false);}};
document.getElementById("forward").onclick=()=>{let tab=tabs.find(t=>t.id===activeTab);if(tab.index<tab.history.length-1){tab.index++;navigateTo(tab.history[tab.index],false);}};
function startProgress(){progressBar.style.width="10%";setTimeout(()=>progressBar.style.width="80%",200);}
function endProgress(){progressBar.style.width="100%";setTimeout(()=>progressBar.style.width="0",300);}
function navigateTo(raw,push=true){
  const url=/^https?:\/\//i.test(raw)?raw:(raw.includes(".")?"https://"+raw:"https://duckduckgo.com/?q="+encodeURIComponent(raw));
  address.value=url;
  const tab=tabs.find(t=>t.id===activeTab);
  if(push){tab.history.splice(tab.index+1);tab.history.push(url);tab.index=tab.history.length-1;}
  tab.url=url;
  startProgress();
  viewport.src=url;
  viewport.onload=()=>{endProgress();renderTabs();};
}

document.getElementById("go").onclick=()=>navigateTo(address.value);
document.getElementById("address").addEventListener("keydown",e=>{if(e.key==="Enter")navigateTo(address.value);});
document.getElementById("newTab").onclick=()=>createTab(HOME);
document.addEventListener("DOMContentLoaded",()=>createTab(HOME));
