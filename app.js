// ============================================================
// REDLINE TOOL — EDITA SOLO ESTA LISTA PARA CAMBIAR SERVICIOS
// price = precio por unidad. category = grupo del servicio.
// ============================================================
const SERVICES = [
  {category:'Mecánica',name:'Servicio general',detail:'Mano de obra / servicio',price:5000},
  {category:'Motor',name:'Motor V8',detail:'Mejora de motor',price:50000},
  {category:'Motor',name:'Motor V12',detail:'Mejora de motor',price:500000},
  {category:'Rendimiento',name:'Turbo Charger',detail:'Turbo',price:25000},
  {category:'Rendimiento',name:'Frenos Cerámicos',detail:'Sistema de frenado',price:25000},
  {category:'Rendimiento',name:'Llantas Slick',detail:'Neumáticos',price:7000},
  {category:'Rendimiento',name:'Llantas Semi Slick',detail:'Neumáticos',price:7000},
  {category:'Rendimiento',name:'Tracción AWD',detail:'Sistema de tracción',price:13000}
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
    if(e.target.value!==String(state[+e.target.dataset.i]))e.target.value=state[+e.target.dataset.i];
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

document.getElementById('search').addEventListener('input',e=>render(e.target.value));
function reset(){state.fill(0);render(document.getElementById('search').value)}
document.getElementById('clear').onclick=reset;
document.getElementById('reset').onclick=reset;
document.getElementById('copy').onclick=async()=>{
  const text=document.getElementById('grand').textContent;
  try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
  const t=document.getElementById('toast');t.textContent='Monto copiado: '+text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);
};
render();
