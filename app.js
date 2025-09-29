// app.js - full functionality without altering existing script.js
(function() {
  const QURAN_API = 'https://api.alquran.cloud/v1/surah';
  const QURAN_API_SURAH = (n) => `https://api.alquran.cloud/v1/surah/${n}`;
  const HADITH_JSON = 'hadith.json';
  const TAJWEED_JSON = 'tajweed.json';
  const TAFSIR_JSON = 'tafsir.json';
  const COURSES_JSON = 'courses.json';
  const FATWA_JSON = 'fatwa.json';
  const ADHKAR_JSON = 'adhkar.json';
  const QURAN_AUDIO = (surah) => `https://api.alquran.cloud/v1/surah/${surah}/ar.alafasy`;
  const PRAYER_API = (lat, lon) => `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=3`;

  const els = {
    navLinks: () => document.querySelectorAll('nav .aList a'),
    searchInput: () => document.querySelector('.search input'),
    quranSection: () => document.getElementById('quran-section'),
    hadithSection: () => document.getElementById('hadith-section'),
    categoriesSection: () => document.getElementById('categories-section'),
    tajweedSection: () => document.getElementById('tajweed-section'),
    tafsirSection: () => document.getElementById('tafsir-section'),
    authSection: () => document.getElementById('auth-section'),
    coursesSection: () => document.getElementById('courses-section'),
    fatwaSection: () => document.getElementById('fatwa-section'),
    ibadahSection: () => document.getElementById('ibadah-section'),
    rightList: () => document.querySelector('.all-thumnail'),
    modal: () => document.getElementById('verse-modal'),
    modalBody: () => document.querySelector('#verse-modal .modal-body'),
    modalClose: () => document.querySelector('#verse-modal .modal-close'),
  };

  let state = {
    surahs: [],
    hadiths: [],
    tajweed: [],
    tafsir: [],
    courses: [],
    fatwas: [],
    adhkar: { morning: [], evening: [], post_prayer: [] },
    filter: '',
    studyList: loadStudyList(),
    hadithFilters: { grading: 'all', collection: 'all', topic: 'all' },
  };

  function loadStudyList() {
    try { return JSON.parse(localStorage.getItem('studyList') || '[]'); } catch { return []; }
  }
  function saveStudyList() {
    localStorage.setItem('studyList', JSON.stringify(state.studyList));
  }
  function addToStudyList(item) {
    const exists = state.studyList.find(x => x.type === item.type && x.id === item.id);
    if (!exists) {
      state.studyList.push(item);
      saveStudyList();
      renderRightList();
      alert('Added to Study List');
    }
  }
  function removeFromStudyList(type, id) {
    state.studyList = state.studyList.filter(x => !(x.type === type && x.id === id));
    saveStudyList();
    renderRightList();
  }

  // Sections routing
  function setupNav() {
    els.navLinks().forEach(link => {
      const text = link.textContent.trim();
      let target = null;
      if (text.includes("Qur'an")) target = 'quran';
      else if (text.includes('Hadith')) target = 'hadith';
      else target = 'categories';
      link.dataset.target = target;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(target);
        els.navLinks().forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // sidebar items
    document.querySelectorAll('.menu .menu-item').forEach(item => {
      const target = item.getAttribute('data-target');
      item.addEventListener('click', () => showSection(target));
    });
  }

  function showSection(target) {
    const q = els.quranSection();
    const h = els.hadithSection();
    const c = els.categoriesSection();
    const tj = els.tajweedSection();
    const tf = els.tafsirSection();
    const au = els.authSection();
    const cr = els.coursesSection();
    const ft = els.fatwaSection();
    const ib = els.ibadahSection();
    [q,h,c,tj,tf,au,cr,ft,ib].forEach(sec => { if (sec) sec.style.display = 'none'; });
    const map = { quran: q, hadith: h, categories: c, tajweed: tj, tafsir: tf, auth: au, courses: cr, fatwa: ft, ibadah: ib };
    if (map[target]) { map[target].style.display = 'block'; }
    if (target === 'tajweed') renderTajweed();
    if (target === 'tafsir') renderTafsir();
    if (target === 'auth') renderHadithAuth();
    if (target === 'courses') renderCourses();
    if (target === 'fatwa') renderFatwa();
    if (target === 'ibadah') renderIbadah();
  }

  // Fetch data
  function loadQuran() {
    return fetch(QURAN_API)
      .then(r => r.json())
      .then(d => Array.isArray(d?.data) ? d.data : [])
      .then(list => { state.surahs = list; renderQuran(); });
  }

  function loadHadith() {
    return fetch(HADITH_JSON)
      .then(r => r.json())
      .then(list => { state.hadiths = Array.isArray(list) ? list : []; renderHadith(); })
      .catch(() => { state.hadiths = []; renderHadith(); });
  }

  function loadTajweed() { return fetch(TAJWEED_JSON).then(r=>r.json()).then(d=>{ state.tajweed = Array.isArray(d)? d: []; }); }
  function loadTafsir() { return fetch(TAFSIR_JSON).then(r=>r.json()).then(d=>{ state.tafsir = Array.isArray(d)? d: []; }); }
  function loadCourses() { return fetch(COURSES_JSON).then(r=>r.json()).then(d=>{ state.courses = Array.isArray(d)? d: []; }); }
  function loadFatwa() { return fetch(FATWA_JSON).then(r=>r.json()).then(d=>{ state.fatwas = Array.isArray(d)? d: []; }); }
  function loadAdhkar() { return fetch(ADHKAR_JSON).then(r=>r.json()).then(d=>{ state.adhkar = d || { morning:[], evening:[], post_prayer:[] }; }); }

  // Renderers
  function renderQuran() {
    const root = els.quranSection();
    if (!root) return;
    const filtered = state.filter
      ? state.surahs.filter(s => (s.englishName || '').toLowerCase().includes(state.filter))
      : state.surahs;
    root.innerHTML = '';

    const list = document.createElement('div');
    list.className = 'list quran-list';
    filtered.forEach(s => {
      const row = document.createElement('div');
      row.className = 'list-row';
      const title = document.createElement('div');
      title.className = 'list-title';
      title.textContent = `${s.number}. ${s.englishName} (${s.numberOfAyahs} ayat)`;
      const actions = document.createElement('div');
      actions.className = 'list-actions';
      const readBtn = document.createElement('button');
      readBtn.className = 'button watch-button';
      readBtn.textContent = 'Read';
      readBtn.addEventListener('click', () => openSurah(s.number));
      const addBtn = document.createElement('button');
      addBtn.className = 'button drop-button';
      addBtn.textContent = 'Add';
      addBtn.addEventListener('click', () => addToStudyList({ type: 'surah', id: s.number, name: s.englishName, meta: `${s.numberOfAyahs} ayat` }));
      actions.appendChild(addBtn); actions.appendChild(readBtn);
      row.appendChild(title); row.appendChild(actions);
      list.appendChild(row);
    });

    root.appendChild(sectionHeader('Qur\'an Surahs'));
    root.appendChild(list);
  }

  function renderHadith() {
    const root = els.hadithSection();
    if (!root) return;
    let filtered = state.hadiths;
    if (state.filter) filtered = filtered.filter(h => (h.title||'').toLowerCase().includes(state.filter) || (h.text||'').toLowerCase().includes(state.filter));
    const { grading, collection, topic } = state.hadithFilters;
    if (grading !== 'all') filtered = filtered.filter(h => (h.grading||'').toLowerCase().includes(grading));
    if (collection !== 'all') filtered = filtered.filter(h => (h.collection||'').toLowerCase().includes(collection));
    if (topic !== 'all') filtered = filtered.filter(h => Array.isArray(h.topics) && h.topics.includes(topic));

    root.innerHTML = '';

    const filters = document.createElement('div');
    filters.className = 'controls';
    const selGrade = document.createElement('select'); selGrade.className='select';
    ['all','sahih','hasan','daif'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent = `Grade: ${v}`; selGrade.appendChild(o); });
    selGrade.value = grading; selGrade.addEventListener('change',()=>{ state.hadithFilters.grading=selGrade.value; renderHadith(); });
    const selColl = document.createElement('select'); selColl.className='select';
    ['all','sahihayn','bukhari','muslim','riyadh as-salihin'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent = `Collection: ${v}`; selColl.appendChild(o); });
    selColl.value = collection; selColl.addEventListener('change',()=>{ state.hadithFilters.collection=selColl.value; renderHadith(); });
    const selTopic = document.createElement('select'); selTopic.className='select';
    ['all','creed','worship','manners','quran'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent = `Topic: ${v}`; selTopic.appendChild(o); });
    selTopic.value = topic; selTopic.addEventListener('change',()=>{ state.hadithFilters.topic=selTopic.value; renderHadith(); });
    filters.appendChild(selGrade); filters.appendChild(selColl); filters.appendChild(selTopic);
    const list = document.createElement('div');
    list.className = 'list hadith-list';

    filtered.forEach(h => {
      const row = document.createElement('div');
      row.className = 'list-row';
      const title = document.createElement('div');
      title.className = 'list-title';
      title.textContent = `${h.title} — ${h.reference}`;
      const actions = document.createElement('div');
      actions.className = 'list-actions';
      const readBtn = document.createElement('button');
      readBtn.className = 'button watch-button';
      readBtn.textContent = 'Read';
      readBtn.addEventListener('click', () => openHadith(h));
      const addBtn = document.createElement('button');
      addBtn.className = 'button drop-button';
      addBtn.textContent = 'Add';
      addBtn.addEventListener('click', () => addToStudyList({ type: 'hadith', id: h.id, name: h.title, meta: h.reference }));
      actions.appendChild(addBtn); actions.appendChild(readBtn);
      row.appendChild(title); row.appendChild(actions);

      const detail = document.createElement('div');
      detail.className = 'hadith-detail hidden';
      detail.textContent = h.text;
      row.appendChild(detail);

      list.appendChild(row);
    });

    root.appendChild(sectionHeader('Hadith (curated)'));
    root.appendChild(filters);
    root.appendChild(list);
  }

  function renderTajweed() {
    const root = els.tajweedSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader('Tajweed Tips'));
    const list = document.createElement('div'); list.className='list';
    state.tajweed.forEach(t=>{
      const row = document.createElement('div'); row.className='list-row';
      const title = document.createElement('div'); title.className='list-title'; title.textContent=t.title;
      const actions = document.createElement('div'); actions.className='list-actions';
      const readBtn = document.createElement('button'); readBtn.className='button watch-button'; readBtn.textContent='View';
      readBtn.addEventListener('click',()=>{
        const body = els.modalBody(); if (!body) return; body.innerHTML='';
        const h = document.createElement('h3'); h.textContent=t.title; body.appendChild(h);
        const ul = document.createElement('ul'); t.tips.forEach(x=>{ const li=document.createElement('li'); li.textContent=x; ul.appendChild(li); }); body.appendChild(ul);
        const refs = document.createElement('div'); refs.className='muted';
        t.references.forEach(r=>{ const a=document.createElement('a'); a.href=r.link; a.target='_blank'; a.rel='noopener'; a.textContent=r.name; a.style.marginRight='8px'; refs.appendChild(a); });
        body.appendChild(refs); showModal(true);
      });
      actions.appendChild(readBtn); row.appendChild(title); row.appendChild(actions); list.appendChild(row);
    });
    root.appendChild(list);
  }

  function renderTafsir() {
    const root = els.tafsirSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader('Tafsir (Ibn Kathir)'));
    const list = document.createElement('div'); list.className='list';
    state.tafsir.forEach(t=>{
      const row=document.createElement('div'); row.className='list-row';
      const title=document.createElement('div'); title.className='list-title'; title.textContent=`${t.source} — Surah ${t.surah}:${t.ayah}`;
      const actions=document.createElement('div'); actions.className='list-actions';
      const link=document.createElement('a'); link.href=t.link; link.target='_blank'; link.rel='noopener'; link.textContent='Read full'; link.className='btn';
      actions.appendChild(link); row.appendChild(title); row.appendChild(actions);
      const detail=document.createElement('div'); detail.className='muted'; detail.textContent=t.excerpt;
      list.appendChild(row); list.appendChild(detail);
    });
    root.appendChild(list);
  }

  function renderHadithAuth() {
    const root = els.authSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader('Hadith Authentication Notes'));
    const p=document.createElement('div'); p.className='muted';
    p.textContent = "Entries curated from Sahihayn and Riyadh as-Salihin with grading notes (e.g., Al-Albani).";
    root.appendChild(p);
    // reuse renderHadith list
    const mirror=document.createElement('div'); root.appendChild(mirror);
    els.hadithSection().innerHTML='';
    renderHadith();
    root.appendChild(els.hadithSection().cloneNode(true));
  }

  function renderCourses() {
    const root = els.coursesSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader('Aqeedah & Fiqh Fundamentals'));
    const grid=document.createElement('div'); grid.className='grid';
    state.courses.forEach(cs=>{
      const card=document.createElement('div'); card.className='card';
      const title=document.createElement('h3'); title.textContent=cs.title; card.appendChild(title);
      const scholars=document.createElement('div'); scholars.className='muted'; scholars.textContent = `Scholars: ${cs.scholars.join(', ')}`; card.appendChild(scholars);
      const btn=document.createElement('button'); btn.className='btn'; btn.textContent='Open';
      btn.addEventListener('click',()=>{
        const body=els.modalBody(); if (!body) return; body.innerHTML='';
        const h=document.createElement('h3'); h.textContent=cs.title; body.appendChild(h);
        cs.lessons.forEach(lesson=>{
          const sec=document.createElement('div'); sec.className='subsection';
          const sh=document.createElement('h4'); sh.textContent=lesson.title; sec.appendChild(sh);
          const sm=document.createElement('div'); sm.textContent=lesson.summary; sec.appendChild(sm);
          if (lesson.quiz && lesson.quiz.length){
            const q=lesson.quiz[0];
            const qd=document.createElement('div'); qd.style.marginTop='8px'; qd.textContent=q.q; sec.appendChild(qd);
            q.choices.forEach((c,i)=>{
              const b=document.createElement('button'); b.className='btn secondary'; b.textContent=c; b.addEventListener('click',()=>{
                alert(i===q.correct? 'Correct':'Try again');
              }); sec.appendChild(b);
            });
          }
          body.appendChild(sec);
        });
        showModal(true);
      });
      card.appendChild(btn); grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function renderFatwa() {
    const root = els.fatwaSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader('Fatwa Navigator (Trusted Sources)'));
    const controls=document.createElement('div'); controls.className='controls';
    const input=document.createElement('input'); input.className='input'; input.placeholder='Search keywords';
    controls.appendChild(input);
    root.appendChild(controls);
    const list=document.createElement('div'); list.className='list'; root.appendChild(list);
    function refresh(){
      const q=(input.value||'').toLowerCase();
      list.innerHTML='';
      state.fatwas.filter(f=> !q || f.title.toLowerCase().includes(q) || f.summary.toLowerCase().includes(q) || (f.tags||[]).some(t=>t.includes(q))).forEach(f=>{
        const row=document.createElement('div'); row.className='list-row';
        const title=document.createElement('div'); title.className='list-title'; title.textContent = `${f.title} — ${f.source}`;
        const actions=document.createElement('div'); actions.className='list-actions';
        const a=document.createElement('a'); a.href=f.link; a.target='_blank'; a.rel='noopener'; a.textContent='Read full'; a.className='btn';
        actions.appendChild(a); row.appendChild(title); row.appendChild(actions);
        const detail=document.createElement('div'); detail.className='muted'; detail.textContent=f.summary;
        list.appendChild(row); list.appendChild(detail);
      });
    }
    input.addEventListener('input', refresh); refresh();
  }

  function renderIbadah() {
    const root = els.ibadahSection(); if (!root) return; root.innerHTML='';
    root.appendChild(sectionHeader("Daily 'Ibadah & Adhkar"));
    const wrap=document.createElement('div'); wrap.className='grid'; root.appendChild(wrap);
    // Prayer times
    const prayerCard=document.createElement('div'); prayerCard.className='card';
    const ph=document.createElement('h3'); ph.textContent='Prayer Times'; prayerCard.appendChild(ph);
    const pBody=document.createElement('div'); prayerCard.appendChild(pBody);
    function loadPrayer(){
      if (!navigator.geolocation) { pBody.textContent='Location not available'; return; }
      navigator.geolocation.getCurrentPosition(pos=>{
        fetch(PRAYER_API(pos.coords.latitude, pos.coords.longitude)).then(r=>r.json()).then(d=>{
          const t=d?.data?.timings||{}; pBody.innerHTML='';
          Object.entries(t).slice(0,6).forEach(([k,v])=>{ const row=document.createElement('div'); row.textContent=`${k}: ${v}`; pBody.appendChild(row); });
        }).catch(()=>{ pBody.textContent='Failed to load times'; });
      }, ()=>{ pBody.textContent='Location permission denied'; });
    }
    const pbtn=document.createElement('button'); pbtn.className='btn'; pbtn.textContent='Load Times'; pbtn.addEventListener('click', loadPrayer); prayerCard.appendChild(pbtn);
    wrap.appendChild(prayerCard);

    // Adhkar
    const adhCard=document.createElement('div'); adhCard.className='card';
    const ah=document.createElement('h3'); ah.textContent='Adhkar'; adhCard.appendChild(ah);
    const sel=document.createElement('select'); sel.className='select'; ['morning','evening','post_prayer'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; sel.appendChild(o); }); adhCard.appendChild(sel);
    const aList=document.createElement('div'); aList.className='list'; adhCard.appendChild(aList);
    function renderAdh(){ aList.innerHTML=''; (state.adhkar[sel.value]||[]).forEach(z=>{ const row=document.createElement('div'); row.className='list-row'; const title=document.createElement('div'); title.className='list-title rtl'; title.textContent=z.text; const meta=document.createElement('div'); meta.className='muted'; meta.textContent=`${z.reference} — ${z.grading}`; row.appendChild(title); row.appendChild(meta); aList.appendChild(row); }); }
    sel.addEventListener('change', renderAdh); renderAdh();
    wrap.appendChild(adhCard);

    // Habit tracking
    const habit=document.createElement('div'); habit.className='card';
    const hh=document.createElement('h3'); hh.textContent='Habit Tracking'; habit.appendChild(hh);
    const items=[{id:'quran',name:'Qur\'an reading'},{id:'sadaqah',name:'Sadaqah'},{id:'kin',name:'Visit kin'}];
    items.forEach(it=>{
      const key=`habit_${it.id}`; const val=Number(localStorage.getItem(key)||0);
      const row=document.createElement('div'); row.className='list-row';
      const title=document.createElement('div'); title.className='list-title'; title.textContent=`${it.name}: ${val}`;
      const actions=document.createElement('div'); actions.className='list-actions';
      const inc=document.createElement('button'); inc.className='btn'; inc.textContent='Done today'; inc.addEventListener('click',()=>{ const v=Number(localStorage.getItem(key)||0)+1; localStorage.setItem(key, String(v)); title.textContent=`${it.name}: ${v}`; });
      actions.appendChild(inc); row.appendChild(title); row.appendChild(actions); habit.appendChild(row);
    });
    wrap.appendChild(habit);
  }

  function renderCategories() {
    const root = els.categoriesSection();
    if (!root) return;
    const cats = [
      { id: 'tawheed', name: 'Tawheed' },
      { id: 'salah', name: 'Salah (Prayer)' },
      { id: 'zakah', name: 'Zakah' },
      { id: 'sawm', name: 'Sawm (Fasting)' },
      { id: 'taharah', name: 'Taharah (Purification)' },
      { id: 'akhlaq', name: 'Akhlaq (Manners)' }
    ];
    root.innerHTML = '';
    root.appendChild(sectionHeader('Categories'));
    const grid = document.createElement('div');
    grid.className = 'cat-grid';
    cats.forEach(c => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.textContent = c.name;
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function renderRightList() {
    const right = els.rightList();
    if (!right) return;
    right.innerHTML = '';
    state.studyList.forEach(item => {
      const cont = document.createElement('div');
      cont.className = 'thumbnail cont';
      const details = document.createElement('div');
      details.className = 'more-d';
      details.appendChild(document.createElement('div')); // image cell placeholder
      const info = document.createElement('div');
      info.className = 'info';
      const h3 = document.createElement('h3');
      h3.textContent = item.name;
      const p1 = document.createElement('p');
      p1.textContent = item.meta || '';
      const p2 = document.createElement('p');
      p2.textContent = `Type: ${item.type}`;
      info.appendChild(h3); info.appendChild(p1); info.appendChild(p2);
      details.appendChild(info);

      const buttons = document.createElement('div');
      buttons.className = 'buttons';
      const removeBtn = document.createElement('button');
      removeBtn.className = 'button drop-button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeFromStudyList(item.type, item.id));
      const readBtn = document.createElement('button');
      readBtn.className = 'button watch-button';
      readBtn.textContent = 'Read';
      readBtn.addEventListener('click', () => {
        if (item.type === 'surah') openSurah(item.id);
        if (item.type === 'hadith') openHadith(state.hadiths.find(h => h.id === item.id));
      });
      buttons.appendChild(removeBtn); buttons.appendChild(readBtn);

      cont.appendChild(details); cont.appendChild(buttons);
      right.appendChild(cont);
    });
  }

  // Helpers
  function sectionHeader(title) {
    const h = document.createElement('h2');
    h.className = 'section-title';
    h.textContent = title;
    return h;
  }

  function openSurah(number) {
    fetch(QURAN_API_SURAH(number))
      .then(r => r.json())
      .then(d => d?.data)
      .then(surah => {
        if (!surah) return;
        const body = els.modalBody();
        if (!body) return;
        body.innerHTML = '';
        const title = document.createElement('h3');
        title.textContent = `${surah.englishName} — ${surah.name} (${surah.numberOfAyahs} ayat)`;
        body.appendChild(title);
        const list = document.createElement('div');
        list.className = 'verse-list';
        surah.ayahs.forEach(a => {
          const v = document.createElement('div');
          v.className = 'verse-item';
          const ar = document.createElement('div'); ar.className = 'verse-ar'; ar.textContent = a.text;
          const meta = document.createElement('div'); meta.className = 'verse-meta'; meta.textContent = `(${a.numberInSurah})`;
          v.appendChild(ar); v.appendChild(meta);
          list.appendChild(v);
        });
        body.appendChild(list);

        // Audio recitation
        fetch(QURAN_AUDIO(number)).then(r=>r.json()).then(d=>{
          const audioUrl = d?.data?.ayahs?.[0]?.audio; // using first ayah to derive base
          if (audioUrl) {
            const audio = document.createElement('audio'); audio.controls = true; audio.src = audioUrl;
            body.appendChild(audio);
          }
        }).catch(()=>{});

        // Spaced repetition: add to study with due date
        const srBtn=document.createElement('button'); srBtn.className='btn'; srBtn.textContent='Add to Spaced Repetition';
        srBtn.addEventListener('click',()=>{
          const due=Date.now()+24*60*60*1000; // 1 day
          addToStudyList({ type:'surah', id:number, name:surah.englishName, meta:`Due: ${new Date(due).toLocaleDateString()}`, due });
        });
        body.appendChild(srBtn);
        showModal(true);
      });
  }

  function openHadith(h) {
    if (!h) return;
    const body = els.modalBody();
    if (!body) return;
    body.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = `${h.title} — ${h.reference}`;
    const text = document.createElement('div');
    text.textContent = h.text;
    const grade = document.createElement('div');
    grade.className = 'hadith-grade';
    grade.textContent = h.grading || '';
    body.appendChild(title); body.appendChild(text); body.appendChild(grade);
    showModal(true);
  }

  function showModal(show) {
    const m = els.modal();
    if (!m) return;
    if (show) m.classList.remove('hidden'); else m.classList.add('hidden');
  }

  function setupModal() {
    const close = els.modalClose();
    if (close) close.addEventListener('click', () => showModal(false));
    const m = els.modal();
    if (m) m.addEventListener('click', (e) => { if (e.target === m) showModal(false); });
  }

  function setupSearch() {
    const input = els.searchInput();
    if (!input) return;
    input.addEventListener('input', (e) => {
      state.filter = (e.target.value || '').toLowerCase();
      renderQuran();
      renderHadith();
    });
  }

  // Boot
  document.addEventListener('DOMContentLoaded', async () => {
    setupNav();
    setupModal();
    setupSearch();
    showSection('quran');
    await Promise.all([loadQuran(), loadHadith(), loadTajweed(), loadTafsir(), loadCourses(), loadFatwa(), loadAdhkar()]);
    renderCategories();
    renderRightList();
  });
})();
