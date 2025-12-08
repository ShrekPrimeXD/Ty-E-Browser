// Page par défaut = ton GitHub Pages
const HOME = "https://shrekprimexd.github.io/Ty-E-Website/";

const address = document.getElementById("address");
const viewport = document.getElementById("viewport");
const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");
const goBtn = document.getElementById("go");
const newTabBtn = document.getElementById("newTab");
const themeSwitch = document.getElementById("themeSwitch");
const tabsContainer = document.getElementById("tabsContainer");

let tabs = [];
let activeTabIndex = -1;
let draggedTabIndex = null;

// Créer un nouvel onglet
function createTab(url = HOME){
  tabs.push({url:url,history:[url],index:0});
  activeTabIndex = tabs.length - 1;
  renderTabs();
  navigateTo(url);
}

// Afficher les onglets
function renderTabs(){
  tabsContainer.innerHTML="";
  tabs.forEach((t,i)=>{
    let div=document.createElement("div");
    div.className="tab"+(i===activeTabIndex?" active":"");
    div.textContent=t.url;

    div.onclick=()=>{activeTabIndex=i;navigateTo(t.url);}

    // Drag & drop
    div.draggable=true;
    div.addEventListener("dragstart",()=>{draggedTabIndex=i;div.style.opacity=0.4;});
    div.addEventListener("dragend",()=>{draggedTabIndex=null;div.style.opacity=1;});
    div.addEventListener("dragover",e=>{
      e.preventDefault();
      if(draggedTabIndex===null || draggedTabIndex===i) return;
      const temp=tabs[draggedTabIndex];
      tabs.splice(draggedTabIndex,1);
      tabs.splice(i,0,temp);
      draggedTabIndex=i;
      renderTabs();
    });

    tabsContainer.appendChild(div);
  });
}

// Navigation
function navigateTo(raw){
  let url = raw.includes("://") ? raw : raw;
  address.value = raw;
  let tab = tabs[activeTabIndex];
  if(tab){
    tab.url = url;
    tab.history = tab.history.slice(0, tab.index+1);
    tab.history.push(url);
    tab.index = tab.history.length-1;
  }
  viewport.src=url;
  renderTabs();
}

// Boutons
goBtn.onclick=()=>navigateTo(address.value);
address.addEventListener("keydown",e=>{if(e.key==="Enter")navigateTo(address.value);});
newTabBtn.onclick=()=>createTab();
themeSwitch.onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark";}
backBtn.onclick=()=>{
  let tab=tabs[activeTabIndex];
  if(tab.index>0){tab.index--;navigateTo(tab.history[tab.index]);}
}
forwardBtn.onclick=()=>{
  let tab=tabs[activeTabIndex];
  if(tab.index<tab.history.length-1){tab.index++;navigateTo(tab.history[tab.index]);}
}

// Initialisation
document.addEventListener("DOMContentLoaded",()=>createTab());
