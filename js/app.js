/* =====================================================================
   ASSETLINE — client-side prototype (in-memory data, no persistence)
   ===================================================================== */

/* ---------- ROLES ---------- */
const ROLES = [
  {id:'admin',  label:'Platform Admin',  init:'PA'},
  {id:'owner',  label:'Asset Owner',     init:'AO'},
  {id:'renter', label:'Verified Renter', init:'VR'},
  {id:'inspector', label:'Inspector',    init:'IN'},
  {id:'finance',label:'Finance Manager', init:'FM'},
];

const NAV = [
  {group:'Marketplace', items:[
    {id:'marketplace', label:'Browse Assets', ic:'⌂', roles:['admin','owner','renter','inspector','finance']},
  ]},
  {group:'Owner tools', items:[
    {id:'listings', label:'Listings', ic:'▦', roles:['admin','owner']},
    {id:'calendar', label:'Calendar & Pricing', ic:'▤', roles:['admin','owner']},
  ]},
  {group:'Rental lifecycle', items:[
    {id:'bookings', label:'Bookings', ic:'✎', roles:['admin','owner','renter']},
    {id:'deposits', label:'Deposits & Escrow', ic:'◈', roles:['admin','owner','finance']},
    {id:'inspections', label:'Condition & Inspection', ic:'◫', roles:['admin','owner','inspector','renter']},
    {id:'penalties', label:'Late Returns & Penalties', ic:'◷', roles:['admin','owner','finance']},
  ]},
  {group:'Trust & insight', items:[
    {id:'reviews', label:'Reviews & Trust Score', ic:'★', roles:['admin','owner','renter']},
    {id:'analytics', label:'Revenue & Analytics', ic:'▥', roles:['admin','owner','finance']},
  ]},
  {group:'Administration', items:[
    {id:'roles', label:'Roles & Permissions', ic:'⚿', roles:['admin']},
    {id:'activity', label:'Activity Log', ic:'≡', roles:['admin','finance']},
  ]},
];

const PAGE_META = {
  marketplace:{title:'Marketplace', caption:'Browse assets available to book'},
  listings:{title:'Listings', caption:'Manage the assets you list for rent'},
  calendar:{title:'Calendar & Pricing', caption:'Availability windows, blackout dates and rate tiers'},
  bookings:{title:'Bookings', caption:'Requests, confirmations and active reservations'},
  deposits:{title:'Deposits & Escrow', caption:'Damage deposit capture, hold and release ledger'},
  inspections:{title:'Condition & Inspection', caption:'Pre- and post-rental condition reports'},
  penalties:{title:'Late Returns & Penalties', caption:'Return deadlines, overstay fees and disputes'},
  reviews:{title:'Reviews & Trust Score', caption:'Mutual reviews and composite trust ratings'},
  analytics:{title:'Revenue & Analytics', caption:'Utilization, revenue and payout reporting'},
  roles:{title:'Roles & Permissions', caption:'Define access by role and booking time-window'},
  activity:{title:'Activity Log', caption:'Full audit trail of every lifecycle event'},
};

/* ---------- MOCK DATA ---------- */
let state = {
  role: 'admin',
  view: 'marketplace',
  assetFilter: 'all',
  bookingTab: 'requested',
  selectedAssetId: 'AST-1042',
  calMonth: 8, calYear: 2026, // Sept 2026 (0-index month =8)  loggedIn: false,
  authMode: 'login',};

const assets = [
  {id:'AST-1042', name:'Ford Transit Cargo Van', type:'Vehicle', owner:'M. Sok', grade:'A', rate:68, period:'day', status:'approved', verified:true, emoji:'🚐', image:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80', blocked:[3,4,5,17,18], booked:[10,11,12]},
  {id:'AST-2091', name:'Canon R5 Camera Kit', type:'Equipment', owner:'L. Chan', grade:'A-', rate:32, period:'day', status:'approved', verified:true, emoji:'📷', image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', blocked:[1,2], booked:[8,9]},
  {id:'AST-3310', name:'Riverside Event Pavilion', type:'Property', owner:'D. Meas', grade:'B+', rate:410, period:'day', status:'approved', verified:true, emoji:'🏛️', image:'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80', blocked:[20,21,22], booked:[]},
  {id:'AST-4177', name:'Bobcat Mini Excavator', type:'Equipment', owner:'S. Vann', grade:'B', rate:145, period:'day', status:'pending', verified:false, emoji:'🚜', image:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80', blocked:[], booked:[]},
  {id:'AST-5528', name:'Toyota Hiace 12-seat', type:'Vehicle', owner:'M. Sok', grade:'A', rate:55, period:'day', status:'approved', verified:true, emoji:'🚌', image:'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80', blocked:[6], booked:[14,15]},
  {id:'AST-6650', name:'Downtown Studio Loft', type:'Property', owner:'P. Ratana', grade:'A', rate:95, period:'day', status:'approved', verified:true, emoji:'🏠', image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', blocked:[], booked:[2,3]},
  {id:'AST-7002', name:'DJI Ronin Gimbal Rig', type:'Equipment', owner:'L. Chan', grade:'A-', rate:24, period:'day', status:'draft', verified:false, emoji:'🎥', image:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80', blocked:[], booked:[]},
];

const bookings = [
  {id:'BK-8841', assetId:'AST-1042', asset:'Ford Transit Cargo Van', renter:'K. Sreyleak', start:'2026-09-22', end:'2026-09-25', total:204, deposit:150, status:'requested'},
  {id:'BK-8842', assetId:'AST-2091', asset:'Canon R5 Camera Kit', renter:'T. Dara', start:'2026-09-19', end:'2026-09-21', total:64, deposit:200, status:'accepted'},
  {id:'BK-8839', assetId:'AST-6650', asset:'Downtown Studio Loft', renter:'J. Kong', start:'2026-09-15', end:'2026-09-18', total:285, deposit:120, status:'active'},
  {id:'BK-8830', assetId:'AST-5528', asset:'Toyota Hiace 12-seat', renter:'N. Bopha', start:'2026-09-10', end:'2026-09-12', total:110, deposit:180, status:'completed'},
  {id:'BK-8825', assetId:'AST-3310', asset:'Riverside Event Pavilion', renter:'Angkor Events Co.', start:'2026-09-05', end:'2026-09-06', total:410, deposit:500, status:'completed'},
  {id:'BK-8818', assetId:'AST-1042', asset:'Ford Transit Cargo Van', renter:'R. Chetra', start:'2026-08-28', end:'2026-08-30', total:136, deposit:150, status:'cancelled'},
  {id:'BK-8844', assetId:'AST-6650', asset:'Downtown Studio Loft', renter:'S. Pisey', start:'2026-09-24', end:'2026-09-26', total:190, deposit:120, status:'requested'},
];

const deposits = [
  {id:'DEP-501', bookingId:'BK-8839', renter:'J. Kong', amount:120, status:'held'},
  {id:'DEP-502', bookingId:'BK-8830', renter:'N. Bopha', amount:180, status:'released', deducted:0},
  {id:'DEP-503', bookingId:'BK-8825', renter:'Angkor Events Co.', amount:500, status:'deducted', deducted:85, reason:'Stage rigging scuff — repaint'},
  {id:'DEP-504', bookingId:'BK-8818', renter:'R. Chetra', amount:150, status:'refunded'},
  {id:'DEP-505', bookingId:'BK-8842', renter:'T. Dara', amount:200, status:'held'},
];

const inspections = [
  {id:'INS-201', bookingId:'BK-8839', asset:'Downtown Studio Loft', stage:'pre', inspector:'Self-reported', items:[
    {name:'Wall paint', sev:'low', note:'Minor scuff near entry, pre-existing'},
    {name:'Flooring', sev:'low', note:'Clean, no marks'},
  ], ownerSigned:true, renterSigned:true},
  {id:'INS-202', bookingId:'BK-8825', asset:'Riverside Event Pavilion', stage:'post', inspector:'C. Sothy', items:[
    {name:'Stage rigging', sev:'med', note:'Scuff mark on left truss, needs repaint'},
    {name:'Sound booth', sev:'low', note:'No damage found'},
    {name:'Parking gate', sev:'high', note:'Bent hinge — quoting replacement'},
  ], ownerSigned:true, renterSigned:false},
  {id:'INS-203', bookingId:'BK-8842', asset:'Canon R5 Camera Kit', stage:'pre', inspector:'Self-reported', items:[
    {name:'Lens glass', sev:'low', note:'No scratches'},
    {name:'Body housing', sev:'low', note:'Light wear on grip, logged'},
  ], ownerSigned:true, renterSigned:true},
];

const penalties = [
  {id:'PEN-11', bookingId:'BK-8830', asset:'Toyota Hiace 12-seat', renter:'N. Bopha', dueBack:'2026-09-12 18:00', returned:'2026-09-12 21:40', hoursLate:3.7, rate:8, amount:30, status:'paid'},
  {id:'PEN-12', bookingId:'BK-8839', asset:'Downtown Studio Loft', renter:'J. Kong', dueBack:'2026-09-18 12:00', returned:null, hoursLate:0, rate:12, amount:0, status:'active'},
  {id:'PEN-13', bookingId:'BK-8818', asset:'Ford Transit Cargo Van', renter:'R. Chetra', dueBack:'2026-08-30 09:00', returned:'2026-08-31 08:15', hoursLate:23.2, rate:8, amount:185, status:'disputed'},
];

const reviews = [
  {id:'RV-90', bookingId:'BK-8830', from:'N. Bopha', to:'M. Sok (owner)', rating:5, comment:'Van was spotless and pickup was quick.', flagged:false},
  {id:'RV-91', bookingId:'BK-8830', from:'M. Sok (owner)', to:'N. Bopha', rating:4, comment:'Returned a little late but kept me posted.', flagged:false},
  {id:'RV-92', bookingId:'BK-8818', from:'M. Sok (owner)', to:'R. Chetra', rating:2, comment:'Nearly a full day late with no notice.', flagged:false},
  {id:'RV-93', bookingId:'BK-8825', from:'Angkor Events Co.', to:'D. Meas (owner)', rating:3, comment:'Great venue, gate lock was stiff.', flagged:true},
];

const trustScores = [
  {name:'M. Sok', role:'Owner', score:96},
  {name:'N. Bopha', role:'Renter', score:88},
  {name:'R. Chetra', role:'Renter', score:52},
  {name:'D. Meas', role:'Owner', score:91},
];

let activityLog = [
  {ts:'2026-09-17 09:14', user:'K. Sreyleak', action:'Booking requested', target:'BK-8841', cat:'booking'},
  {ts:'2026-09-17 08:51', user:'Finance bot', action:'Deposit held', target:'DEP-505', cat:'deposit'},
  {ts:'2026-09-16 19:22', user:'C. Sothy', action:'Inspection signed off (owner)', target:'INS-202', cat:'inspection'},
  {ts:'2026-09-16 14:03', user:'System', action:'Late penalty calculated', target:'PEN-13', cat:'penalty'},
  {ts:'2026-09-15 11:40', user:'D. Meas', action:'Deposit deducted', target:'DEP-503', cat:'deposit'},
  {ts:'2026-09-14 10:02', user:'S. Vann', action:'Listing submitted for approval', target:'AST-4177', cat:'listing'},
  {ts:'2026-09-12 21:41', user:'N. Bopha', action:'Vehicle returned', target:'BK-8830', cat:'booking'},
  {ts:'2026-09-10 07:30', user:'Admin', action:'Role permission updated', target:'Inspector', cat:'role'},
];

const permissionMatrix = {
  rows:['View asset listings','Create / edit listings','Approve listings','Manage availability & pricing','Create booking request','Accept / reject booking','Capture & release deposit','Deduct damage from deposit','Create inspection report','Sign off inspection','Issue penalty invoice','View analytics & payouts','Manage roles & permissions'],
  cols:['admin','owner','renter','inspector','finance'],
  grid:[
    [1,1,1,1,1],[0,1,0,0,0],[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],
    [0,1,0,0,0],[1,0,0,0,1],[1,1,0,0,1],[1,1,1,1,0],[0,1,1,1,0],
    [1,0,0,0,1],[1,1,0,0,1],[1,0,0,0,0],
  ]
};

/* ---------- HELPERS ---------- */
const $ = sel => document.querySelector(sel);
const el = (html) => { const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
const fmt = n => '$'+n.toLocaleString();

function toast(msg){
  const t = el(`<div class="toast">✓ ${msg}</div>`);
  $('#toastWrap').appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(6px)'; t.style.transition='all .25s'; setTimeout(()=>t.remove(),250); }, 2400);
}
function logActivity(user, action, target, cat){
  activityLog.unshift({ts:'2026-09-17 '+new Date().toTimeString().slice(0,5), user, action, target, cat});
}
function statusBadge(status){
  const map = {
    approved:'b-green', pending:'b-amber', draft:'b-muted', rejected:'b-red',
    requested:'b-amber', accepted:'b-navy', active:'b-navy', completed:'b-green', cancelled:'b-red',
    held:'b-navy', released:'b-green', deducted:'b-amber', refunded:'b-green',
    paid:'b-green', disputed:'b-red',
  };
  return `<span class="badge ${map[status]||'b-muted'}">${status[0].toUpperCase()+status.slice(1)}</span>`;
}
function closeModal(){ $('#overlay').classList.remove('open'); $('#modalHost').innerHTML=''; }
function openModal(html){ $('#modalHost').innerHTML = html; $('#overlay').classList.add('open'); }
$('#overlay').addEventListener('click', e=>{ if(e.target.id==='overlay') closeModal(); });

/* ---------- SIDEBAR / NAV RENDER ---------- */
function canSee(item){ return item.roles.includes(state.role); }

function renderNav(){
  const host = $('#navHost');
  host.innerHTML = '';
  NAV.forEach(group=>{
    const visible = group.items.filter(canSee);
    if(!visible.length) return;
    const g = el(`<div class="nav-group"><div class="nav-group-title">${group.group}</div></div>`);
    visible.forEach(item=>{
      const btn = el(`<button class="nav-item ${state.view===item.id?'active':''}">
        <span class="ic">${item.ic}</span><span>${item.label}</span>
      </button>`);
      btn.addEventListener('click', ()=> navigate(item.id));
      g.appendChild(btn);
    });
    host.appendChild(g);
  });
}

function navigate(view){
  state.view = view;
  const meta = PAGE_META[view];
  $('#pageTitle').textContent = meta.title;
  $('#pageCaption').textContent = meta.caption;
  renderNav();
  render();
  $('#sidebar').classList.remove('open');
  window.scrollTo(0,0);
}

/* ---------- ROLE SWITCHER ---------- */
function renderRoleMenu(){
  const menu = $('#roleMenu');
  menu.innerHTML = ROLES.map(r=>`<button data-r="${r.id}" class="${state.role===r.id?'sel':''}">${r.label}</button>`).join('');
  menu.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{
      state.role = b.dataset.r;
      const r = ROLES.find(x=>x.id===state.role);
      $('#roleAvatar').textContent = r.init;
      $('#roleLabel').textContent = r.label;
      $('#footRole').textContent = r.label;
      menu.classList.remove('open');
      // if current view not allowed for new role, fall back to marketplace
      const flatIds = NAV.flatMap(g=>g.items);
      const currentItem = flatIds.find(i=>i.id===state.view);
      if(!currentItem || !canSee(currentItem)) { navigate('marketplace'); }
      else { renderNav(); render(); }
      toast(`Switched to ${r.label} view`);
    });
  });
}
$('#rolePill').addEventListener('click', ()=> $('#roleMenu').classList.toggle('open'));
document.addEventListener('click', e=>{ if(!e.target.closest('.role-switch')) $('#roleMenu').classList.remove('open'); });
$('#menuBtn').addEventListener('click', ()=> $('#sidebar').classList.toggle('open'));

/* =====================================================================
   VIEW RENDERERS
   ===================================================================== */
function render(){
  const c = $('#content');
  c.innerHTML = '';
  const fn = {
    marketplace: renderMarketplace,
    listings: renderListings,
    calendar: renderCalendar,
    bookings: renderBookings,
    deposits: renderDeposits,
    inspections: renderInspections,
    penalties: renderPenalties,
    reviews: renderReviews,
    analytics: renderAnalytics,
    roles: renderRoles,
    activity: renderActivity,
  }[state.view];
  fn(c);
}

/* ---------- 1. MARKETPLACE ---------- */
function renderMarketplace(c){
  const types = ['all','Vehicle','Equipment','Property'];
  const toolbar = el(`<div class="toolbar">
    <div class="chip-group" id="typeChips">
      ${types.map(t=>`<button class="chip ${state.assetFilter===t?'active':''}" data-t="${t}">${t==='all'?'All assets':t+'s'}</button>`).join('')}
    </div>
    <span style="margin-left:auto;font-size:12px;color:var(--muted)">Only approved, insured listings shown to renters</span>
  </div>`);
  c.appendChild(toolbar);
  toolbar.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{ state.assetFilter = chip.dataset.t; render(); });
  });

  const list = assets.filter(a=> a.status==='approved' && (state.assetFilter==='all' || a.type===state.assetFilter));
  const grid = el(`<div class="grid g-4" id="assetGrid"></div>`);
  c.appendChild(grid);
  if(!list.length){ grid.replaceWith(el(`<div class="empty-state"><div class="em">🗂️</div>No assets match this filter yet.</div>`)); return; }

  list.forEach(a=>{
    const card = el(`<div class="asset-card">
      <div class="asset-thumb">
        <img src="${a.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'}" alt="${a.name}" loading="lazy">
        <span class="grade">Grade ${a.grade}</span>
      </div>
      <div class="asset-body">
        <div>
          <div class="asset-name">${a.name}</div>
          <div class="asset-meta">${a.type} · <span class="plate">${a.id}</span> ${a.verified?'· ✅ Verified owner':''}</div>
        </div>
        <div class="asset-price">
          <div><b>${fmt(a.rate)}</b><span> / ${a.period}</span></div>
          <button class="btn btn-primary btn-sm" data-book="${a.id}">Book</button>
        </div>
      </div>
    </div>`);
    grid.appendChild(card);
  });
  grid.querySelectorAll('[data-book]').forEach(btn=>{
    btn.addEventListener('click', ()=> openBookingModal(btn.dataset.book));
  });
}

function openBookingModal(assetId){
  const a = assets.find(x=>x.id===assetId);
  openModal(`
    <div class="modal-h"><span class="modal-title">Request to book</span><button class="modal-x" id="mClose">×</button></div>
    <div class="section-note">${a.name} · ${a.id} · ${fmt(a.rate)}/${a.period}</div>
    <div class="row2">
      <div class="field"><label>Start date</label><input type="date" id="bkStart" value="2026-09-22"></div>
      <div class="field"><label>End date</label><input type="date" id="bkEnd" value="2026-09-24"></div>
    </div>
    <div class="field"><label>Note to owner (optional)</label><textarea placeholder="Pickup time, intended use, etc."></textarea></div>
    <div class="field"><label>Damage deposit due at confirmation</label><input value="${fmt(Math.round(a.rate*1.8))}" disabled></div>
    <div class="modal-foot">
      <button class="btn" id="mCancel">Cancel</button>
      <button class="btn btn-primary" id="mSend">Send request</button>
    </div>
  `);
  $('#mClose').onclick = $('#mCancel').onclick = closeModal;
  $('#mSend').onclick = ()=>{
    const id = 'BK-'+(8800+bookings.length+50);
    bookings.unshift({id, assetId:a.id, asset:a.name, renter:'You (Verified Renter)', start:$('#bkStart').value, end:$('#bkEnd').value, total:a.rate*2, deposit:Math.round(a.rate*1.8), status:'requested'});
    logActivity('You','Booking requested',id,'booking');
    closeModal();
    toast('Booking request sent to owner');
    navigate('bookings');
  };
}

/* ---------- 2. LISTINGS ---------- */
function renderListings(c){
  c.appendChild(el(`<div class="toolbar">
      <button class="btn btn-primary" id="newListing">+ New listing</button>
      <span style="margin-left:auto;font-size:12px;color:var(--muted)">${assets.length} listings total</span>
    </div>`));
  $('#newListing').addEventListener('click', ()=> openListingModal());

  const wrap = el(`<div class="card"><div class="tbl-wrap"><table>
    <thead><tr><th>Asset</th><th>Type</th><th>Owner</th><th>Grade</th><th>Rate</th><th>Insurance</th><th>Status</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  c.appendChild(wrap);
  const tbody = wrap.querySelector('tbody');
  assets.forEach(a=>{
    const tr = el(`<tr class="tbl-row">
      <td><span class="plate">${a.id}</span> &nbsp;${a.name}</td>
      <td>${a.type}</td><td>${a.owner}</td><td>${a.grade}</td>
      <td>${fmt(a.rate)}/${a.period}</td>
      <td>${a.verified? '📄 On file':'⚠️ Missing'}</td>
      <td>${statusBadge(a.status)}</td>
      <td style="text-align:right;white-space:nowrap;">
        ${a.status==='draft'?`<button class="btn btn-sm" data-submit="${a.id}">Submit</button>`:''}
        <button class="btn btn-sm" data-edit="${a.id}">Edit</button>
        <button class="btn btn-sm btn-danger" data-del="${a.id}">Delete</button>
      </td>
    </tr>`);
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>openListingModal(b.dataset.edit)));
  tbody.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{
    const i = assets.findIndex(a=>a.id===b.dataset.del);
    logActivity('You','Listing deleted',b.dataset.del,'listing');
    assets.splice(i,1); toast('Listing deleted'); render();
  }));
  tbody.querySelectorAll('[data-submit]').forEach(b=>b.addEventListener('click',()=>{
    const a = assets.find(x=>x.id===b.dataset.submit);
    a.status='pending';
    logActivity('You','Listing submitted for approval',a.id,'listing');
    toast('Submitted for admin approval'); render();
  }));
}

function openListingModal(id){
  const a = id ? assets.find(x=>x.id===id) : null;
  openModal(`
    <div class="modal-h"><span class="modal-title">${a?'Edit listing':'New listing'}</span><button class="modal-x" id="mClose">×</button></div>
    <div class="field"><label>Asset name</label><input id="lName" value="${a?a.name:''}" placeholder="e.g. Ford Transit Cargo Van"></div>
    <div class="row2">
      <div class="field"><label>Type</label><select id="lType">
        ${['Vehicle','Equipment','Property'].map(t=>`<option ${a&&a.type===t?'selected':''}>${t}</option>`).join('')}
      </select></div>
      <div class="field"><label>Condition grade</label><select id="lGrade">
        ${['A','A-','B+','B','C'].map(g=>`<option ${a&&a.grade===g?'selected':''}>${g}</option>`).join('')}
      </select></div>
    </div>
    <div class="row2">
      <div class="field"><label>Rate</label><input id="lRate" type="number" value="${a?a.rate:''}" placeholder="e.g. 65"></div>
      <div class="field"><label>Period</label><select id="lPeriod">
        ${['day','week','month'].map(p=>`<option ${a&&a.period===p?'selected':''}>${p}</option>`).join('')}
      </select></div>
    </div>
    <div class="field"><label>Insurance document</label><input type="file"></div>
    <div class="field"><label>Photos</label><input type="file" multiple></div>
    <div class="modal-foot">
      <button class="btn" id="mCancel">Cancel</button>
      <button class="btn btn-primary" id="mSave">Save as draft</button>
    </div>
  `);
  $('#mClose').onclick = $('#mCancel').onclick = closeModal;
  $('#mSave').onclick = ()=>{
    const name = $('#lName').value.trim() || 'Untitled asset';
    const type = $('#lType').value, grade = $('#lGrade').value, rate = Number($('#lRate').value)||0, period=$('#lPeriod').value;
    if(a){ Object.assign(a,{name,type,grade,rate,period}); logActivity('You','Listing updated',a.id,'listing'); toast('Listing updated'); }
    else {
      const id = 'AST-'+(1000+Math.floor(Math.random()*8999));
      assets.push({id,name,type,owner:'You',grade,rate,period,status:'draft',verified:false,emoji:{Vehicle:'🚚',Equipment:'🛠️',Property:'🏢'}[type],blocked:[],booked:[]});
      logActivity('You','Listing created',id,'listing'); toast('Draft listing created');
    }
    closeModal(); render();
  };
}

/* ---------- 3. CALENDAR & PRICING ---------- */
function renderCalendar(c){
  const wrap = el(`<div class="cal-wrap">
    <div class="asset-pick" id="assetPick"></div>
    <div>
      <div class="card" id="calCard"></div>
      <div class="card" style="margin-top:16px;">
        <div class="card-title" style="margin-bottom:12px;">Pricing tiers</div>
        <div class="grid g-3">
          <div class="stat-card"><div class="stat-label">Daily rate</div><div class="stat-value" id="rDay">—</div></div>
          <div class="stat-card"><div class="stat-label">Weekly (−12%)</div><div class="stat-value" id="rWeek">—</div></div>
          <div class="stat-card"><div class="stat-label">Monthly (−25%)</div><div class="stat-value" id="rMonth">—</div></div>
        </div>
        <div class="section-note" style="margin-top:14px;">Instant booking is on for stays under 3 days; longer stays require owner approval.</div>
      </div>
    </div>
  </div>`);
  c.appendChild(wrap);

  const pick = wrap.querySelector('#assetPick');
  assets.forEach(a=>{
    const item = el(`<div class="asset-pick-item ${state.selectedAssetId===a.id?'active':''}">${a.emoji} ${a.name}<div style="font-size:11px;color:var(--muted)">${a.id}</div></div>`);
    item.addEventListener('click', ()=>{ state.selectedAssetId = a.id; render(); });
    pick.appendChild(item);
  });

  const a = assets.find(x=>x.id===state.selectedAssetId) || assets[0];
  $('#rDay') && ($('#rDay').textContent = fmt(a.rate));
  $('#rWeek').textContent = fmt(Math.round(a.rate*7*0.88));
  $('#rMonth').textContent = fmt(Math.round(a.rate*30*0.75));

  const calCard = wrap.querySelector('#calCard');
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(state.calYear, state.calMonth+1, 0).getDate();
  const firstDow = new Date(state.calYear, state.calMonth, 1).getDay();

  calCard.innerHTML = `<div class="cal-head">
      <button class="btn btn-sm" id="calPrev">‹</button>
      <div class="card-title">${monthNames[state.calMonth]} ${state.calYear} — ${a.name}</div>
      <button class="btn btn-sm" id="calNext">›</button>
    </div>
    <div class="cal-grid" id="calGrid"></div>
    <div class="legend">
      <span><i style="background:var(--surface);border:1px solid var(--line);"></i>Open</span>
      <span><i style="background:var(--navy-100);"></i>Booked</span>
      <span><i style="background:var(--red-bg);"></i>Blocked</span>
    </div>`;
  calCard.querySelector('#calPrev').onclick=()=>{ state.calMonth--; if(state.calMonth<0){state.calMonth=11;state.calYear--;} render(); };
  calCard.querySelector('#calNext').onclick=()=>{ state.calMonth++; if(state.calMonth>11){state.calMonth=0;state.calYear++;} render(); };

  const grid = calCard.querySelector('#calGrid');
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=> grid.appendChild(el(`<div class="cal-dow">${d}</div>`)));
  for(let i=0;i<firstDow;i++) grid.appendChild(el(`<div class="cal-cell empty"></div>`));
  for(let d=1; d<=daysInMonth; d++){
    let cls='';
    if(a.blocked.includes(d)) cls='blocked'; else if(a.booked.includes(d)) cls='booked';
    const cell = el(`<div class="cal-cell ${cls}"><span class="d">${d}</span><span class="tag">${cls==='blocked'?'Blocked':cls==='booked'?'Booked':''}</span></div>`);
    cell.addEventListener('click', ()=>{
      if(a.booked.includes(d)){ toast('Day already booked — cancel the reservation first'); return; }
      const idx = a.blocked.indexOf(d);
      if(idx>-1){ a.blocked.splice(idx,1); logActivity('You','Date unblocked',`${a.id} · day ${d}`,'listing'); }
      else { a.blocked.push(d); logActivity('You','Date blocked',`${a.id} · day ${d}`,'listing'); }
      render();
    });
    grid.appendChild(cell);
  }
}

/* ---------- 4. BOOKINGS ---------- */
function renderBookings(c){
  const tabs = ['requested','accepted','active','completed','cancelled'];
  const toolbar = el(`<div class="toolbar"><div class="chip-group">
    ${tabs.map(t=>`<button class="chip ${state.bookingTab===t?'active':''}" data-t="${t}">${t[0].toUpperCase()+t.slice(1)} (${bookings.filter(b=>b.status===t).length})</button>`).join('')}
  </div></div>`);
  c.appendChild(toolbar);
  toolbar.querySelectorAll('.chip').forEach(chip=> chip.addEventListener('click',()=>{ state.bookingTab=chip.dataset.t; render(); }));

  const list = bookings.filter(b=>b.status===state.bookingTab);
  if(!list.length){ c.appendChild(el(`<div class="empty-state"><div class="em">📭</div>No ${state.bookingTab} bookings right now.</div>`)); return; }

  const wrap = el(`<div class="card"><div class="tbl-wrap"><table>
    <thead><tr><th>Booking</th><th>Asset</th><th>Renter</th><th>Dates</th><th>Total</th><th>Deposit</th><th>Status</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  c.appendChild(wrap);
  const tbody = wrap.querySelector('tbody');
  list.forEach(b=>{
    const tr = el(`<tr class="tbl-row">
      <td><span class="plate">${b.id}</span></td>
      <td>${b.asset}</td>
      <td><span class="avatar-sm">${b.renter.slice(0,1)}</span>${b.renter}</td>
      <td>${b.start} → ${b.end}</td>
      <td>${fmt(b.total)}</td><td>${fmt(b.deposit)}</td>
      <td>${statusBadge(b.status)}</td>
      <td style="text-align:right;white-space:nowrap;">
        ${b.status==='requested'?`<button class="btn btn-sm btn-primary" data-acc="${b.id}">Accept</button><button class="btn btn-sm btn-danger" data-rej="${b.id}">Reject</button>`:''}
        ${b.status==='accepted'?`<button class="btn btn-sm" data-start="${b.id}">Mark active</button>`:''}
        ${b.status==='active'?`<button class="btn btn-sm" data-complete="${b.id}">Mark returned</button>`:''}
      </td>
    </tr>`);
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-acc]').forEach(b=>b.addEventListener('click',()=>{
    const bk = bookings.find(x=>x.id===b.dataset.acc); bk.status='accepted';
    deposits.push({id:'DEP-'+Math.floor(500+Math.random()*400), bookingId:bk.id, renter:bk.renter, amount:bk.deposit, status:'held'});
    logActivity('You','Booking accepted',bk.id,'booking'); toast('Booking accepted · deposit capture triggered'); render();
  }));
  tbody.querySelectorAll('[data-rej]').forEach(b=>b.addEventListener('click',()=>{
    const bk = bookings.find(x=>x.id===b.dataset.rej); bk.status='cancelled';
    logActivity('You','Booking rejected',bk.id,'booking'); toast('Booking rejected'); render();
  }));
  tbody.querySelectorAll('[data-start]').forEach(b=>b.addEventListener('click',()=>{
    const bk = bookings.find(x=>x.id===b.dataset.start); bk.status='active';
    logActivity('You','Rental started',bk.id,'booking'); toast('Rental marked active'); render();
  }));
  tbody.querySelectorAll('[data-complete]').forEach(b=>b.addEventListener('click',()=>{
    const bk = bookings.find(x=>x.id===b.dataset.complete); bk.status='completed';
    const dep = deposits.find(d=>d.bookingId===bk.id); if(dep) dep.status='released';
    logActivity('You','Rental completed / returned',bk.id,'booking'); toast('Return logged · deposit released'); render();
  }));
}

/* ---------- 5. DEPOSITS ---------- */
function renderDeposits(c){
  const held = deposits.filter(d=>d.status==='held').reduce((s,d)=>s+d.amount,0);
  const released = deposits.filter(d=>d.status==='released'||d.status==='refunded').reduce((s,d)=>s+d.amount,0);
  const deducted = deposits.filter(d=>d.status==='deducted').reduce((s,d)=>s+(d.deducted||0),0);
  c.appendChild(el(`<div class="grid g-3" style="margin-bottom:18px;">
    <div class="stat-card"><div class="stat-label">Currently held in escrow</div><div class="stat-value">${fmt(held)}</div></div>
    <div class="stat-card"><div class="stat-label">Released to renters</div><div class="stat-value">${fmt(released)}</div></div>
    <div class="stat-card"><div class="stat-label">Deducted for damage</div><div class="stat-value">${fmt(deducted)}</div></div>
  </div>`));

  const wrap = el(`<div class="card"><div class="tbl-wrap"><table>
    <thead><tr><th>Deposit</th><th>Booking</th><th>Renter</th><th>Amount</th><th>Status</th><th>Ledger</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  c.appendChild(wrap);
  const tbody = wrap.querySelector('tbody');
  deposits.forEach(d=>{
    const pct = d.status==='held'?45 : d.status==='deducted'? Math.round(((d.amount-d.deducted)/d.amount)*100) : 100;
    const tr = el(`<tr class="tbl-row">
      <td><span class="plate">${d.id}</span></td><td>${d.bookingId}</td><td>${d.renter}</td>
      <td>${fmt(d.amount)}${d.deducted?` <span style="color:var(--red);font-size:11.5px;">(−${fmt(d.deducted)})</span>`:''}</td>
      <td>${statusBadge(d.status)}</td>
      <td style="min-width:120px;"><div class="dep-bar"><i style="width:${pct}%"></i></div></td>
      <td style="text-align:right;white-space:nowrap;">
        ${d.status==='held'?`<button class="btn btn-sm btn-primary" data-rel="${d.id}">Release</button><button class="btn btn-sm btn-danger" data-ded="${d.id}">Deduct</button>`:''}
      </td>
    </tr>`);
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-rel]').forEach(b=>b.addEventListener('click',()=>{
    const d = deposits.find(x=>x.id===b.dataset.rel); d.status='released';
    logActivity('You','Deposit released',d.id,'deposit'); toast('Full deposit released'); render();
  }));
  tbody.querySelectorAll('[data-ded]').forEach(b=>b.addEventListener('click',()=>openDeductModal(b.dataset.ded)));
}

function openDeductModal(id){
  const d = deposits.find(x=>x.id===id);
  openModal(`
    <div class="modal-h"><span class="modal-title">Deduct for damage</span><button class="modal-x" id="mClose">×</button></div>
    <div class="section-note">${d.id} · held amount ${fmt(d.amount)}</div>
    <div class="field"><label>Deduction amount</label><input type="number" id="dAmt" placeholder="e.g. 45"></div>
    <div class="field"><label>Reason / evidence reference</label><textarea id="dReason" placeholder="Link to inspection report, photo evidence…"></textarea></div>
    <div class="modal-foot"><button class="btn" id="mCancel">Cancel</button><button class="btn btn-primary" id="mSave">Confirm deduction</button></div>
  `);
  $('#mClose').onclick = $('#mCancel').onclick = closeModal;
  $('#mSave').onclick = ()=>{
    const amt = Math.min(Number($('#dAmt').value)||0, d.amount);
    d.status='deducted'; d.deducted=amt; d.reason=$('#dReason').value;
    logActivity('You','Deposit deducted',d.id,'deposit'); toast(`${fmt(amt)} deducted, remainder refunded`); closeModal(); render();
  };
}

/* ---------- 6. INSPECTIONS ---------- */
function renderInspections(c){
  c.appendChild(el(`<div class="toolbar"><button class="btn btn-primary" id="newInsp">+ New condition report</button></div>`));
  $('#newInsp').addEventListener('click', openInspectionModal);

  const grid = el(`<div class="grid g-2" id="inspGrid"></div>`);
  c.appendChild(grid);
  inspections.forEach(ins=>{
    const card = el(`<div class="card">
      <div class="card-h">
        <div><div class="card-title" style="font-size:15px;">${ins.asset}</div>
        <div class="section-note" style="margin:2px 0 0;">${ins.bookingId} · ${ins.stage==='pre'?'Pre-rental report':'Post-rental report'} · Inspector: ${ins.inspector}</div></div>
        ${ins.ownerSigned && ins.renterSigned ? statusBadge('completed') : statusBadge('pending')}
      </div>
      <div>${ins.items.map(it=>`<div class="cond-item"><span class="sev-dot sev-${it.sev}"></span><div><b>${it.name}</b><div style="color:var(--muted);font-size:12px;">${it.note}</div></div></div>`).join('')}</div>
      <div class="toolbar" style="margin:14px 0 0;">
        <span class="badge ${ins.ownerSigned?'b-green':'b-muted'}">${ins.ownerSigned?'✓ Owner signed':'Owner pending'}</span>
        <span class="badge ${ins.renterSigned?'b-green':'b-muted'}">${ins.renterSigned?'✓ Renter signed':'Renter pending'}</span>
        ${!ins.renterSigned?`<button class="btn btn-sm btn-primary" style="margin-left:auto;" data-sign="${ins.id}">Sign as renter</button>`:''}
      </div>
    </div>`);
    grid.appendChild(card);
  });
  grid.querySelectorAll('[data-sign]').forEach(b=>b.addEventListener('click',()=>{
    const ins = inspections.find(x=>x.id===b.dataset.sign); ins.renterSigned=true;
    logActivity('You','Inspection signed off (renter)',ins.id,'inspection'); toast('Signed off'); render();
  }));
}

function openInspectionModal(){
  openModal(`
    <div class="modal-h"><span class="modal-title">New condition report</span><button class="modal-x" id="mClose">×</button></div>
    <div class="row2">
      <div class="field"><label>Booking</label><select id="iBooking">${bookings.map(b=>`<option value="${b.id}">${b.id} — ${b.asset}</option>`).join('')}</select></div>
      <div class="field"><label>Stage</label><select id="iStage"><option value="pre">Pre-rental</option><option value="post">Post-rental</option></select></div>
    </div>
    <div class="field"><label>Assign inspector (optional, for high-value assets)</label><input id="iInspector" placeholder="e.g. C. Sothy"></div>
    <div class="field"><label>Condition item</label><input id="iItem" placeholder="e.g. Rear bumper"></div>
    <div class="row2">
      <div class="field"><label>Severity</label><select id="iSev"><option value="low">Low</option><option value="med">Medium</option><option value="high">High</option></select></div>
      <div class="field"><label>Photo evidence</label><input type="file" multiple></div>
    </div>
    <div class="field"><label>Note</label><textarea id="iNote" placeholder="Describe the condition…"></textarea></div>
    <div class="modal-foot"><button class="btn" id="mCancel">Cancel</button><button class="btn btn-primary" id="mSave">Save report</button></div>
  `);
  $('#mClose').onclick = $('#mCancel').onclick = closeModal;
  $('#mSave').onclick = ()=>{
    const bkId = $('#iBooking').value; const bk = bookings.find(b=>b.id===bkId);
    const id = 'INS-'+(200+inspections.length+1);
    inspections.unshift({id, bookingId:bkId, asset:bk.asset, stage:$('#iStage').value, inspector:$('#iInspector').value||'Self-reported',
      items:[{name:$('#iItem').value||'General condition', sev:$('#iSev').value, note:$('#iNote').value||'No notes added'}], ownerSigned:true, renterSigned:false});
    logActivity('You','Condition report created',id,'inspection'); toast('Report saved'); closeModal(); render();
  };
}

/* ---------- 7. PENALTIES ---------- */
function renderPenalties(c){
  const wrap = el(`<div class="card"><div class="tbl-wrap"><table>
    <thead><tr><th>Booking</th><th>Asset</th><th>Renter</th><th>Due back</th><th>Returned</th><th>Hours late</th><th>Penalty</th><th>Status</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  c.appendChild(wrap);
  const tbody = wrap.querySelector('tbody');
  penalties.forEach(p=>{
    const tr = el(`<tr class="tbl-row">
      <td><span class="plate">${p.bookingId}</span></td><td>${p.asset}</td><td>${p.renter}</td>
      <td>${p.dueBack}</td><td>${p.returned||'—'}</td>
      <td>${p.hoursLate>0?p.hoursLate+' h':'On time'}</td>
      <td>${fmt(p.amount)} <span style="color:var(--muted);font-size:11px;">(${fmt(p.rate)}/hr, 1hr grace)</span></td>
      <td>${statusBadge(p.status)}</td>
      <td style="text-align:right;white-space:nowrap;">
        ${p.status==='active'?`<button class="btn btn-sm" data-nudge="${p.id}">Send reminder</button>`:''}
        ${p.status==='disputed'?`<button class="btn btn-sm btn-primary" data-resolve="${p.id}">Resolve dispute</button>`:''}
      </td>
    </tr>`);
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-nudge]').forEach(b=>b.addEventListener('click',()=>{ toast('Return reminder sent to renter'); logActivity('You','Return reminder sent',b.dataset.nudge,'penalty'); }));
  tbody.querySelectorAll('[data-resolve]').forEach(b=>b.addEventListener('click',()=>{
    const p = penalties.find(x=>x.id===b.dataset.resolve); p.status='paid';
    logActivity('You','Penalty dispute resolved',p.id,'penalty'); toast('Dispute resolved · penalty upheld'); render();
  }));

  const repeat = penalties.filter(p=>p.status==='disputed'||p.hoursLate>12);
  if(repeat.length){
    c.appendChild(el(`<div class="card" style="margin-top:16px;border-color:var(--red-bg);">
      <div class="card-title" style="font-size:15px;color:var(--red);">⚠ Repeat-offender watchlist</div>
      <div class="section-note" style="margin-top:6px;">${repeat.map(p=>p.renter).join(', ')} flagged for return-time violations exceeding policy thresholds.</div>
    </div>`));
  }
}

/* ---------- 8. REVIEWS ---------- */
function renderReviews(c){
  const grid = el(`<div class="grid g-2"></div>`);
  c.appendChild(grid);

  const reviewCard = el(`<div class="card"><div class="card-title" style="margin-bottom:12px;">Recent reviews</div></div>`);
  reviews.forEach(r=>{
    reviewCard.appendChild(el(`<div class="cond-item" style="align-items:flex-start;">
      <span class="avatar-sm" style="margin-top:2px;">${r.from.slice(0,1)}</span>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:13px;">${r.from} → ${r.to} ${r.flagged?'<span class=\"badge b-red\" style=\"margin-left:6px;\">Flagged</span>':''}</div>
        <div style="color:var(--amber);letter-spacing:1px;margin:2px 0;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        <div style="color:var(--muted);font-size:12.5px;">${r.comment}</div>
      </div>
    </div>`));
  });
  grid.appendChild(reviewCard);

  const trustCard = el(`<div class="card"><div class="card-title" style="margin-bottom:12px;">Composite trust scores</div></div>`);
  trustScores.forEach(t=>{
    trustCard.appendChild(el(`<div class="cond-item">
      <div class="gauge" style="--pct:${t.score}"><span>${t.score}</span></div>
      <div><b>${t.name}</b><div style="color:var(--muted);font-size:12px;">${t.role} ${t.score<60?'· ⚠ under review':t.score>=90?'· ✅ Verified badge':''}</div></div>
    </div>`));
  });
  grid.appendChild(trustCard);
}

/* ---------- 9. ANALYTICS ---------- */
function renderAnalytics(c){
  c.appendChild(el(`<div class="grid g-4" style="margin-bottom:18px;">
    <div class="stat-card"><div class="stat-label">Avg. utilization rate</div><div class="stat-value">61%</div><div class="stat-trend up">▲ 6% vs last month</div></div>
    <div class="stat-card"><div class="stat-label">Total revenue (30d)</div><div class="stat-value">$5,240</div><div class="stat-trend up">▲ 12%</div></div>
    <div class="stat-card"><div class="stat-label">Damage claims</div><div class="stat-value">3</div><div class="stat-trend down">▼ 1 vs last month</div></div>
    <div class="stat-card"><div class="stat-label">Owner payouts due</div><div class="stat-value">$4,182</div><div class="stat-trend">Next run Fri</div></div>
  </div>`));

  const grid = el(`<div class="grid g-2"></div>`); c.appendChild(grid);

  const util = [{n:'Van',v:78},{n:'Camera',v:64},{n:'Pavilion',v:35},{n:'Hiace',v:70},{n:'Loft',v:58},{n:'Gimbal',v:20}];
  const revenue = [{n:'Van',v:1180},{n:'Camera',v:640},{n:'Pavilion',v:820},{n:'Hiace',v:660},{n:'Loft',v:1140},{n:'Gimbal',v:180}];

  function barCard(title, data, suffix){
    const max = Math.max(...data.map(d=>d.v));
    const card = el(`<div class="card"><div class="card-title" style="font-size:15px;margin-bottom:4px;">${title}</div><div class="bars"></div></div>`);
    const bars = card.querySelector('.bars');
    data.forEach(d=>{
      bars.appendChild(el(`<div class="bar-col"><div style="font-size:11px;font-weight:700;">${d.v}${suffix}</div><div class="bar" style="height:${(d.v/max)*100}%"></div><div class="lbl">${d.n}</div></div>`));
    });
    return card;
  }
  grid.appendChild(barCard('Utilization rate by asset', util, '%'));
  grid.appendChild(barCard('Revenue by asset (30d, $)', revenue, ''));

  const seasonal = el(`<div class="card" style="margin-top:16px;">
    <div class="card-title" style="font-size:15px;">Seasonal demand — bookings per month</div>
    <div class="bars">${[18,22,26,31,29,35,41,38,44].map((v,i)=>`<div class="bar-col"><div class="bar" style="height:${(v/44)*100}%"></div><div class="lbl">${['J','F','M','A','M','J','J','A','S'][i]}</div></div>`).join('')}</div>
  </div>`);
  c.appendChild(seasonal);

  const payoutCard = el(`<div class="card" style="margin-top:16px;">
    <div class="card-h"><div class="card-title" style="font-size:15px;">Owner payout report</div><button class="btn btn-sm" id="exportPayout">Export CSV</button></div>
    <div class="tbl-wrap"><table><thead><tr><th>Owner</th><th>Gross earnings</th><th>Platform fee</th><th>Net payout</th></tr></thead><tbody>
      <tr><td>M. Sok</td><td>$1,840</td><td>−$184</td><td><b>$1,656</b></td></tr>
      <tr><td>L. Chan</td><td>$820</td><td>−$82</td><td><b>$738</b></td></tr>
      <tr><td>D. Meas</td><td>$1,230</td><td>−$123</td><td><b>$1,107</b></td></tr>
      <tr><td>P. Ratana</td><td>$920</td><td>−$92</td><td><b>$828</b></td></tr>
    </tbody></table></div>
  </div>`);
  c.appendChild(payoutCard);
  payoutCard.querySelector('#exportPayout').addEventListener('click', ()=> toast('Payout report exported'));
}

/* ---------- 10a. ROLES & PERMISSIONS ---------- */
function renderRoles(c){
  c.appendChild(el(`<div class="section-note">Toggle which actions each role can perform. Renter access to booking details is additionally time-windowed — it only activates during a confirmed reservation.</div>`));
  const card = el(`<div class="card"><div class="tbl-wrap"><table class="perm-table">
    <thead><tr><th>Action</th>${permissionMatrix.cols.map(r=>`<th>${ROLES.find(x=>x.id===r).label}</th>`).join('')}</tr></thead>
    <tbody></tbody></table></div></div>`);
  c.appendChild(card);
  const tbody = card.querySelector('tbody');
  permissionMatrix.rows.forEach((row,ri)=>{
    const tr = el(`<tr><td>${row}</td></tr>`);
    permissionMatrix.cols.forEach((col,ci)=>{
      const checked = permissionMatrix.grid[ri][ci];
      const td = el(`<td><input type="checkbox" class="tgl" ${checked?'checked':''}></td>`);
      td.querySelector('input').addEventListener('change', (e)=>{
        permissionMatrix.grid[ri][ci] = e.target.checked?1:0;
        logActivity('Admin', `Permission ${e.target.checked?'granted':'revoked'}`, `${col} · ${row}`, 'role');
        toast(`Permission ${e.target.checked?'granted':'revoked'} for ${col}`);
      });
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  c.appendChild(el(`<div class="card" style="margin-top:16px;">
    <div class="card-title" style="font-size:15px;margin-bottom:10px;">Time-window access control</div>
    <div class="cond-item"><span class="sev-dot sev-low"></span><div><b>Verified Renter</b><div style="color:var(--muted);font-size:12px;">Can view full asset location & contact details only from booking confirmation through the return deadline.</div></div></div>
    <div class="cond-item"><span class="sev-dot sev-med"></span><div><b>Inspector</b><div style="color:var(--muted);font-size:12px;">Report editing access closes automatically 48 hours after both parties sign off.</div></div></div>
  </div>`));
}

/* ---------- 10b. ACTIVITY LOG ---------- */
function renderActivity(c){
  const cats = ['all','booking','deposit','inspection','penalty','listing','role'];
  let activeCat = 'all';
  const toolbar = el(`<div class="toolbar">
    <div class="chip-group" id="catChips">${cats.map(cg=>`<button class="chip ${cg==='all'?'active':''}" data-c="${cg}">${cg[0].toUpperCase()+cg.slice(1)}</button>`).join('')}</div>
    <button class="btn btn-sm" id="exportLog" style="margin-left:auto;">Export log</button>
  </div>`);
  c.appendChild(toolbar);
  const wrap = el(`<div class="card"><div class="tbl-wrap"><table><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Target</th><th>Category</th></tr></thead><tbody id="logBody"></tbody></table></div></div>`);
  c.appendChild(wrap);

  function draw(){
    const body = wrap.querySelector('#logBody'); body.innerHTML='';
    activityLog.filter(l=> activeCat==='all' || l.cat===activeCat).forEach(l=>{
      body.appendChild(el(`<tr class="tbl-row"><td>${l.ts}</td><td>${l.user}</td><td>${l.action}</td><td><span class="plate">${l.target}</span></td><td><span class="badge b-navy">${l.cat}</span></td></tr>`));
    });
  }
  draw();
  toolbar.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{
    toolbar.querySelectorAll('.chip').forEach(x=>x.classList.remove('active')); chip.classList.add('active');
    activeCat = chip.dataset.c; draw();
  }));
  toolbar.querySelector('#exportLog').addEventListener('click', ()=> toast('Activity log exported as CSV'));
}

function renderAuthScreen(){
  const panel = el(`
    <div class="auth-panel">
      <div class="auth-header">
        <div class="auth-brand">
          <div class="auth-mark">A</div>
          <div>
            <div class="brand-name" style="font-size:24px; color:var(--navy-900);">AssetLine</div>
          </div>
        </div>
        <h1 class="auth-title">Welcome back</h1>
        <div class="auth-sub">Access your marketplace, bookings, and asset tools.</div>
      </div>

      <div class="auth-tabs">
        <button class="auth-tab active" data-auth="login" type="button">Login</button>
        <button class="auth-tab" data-auth="register" type="button">Register</button>
      </div>

      <form class="auth-form" id="authForm">
        <div class="auth-field auth-register-only" style="display:none;">
          <label>Full name</label>
          <input type="text" id="authName" placeholder="Your full name">
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input type="email" id="authEmail" placeholder="you@example.com" required>
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input type="password" id="authPassword" placeholder="Enter your password" required>
        </div>
        <div class="auth-field auth-register-only" style="display:none;">
          <label>Role</label>
          <select id="authRole">
            <option value="admin">Platform Admin</option>
            <option value="owner">Asset Owner</option>
            <option value="renter">Verified Renter</option>
            <option value="inspector">Inspector</option>
            <option value="finance">Finance Manager</option>
          </select>
        </div>
        <button class="btn btn-primary auth-cta" type="submit" id="authSubmit">Sign in</button>
      </form>

      <div class="auth-foot">
        <span id="authFootText">Need an account?</span>
        <button type="button" id="authSwitch">Create one</button>
      </div>
    </div>
  `);

  const screen = $('#authScreen');
  screen.innerHTML = ''; screen.appendChild(panel);

  const authTabs = panel.querySelectorAll('.auth-tab');
  const registerFields = panel.querySelectorAll('.auth-register-only');
  const authFootText = panel.querySelector('#authFootText');
  const authSwitch = panel.querySelector('#authSwitch');
  const authTitle = panel.querySelector('.auth-title');
  const authSub = panel.querySelector('.auth-sub');
  const authSubmit = panel.querySelector('#authSubmit');

  function applyAuthMode(mode){
    state.authMode = mode;
    const isRegister = mode === 'register';
    authTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.auth === mode));
    registerFields.forEach(field => field.style.display = isRegister ? 'flex' : 'none');
    authTitle.textContent = isRegister ? 'Create your account' : 'Welcome back';
    authSub.textContent = isRegister ? 'Set up your workspace and start listing or booking assets.' : 'Access your marketplace, bookings, and asset tools.';
    authSubmit.textContent = isRegister ? 'Create account' : 'Sign in';
    authFootText.textContent = isRegister ? 'Already have an account?' : 'Need an account?';
    authSwitch.textContent = isRegister ? 'Log in' : 'Create one';
  }

  authTabs.forEach(tab => tab.addEventListener('click', () => applyAuthMode(tab.dataset.auth)));
  authSwitch.addEventListener('click', () => applyAuthMode(state.authMode === 'login' ? 'register' : 'login'));

  panel.querySelector('#authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#authEmail').value.trim();
    const password = $('#authPassword').value;

    if (!email || !password || (state.authMode === 'register' && !$('#authName').value.trim())) {
      toast('Please complete the required fields');
      return;
    }

    if (password.length < 6) {
      toast('Password should be at least 6 characters');
      return;
    }

    state.loggedIn = true;
    document.body.classList.remove('auth-mode');
    if (state.authMode === 'register') {
      const selectedRole = $('#authRole').value;
      state.role = selectedRole;
      const roleInfo = ROLES.find(r => r.id === selectedRole);
      $('#roleAvatar').textContent = roleInfo.init;
      $('#roleLabel').textContent = roleInfo.label;
      $('#footRole').textContent = roleInfo.label;
    }
    toast(state.authMode === 'register' ? 'Account created successfully' : 'Login successful');
    renderNav();
    renderRoleMenu();
    render();
  });

  applyAuthMode(state.authMode);
}

function initializeApp(){
  if (!state.loggedIn) {
    renderAuthScreen();
    return;
  }
  document.body.classList.remove('auth-mode');
  renderNav();
  renderRoleMenu();
  render();
}

initializeApp();
