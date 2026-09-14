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
const services=document.getElementById('services'), full=document.getElementById('fullServices');
function render(filter=''){
  services.innerHTML=''; full.innerHTML='';
  const q=filter.toLowerCase();
  const cats=[...new Set(SERVICES.map(x=>x.category))];
  cats.forEach(cat=>{
    const list=SERVICES.map((x,i)=>({...x,i})).filter(x=>x.category===cat && (x.name+' '+x.detail).toLowerCase().includes(q));
    if(!list.length)return;
    const wrap=document.createElement('div'); wrap.className='category';
    wrap.innerHTML=`<div class="cat-title">${cat}</div>`;
    list.forEach(x=>{
      const row=document.createElement('div'); row.className='service';
      row.innerHTML=`<div class="service-name"><strong>${x.name}</strong><small>${x.detail}</small></div><input class="qty" type="number" min="0" step="1" value="${state[x.i]}" data-i="${x.i}"><div class="price">${money(x.price)}</div><div class="price line-total" id="line-${x.i}">${money(x.price*state[x.i])}</div>`;
      wrap.appendChild(row);
    });
    services.appendChild(wrap);
  });
  const all=SERVICES.map((x,i)=>({...x,i}));
  all.forEach(x=>{const row=document.createElement('div');row.className='service';row.innerHTML=`<div class="service-name"><strong>${x.name}</strong><small>${x.category} • ${x.detail}</small></div><div></div><div class="price">${money(x.price)}</div><div class="price">${money(x.price*state[x.i])}</div>`;full.appendChild(row)});
  document.querySelectorAll('.qty').forEach(inp=>inp.addEventListener('input',e=>{state[+e.target.dataset.i]=Math.max(0,Number(e.target.value)||0);update()}));
  update();
}
function update(){let total=0;SERVICES.forEach((x,i)=>{total+=x.price*state[i];const el=document.getElementById('line-'+i);if(el)el.textContent=money(x.price*state[i]);});document.getElementById('grand').textContent=money(total);document.getElementById('d5').textContent=money(total*.95);document.getElementById('d10').textContent=money(total*.90);document.getElementById('d15').textContent=money(total*.85)}
document.getElementById('search').addEventListener('input',e=>render(e.target.value));
function reset(){state.fill(0);render(document.getElementById('search').value)}
document.getElementById('clear').onclick=reset;document.getElementById('reset').onclick=reset;
document.getElementById('copy').onclick=()=>{const text=document.getElementById('grand').textContent;navigator.clipboard?.writeText(text);const t=document.getElementById('toast');t.textContent='Monto copiado: '+text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)};
document.querySelectorAll('.nav button').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));document.getElementById(btn.dataset.view).classList.remove('hidden');const titles={calc:['Calculadora de Servicios','Calcula reparaciones, mejoras y servicios de Redline de forma rápida y precisa.'],full:['Vista Completa','Todos los servicios y mejoras configurados para Redline.'],info:['Información','Herramienta interna para el cálculo de servicios de Redline.']};document.getElementById('title').textContent=titles[btn.dataset.view][0];document.getElementById('subtitle').textContent=titles[btn.dataset.view][1]});
render();
