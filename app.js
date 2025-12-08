const HOME = "https://html.duckduckgo.com/html/";

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

// Crée un nouvel onglet
function createTab(url = HOME){
  tabs.push({url: url, history: [url], index: 0});
  activeTabIndex = tabs.length - 1;
  renderTabs();
  navigateTo(url);
}

// Affiche les onglets
function renderTabs(){
  tabsContainer.innerHTML="";
  tabs.forEach((t, i)=>{
    let div=document.createElement("div");
    div.className="tab"+(i===activeTabIndex?" active":"");
    div.textContent=new URL(t.url).hostname;
    div.onclick=()=>{activeTabIndex=i;navigateTo(t.url);}
    tabsContainer.appendChild(div);
  });
}

// Navigation vers URL ou recherche DuckDuckGo HTML
function navigateTo(raw){
  let url;
  if(raw.includes("html.duckduckgo.com")) url = raw;
  else url = "https://html.duckduckgo.com/html/?q="+encodeURIComponent(raw);

  address.value = raw;

  let tab = tabs[activeTabIndex];
  if(tab){
    tab.url = url;
    tab.history = tab.history.slice(0, tab.index + 1);
    tab.history.push(url);
    tab.index = tab.history.length - 1;
  }

  viewport.src = url;
  renderTabs();
}

// Boutons
goBtn.onclick=()=>navigateTo(address.value);
address.addEventListener("keydown", e=>{if(e.key==="Enter")navigateTo(address.value);});
newTabBtn.onclick=()=>createTab();
themeSwitch.onclick=()=>{
  document.documentElement.dataset.theme = document.documentElement.dataset.theme==="dark"?"light":"dark";
}
backBtn.onclick=()=>{
  let tab=tabs[activeTabIndex];
  if(tab.index>0){tab.index--;navigateTo(tab.history[tab.index]);}
}
forwardBtn.onclick=()=>{
  let tab=tabs[activeTabIndex];
  if(tab.index<tab.history.length-1){tab.index++;navigateTo(tab.history[tab.index]);}
}

// Au chargement
document.addEventListener("DOMContentLoaded",()=>createTab());
