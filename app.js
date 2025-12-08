const HOME = "https://example.com";

function createTab(url){
  const id = Math.random().toString(36).slice(2);
  tabs.push({ id, url, favicon:"", title:"Nouvel onglet" });
  switchTab(id);
  navigateTo(url, false);
}

function closeTab(id){
  const i = tabs.findIndex(t=>t.id===id);
  if(i>=0){
    tabs.splice(i,1);
    if(activeTab===id && tabs.length>0){
      switchTab(tabs[tabs.length-1].id);
    }
  }
  renderTabs();
}

function switchTab(id){
  activeTab = id;
  const t = tabs.find(x=>x.id===id);
  if(t) navigateTo(t.url, false);
  renderTabs();
}

function makeDraggable(div, id){
  let dragged = null;

  div.draggable = true;

  div.addEventListener("dragstart", ()=>{ dragged = id; div.classList.add("dragging"); });
  div.addEventListener("dragend", ()=>{ dragged = null; div.classList.remove("dragging"); });

  div.addEventListener("dragover", e=>{
    e.preventDefault();
    const tabIndex = tabs.findIndex(t=>t.id===id);
    const dragIndex = tabs.findIndex(t=>t.id===dragged);
    if(tabIndex !== dragIndex){
      const temp = tabs[dragIndex];
      tabs.splice(dragIndex,1);
      tabs.splice(tabIndex,0,temp);
      renderTabs();
    }
  });
}

function renderTabs(){
  tabsContainer.innerHTML = "";
  tabs.forEach(t=>{
    const div = document.createElement("div");
    div.className = "tab" + (t.id===activeTab ? " active" : "");

    const img = document.createElement("img");
    img.src = t.favicon;
    div.appendChild(img);

    div.appendChild(document.createTextNode(new URL(t.url).hostname));

    const close = document.createElement("span");
    close.textContent = " ✕";
    close.className = "tabClose";
    close.onclick = (e)=>{e.stopPropagation();closeTab(t.id)};
    div.appendChild(close);

    div.onclick = ()=> switchTab(t.id);

    makeDraggable(div, t.id);

    tabsContainer.appendChild(div);
  });
}

function startProgress(){progressBar.style.width = "10%";setTimeout(()=>progressBar.style.width="80%",200);}
function endProgress(){progressBar.style.width = "100%";setTimeout(()=>progressBar.style.width="0",300);}

function navigateTo(raw, push=true){
  const url = normalizeUrl(raw);
  address.value = url;

  const tab = tabs.find(t=>t.id===activeTab);
  if(tab) tab.url = url;

  startProgress();
  viewport.src = url;

  viewport.onload = ()=>{
    endProgress();
    try{
      const icon = viewport.contentWindow.document.querySelector("link[rel~='icon']");
      if(icon) tab.favicon = icon.href;
    }catch{}
    renderTabs();
  }
}

function normalizeUrl(input){
  if(/^https?:\/\//i.test(input)) return input;
  if(input.includes(".")) return "https://"+input;
  return "https://duckduckgo.com/?q="+encodeURIComponent(input);
}

document.getElementById("go").onclick = ()=> navigateTo(address.value);
document.getElementById("address").addEventListener("keydown", e=>{ if(e.key==="Enter") navigateTo(address.value); });
document.getElementById("newTab").onclick = ()=> createTab(HOME);

document.addEventListener("DOMContentLoaded", ()=> createTab(HOME));
