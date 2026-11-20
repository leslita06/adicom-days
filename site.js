(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('adc-'+k));localStorage.setItem('adc-'+k,JSON.stringify(v))}catch(e){return null}}
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var PASS={participant:'Pass Participant',createur:'Pass Créateur de contenu',atelier:'Pass Atelier pratique'};

/* nav */
var nav=$('#nav'),mbar=$('#mbar');
function onScroll(){var y=window.scrollY;nav.classList.toggle('solid',y>40);
  var r=$('#inscription').getBoundingClientRect(),b=$('#billet').getBoundingClientRect();
  mbar.classList.toggle('on',y>500&&!(r.top<innerHeight&&r.bottom>0)&&!(b.top<innerHeight&&b.bottom>0))}
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('#burger').onclick=function(){nav.classList.toggle('open')};
$$('#links a').forEach(function(a){a.onclick=function(){nav.classList.remove('open')}});

/* apparitions */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'}):null;
function watch(){$$('.rv:not(.in)').forEach(function(e){io?io.observe(e):e.classList.add('in')})}

/* jauge */
var base=1128;
function regs(){return store('regs')||{}}
function count(){return base+Object.keys(regs()).length}
function jauge(){var n=count();$('#j-n').textContent=n.toLocaleString('fr-FR');$('#j-bar').style.width=Math.min(100,n/ADC.places*100).toFixed(1)+'%';$('#j-left').textContent='sur '+ADC.places.toLocaleString('fr-FR')+' places prioritaires · '+(ADC.places-n).toLocaleString('fr-FR')+' restantes'}
setTimeout(jauge,400);
setInterval(function(){if(Math.random()<.5){base++;jauge()}},7000);

/* programme */
var day=1,track='Toutes',mine=store('agenda')||[];
function spkName(i){return ADC.speakers[i][0]}
function drawFilters(){var h='<button data-t="Toutes" class="'+(track==='Toutes'?'on':'')+'">Toutes les sessions</button>';
  Object.keys(ADC.tracks).forEach(function(t){h+='<button data-t="'+t+'" class="'+(track===t?'on':'')+'"><i style="background:'+ADC.tracks[t]+'"></i>'+t+'</button>'});
  $('#filters').innerHTML=h;$$('#filters button').forEach(function(b){b.onclick=function(){track=b.dataset.t;drawFilters();drawProg()}})}
function drawProg(){
  var h='';ADC.sessions.filter(function(s){return s[1]===day&&(track==='Toutes'||s[5]===track)}).forEach(function(s){
    var on=mine.indexOf(s[0])>=0,c=ADC.tracks[s[5]];
    h+='<li class="ss"><div class="ss-t"><b>'+s[2]+'</b><span>'+s[3]+'</span></div><div><h3>'+esc(s[4])+'</h3><p>'+esc(s[8])+'</p><div class="ss-m"><span class="pill"><i style="background:'+c+'"></i>'+s[5]+'</span><span class="pill">'+s[6]+'</span>'+(s[7].length?'<span class="pill">'+s[7].length+' intervenant'+(s[7].length>1?'s':'')+'</span>':'')+'</div></div><button class="ss-add'+(on?' on':'')+'" data-id="'+s[0]+'" aria-label="'+(on?'Retirer de':'Ajouter à')+' mon agenda" title="'+(on?'Dans mon agenda':'Ajouter à mon agenda')+'">'+(on?'✓':'+')+'</button></li>'});
  $('#prog').innerHTML=h||'<li class="ss"><div class="ss-t"></div><div><h3>Aucune session dans cette piste ce jour-là.</h3></div></li>';
  $$('#prog .ss-add').forEach(function(b){b.onclick=function(){var id=b.dataset.id,i=mine.indexOf(id);if(i>=0)mine.splice(i,1);else mine.push(id);store('agenda',mine);drawProg()}})}
$$('.tabs button').forEach(function(b){b.onclick=function(){day=+b.dataset.d;$$('.tabs button').forEach(function(x){x.classList.toggle('on',x===b)});drawProg()}});
drawFilters();drawProg();

/* intervenants : silhouettes d'illustration */
var G=[['#964C97','#5B2A5C'],['#B6D401','#6E8A00'],['#7A3A7B','#2A1633'],['#C46BC5','#964C97'],['#2EC4B6','#127A71'],['#FF8A3D','#B04E12']];
function sil(k){return '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="36" r="19" fill="rgba(255,255,255,.88)"/><path d="M12 100c2-24 18-38 38-38s36 14 38 38z" fill="rgba(255,255,255,.88)"/></svg>'}
$('#spk').innerHTML=ADC.speakers.map(function(s,i){var g=G[i%G.length];return '<article class="sp rv"><div class="sp-av" style="background:linear-gradient(150deg,'+g[0]+','+g[1]+')"><em>À annoncer</em>'+sil(i)+'</div><h3>'+esc(s[0])+'</h3><p>'+esc(s[1])+'</p><span class="pill">'+s[2]+'</span></article>'}).join('');

/* choix de pass */
$$('[data-pick]').forEach(function(b){b.onclick=function(){var r=$('input[name=pass][value='+b.dataset.pick+']');if(r)r.checked=true;$('#inscription').scrollIntoView({behavior:'smooth'})}});

/* inscription */
function code(){var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='ADC-';for(var i=0;i<4;i++)s+=a[Math.floor(Math.random()*a.length)];s+='-';for(i=0;i<2;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
var f=$('#f');
f.addEventListener('submit',function(e){e.preventDefault();
  var bad=[];$$('input[required],select[required]',f).forEach(function(i){var ok=i.type==='checkbox'?i.checked:(i.type==='email'?/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()):i.value.trim().length>1);i.classList.toggle('bad',!ok);if(!ok)bad.push(i)});
  var err=$('#err');if(bad.length){err.hidden=false;err.textContent=bad.length===1&&bad[0].name==='ok'?'Merci d\'accepter d\'être contacté pour recevoir votre billet.':'Merci de compléter les champs en rouge.';bad[0].focus();return}
  err.hidden=true;var d=new FormData(f),mail=d.get('mail').trim().toLowerCase(),R=regs();
  var r=R[mail]||{c:code(),t:Date.now()};
  r.prenom=d.get('prenom').trim();r.nom=d.get('nom').trim();r.mail=mail;r.tel=d.get('tel').trim();r.org=(d.get('org')||'').trim();r.profil=d.get('profil');r.pass=d.get('pass');r.int=d.getAll('int');
  if(r.pass==='atelier'&&!r.wl)r.wl=5+Object.keys(R).length%6+2;
  R[mail]=r;store('regs',R);store('me',mail);
  var b=$('#go');b.textContent='Billet en cours d\'émission…';b.disabled=true;
  setTimeout(function(){b.textContent='Recevoir mon billet';b.disabled=false;show(r,true);jauge()},700)});
$$('input,select',f).forEach(function(i){i.addEventListener('input',function(){i.classList.remove('bad')})});

function show(r,fresh){
  document.body.classList.add('has-ticket');
  var wl=r.pass==='atelier';
  $('#ok').hidden=wl;$('#wl').hidden=!wl;
  fillTicket(r,wl);
  if(wl){$('#wl-n').textContent=r.wl;$('#wl-who').textContent=r.prenom+' '+r.nom+' · '+r.mail;$('#wl-code').textContent=r.c}
  else{$('#ok-k').textContent=fresh?'C\'est confirmé':'Billet retrouvé';$('#ok-h').textContent=fresh?'Bienvenue, '+r.prenom+'. Votre billet est prêt.':'Voici votre billet, '+r.prenom+'.'}
  $('#find').hidden=true;
  $('#billet').scrollIntoView({behavior:fresh?'smooth':'auto'});
}
function fillTicket(r,wl){
  $('#t-pass').textContent=wl?'Pass Participant · Atelier en attente':PASS[r.pass];
  $('#t-name').textContent=r.prenom+' '+r.nom;$('#t-org').textContent=r.org||'';$('#t-prof').textContent=(r.profil||'').split(',')[0];
  $('#code').textContent=r.c;
  var q=$('#qr');q.innerHTML='';if(window.QRCode)new QRCode(q,{text:'ADICOMDAYS|'+r.c+'|'+r.prenom+' '+r.nom,width:300,height:300,colorDark:'#1E1024',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
  $('#to-app').href='app/#billet?c='+encodeURIComponent(r.c);
  $('#wa').href='https://wa.me/?text='+encodeURIComponent('Mon billet ADICOM Days ('+(PASS[r.pass]||'')+') : code '+r.c+'. Je le retrouve sur '+location.href.split('#')[0]+'#billet');
}
$('#wl-show').onclick=function(){$('#wl').hidden=true;$('#ok').hidden=false;$('#ok-k').textContent='En attendant votre atelier';$('#ok-h').textContent='Votre billet Participant';$('#billet').scrollIntoView({behavior:'smooth'})};
$$('.do-reset').forEach(function(x){x.onclick=function(){f.reset();store('me',null);document.body.classList.remove('has-ticket');$('#ok').hidden=true;$('#wl').hidden=true;$('#find').hidden=false;$('#inscription').scrollIntoView({behavior:'smooth'})}});

/* retrouver mon billet */
$('#ff').addEventListener('submit',function(e){e.preventDefault();var m=$('#fm').value.trim().toLowerCase(),r=regs()[m];
  if(r){$('#fmsg').textContent='';show(r,false)}else{$('#fmsg').textContent='Aucune inscription trouvée avec cet e-mail sur cet appareil. Vérifiez l\'adresse, ou inscrivez-vous en une minute.'}});

/* télécharger le billet (image) */
$('#dl').onclick=function(){var me=regs()[store('me')];if(!me)return;
  var W=900,H=1300,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  x.fillStyle='#fff';x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,260);g.addColorStop(0,'#964C97');g.addColorStop(1,'#5B2A5C');x.fillStyle=g;x.fillRect(0,0,W,260);
  x.fillStyle='#fff';x.font='600 30px Montserrat,sans-serif';x.fillText('ADICOM Days · 11e édition',60,110);x.font='800 50px Montserrat,sans-serif';x.fillText($('#t-pass').textContent,60,180);
  x.fillStyle='#1A1320';x.font='900 64px Montserrat,sans-serif';x.fillText(me.prenom+' '+me.nom,60,360);x.fillStyle='#6B6170';x.font='600 32px Montserrat,sans-serif';x.fillText(me.org||'',60,410);
  x.fillText('Dates et lieu : à annoncer',60,480);
  var qi=$('#qr img'),qc=$('#qr canvas');var src=qc||qi;try{x.drawImage(src,200,560,500,500)}catch(e){}
  x.fillStyle='#1A1320';x.font='800 48px Montserrat,sans-serif';x.textAlign='center';x.fillText(me.c,W/2,1140);x.fillStyle='#6B6170';x.font='500 26px Montserrat,sans-serif';x.fillText('Présentez ce QR code à l\'entrée',W/2,1195);
  var a=document.createElement('a');a.download='billet-adicom-days-'+me.c+'.png';a.href=c.toDataURL('image/png');a.click()};

/* au chargement : billet déjà émis sur cet appareil */
var me=store('me'),R0=regs();if(me&&R0[me]){fillTicket(R0[me],R0[me].pass==='atelier');document.body.classList.add('has-ticket');$('#ok').hidden=R0[me].pass==='atelier';$('#wl').hidden=R0[me].pass!=='atelier';if(R0[me].pass==='atelier'){$('#wl-n').textContent=R0[me].wl;$('#wl-who').textContent=R0[me].prenom+' '+R0[me].nom+' · '+R0[me].mail;$('#wl-code').textContent=R0[me].c}$('#find').hidden=true}
watch();
})();
