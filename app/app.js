(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('adc-'+k));localStorage.setItem('adc-'+k,JSON.stringify(v))}catch(e){return null}}
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function p2(n){return String(n).padStart(2,'0')}
function hm(m){m=Math.floor(m);return p2(Math.floor(m/60)%24)+':'+p2(m%60)}
function mins(s){var a=s.split(':');return +a[0]*60+ +a[1]}
function ini(n){return n.replace(/\./g,'').split(/\s+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase()}
var PAL=['#964C97','#7A3A7B','#2EC4B6','#FF8A3D','#4D8BFF','#E84A8A','#6E8A00','#5B2A5C'];
function col(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return PAL[h%PAL.length]}
function ava(n,sz){return '<span class="ava" style="background:'+col(n)+(sz?';width:'+sz+'px;height:'+sz+'px':'')+'">'+ini(n)+'</span>'}
var S=ADC.sessions,TR=ADC.tracks,PASS={participant:'Pass Participant',createur:'Pass Créateur de contenu',atelier:'Pass Participant'};

/* --- heure simulée du jour J (jour 1) --- */
var T0=10*60+42,start=Date.now(),speed=1,simBase=T0;
function now(){return simBase+(Date.now()-start)/60000*speed}
function setSpeed(x){simBase=now();start=Date.now();speed=x}

/* --- participant --- */
var me=null,R=store('regs')||{},m=store('me');
var hc=(location.hash.match(/c=([A-Z0-9-]+)/i)||[])[1];
if(hc){Object.keys(R).forEach(function(k){if(R[k].c.toUpperCase()===hc.toUpperCase())me=R[k]})}
if(!me&&m&&R[m])me=R[m];
if(!me)me={prenom:'Aya',nom:'Koné',org:'Studio Plateau',c:'ADC-7K2P-QX',pass:'createur',profil:'Créateur de contenu',int:['IA','Influence','Vidéo']};
if(!me.int||!me.int.length)me.int=['IA','Influence'];

/* --- agenda --- */
var mine=store('agenda');if(!mine||!mine.length){mine=['s2','s3','s5','s6','s8','s10'];store('agenda',mine)}
function sess(id){return S.filter(function(s){return s[0]===id})[0]}
function inMine(id){return mine.indexOf(id)>=0}
function toggle(id){var i=mine.indexOf(id);if(i>=0)mine.splice(i,1);else{mine.push(id);toast('Ajouté à votre agenda','Rappel 10 min avant : '+sess(id)[4])}store('agenda',mine);drawAll()}
function conflict(s){return mine.some(function(id){var o=sess(id);return o&&o[0]!==s[0]&&o[1]===s[1]&&mins(o[2])<mins(s[3])&&mins(s[2])<mins(o[3])})}
function curSess(T){return S.filter(function(s){return s[1]===1&&mins(s[2])<=T&&T<mins(s[3])})}

/* --- navigation --- */
var cur='accueil';
function go(id){if(!$('#s-'+id))return;cur=id;$$('.scr').forEach(function(s){s.classList.toggle('on',s.id==='s-'+id)});$$('#tabs button').forEach(function(b){b.classList.toggle('on',b.dataset.go===id)});$('#s-'+id).scrollTop=0;head();if(id==='live')animPoll();if(id==='reseau'){$('#b-reseau').hidden=true}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}});
function head(){var s=$('#s-'+cur);$('#top').classList.toggle('solid',cur!=='accueil'||s.scrollTop>230)}
$$('.scr').forEach(function(s){s.addEventListener('scroll',head,{passive:true})});
$('#btn-billet').onclick=function(){go('billet')};
$('#btn-notif').onclick=function(){$('#notif-dot').classList.remove('on');sheet('<h3>Annonces de l\'organisation</h3>'+ANN.map(annH).join(''))};

/* --- toast + feuille --- */
var tt;function toast(k,t){$('#toast-k').textContent=k;$('#toast-t').textContent=t;var e=$('#toast');e.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){e.classList.remove('on')},3800)}
function sheet(h){$('#sh-body').innerHTML=h;$('#sheet').hidden=false}
$('#sh-bg').onclick=function(){$('#sheet').hidden=true};

/* --- QR --- */
function qr(el,txt,size){el.innerHTML='';if(window.QRCode)new QRCode(el,{text:txt,width:size,height:size,colorDark:'#1E1024',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}

/* --- accueil --- */
var ANN=store('ann')||[['09:58','Bienvenue ! Le vestiaire est ouvert à droite de l\'entrée principale.'],['10:20','Le panel « les marques face aux créateurs » se tiendra en Grande scène.']];
function annH(a){return '<div class="ann"><small>'+a[0]+'</small>'+esc(a[1])+'</div>'}
function drawHome(){var T=now();
  $('#hi-name').textContent=me.prenom;$('#clock').textContent=hm(T);
  var c=curSess(T).filter(function(s){return s[5]!=='Réseau'})[0]||curSess(T)[0];
  var nx=S.filter(function(s){return s[1]===1&&mins(s[2])>T&&inMine(s[0])})[0];
  $('#next-in').textContent=nx?(Math.round(mins(nx[2])-T)+' min'):'-';
  if(c){var p=(T-mins(c[2]))/(mins(c[3])-mins(c[2]))*100;
    $('#now').innerHTML='<small>En ce moment · '+c[6]+'</small><h3>'+esc(c[4])+'</h3><p>'+c[2]+' - '+c[3]+' · '+c[5]+'</p><div class="pbar"><i style="width:'+p.toFixed(0)+'%"></i></div><div class="acts"><button class="l" data-go="live">Voter, poser une question</button><button data-sid="'+c[0]+'">Détails</button></div>'}
  else $('#now').innerHTML='<small>Pause</small><h3>Prochaine session à '+(nx?nx[2]:'-')+'</h3><p>Profitez-en pour rencontrer d\'autres participants.</p>';
  $('#tile-code').textContent=me.c;
  var h='';S.filter(function(s){return s[1]===1&&inMine(s[0])}).sort(function(a,b){return mins(a[2])-mins(b[2])}).slice(0,5).forEach(function(s){var st=T>=mins(s[3])?'past':T>=mins(s[2])?'cur':'';h+='<li class="'+st+'" data-sid="'+s[0]+'"><time>'+s[2]+'</time><div><b>'+esc(s[4])+'</b><span>'+s[6]+(st==='cur'?' · en cours':'')+'</span></div></li>'});
  $('#mini-tl').innerHTML=h||'<li class="empty">Aucune session choisie pour aujourd\'hui.</li>';
  $('#peek').innerHTML=people().slice(0,6).map(function(p){return '<div class="pk">'+ava(p[0])+'<b>'+esc(p[0])+'</b><span>'+esc(p[1])+' · '+esc(p[2])+'</span><em class="m">'+p.score+' % en commun</em></div>'}).join('');
  $('#ann-home').innerHTML=ANN.slice(0,2).map(annH).join('');
  $('#av-ini').textContent=ini(me.prenom+' '+me.nom);
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-sid]');if(b&&!e.target.closest('.add')){openSess(b.dataset.sid)}});

/* --- agenda --- */
var agV='mine',agD=1,agT='Toutes';
$$('#ag-seg button').forEach(function(b){b.onclick=function(){agV=b.dataset.v;$$('#ag-seg button').forEach(function(x){x.classList.toggle('on',x===b)});drawAg()}});
$$('#ag-days button').forEach(function(b){b.onclick=function(){agD=+b.dataset.d;$$('#ag-days button').forEach(function(x){x.classList.toggle('on',x===b)});drawAg()}});
function drawAg(){var T=now();
  $('#ag-n').textContent=mine.length;
  $('#ag-trk').innerHTML=['Toutes'].concat(Object.keys(TR)).map(function(t){return '<button data-t="'+t+'" class="'+(agT===t?'on':'')+'">'+(t!=='Toutes'?'<i style="background:'+TR[t]+'"></i>':'')+t+'</button>'}).join('');
  $$('#ag-trk button').forEach(function(b){b.onclick=function(){agT=b.dataset.t;drawAg()}});
  var L=S.filter(function(s){return s[1]===agD&&(agV==='all'||inMine(s[0]))&&(agT==='Toutes'||s[5]===agT)});
  if(!L.length){$('#tl').innerHTML='<li style="display:block"><div class="empty-ag"><b>Rien ici pour l\'instant.</b>Ajoutez des sessions depuis l\'onglet Programme.</div></li>';return}
  $('#tl').innerHTML=L.map(function(s){var live=agD===1&&mins(s[2])<=T&&T<mins(s[3]),on=inMine(s[0]),cf=on&&conflict(s);
    return '<li><time>'+s[2]+'<small>'+s[3]+'</small></time><div class="se'+(live?' cur':'')+'" style="--c:'+TR[s[5]]+'" data-sid="'+s[0]+'">'+(live?'<span class="lv-t"><i></i>En cours</span>':'')+'<h3>'+esc(s[4])+'</h3><p>'+s[6]+' · '+s[5]+(cf?'<span class="conf">Chevauchement</span>':'')+'</p><button class="add'+(on?' on':'')+'" data-add="'+s[0]+'" aria-label="'+(on?'Retirer':'Ajouter')+'">'+(on?'✓':'+')+'</button></div></li>'}).join('');
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b){e.stopPropagation();toggle(b.dataset.add)}},true);
function openSess(id){var s=sess(id);if(!s)return;var on=inMine(id);
  sheet('<span class="pill" style="background:'+TR[s[5]]+'22;color:'+TR[s[5]]+'">'+s[5]+'</span><h3>'+esc(s[4])+'</h3><p>Jour '+s[1]+' · '+s[2]+' - '+s[3]+' · '+s[6]+'</p><p style="margin-top:10px">'+esc(s[8])+'</p>'+
  (s[7].length?'<div style="margin-top:12px">'+s[7].map(function(i){var p=ADC.speakers[i];return '<div class="spk">'+ava(p[0],38)+'<div><b>'+esc(p[0])+'</b><span>'+esc(p[1])+' · intervenant à annoncer</span></div></div>'}).join('')+'</div>':'')+
  '<button class="big'+(on?' on':'')+'" id="sh-add">'+(on?'✓ Dans mon agenda':'Ajouter à mon agenda')+'</button><button class="big" style="background:var(--vl);color:var(--v3)" data-room="'+s[6]+'">Voir la salle sur le plan</button>');
  $('#sh-add').onclick=function(){toggle(id);openSess(id)};
  var r=$('[data-room]',$('#sheet'));r.onclick=function(){$('#sheet').hidden=true;showRoom(s[6]);go('plan')};
}

/* --- rencontres --- */
var REQ=store('req')||{};
function people(){return ADC.people.map(function(p){var c=p[3].filter(function(t){return me.int.indexOf(t)>=0}).length;var o=p.slice();o.score=Math.min(98,p[4]-12+c*9);o.common=c;return o}).sort(function(a,b){return b.score-a.score})}
function drawNet(){var q=($('#r-q').value||'').toLowerCase();
  $('#my-int').textContent=me.int.join(', ');
  var L=people().filter(function(p){return !q||(p[0]+p[1]+p[2]+p[3].join(' ')).toLowerCase().indexOf(q)>=0});
  $('#r-sugg').textContent=ADC.people.length;
  var n=Object.keys(REQ).length,r=Object.keys(REQ).filter(function(k){return REQ[k].slot}).length;$('#r-req').textContent=n;$('#r-rdv').textContent=r;
  $('#people').innerHTML=L.map(function(p){var st=REQ[p[0]],lab=!st?'Se connecter':st.slot?'RDV '+st.slot:st.ok?'Proposer un créneau':'Demande envoyée',cl=!st?'':st.slot||st.ok?' ok':' sent';
    return '<div class="pp"><div class="pp-h">'+ava(p[0])+'<div><b>'+esc(p[0])+'</b><span>'+esc(p[1])+' · '+esc(p[2])+'</span></div><div class="match"><b>'+p.score+' %</b><small>affinité</small></div></div><div class="tags">'+p[3].map(function(t){return '<span class="'+(me.int.indexOf(t)>=0?'c':'')+'">'+t+'</span>'}).join('')+'</div><div class="pp-a"><button class="go'+cl+'" data-con="'+esc(p[0])+'">'+lab+'</button><button data-msg="'+esc(p[0])+'">Message</button></div></div>'}).join('')||'<div class="empty-ag"><b>Aucun profil ne correspond.</b>Essayez un autre mot.</div>';
}
$('#r-q').addEventListener('input',drawNet);
document.addEventListener('click',function(e){var b=e.target.closest('[data-con]');if(b){var n=b.dataset.con,st=REQ[n];
  if(!st){REQ[n]={t:Date.now()};store('req',REQ);drawNet();setTimeout(function(){REQ[n].ok=1;store('req',REQ);drawNet();drawHome();toast('Demande acceptée',n+' a accepté votre demande. Proposez un créneau.');if(cur!=='reseau'){var bb=$('#b-reseau');bb.hidden=false;bb.textContent=1}},2600)}
  else if(st.ok&&!st.slot)slotSheet(n)}
  var m=e.target.closest('[data-msg]');if(m){var who=m.dataset.msg;sheet('<h3>Message à '+esc(who)+'</h3><p>Présentez-vous en une phrase : votre message arrive dans sa messagerie ADICOM.</p><textarea id="msg-t" rows="3">Bonjour '+esc(who.split(' ')[0])+', ravie de vous croiser aux ADICOM Days. On prend un café entre deux sessions ?</textarea><button class="big" id="msg-go">Envoyer</button>');$('#msg-go').onclick=function(){$('#sheet').hidden=true;toast('Message envoyé','À '+who+' · réponse dans votre messagerie')}}});
function slotSheet(n){var sl=['12:50','13:10','13:30','15:20','16:40','17:10'],pick=null;
  sheet('<h3>Rendez-vous avec '+esc(n)+'</h3><p>Créneaux de 15 minutes où vous êtes tous les deux libres, à l\'espace Rencontres (Jardin).</p><div class="slots">'+sl.map(function(s){return '<button data-s="'+s+'">'+s+'</button>'}).join('')+'</div><button class="big" id="slot-go">Confirmer le rendez-vous</button>');
  $$('.slots button').forEach(function(b){b.onclick=function(){pick=b.dataset.s;$$('.slots button').forEach(function(x){x.classList.toggle('on',x===b)})}});
  $('#slot-go').onclick=function(){if(!pick){toast('Choisissez un créneau','Touchez une heure, puis confirmez.');return}REQ[n].slot=pick;store('req',REQ);$('#sheet').hidden=true;drawNet();toast('Rendez-vous confirmé',n+' · '+pick+' · espace Rencontres, Jardin')}}

/* --- vote --- */
var POLL={q:'Pour une marque, quel format crée le plus d\'engagement en Afrique de l\'Ouest ?',o:[['La vidéo courte de créateur',184],['Le live shopping',96],['La série de marque',71],['Le podcast',38]]};
var myVote=store('vote');
function drawPoll(){var tot=POLL.o.reduce(function(a,o){return a+o[1]},0)+(myVote!=null?1:0);
  $('#poll').innerHTML='<small>Vote en cours · '+(myVote!=null?'merci pour votre vote':'touchez une réponse')+'</small><h3>'+POLL.q+'</h3>'+POLL.o.map(function(o,i){var v=o[1]+(myVote===i?1:0),p=Math.round(v/tot*100);return '<button class="opt'+(myVote===i?' me':'')+'" data-v="'+i+'"><i class="fill" data-w="'+(myVote!=null?p:0)+'"></i><span>'+o[0]+'</span>'+(myVote!=null?'<em>'+p+' %</em>':'')+'</button>'}).join('')+'<p class="meta">'+tot+' votes · résultats affichés en direct sur l\'écran de la Grande scène</p>';
  $('#tile-vote').textContent=POLL.o.length+' options · '+tot+' votes';
  $$('#poll .opt').forEach(function(b){b.onclick=function(){if(myVote!=null)return;myVote=+b.dataset.v;store('vote',myVote);drawPoll();animPoll();toast('Vote enregistré','Les résultats s\'affichent sur l\'écran de la salle.')}});
  $('#poll2').innerHTML='<small>Vote clos · 10:30</small><h3>Utilisez-vous déjà l\'IA pour créer vos contenus ?</h3>'+[['Tous les jours',47],['De temps en temps',38],['Pas encore',15]].map(function(o){return '<div class="opt"><i class="fill" data-w="'+o[1]+'"></i><span>'+o[0]+'</span><em>'+o[1]+' %</em></div>'}).join('')+'<p class="meta">612 votes</p>';
}
function animPoll(){$$('.fill').forEach(function(f){f.style.width='0';setTimeout(function(){f.style.width=f.dataset.w+'%'},60)})}
$$('#lv-seg button').forEach(function(b){b.onclick=function(){$$('#lv-seg button').forEach(function(x){x.classList.toggle('on',x===b)});$('#pane-vote').hidden=b.dataset.v!=='vote';$('#pane-q').hidden=b.dataset.v!=='q';if(b.dataset.v==='vote')animPoll()}});

/* --- questions --- */
var Q=store('qs')||[{id:1,t:'Comment fixer un tarif juste pour un créateur qui débute ?',a:'Mariam T.',u:42,s:'pin'},{id:2,t:'Quels indicateurs demander à un créateur avant de signer ?',a:'Serge D.',u:31,s:''},{id:3,t:'Les marques sont-elles prêtes à payer pour du contenu en langues locales ?',a:'Anonyme',u:27,s:''},{id:4,t:'Faut-il un contrat écrit pour une seule publication ?',a:'Kevin A.',u:18,s:'ans'}];
var UP=store('ups')||[],qSort='top';
function saveQ(){store('qs',Q);store('ups',UP)}
function stL(s){return s==='pin'?'<span class="st pin">À l\'écran</span>':s==='ans'?'<span class="st ans">Répondue</span>':s==='wait'?'<span class="st wait">En modération</span>':''}
function drawQ(){var L=Q.filter(function(q){return q.s!=='wait'||q.mine}).slice().sort(function(a,b){return qSort==='top'?b.u-a.u:b.id-a.id});
  $('#q-n').textContent=L.length;
  $('#qs').innerHTML=L.map(function(q){var on=UP.indexOf(q.id)>=0;return '<li class="qi"><button class="up'+(on?' on':'')+'" data-up="'+q.id+'" aria-label="Soutenir"><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg>'+q.u+'</button><div><p>'+esc(q.t)+'</p><small>'+esc(q.a)+stL(q.s)+'</small></div></li>'}).join('');
  $$('[data-up]').forEach(function(b){b.onclick=function(){var id=+b.dataset.up,q=Q.filter(function(x){return x.id===id})[0],i=UP.indexOf(id);if(i>=0){UP.splice(i,1);q.u--}else{UP.push(id);q.u++}saveQ();drawQ()}});
  drawMod();
}
$$('.q-sort button').forEach(function(b){b.onclick=function(){qSort=b.dataset.s;$$('.q-sort button').forEach(function(x){x.classList.toggle('on',x===b)});drawQ()}});
$('#q-in').addEventListener('input',function(){$('#q-cnt').textContent=this.value.length+'/240'});
$('#ask').addEventListener('submit',function(e){e.preventDefault();var t=$('#q-in').value.trim();if(t.length<8){toast('Question trop courte','Quelques mots de plus, pour que l\'intervenant comprenne.');return}
  Q.push({id:Date.now(),t:t,a:$('#q-anon').checked?'Anonyme':me.prenom+' '+me.nom.charAt(0)+'.',u:0,s:'wait',mine:1});saveQ();$('#q-in').value='';$('#q-cnt').textContent='0/240';qSort='new';$$('.q-sort button').forEach(function(x){x.classList.toggle('on',x.dataset.s==='new')});drawQ();toast('Question envoyée','Elle passe en modération, puis à l\'écran.')});

/* --- plan --- */
var lvl=0,ROOM={
  0:[['Grande scène',20,20,200,150,'#964C97'],['Hall',230,20,110,150,'#2A1633'],['Accueil et badges',230,180,110,70,'#B6D401'],['Jardin',20,180,200,120,'#2EC4B6'],['Stands partenaires',230,260,110,40,'#FF8A3D'],['Vestiaire',20,310,95,50,'#8C8396'],['Restauration',125,310,215,50,'#E84A8A']],
  1:[['Salle Lagune',20,20,150,130,'#FF8A3D'],['Salle Atelier',180,20,160,130,'#4D8BFF'],['Studio Créateurs',20,160,150,100,'#B6D401'],['Espace presse',180,160,160,100,'#7A3A7B'],['Salon VIP',20,270,320,90,'#2A1633']]};
function drawMap(sel){var h='<svg viewBox="0 0 360 380" role="img" aria-label="Plan niveau '+lvl+'"><rect x="0" y="0" width="360" height="380" rx="16" fill="#F7F3F8"/>';
  ROOM[lvl].forEach(function(r){var on=sel===r[0],light=r[5]==='#B6D401';h+='<g class="rm" data-r="'+r[0]+'"><rect x="'+r[1]+'" y="'+r[2]+'" width="'+r[3]+'" height="'+r[4]+'" rx="12" fill="'+r[5]+'" opacity="'+(sel&&!on?.35:1)+'" '+(on?'stroke="#1A1320" stroke-width="3"':'')+'/><text x="'+(r[1]+r[3]/2)+'" y="'+(r[2]+r[4]/2+4)+'" text-anchor="middle" font-size="'+(r[3]<120?10:12)+'" fill="'+(light?'#1A1320':'#fff')+'">'+r[0]+'</text></g>'});
  if(lvl===0)h+='<g><circle cx="285" cy="215" r="9" fill="#FF4D57"/><circle cx="285" cy="215" r="16" fill="#FF4D57" opacity=".25"><animate attributeName="r" values="9;20;9" dur="2s" repeatCount="indefinite"/></circle><text x="285" y="245" text-anchor="middle" font-size="10" fill="#1A1320">Vous êtes ici</text></g>';
  h+='</svg>';$('#map').innerHTML=h;
  $('#legend').innerHTML=ROOM[lvl].map(function(r){return '<span><i style="background:'+r[5]+'"></i>'+r[0]+'</span>'}).join('');
  $$('#map .rm').forEach(function(g){g.onclick=function(){showRoom(g.dataset.r)}})}
function showRoom(n){var l=ROOM[1].some(function(r){return r[0]===n})?1:0;if(l!==lvl){lvl=l;$$('#lv button').forEach(function(b){b.classList.toggle('on',+b.dataset.l===l)})}drawMap(n);
  var ss=S.filter(function(s){return s[6]===n&&s[1]===1});
  $('#room-card').innerHTML='<small>Niveau '+l+'</small><b>'+n+'</b><span>'+(ADC.rooms[n]||'Signalé par les hôtesses sur place')+'</span>'+(ss.length?'<ul>'+ss.map(function(s){return '<li><time>'+s[2]+'</time>'+esc(s[4])+'</li>'}).join('')+'</ul>':'')}
$$('#lv button').forEach(function(b){b.onclick=function(){lvl=+b.dataset.l;$$('#lv button').forEach(function(x){x.classList.toggle('on',x===b)});drawMap();$('#room-card').innerHTML='<small>Plan</small><b>Touchez une salle</b><span>pour voir ses sessions du jour.</span>'}});

/* --- billet --- */
function drawPass(){$('#p-pass').textContent=PASS[me.pass]||'Pass Participant';$('#p-name').textContent=me.prenom+' '+me.nom;$('#p-org').textContent=me.org||'';$('#p-code').textContent=me.c;
  qr($('#qr-big'),'ADICOMDAYS|'+me.c+'|'+me.prenom+' '+me.nom,420);qr($('#qr-peek'),'ADICOMDAYS|'+me.c,104);
  if(IN[me.c]){$('#pass').classList.add('used');$('#p-state').innerHTML='<i></i>Entrée validée à '+hm(IN[me.c])+'. Bonnes journées !'}}
$('#code-f').addEventListener('submit',function(e){e.preventDefault();var c=$('#code-in').value.trim().toUpperCase(),f=null;Object.keys(R).forEach(function(k){if(R[k].c===c)f=R[k]});
  if(f){me=f;drawAll();toast('Billet ouvert','Bienvenue, '+me.prenom+'.')}else toast('Code introuvable','Vérifiez le code reçu à l\'inscription.')});

/* --- régie : arrivées --- */
var FN=['Aminata','Kouadio','Fatou','Jean-Marc','Awa','Serge','Mariam','Ibrahim','Grâce','Yao','Nadia','Christian','Bintou','Hervé','Salimata','Didier','Esther','Moussa','Rokia','Arnaud','Prisca','Koffi','Djeneba','Franck','Ange','Mohamed','Carine','Lamine','Inès','Wilfried'];
var LN=['K.','T.','D.','B.','C.','O.','S.','A.','N.','Y.','M.','G.','Z.','L.'];
var REG=1342,DOORS=['Porte A','Porte B','Porte C'],PS=[['Participant',.62,'#964C97'],['Créateur',.28,'#B6D401'],['Partenaire et presse',.10,'#2EC4B6']];
var seed=11;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
var ARR=[],IN=store('in')||{};
(function build(){var t=8*60+15;while(t<T0){var lam=t<9*60?4.2:t<9*60+40?8.8:t<10*60+20?4.1:2.2;t+= -Math.log(1-rnd())/lam;if(t>=T0)break;var pr=rnd(),pi=pr<.62?0:pr<.9?1:2;ARR.push({t:t,n:FN[Math.floor(rnd()*FN.length)]+' '+LN[Math.floor(rnd()*LN.length)],p:pi,d:Math.floor(rnd()*3)})}})();
var lastT=T0;
function liveArr(){var T=now();while(lastT<T){var lam=T<11*60?1.0:.5;lastT+= -Math.log(1-Math.random())/lam;if(lastT>T){break}var pr=Math.random(),pi=pr<.62?0:pr<.9?1:2;ARR.push({t:lastT,n:FN[Math.floor(Math.random()*FN.length)]+' '+LN[Math.floor(Math.random()*LN.length)],p:pi,d:Math.floor(Math.random()*3)})}}
var FEEDX=[];
function drawRegie(){if($('#regie').hidden)return;liveArr();var T=now(),n=ARR.length,rate=n/REG*100;
  $('#rg-clock').textContent=hm(T);$('#k-in').textContent=n.toLocaleString('fr-FR');$('#k-reg').textContent=REG.toLocaleString('fr-FR');$('#k-bar').style.width=rate.toFixed(1)+'%';
  $('#k-rate').textContent=Math.round(rate)+' %';$('#k-rate-s').textContent=rate>=75?'objectif 75 % atteint':'objectif 75 % · encore '+Math.ceil(REG*.75-n);
  var l15=ARR.filter(function(a){return a.t>T-15}).length;$('#k-15').textContent=l15;var w=Math.max(1,Math.round(l15/3/4));$('#k-wait').textContent=w+' min';$('#k-wait-s').textContent='3 portes ouvertes'+(w>3?' · ouvrir la porte D':'');
  var b0=8*60+15,B=[];for(var t=b0;t<=T;t+=15)B.push(t);B=B.slice(-12);var cnt=B.map(function(t){return ARR.filter(function(a){return a.t>=t&&a.t<t+15}).length}),mx=Math.max.apply(null,cnt.concat([1])),pk=cnt.indexOf(Math.max.apply(null,cnt));
  $('#bars').innerHTML=B.map(function(t,i){return '<div class="'+(i===B.length-1?'cur':'')+'"><em>'+cnt[i]+'</em><i style="height:'+(cnt[i]/mx*100)+'%"></i><span>'+hm(t)+'</span></div>'}).join('');
  $('#peak').textContent='pic : '+cnt[pk]+' entrées à '+hm(B[pk]);
  $('#by-pass').innerHTML=PS.map(function(p,i){var c=ARR.filter(function(a){return a.p===i}).length,tot=Math.round(REG*p[1]);return '<div class="hb"><div class="hb-l"><b>'+p[0]+'</b><span>'+c+' / '+tot+'</span></div><div class="hb-b"><i style="width:'+(c/tot*100).toFixed(1)+'%;background:'+p[2]+'"></i></div></div>'}).join('');
  $('#by-door').innerHTML=DOORS.map(function(d,i){var c=ARR.filter(function(a){return a.d===i}).length;return '<div class="hb"><div class="hb-l"><b>'+d+'</b><span>'+c+'</span></div><div class="hb-b"><i style="width:'+(c/n*100).toFixed(1)+'%;background:#7A3A7B"></i></div></div>'}).join('');
  var F=ARR.slice(-14).reverse().map(function(a){return '<li>'+ava(a.n,36)+'<div><b>'+esc(a.n)+'</b><span>'+PS[a.p][0]+' · '+DOORS[a.d]+'</span></div><time>'+hm(a.t)+'</time></li>'});
  $('#feed').innerHTML=FEEDX.concat(F).slice(0,16).join('');
  var occ=[['Grande scène',640,Math.min(640,Math.round(n*.52))],['Salle Lagune',180,Math.min(180,Math.round(n*.11))],['Salle Atelier',40,40],['Jardin',400,Math.round(n*.14)]];
  $('#rooms').innerHTML='<div class="rooms">'+occ.map(function(o){var p=o[2]/o[1]*100,c=p>=95?'#C0262E':p>=75?'#B0560E':'#1F7A3D';return '<div class="room"><b>'+o[0]+'</b><span style="color:'+c+'">'+Math.round(p)+' %</span><p>'+o[2]+' / '+o[1]+' places'+(p>=95?' · complet, orienter vers la retransmission':'')+'</p><div class="hb-b"><i style="width:'+Math.min(100,p)+'%;background:'+c+'"></i></div></div>'}).join('')+'</div>';
}
function drawMod(){var W=Q.filter(function(q){return q.s==='wait'});$('#mod-n').textContent=W.length+' en attente';
  $('#mod').innerHTML=W.length?W.map(function(q){return '<li>'+esc(q.t)+'<small>'+esc(q.a)+' · '+q.u+' soutiens</small><div class="ma"><button class="y" data-m="pin" data-id="'+q.id+'">Afficher à l\'écran</button><button data-m="ok" data-id="'+q.id+'">Publier</button><button data-m="no" data-id="'+q.id+'">Écarter</button></div></li>'}).join(''):'<li class="empty">Aucune question en attente. Les nouvelles questions des participants arrivent ici.</li>';
  $$('#mod [data-m]').forEach(function(b){b.onclick=function(){var q=Q.filter(function(x){return x.id==b.dataset.id})[0];if(b.dataset.m==='no')Q.splice(Q.indexOf(q),1);else{if(b.dataset.m==='pin')Q.forEach(function(x){if(x.s==='pin')x.s='ans'});q.s=b.dataset.m==='pin'?'pin':''}saveQ();drawQ()}})}
$('#scan-f').addEventListener('submit',function(e){e.preventDefault();var v=$('#scan-in').value.trim(),V=v.toUpperCase(),f=null;
  if(me.c===V||(me.prenom+' '+me.nom).toLowerCase()===v.toLowerCase())f=me;Object.keys(R).forEach(function(k){var r=R[k];if(r.c===V||(r.prenom+' '+r.nom).toLowerCase()===v.toLowerCase())f=r});
  var res=$('#scan-res');
  if(!f){res.innerHTML='<div class="ko">✕ Billet inconnu : « '+esc(v)+' ». Vérifier la pièce d\'identité et l\'inscription.</div>';FEEDX.unshift('<li class="ko">'+ava('!',36)+'<div><b>Billet refusé</b><span>'+esc(v)+'</span></div><time>'+hm(now())+'</time></li>');FEEDX=FEEDX.slice(0,2);drawRegie();return}
  if(IN[f.c]){res.innerHTML='<div class="dup">⚠ Déjà entré à '+hm(IN[f.c])+' : '+esc(f.prenom+' '+f.nom)+'. Double passage signalé.</div>';return}
  IN[f.c]=now();store('in',IN);ARR.push({t:now(),n:f.prenom+' '+f.nom.charAt(0)+'.',p:f.pass==='createur'?1:0,d:0});
  res.innerHTML='<div class="ok">✓ Entrée validée : '+esc(f.prenom+' '+f.nom)+' · '+(PASS[f.pass]||'Pass Participant')+(f.org?' · '+esc(f.org):'')+'</div>';$('#scan-in').value='';drawRegie();drawPass()});
$('#push-f').addEventListener('submit',function(e){e.preventDefault();var t=$('#push-in').value.trim();if(!t)return;ANN.unshift([hm(now()),t]);store('ann',ANN);$('#push-in').value='';$('#push-log').textContent='Envoyée à '+hm(now())+' à '+ARR.length+' participants présents et '+REG+' inscrits.';$('#notif-dot').classList.add('on');drawHome();toast('Annonce de l\'organisation',t)});
function regie(on){$('#regie').hidden=!on;document.body.style.overflow=on?'auto':'';if(on){drawRegie();drawMod();history.replaceState&&history.replaceState(null,'','#regie')}else history.replaceState&&history.replaceState(null,'','#')}
$('#open-regie').onclick=function(){regie(true)};$('#rg-close').onclick=function(){regie(false)};
$('#rg-speed').onclick=function(){var on=speed===1;setSpeed(on?20:1);this.classList.toggle('on',on);this.textContent=on?'Vitesse réelle':'Accélérer ×20'};
$$('.d-list li').forEach(function(l){l.onclick=function(){go(l.dataset.go)}});

/* --- tout dessiner --- */
function drawAll(){drawHome();drawAg();drawNet();drawPoll();drawQ();drawPass()}
drawAll();drawMap();$('#room-card').innerHTML='<small>Plan</small><b>Touchez une salle</b><span>pour voir ses sessions du jour.</span>';
qr($('#qr-desk'),location.href.split('#')[0],128);
var h=location.hash.replace('#','').split('?')[0];
if(h==='regie')regie(true);else if(h&&$('#s-'+h))go(h);
addEventListener('hashchange',function(){var h=location.hash.replace('#','').split('?')[0];if(h==='regie'){if($('#regie').hidden)regie(true)}else if(h&&$('#s-'+h))go(h)});
setTimeout(function(){var T=now(),nx=S.filter(function(s){return s[1]===1&&mins(s[2])>T&&inMine(s[0])})[0];if(nx)toast('Rappel · à '+nx[2],nx[4]+' · '+nx[6])},2500);
setInterval(function(){drawHome();if(!$('#regie').hidden)drawRegie()},4000);
})();
