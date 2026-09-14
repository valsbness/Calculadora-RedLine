const SERVICES = [
  ['REPARACIÓN','Kit de reparación','Reparación del vehículo',1000],
  ['RENDIMIENTO','Piezas de Rendimiento','Mejoras de rendimiento',10000],
  ['PINTURA','Kit de pintura','Pintura del vehículo',1500],
  ['COSMÉTICOS','Piezas Cosméticas','Modificaciones cosméticas',4000],
  ['RUEDAS / LLANTAS','Set de Rines','Ruedas / llantas',10000],
  ['KIT DE HUMOS','Kit de Humo para neumáticos','Humo para neumáticos',10000],
  ['MOTORES','Motor V8 Upgrade','Motor V8',50000],
  ['MOTORES','Motor V12','Motor V12',500000],
  ['FRENOS','Frenos cerámicos','Frenos cerámicos',25000],
  ['TURBO CHARGER','Turbo Charger','Turbo Charger',25000],
  ['TRACCIONES','Tracción AWD','Tracción ambas',13000],
  ['TRACCIONES','Tracción RWD','Tracción trasera',12000],
  ['TRACCIONES','Tracción FWD','Tracción delantera',11000],
  ['NEUMÁTICOS','Slick','Neumáticos Slick',7000],
  ['NEUMÁTICOS','Semi-Slick','Neumáticos Semi-Slick',7000],
  ['NEUMÁTICOS','Offroad','Neumáticos Offroad',7000],
  ['STANCE','Stance o suspensión','Kit de Stance',10000],
  ['EXTRAS','Extras','Modificaciones adicionales',10000],
  ['NITRO','Nitro','Sistema de Nitro',680000],
  ['NITRO','Botella de Nitro','Botella de Nitro',200000]
].map((x,i)=>({id:i,category:x[0],name:x[1],detail:x[2],price:x[3]}));

const PACKAGES = [
  {name:'FULL TUNING V8',price:110000,detail:'Motor V8 + Turbo Charger + Frenos Cerámicos + Llantas Slick + Tracción AWD'},
  {name:'FULL TUNING V12',price:570000,detail:'Motor V12 + Turbo Charger + Frenos Cerámicos + Llantas Slick + Tracción AWD'}
];

const state = Array(SERVICES.length).fill(0);
const money = n => '$' + new Intl.NumberFormat('es-ES').format(n);
const services = document.getElementById('services');

function render(filter='') {
  services.innerHTML='';
  const q=filter.toLowerCase().trim();
  let visible=0;
  [...new Set(SERVICES.map(x=>x.category))].forEach(cat=>{
    const list=SERVICES.filter(x=>x.category===cat && (`${x.name} ${x.detail} ${x.category}`).toLowerCase().includes(q));
    if(!list.length) return;
    visible += list.length;
    const wrap=document.createElement('div');
    wrap.className='category';
    wrap.innerHTML=`<div class="cat-title">${cat}</div>`;
    list.forEach(x=>{
      const row=document.createElement('div');
      row.className='service';
      row.innerHTML=`<div class="service-name"><strong>${x.name}</strong><small>${x.detail}</small></div>
      <input class="qty" type="number" min="0" step="1" value="${state[x.id]}" data-i="${x.id}">
      <div class="price">${x.price ? money(x.price) : 'Por configurar'}</div>
      <div class="price line-total" id="line-${x.id}">${money(x.price*state[x.id])}</div>`;
      wrap.appendChild(row);
    });
    services.appendChild(wrap);
  });
  if(!visible) services.innerHTML='<div class="empty">No se encontró ningún elemento.</div>';
  document.querySelectorAll('.qty').forEach(inp=>inp.oninput=e=>{
    state[+e.target.dataset.i]=Math.max(0,Math.floor(Number(e.target.value)||0));
    e.target.value=state[+e.target.dataset.i];
    update();
  });
  update();
}

function update(){
  let total=0;
  SERVICES.forEach(x=>{
    total += x.price*state[x.id];
    const el=document.getElementById('line-'+x.id);
    if(el) el.textContent=money(x.price*state[x.id]);
  });
  document.getElementById('grand').textContent=money(total);
  document.getElementById('d5').textContent=money(total*.95);
  document.getElementById('d10').textContent=money(total*.90);
  document.getElementById('d15').textContent=money(total*.85);
}
function reset(){state.fill(0);render(document.getElementById('search').value)}
document.getElementById('search').oninput=e=>render(e.target.value);
document.getElementById('clear').onclick=reset;
document.getElementById('reset').onclick=reset;
document.getElementById('copy').onclick=async()=>{
  const t=document.getElementById('grand').textContent;
  try{await navigator.clipboard.writeText(t)}catch{}
  show('Monto copiado: '+t);
};
function show(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1600)}
document.getElementById('packages').innerHTML=PACKAGES.map(p=>`<div class="package"><div><strong>${p.name}</strong><small>${p.detail}</small></div><b>${money(p.price)}</b></div>`).join('');
render();
