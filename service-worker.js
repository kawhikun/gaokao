const CACHE_NAME = 'gaokao-v15-shell-20260422-v15';
const CORE = ["./", "./index.html", "./recite.html", "./text-map.html", "./coverage-plus.html", "./resources.html", "./gallery.html", "./practice.html", "./writing.html", "./meme-library.html", "./random.html", "./games.html", "./knowledge.html", "./paper.html", "./classroom.html", "./teacher.html", "./review.html", "./404.html", "./assets/css/styles.css", "./assets/js/bootstrap.js", "./assets/js/start.js", "./assets/js/app.bundle.js", "./assets/js/app.v11.patch.js", "./assets/js/gaokao.v13.data.js", "./assets/js/app.v13.patch.js", "./text_question_audit.csv", "./text_question_audit.json", "./text_question_audit_plus.csv", "./text_question_audit_plus.json", "./assets/memes/meme_changting.svg", "./assets/memes/meme_chaotianzi.svg", "./assets/memes/meme_chenqing.svg", "./assets/memes/meme_efanggong.svg", "./assets/memes/meme_guanwei.png", "./assets/memes/meme_lejing.jpg", "./assets/memes/meme_liuguo.svg", "./assets/memes/meme_mengyou.svg", "./assets/memes/meme_pipa_plus.svg", "./assets/memes/meme_qx.svg", "./assets/memes/meme_shishuo_plus.svg", "./assets/games/scene_algorithm_court.svg", "./assets/games/scene_grammar_surgery.svg", "./assets/games/scene_neighborhood_void.svg", "./assets/games/scene_punctuation_bomb.svg", "./assets/games/scene_robber_labour.svg", "./assets/reference-gallery/cuzhi1.webp", "./assets/reference-gallery/cuzhi2.webp", "./assets/reference-gallery/cuzhi3.webp", "./assets/reference-gallery/cuzhi4.webp", "./assets/reference-gallery/jianai1.webp", "./assets/reference-gallery/jianai2.webp", "./assets/reference-gallery/jianai3.webp", "./assets/reference-gallery/jianai4.webp", "./assets/reference-gallery/laozi1.webp", "./assets/reference-gallery/laozi2.webp", "./assets/reference-gallery/laozi3.webp", "./assets/reference-gallery/laozi4.webp", "./assets/reference-gallery/suwu4.webp", "./assets/reference-gallery/wushi1.webp", "./assets/reference-gallery/wushi2.webp", "./assets/reference-gallery/wushi3.webp", "./assets/reference-gallery/人皆1.webp", "./assets/reference-gallery/人皆2.webp", "./assets/reference-gallery/人皆3.webp", "./assets/reference-gallery/人皆4.webp", "./assets/reference-gallery/大学1.webp", "./assets/reference-gallery/大学2.webp", "./assets/reference-gallery/大学3.webp", "./assets/reference-gallery/大学4.webp", "./assets/reference-gallery/成绩1.PNG", "./assets/reference-gallery/未考.PNG", "./assets/reference-gallery/苏武1.webp", "./assets/reference-gallery/苏武2.webp", "./assets/reference-gallery/苏武3.webp", "./assets/reference-gallery/论语1.webp", "./assets/reference-gallery/论语2.webp", "./assets/reference-gallery/论语3.webp", "./assets/reference-gallery/论语4.webp", "./assets/js/app.v14.fun.patch.js", "./assets/js/app.v15.auth.cloud.patch.js", "./accounts.json", "./cloud-sync.config.json", "./assets/games/scene_kpi_cage.svg", "./assets/games/scene_cyber_family.svg", "./assets/games/scene_first_cut.svg", "./assets/games/scene_sequence_map.svg", "./assets/games/scene_coherence_bridge.svg", "./assets/games/scene_rhetoric_masquerade.svg", "./assets/games/scene_idiom_maze.svg", "./assets/games/scene_word_pitch.svg", "./assets/games/scene_opening_er.svg", "./assets/games/scene_structure_boss.svg", "./assets/games/scene_reflection_valve.svg", "./assets/games/scene_title_workshop.svg"];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);


  if (url.origin === self.location.origin && (/\/accounts\.json(?:\?|$)/.test(url.pathname + url.search) || /\/cloud-sync\.config\.json(?:\?|$)/.test(url.pathname + url.search))) {
    event.respondWith(fetch(req, { cache: 'no-store' }).catch(() => new Response('{}', { headers:{'Content-Type':'application/json'} })));
    return;
  }
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(resp => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(resp => {
        if (resp && resp.ok && url.origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return resp;
      });
    })
  );
});
