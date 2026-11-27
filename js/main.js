/* BO Studio · language switch, reveals, hero clip, reels, quote ticket, clocks.
   Prices live in the D object below AND in index.html (services + FAQ). Change both: see .agents/workflows/change-price.md */
(function(){
  var root=document.documentElement;
  function L(){return root.lang==='fr'?'fr':'en'}
  function setLang(l){root.lang=l;document.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.set===l))});try{localStorage.setItem('ob-lang',l)}catch(e){}meta();translate('alt','data-fr-alt');translate('aria-label','data-fr-label');renderTicket(false);snd();heroLabel()}
  /* the tab title and description follow the language */
  var M={en:['BO Studio · Video editing, AI agents and websites','BO Studio: reel editing, AI agents, websites and apps for creators, agencies and small businesses. Reels from €15, a quote within 24 hours.'],
    fr:['BO Studio · Montage vidéo, agents IA et sites web','BO Studio\u00a0: montage de reels, agents IA, sites web et applications pour créateurs, agences et petites entreprises. Reels dès 15\u00a0€, devis sous 24\u00a0h.']};
  function meta(){var m=M[L()];document.title=m[0];document.querySelector('meta[name="description"]').setAttribute('content',m[1])}
  /* picture descriptions and control names: English in the HTML, French in a data attribute */
  function translate(attr,frAttr){document.querySelectorAll('['+frAttr+']').forEach(function(el){var keep='data-en-'+attr;if(!el.hasAttribute(keep))el.setAttribute(keep,el.getAttribute(attr)||'');el.setAttribute(attr,el.getAttribute(L()==='fr'?frAttr:keep))})}
  document.querySelectorAll('.langs button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.set)})});
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.querySelector('.hero').classList.add('on')})});

  var t=document.querySelectorAll('[data-reveal],.plate');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.05});
    t.forEach(function(el){io.observe(el)});
    window.addEventListener('load',function(){setTimeout(function(){t.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('is-in')})},2500)});
  } else t.forEach(function(el){el.classList.add('is-in')});

  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero clip: starts after the page has loaded (the poster shows first), with a pause button */
  var hv=document.querySelector('.hero video'),hb=document.querySelector('.hv-toggle');
  function play(v){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  function heroLabel(){var fr=L()==='fr';hb.textContent=hv.paused?(fr?'Lire':'Play'):'Pause'}
  hb.hidden=false;
  hb.addEventListener('click',function(){if(hv.paused)play(hv);else hv.pause()});
  hv.addEventListener('play',heroLabel);hv.addEventListener('pause',heroLabel);
  function startHero(){if(!reduce)play(hv)}
  if(document.readyState==='complete')startHero();else window.addEventListener('load',startHero);

  /* reels: press to play with sound, one sound at a time, pause off screen; hover peeks muted */
  var reels=[].slice.call(document.querySelectorAll('.reel')),show=document.querySelector('.reel-main video');
  function vid(r){var v=r.querySelector('video');if(!v){v=document.createElement('video');v.src=r.dataset.src;v.playsInline=true;v.setAttribute('playsinline','');v.preload='metadata';v.loop=true;r.querySelector('.fr').appendChild(v)}return v}
  function label(r){var s=r.querySelector('.snd');if(!s){s=document.createElement('span');s.className='snd';r.querySelector('.fr').appendChild(s)}var fr=L()==='fr';s.textContent=r.classList.contains('playing')?'Pause':(fr?'▶ Lire avec le son':'▶ Play with sound')}
  function snd(){reels.forEach(label)}
  /* the playing reel takes the full width on a phone (see .reels li.on) */
  function stop(r){var v=r.querySelector('video');if(v)v.pause();r.classList.remove('playing');r.parentNode.classList.remove('on');label(r)}
  function stopOthers(keep){reels.forEach(function(o){if(o!==keep&&o.classList.contains('playing'))stop(o)});if(show!==keep&&!show.paused)show.pause()}
  show.addEventListener('play',function(){stopOthers(show)});
  reels.forEach(function(r){
    label(r);
    r.addEventListener('click',function(){
      if(r.classList.contains('playing')){stop(r);return}
      stopOthers(r);
      var v=vid(r);v.muted=false;play(v);
      r.classList.add('playing');r.classList.remove('peek');r.parentNode.classList.add('on');label(r);
      if(matchMedia('(max-width:820px)').matches)r.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
    });
    if(!reduce&&matchMedia('(hover:hover)').matches){
      r.addEventListener('mouseenter',function(){if(r.classList.contains('playing'))return;var v=vid(r);v.muted=true;play(v);r.classList.add('peek')});
      r.addEventListener('mouseleave',function(){if(r.classList.contains('playing'))return;var v=r.querySelector('video');if(v)v.pause();r.classList.remove('peek')});
    }
  });
  if('IntersectionObserver' in window){
    var away=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting)return;
      if(e.target===show){if(!show.paused&&!document.fullscreenElement)show.pause()}
      else if(e.target.classList.contains('playing'))stop(e.target);
    })});
    reels.concat(show).forEach(function(el){away.observe(el)});
  }

  /* the quote ticket */
  var R={en:'2 rounds of changes',fr:'2 allers-retours de retouches'},V={en:'Vercel hosting set up',fr:'Mise en ligne Vercel'},Dm={en:'Demo before the balance',fr:'Démo avant le solde'},Q={en:'Date in the quote',fr:'Date dans le devis'};
  var D={
    video:[
      {id:'reel',en:'Single reels',fr:'Reels à l\'unité',p:15,unit:true,time:{en:'48 h per reel',fr:'48\u00a0h par reel'},inc:R},
      {id:'pack',en:'Pack of 8 reels per month',fr:'Pack 8 reels par mois',p:95,per:{en:'per month',fr:'par mois'},time:{en:'48 h per reel',fr:'48\u00a0h par reel'},inc:R},
      {id:'pod',en:'1 podcast episode into 5 clips',fr:'1 épisode de podcast en 5 clips',p:55,time:Q,inc:R},
      {id:'yt',en:'YouTube video up to 15 min',fr:'Vidéo YouTube jusqu\'à 15 min',p:40,from:1,time:Q,inc:R}
    ],
    ai:[
      {id:'auto',en:'Simple automation',fr:'Automatisation simple',p:90,from:1,time:{en:'3 to 7 days',fr:'3 à 7\u00a0jours'},inc:Dm},
      {id:'assist',en:'AI assistant: email, leads, FAQ',fr:'Assistant IA\u00a0: e-mails, prospects, FAQ',p:180,from:1,time:{en:'3 to 7 days',fr:'3 à 7\u00a0jours'},inc:Dm},
      {id:'care',en:'Monitoring and fixes',fr:'Suivi et corrections',p:18,per:{en:'per month',fr:'par mois'},nodep:1,time:{en:'After delivery',fr:'Après la livraison'},inc:{en:'Fixes when something breaks',fr:'Corrections en cas de panne'}}
    ],
    web:[
      {id:'land',en:'Landing page',fr:'Landing page',p:150,from:1,time:{en:'About a week',fr:'Une semaine environ'},inc:V},
      {id:'site',en:'Business site, up to 5 pages',fr:'Site vitrine, jusqu\'à 5 pages',p:270,from:1,time:Q,inc:V},
      {id:'app',en:'Flutter mobile app',fr:'Application mobile Flutter',p:360,from:1,time:Q,inc:{en:'Built with Flutter',fr:'Développée avec Flutter'}},
      {id:'shop',en:'Online store',fr:'Boutique en ligne',p:480,from:1,time:Q,inc:V}
    ]
  };
  var st={cat:'video',id:'pack',q:4};
  var offersEl=document.querySelector('.offers'),qtyEl=document.querySelector('.qty'),ticket=document.querySelector('.ticket');
  var hintEl=document.querySelector('.picker .hint'),statusEl=document.getElementById('t-status');
  var MAIL='oussema.bouchahwa@ipsas.tn',WA='https://wa.me/21653106229',PACK=8;
  function eur(n){return L()==='fr'?n+'\u00a0€':'€'+n}
  function priceText(o,n){var fr=L()==='fr';return (o.from?(fr?'dès\u00a0':'from '):'')+eur(n)+(o.per?(fr?'\u00a0/\u00a0mois':' / month'):'')}
  function find(cat,id){return D[cat].filter(function(o){return o.id===id})[0]}
  function cur(){return find(st.cat,st.id)}
  /* rebuild the buttons only when the list changes, so keyboard focus stays on the chosen offer */
  function drawOffers(){
    var key=st.cat+'-'+L();
    if(offersEl.getAttribute('data-key')!==key){
      offersEl.setAttribute('data-key',key);offersEl.innerHTML='';
      D[st.cat].forEach(function(o){
        var b=document.createElement('button');b.type='button';b.setAttribute('data-id',o.id);
        b.innerHTML='<span>'+o[L()]+'</span><span>'+priceText(o,o.p)+'</span>';
        b.addEventListener('click',function(){st.id=o.id;renderTicket(true)});
        offersEl.appendChild(b);
      });
    }
    [].forEach.call(offersEl.children,function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-id')===st.id))});
  }
  function renderTicket(bump){
    var o=cur(),l=L(),fr=l==='fr';
    drawOffers();
    qtyEl.hidden=!o.unit;
    var total=o.unit?o.p*st.q:o.p,n=st.q+' reel'+(st.q>1?'s':'');
    var title=o.unit?(fr?n+' à l\'unité':n+', one by one'):o[l];
    qtyEl.querySelector('output').textContent=n;
    document.getElementById('t-title').textContent=title;
    document.getElementById('t-price').textContent=eur(total);
    document.getElementById('t-per').textContent=o.per?o.per[l]:(o.from?(fr?'prix de départ':'starting price'):(fr?'au total':'in total'));
    document.getElementById('t-time').textContent=o.time[l];
    document.getElementById('t-inc').textContent=o.inc[l];
    document.getElementById('t-dep').textContent=o.nodep?(fr?'Aucun':'None'):(o.from?(fr?'50\u00a0% du devis':'50% of the quote'):eur(Math.round(total/2)));
    document.getElementById('t-pay').textContent=(fr?'Virement':'Bank transfer')+(o.nodep?'':', 50/50');
    var pack=find('video','pack');
    hintEl.hidden=!(o.unit&&total>pack.p);
    hintEl.textContent=fr?('Choisir le pack\u00a0: '+PACK+' reels à '+priceText(pack,pack.p)+' au lieu de '+eur(PACK*o.p)):('Choose the pack: '+PACK+' reels for '+priceText(pack,pack.p)+' instead of '+eur(PACK*o.p));
    var price=priceText(o,total);
    var subj=(fr?'Devis BO Studio\u00a0: ':'BO Studio quote: ')+title+' ('+price+')';
    var body=fr?('Bonjour Oussema,\n\nJe suis intéressé(e) par\u00a0: '+title+' ('+price+').\n\nMon projet en quelques lignes\u00a0:\n\nMon délai\u00a0:\n\nMerci\u00a0!'):('Hi Oussema,\n\nI am interested in: '+title+' ('+price+').\n\nMy project in a few lines:\n\nMy deadline:\n\nThanks!');
    document.getElementById('t-send').href='mailto:'+MAIL+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
    document.getElementById('t-wa').href=WA+'?text='+encodeURIComponent(body);
    statusEl.textContent='';
    if(bump){ticket.classList.remove('bump');void ticket.offsetWidth;ticket.classList.add('bump')}
  }
  function pick(cat){
    st.cat=cat;st.id=D[cat][cat==='video'?1:0].id;
    document.querySelectorAll('.cats button').forEach(function(x){x.setAttribute('aria-pressed',String(x.dataset.cat===cat))});
    renderTicket(true);
  }
  document.querySelectorAll('.cats button').forEach(function(b){b.addEventListener('click',function(){pick(b.dataset.cat)})});
  /* the button on each service sheet opens the ticket on that service */
  document.querySelectorAll('[data-quote]').forEach(function(a){a.addEventListener('click',function(){pick(a.getAttribute('data-quote'))})});
  qtyEl.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){st.q=Math.max(1,Math.min(20,st.q+(+b.dataset.q)));renderTicket(true)})});
  hintEl.addEventListener('click',function(){st.id='pack';renderTicket(true);offersEl.querySelector('[data-id="pack"]').focus()});

  /* copy the email address; if the browser refuses, show it so it can be selected */
  function oldCopy(){
    var a=document.createElement('textarea'),ok=false,back=document.activeElement;
    a.value=MAIL;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';
    document.body.appendChild(a);a.select();
    try{ok=document.execCommand('copy')}catch(e){}
    document.body.removeChild(a);if(back)back.focus({preventScroll:true});
    return ok;
  }
  function copied(ok){statusEl.textContent=ok?(L()==='fr'?'Adresse copiée':'Address copied'):MAIL}
  document.getElementById('t-copy').addEventListener('click',function(){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(MAIL).then(function(){copied(true)},function(){copied(oldCopy())})}
    else copied(oldCopy());
  });

  function hm(tz){try{return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(new Date()).split(':')}catch(e){return null}}
  function tick(){[['clk-sfax','Africa/Tunis'],['clk-paris','Europe/Paris']].forEach(function(c){var v=hm(c[1]);if(v)document.getElementById(c[0]).innerHTML=v[0]+'<i>:</i>'+v[1]})}
  tick();setInterval(tick,15000);
  setLang(L());
})();
