const input=document.querySelector("#file"),drop=document.querySelector("#dropzone"),card=document.querySelector("#fileCard"),typeEl=document.querySelector("#fileType"),nameEl=document.querySelector("#fileName"),sizeEl=document.querySelector("#fileSize"),detected=document.querySelector("#detectedType"),remove=document.querySelector("#removeFile"),convert=document.querySelector("#convert"),status=document.querySelector("#status"),target=document.querySelector("#targetVersion");
let selected=null;

function statusMsg(text){status.textContent=text;status.classList.toggle("hidden",!text)}
function selectFile(file){
  if(!file)return;
  const name=file.name.toLowerCase();
  const ext=name.endsWith(".aep")?".aep":name.endsWith(".aex")?".aex":"";
  if(!ext){statusMsg("Unsupported file. Please choose an .aep or .aex file.");return}
  selected=file;
  typeEl.textContent=ext.slice(1).toUpperCase();
  detected.textContent=ext===".aep"?"AEP PROJECT":"AEX PLUGIN";
  nameEl.textContent=file.name;
  sizeEl.textContent=(file.size/1048576).toFixed(2)+" MB";
  card.classList.remove("hidden");
  convert.disabled=false;
  statusMsg("");
}
input.addEventListener("change",()=>selectFile(input.files[0]));
drop.addEventListener("click",()=>input.click());
drop.addEventListener("dragover",e=>{e.preventDefault();drop.style.borderColor="#ff6fa6"});
drop.addEventListener("dragleave",()=>drop.style.borderColor="");
drop.addEventListener("drop",e=>{e.preventDefault();drop.style.borderColor="";selectFile(e.dataTransfer.files[0])});
remove.addEventListener("click",()=>{selected=null;input.value="";card.classList.add("hidden");detected.textContent="Waiting for file";convert.disabled=true;statusMsg("")});

convert.addEventListener("click",()=>{
  if(!selected)return;
  statusMsg("GitHub Pages is the frontend only. Connect your conversion API to enable real AEP/AEX conversion.");
});
