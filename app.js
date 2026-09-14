const SERVICES=[
['RENDIMIENTO','Rendimiento','Mejoras de rendimiento',0],
['PINTURA','Pintura','Pintura del vehículo',0],
['COSMÉTICOS','Cosméticos','Modificaciones cosméticas',0],
['RUEDAS','Ruedas','Cambio / modificación de ruedas',0],
['KIT DE HUMOS','Kit de humos','Instalación de kit de humos',0],
['MOTORES','Motor V8','Motor V8',50000],
['MOTORES','Motor V12','Motor V12',500000],
['TURBO CHARGER','Turbo Charger','Turbo Charger',25000],
['TRACCIONES','Tracción AWD','Sistema de tracción',13000],
['NEUMÁTICOS','Neumáticos','Neumáticos',0],
['STANCE','Stance','Ajuste de stance',0],
['NITRO','Nitro','Sistema de nitro',0],
['NITRO','Botella de Nitro','Botella de Nitro',0]
].map((x,i)=>({id:i,category:x[0],name:x[1],detail:x[2],price:x[3]}));
const PACKAGES=[{name:'FULL TUNING V8',price:115000,detail:'Motor V8 + Turbo Charger + mejoras del paquete'},{name:'FULL TUNING V12',price:575000,detail:'Motor V12 + Turbo Charger + mejoras del paquete'}];
const state=Array(SERVICES.length).fill(0);const money=n=>'$'+new Intl.NumberFormat('es-ES').format(n);
const services=document.getElementById('services');
function render(filter=''){services.innerHTML='';const q=filter.toLowerCase().trim();let visible=0;[...new Set(SERVICES.map(x=>x.category))].forEach(cat=>{const list=SERVICES.filter(x=>x.category===cat&&(`${x.name} ${x.detail} ${x.category}`).toLowerCase().includes(q));if(!list.length)return;visible+=list.length;const wrap=document.createElement('div');wrap.className='category';wrap.innerHTML=`<div class="cat-title">${cat}</div>`;list.forEach(x=>{const row=document.createElement('div');row.className='service';row.innerHTML=`<div class="service-name"><strong>${x.name}</strong><small>${x.detail}</small></div><input class="qty" type="number" min="0" step="1" value="${state[x.id]}" data-i="${x.id}"><div class="price">${x.price?money(x.price):'Por configurar'}</div><div class="price line-total" id="line-${x.id}">${money(x.price*state[x.id])}</div>`;wrap.appendChild(row)});services.appendChild(wrap)});if(!visible)services.innerHTML='<div class="empty">No se encontró ningún elemento.</div>';document.querySelectorAll('.qty').forEach(inp=>inp.oninput=e=>{state[+e.target.dataset.i]=Math.max(0,Math.floor(Number(e.target.value)||0));e.target.value=state[+e.target.dataset.i];update()});update()}
function update(){let total=0;SERVICES.forEach(x=>{total+=x.price*state[x.id];const el=document.getElementById('line-'+x.id);if(el)el.textContent=money(x.price*state[x.id])});document.getElementById('grand').textContent=money(total);document.getElementById('d5').textContent=money(total*.95);document.getElementById('d10').textContent=money(total*.9);document.getElementById('d15').textContent=money(total*.85)}
function reset(){state.fill(0);render(document.getElementById('search').value)}
document.getElementById('search').oninput=e=>render(e.target.value);document.getElementById('clear').onclick=reset;document.getElementById('reset').onclick=reset;document.getElementById('copy').onclick=async()=>{const t=document.getElementById('grand').textContent;try{await navigator.clipboard.writeText(t)}catch{}show('Monto copiado: '+t)};function show(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1600)}
document.getElementById('packages').innerHTML=PACKAGES.map(p=>`<div class="package"><div><strong>${p.name}</strong><small>${p.detail}</small></div><b>${money(p.price)}</b></div>`).join('');render();
