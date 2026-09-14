// REDLINE TOOL — SERVICIOS COMPLETOS
// Edita esta lista si quieres cambiar nombres, categorías o precios.
const SERVICES = [
  {category:'MOTOR',name:'Motor V8',detail:'Mejora de motor',price:50000},
  {category:'MOTOR',name:'Motor V12',detail:'Mejora de motor',price:500000},
  {category:'RENDIMIENTO',name:'Turbo Charger',detail:'Turbo',price:25000},
  {category:'RENDIMIENTO',name:'Frenos Cerámicos',detail:'Sistema de frenado',price:25000},
  {category:'RENDIMIENTO',name:'Llantas Slick',detail:'Neumáticos',price:7000},
  {category:'RENDIMIENTO',name:'Llantas Semi Slick',detail:'Neumáticos',price:7000},
  {category:'RENDIMIENTO',name:'Tracción AWD',detail:'Sistema de tracción',price:13000},
  {category:'SERVICIO',name:'Servicio',detail:'Mano de obra',price:5000}
];

const PACKAGES = [
  {name:'FULL TUNING V12',price:575000,detail:'Motor V12 + Turbo + Frenos + Slick + AWD + Servicio'},
  {name:'FULL TUNING V8',price:115000,detail:'Motor V8 + Turbo + Frenos + Semi Slick + AWD • Servicio incluido'}
];

const money=n=>'$'+new Intl.NumberFormat('es-ES').format(n);
const state=new Array(SERVICES.length).fill(0);
const services=document.getElementById('services');

function render(filter=''){
  services.innerHTML='';
  const q=filter.toLowerCase().trim();
  const cats=[...new Set(SERVICES.map(x=>x.category))];
  let visible=0;
  cats.forEach(cat=>{
    const list=SERVICES.map((x,i)=>({...x,i})).filter(x=>x.category===cat && (x.name+' '+x.detail+' '+x.category).toLowerCase().includes(q));
    if(!list.length)return;
    visible+=list.length;
    const wrap=document.createElement('div');
    wrap.className='category';
    wrap.innerHTML=`<div class="cat-title">${cat}</div>`;
    list.forEach(x=>{
      const row=document.createElement('div');
      row.className='service';
      row.innerHTML=`<div class="service-name"><strong>${x.name}</strong><small>${x.detail}</small></div><input aria-label="Cantidad de ${x.name}" class="qty" type="number" min="0" step="1" value="${state[x.i]}" data-i="${x.i}"><div class="price">${money(x.price)}</div><div class="price line-total" id="line-${x.i}">${money(x.price*state[x.i])}</div>`;
      wrap.appendChild(row);
    });
    services.appendChild(wrap);
  });
  if(!visible)services.innerHTML='<div class="empty">No se encontró ningún servicio.</div>';
  document.querySelectorAll('.qty').forEach(inp=>inp.addEventListener('input',e=>{
    state[+e.target.dataset.i]=Math.max(0,Math.floor(Number(e.target.value)||0));
    e.target.value=state[+e.target.dataset.i];
    update();
  }));
  update();
}

function update(){
  let total=0;
  SERVICES.forEach((x,i)=>{
    total+=x.price*state[i];
    const el=document.getElementById('line-'+i);
    if(el)el.textContent=money(x.price*state[i]);
  });
  document.getElementById('grand').textContent=money(total);
  document.getElementById('d5').textContent=money(total*.95);
  document.getElementById('d10').textContent=money(total*.90);
  document.getElementById('d15').textContent=money(total*.85);
}

function packageText(pkg){
  return `${pkg.name}: ${money(pkg.price)}\n${pkg.detail}`;
}

document.getElementById('search').addEventListener('input',e=>render(e.target.value));
function reset(){state.fill(0);render(document.getElementById('search').value)}
document.getElementById('clear').onclick=reset;
document.getElementById('reset').onclick=reset;
document.getElementById('copy').onclick=async()=>{
  const text=document.getElementById('grand').textContent;
  try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
  const t=document.getElementById('toast');t.textContent='Monto copiado: '+text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);
};

document.getElementById('packages').innerHTML=PACKAGES.map(p=>`<div class="package"><div><strong>${p.name}</strong><small>${p.detail}</small></div><b>${money(p.price)}</b><button class="btn package-copy" data-text="${packageText(p).replace(/"/g,'&quot;')}">COPIAR</button></div>`).join('');
document.querySelectorAll('.package-copy').forEach(btn=>btn.onclick=async()=>{
  const text=btn.dataset.text;
  try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
  const t=document.getElementById('toast');t.textContent='Paquete copiado';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);
});
render();
