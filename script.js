(() => {
  'use strict';

  const cover = document.querySelector('.page');
  const reveal = document.querySelector('#reveal');
  const launch = document.querySelector('#discover-btn');
  const back = document.querySelector('#back-btn');
  const music = document.querySelector('#background-audio');
  const musicButton = document.querySelector('#music-btn');
  const musicText = musicButton.querySelector('.music-text');
  const burstLayer = document.querySelector('#burst-layer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Le compteur chronologique est calendaire. L'heure exacte de naissance
  // n'étant pas connue, le point de départ est le 17 novembre 2009 à minuit,
  // heure de Madagascar (UTC+3, sans changement d'heure).
  const BIRTH_YEAR = 2009;
  const BIRTH_MONTH_ZERO_BASED = 10; // novembre
  const BIRTH_DAY = 17;
  const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const clockNodes = {
    years: document.querySelector('#clock-years'),
    months: document.querySelector('#clock-months'),
    days: document.querySelector('#clock-days'),
    hours: document.querySelector('#clock-hours'),
    minutes: document.querySelector('#clock-minutes'),
    seconds: document.querySelector('#clock-seconds')
  };
  let clockInterval = null;
  let focusBeforeOpen = null;

  function agePartsAt(timestamp) {
    // Décalage volontaire de +3h, puis utilisation des champs UTC : on
    // obtient des dates civiles malgaches, même sur un mobile configuré ailleurs.
    const local = new Date(timestamp + TZ_OFFSET_MS);
    const civilNow = Date.UTC(
      local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(),
      local.getUTCHours(), local.getUTCMinutes(), local.getUTCSeconds()
    );
    const calendarAnchor = (years, months = 0) =>
      Date.UTC(BIRTH_YEAR + years, BIRTH_MONTH_ZERO_BASED + months, BIRTH_DAY);
    if (civilNow < calendarAnchor(0)) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let years = local.getUTCFullYear() - BIRTH_YEAR;
    if (calendarAnchor(years) > civilNow) years -= 1;
    let months = (local.getUTCFullYear() - (BIRTH_YEAR + years)) * 12
      + (local.getUTCMonth() - BIRTH_MONTH_ZERO_BASED);
    while (calendarAnchor(years, months) > civilNow) months -= 1;
    while (calendarAnchor(years, months + 1) <= civilNow) months += 1;

    let remaining = civilNow - calendarAnchor(years, months);
    const days = Math.floor(remaining / ONE_DAY_MS);
    remaining %= ONE_DAY_MS;
    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { years, months, days, hours, minutes, seconds };
  }

  function updateClock() {
    const values = agePartsAt(Date.now());
    for (const [unit, element] of Object.entries(clockNodes)) {
      const formatted = String(values[unit]).padStart(2, '0');
      if (element.textContent !== formatted) element.textContent = formatted;
    }
    const label = Object.entries(values)
      .map(([unit, value]) => `${value} ${({ years:'ans', months:'mois', days:'jours', hours:'heures', minutes:'minutes', seconds:'secondes' })[unit]}`)
      .join(', ');
    document.querySelector('#age-clock').setAttribute('aria-label', `Temps écoulé : ${label}`);
  }

  function startClock() {
    updateClock();
    if (clockInterval !== null) clearInterval(clockInterval);
    // Synchronisation sur un nouvel affichage lors du retour dans l'onglet.
    clockInterval = setInterval(updateClock, 1000);
  }

  function stopClock() {
    if (clockInterval !== null) clearInterval(clockInterval);
    clockInterval = null;
  }

  function littleHeartBurst() {
    if (reduceMotion) return;
    const rect = launch.getBoundingClientRect();
    const x = rect.left + rect.width * .52;
    const y = rect.top + rect.height * .5;
    for (let i = 0; i < 13; i += 1) {
      const el = document.createElement('span');
      const radians = Math.PI * 2 * i / 13;
      const radius = 65 + i % 4 * 20;
      el.textContent = i % 4 === 0 ? '✳' : '♥';
      el.className = 'burst-heart';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--dx', `${Math.cos(radians) * radius}px`);
      el.style.setProperty('--dy', `${Math.sin(radians) * radius - 35}px`);
      el.style.setProperty('--rotate', `${(i % 2 ? 1 : -1) * 75}deg`);
      el.style.setProperty('--size', `${13 + i % 4 * 4}px`);
      el.style.setProperty('--delay', `${i % 3 * 35}ms`);
      burstLayer.append(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }
  }

  function openReveal() {
    focusBeforeOpen = document.activeElement;
    // Une lecture demandée par le clic est permise sur les mobiles modernes.
    // Appel synchrone dans l'événement utilisateur, avant toute animation.
    playMusic();
    littleHeartBurst();
    reveal.inert = false;
    reveal.scrollTop = 0;
    reveal.classList.remove('is-open');
    // Force un nouveau cycle des animations même après une réouverture.
    void reveal.offsetWidth;
    reveal.classList.add('is-open');
    reveal.setAttribute('aria-hidden', 'false');
    cover.inert = true;
    document.body.classList.add('modal-open');
    startClock();
    back.focus({ preventScroll: true });
  }

  function stopMusic() {
    music.pause();
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.setAttribute('aria-label', 'Lancer la musique');
    musicText.textContent = 'Musique';
  }

  function closeReveal() {
    if (gallery.dialog.open) gallery.dialog.close();
    stopMusic();
    stopClock();
    reveal.classList.remove('is-open');
    reveal.setAttribute('aria-hidden', 'true');
    reveal.inert = true;
    cover.inert = false;
    document.body.classList.remove('modal-open');
    if (focusBeforeOpen) focusBeforeOpen.focus({ preventScroll: true });
  }

  function playMusic() {
    // Ne pas faire d'await avant play(): indispensable pour préserver
    // l'activation utilisateur sur Android / Chrome.
    music.volume = 0.75;
    music.currentTime = 0;
    try {
      const playAttempt = music.play();
      if (playAttempt && typeof playAttempt.then === 'function') {
        playAttempt.then(() => {
          musicButton.setAttribute('aria-pressed', 'true');
          musicButton.setAttribute('aria-label', 'Mettre la musique en pause');
          musicText.textContent = 'Pause';
        }).catch(error => {
          musicButton.setAttribute('aria-pressed', 'false');
          musicButton.setAttribute('aria-label', 'Lancer la musique');
          musicText.textContent = 'Musique';
          console.warn('Lecture audio à relancer manuellement :', error);
        });
      }
    } catch (error) {
      console.warn('Lecture audio bloquée :', error);
    }
  }

  function toggleMusic() {
    if (!music.paused) {
      stopMusic();
    } else {
      playMusic();
    }
  }


  // Dix messages issus du projet original, suivis de sept souhaits originaux.
  // Pour personnaliser les textes, modifie uniquement les champs « title » et « text ».
  const BIRTHDAY_NOTES = [
    { title: 'Ton sourire.', text: 'Ton sourire qui illumine même mes jours les plus sombres' },
    { title: 'Ton regard.', text: 'Ta façon de me regarder comme si j’étais la plus belle chose au monde' },
    { title: 'Ta gentillesse.', text: 'Ta gentillesse infinie envers tout le monde' },
    { title: 'Ton rire.', text: 'Ton rire contagieux qui remplit la pièce de bonheur' },
    { title: 'Ton courage.', text: 'Ta force et ton courage qui m’inspirent chaque jour' },
    { title: 'Ta douceur.', text: 'La douceur de tes mains quand tu prends les miennes' },
    { title: 'Ta patience.', text: 'Ta patience et ta compréhension quand j’en ai besoin' },
    { title: 'Ta présence.', text: 'La façon dont tu me fais sentir aimé sans même un mot' },
    { title: 'Ta curiosité.', text: 'Ton intelligence et ta curiosité qui m’émerveillent' },
    { title: 'Juste toi.', text: 'Tout simplement parce que tu es toi, et que toi c’est parfait' },
    { title: 'Tes rêves.', text: 'Que cette nouvelle année te donne l’audace de poursuivre ce qui te fait vibrer.' },
    { title: 'Tes découvertes.', text: 'Je te souhaite des lieux à explorer, de belles surprises et des souvenirs à garder longtemps.' },
    { title: 'Tes victoires.', text: 'Même les plus petites méritent d’être célébrées. N’oublie jamais le chemin déjà parcouru.' },
    { title: 'Ta liberté.', text: 'Continue de grandir à ta façon, sans jamais perdre ce qui te rend unique.' },
    { title: 'Les jours doux.', text: 'Je te souhaite des éclats de rire spontanés, des journées légères et des moments paisibles.' },
    { title: 'Tout ce qui vient.', text: 'Dix-sept ans, c’est tant de belles choses à imaginer. Je te souhaite une suite à la hauteur de tes rêves.' },
    { title: 'Aujourd’hui.', text: 'Aujourd’hui, tu n’as rien à prouver. Seulement à profiter de cette journée qui porte ton nom. Joyeux anniversaire, Tsiky. ♥' }
  ];
  let currentNoteIndex = 0;
  const noteNodes = {
    reader: document.querySelector('#notes-reader'),
    card: document.querySelector('#note-card'),
    title: document.querySelector('#note-title'),
    text: document.querySelector('#note-text'),
    kicker: document.querySelector('#note-kicker'),
    number: document.querySelector('#note-number'),
    watermark: document.querySelector('#note-watermark'),
    position: document.querySelector('#notes-position'),
    step: document.querySelector('#notes-step'),
    meter: document.querySelector('#notes-meter'),
    fill: document.querySelector('#notes-meter-fill'),
    hint: document.querySelector('#notes-hint'),
    prev: document.querySelector('#notes-prev'),
    next: document.querySelector('#notes-next')
  };

  function showNote(index) {
    if (index < 0 || index >= BIRTHDAY_NOTES.length) return;
    const direction = index >= currentNoteIndex ? 'next' : 'prev';
    currentNoteIndex = index;
    const note = BIRTHDAY_NOTES[index];
    const number = String(index + 1).padStart(2, '0');
    noteNodes.title.textContent = note.title;
    noteNodes.text.textContent = note.text;
    noteNodes.number.textContent = `Nº ${number}`;
    noteNodes.watermark.textContent = number;
    noteNodes.position.textContent = `${number} / 17`;
    noteNodes.step.textContent = `${number} — 17`;
    noteNodes.kicker.textContent = index < 10 ? 'CE QUE J’AIME CHEZ TOI' : 'UN SOUHAIT POUR TES 17 ANS';
    noteNodes.meter.setAttribute('aria-valuenow', String(index + 1));
    noteNodes.fill.style.width = `${(index + 1) / BIRTHDAY_NOTES.length * 100}%`;
    noteNodes.prev.disabled = index === 0;
    noteNodes.next.disabled = index === BIRTHDAY_NOTES.length - 1;
    noteNodes.hint.textContent = index === BIRTHDAY_NOTES.length - 1
      ? 'Dix-sept pensées, et tellement d’autres encore. Joyeux anniversaire, Tsiky ♥'
      : 'Tu peux lire chaque carte à ton rythme, sans limite de temps.';
    if (!reduceMotion) {
      noteNodes.card.classList.remove('note-in', 'note-direction-next', 'note-direction-prev');
      // Les mots arrivent dans le sens du geste, et le titre puis la phrase se succèdent.
      void noteNodes.card.offsetWidth;
      noteNodes.card.classList.add('note-in', `note-direction-${direction}`);
    }
  }
  noteNodes.prev.addEventListener('click', () => showNote(currentNoteIndex - 1));
  noteNodes.next.addEventListener('click', () => showNote(currentNoteIndex + 1));
  noteNodes.reader.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const delta = event.key === 'ArrowLeft' ? -1 : 1;
      if (currentNoteIndex + delta >= 0 && currentNoteIndex + delta < BIRTHDAY_NOTES.length) {
        event.preventDefault();
        showNote(currentNoteIndex + delta);
      }
    }
  });
  let swipeStart = null;
  noteNodes.card.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return;
    swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  noteNodes.card.addEventListener('touchend', (event) => {
    if (!swipeStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - swipeStart.x;
    const dy = event.changedTouches[0].clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      showNote(currentNoteIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  noteNodes.card.addEventListener('touchcancel', () => { swipeStart = null; });
  showNote(0);

  // Galerie : les trois seuls fichiers photo du site. Les deux portraits peuvent
  // être remplacés localement sans partager d'image ni modifier ce JavaScript.
  const GALLERY_PHOTOS = [
    {
      src: 'assets/photos/tsiky-portrait-01.jpg',
      alt: 'Portrait de Tsiky sous le soleil',
      kicker: '01 / TON SOURIRE, TON JOUR',
      title: 'La lumière, c’est toi.',
      caption: 'Une image douce et lumineuse pour ouvrir cette journée qui t’est dédiée.',
      fit: 'cover', position: 'center 34%'
    },
    {
      src: 'assets/photos/couple-plage.jpeg',
      alt: 'Tsiky et son amoureux sur la plage',
      kicker: '02 / UN SOUVENIR À DEUX',
      title: 'La plage, nous deux, ce moment.',
      caption: 'Un souvenir à la plage, choisi avec amour pour sa douceur et sa simplicité.',
      fit: 'cover', position: 'center 30%'
    },
    {
      src: 'assets/photos/tsiky-portrait-02.jpg',
      alt: 'Tsiky sur la plage',
      kicker: '03 / UNE AUTRE IMAGE DE TOI',
      title: 'Belle, paisible, inoubliable.',
      caption: 'Un dernier souvenir de toi, avec l’air de la plage, la lumière et cette belle présence qui te ressemble.',
      fit: 'cover', position: 'center 26%'
    }
  ];
  const gallery = {
    viewer: document.querySelector('#gallery-viewer'),
    wrap: document.querySelector('#gallery-photo-wrap'),
    figure: document.querySelector('#gallery-figure'),
    img: document.querySelector('#gallery-photo'),
    count: document.querySelector('#gallery-count'),
    index: document.querySelector('#gallery-photo-index'),
    kicker: document.querySelector('#gallery-kicker'),
    title: document.querySelector('#gallery-caption-title'),
    copy: document.querySelector('#gallery-caption-copy'),
    prev: document.querySelector('#gallery-prev'),
    next: document.querySelector('#gallery-next'),
    dots: Array.from(document.querySelectorAll('.gallery-dot')),
    expand: document.querySelector('#gallery-expand'),
    dialog: document.querySelector('#gallery-dialog'),
    dialogImg: document.querySelector('#gallery-dialog-img'),
    dialogLabel: document.querySelector('#gallery-dialog-label'),
    dialogClose: document.querySelector('#gallery-dialog-close')
  };
  let currentPhotoIndex = 0;

  function showPhoto(index, animate = true) {
    if (index < 0 || index >= GALLERY_PHOTOS.length) return;
    const direction = index >= currentPhotoIndex ? 'next' : 'prev';
    currentPhotoIndex = index;
    const photo = GALLERY_PHOTOS[index];
    const number = String(index + 1).padStart(2, '0');
    gallery.img.src = photo.src;
    gallery.img.alt = photo.alt;
    gallery.img.style.objectFit = photo.fit;
    gallery.img.style.objectPosition = photo.position;
    gallery.wrap.classList.toggle('is-couple', photo.fit === 'contain');
    gallery.count.textContent = `${number} — 03`;
    gallery.index.textContent = number;
    gallery.kicker.textContent = photo.kicker;
    gallery.title.textContent = photo.title;
    gallery.copy.textContent = photo.caption;
    gallery.prev.disabled = index === 0;
    gallery.next.disabled = index === GALLERY_PHOTOS.length - 1;
    gallery.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (animate && !reduceMotion) {
      gallery.figure.classList.remove('photo-enter', 'photo-slide-next', 'photo-slide-prev');
      void gallery.figure.offsetWidth;
      gallery.figure.classList.add('photo-enter', `photo-slide-${direction}`);
    }
  }

  gallery.prev.addEventListener('click', () => showPhoto(currentPhotoIndex - 1));
  gallery.next.addEventListener('click', () => showPhoto(currentPhotoIndex + 1));
  gallery.dots.forEach(dot => {
    dot.addEventListener('click', () => showPhoto(Number(dot.dataset.photo)));
  });
  gallery.viewer.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const next = currentPhotoIndex + (event.key === 'ArrowLeft' ? -1 : 1);
    if (next < 0 || next >= GALLERY_PHOTOS.length) return;
    event.preventDefault();
    showPhoto(next);
  });

  let photoSwipe = null;
  gallery.wrap.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    photoSwipe = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  gallery.wrap.addEventListener('touchend', event => {
    if (!photoSwipe || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - photoSwipe.x;
    const dy = event.changedTouches[0].clientY - photoSwipe.y;
    photoSwipe = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.35) {
      showPhoto(currentPhotoIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  gallery.wrap.addEventListener('touchcancel', () => { photoSwipe = null; });

  gallery.expand.addEventListener('click', () => {
    const photo = GALLERY_PHOTOS[currentPhotoIndex];
    gallery.dialogImg.src = photo.src;
    gallery.dialogImg.alt = photo.alt;
    gallery.dialogLabel.textContent = `PHOTO ${String(currentPhotoIndex + 1).padStart(2,'0')} / 03`;
    if (typeof gallery.dialog.showModal === 'function') gallery.dialog.showModal();
  });
  gallery.dialogClose.addEventListener('click', () => gallery.dialog.close());
  gallery.dialog.addEventListener('click', event => {
    if (event.target === gallery.dialog) gallery.dialog.close();
  });
  showPhoto(0, false);



  // CHAPITRE 04 — 17 bougies tactiles. Aucune permission microphone requise.
  // 6 bougies à l’arrière, 6 au milieu et 5 à l’avant ; elles peuvent être éteintes
  // individuellement au toucher, par clavier ou toutes ensemble par le bouton.
  const cake = {
    scene: document.querySelector('#cake-art'),
    back: document.querySelector('#cake-candles-back'),
    mid: document.querySelector('#cake-candles-mid'),
    front: document.querySelector('#cake-candles-front'),
    status: document.querySelector('#cake-status'),
    progress: document.querySelector('#cake-progress'),
    progressLabel: document.querySelector('#cake-progress-label'),
    fill: document.querySelector('#cake-progress-fill'),
    blow: document.querySelector('#cake-blow'),
    reset: document.querySelector('#cake-reset'),
    wish: document.querySelector('#cake-wish'),
    confetti: document.querySelector('#cake-confetti')
  };
  const CANDLE_COUNT = 17;
  const candleButtons = [];
  let candlesOut = 0;

  function makeCandle(i) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cake-candle';
    button.dataset.candle = String(i + 1);
    button.setAttribute('aria-label', `Éteindre la bougie ${i + 1} sur ${CANDLE_COUNT}`);
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<span class="candle-glow" aria-hidden="true"></span><span class="candle-flame" aria-hidden="true"></span><span class="candle-smoke" aria-hidden="true"></span><span class="candle-wick" aria-hidden="true"></span><span class="candle-stick" aria-hidden="true"></span>';
    button.addEventListener('click', () => extinguish(button));
    return button;
  }

  function setCandleStatus() {
    const left = CANDLE_COUNT - candlesOut;
    cake.status.textContent = left === 0 ? 'Toutes les flammes sont éteintes !' : `${left} flamme${left > 1 ? 's' : ''} allumée${left > 1 ? 's' : ''}`;
    cake.progressLabel.textContent = `${String(candlesOut).padStart(2, '0')} / 17`;
    cake.progress.setAttribute('aria-valuenow', String(candlesOut));
    cake.fill.style.width = `${100 * candlesOut / CANDLE_COUNT}%`;
    cake.blow.disabled = left === 0;
    cake.reset.hidden = left > 0;
    cake.wish.hidden = left > 0;
  }

  function launchCakeConfetti() {
    if (reduceMotion) return;
    cake.confetti.replaceChildren();
    cake.scene.classList.add('is-celebrating');
    setTimeout(() => cake.scene.classList.remove('is-celebrating'), 1800);
    const colors = ['#9b3f59','#b9a5dd','#c65c73','#f1d5dc','#e6bc82'];
    for (let i = 0; i < 44; i += 1) {
      const bit = document.createElement('span');
      bit.className = 'cake-confetti-bit';
      const angle = Math.PI * 2 * (i / 44);
      const distance = 85 + (i % 5) * 18;
      bit.style.setProperty('--dx', `${Math.round(Math.cos(angle) * distance)}px`);
      bit.style.setProperty('--dy', `${Math.round(Math.sin(angle) * distance - 65)}px`);
      bit.style.setProperty('--spin', `${(i % 2 ? -1 : 1) * (200 + i * 13)}deg`);
      bit.style.setProperty('--c', colors[i % colors.length]);
      bit.style.setProperty('--w', `${5 + (i % 3) * 2}px`);
      bit.style.setProperty('--h', `${8 + (i % 3) * 3}px`);
      bit.style.setProperty('--duration', `${900 + (i % 4) * 100}ms`);
      bit.style.setProperty('--delay', `${(i % 6) * 25}ms`);
      bit.addEventListener('animationend', () => bit.remove(), { once: true });
      cake.confetti.appendChild(bit);
    }
  }

  function extinguish(button, update = true) {
    if (!button || button.classList.contains('is-out')) return;
    button.classList.add('is-out');
    button.setAttribute('aria-pressed', 'true');
    const n = button.dataset.candle;
    button.setAttribute('aria-label', `Bougie ${n} éteinte sur ${CANDLE_COUNT}`);
    candlesOut += 1;
    if (update) {
      setCandleStatus();
      if (candlesOut === CANDLE_COUNT) launchCakeConfetti();
    }
  }

  for (let i = 0; i < CANDLE_COUNT; i += 1) {
    const button = makeCandle(i);
    (i < 6 ? cake.back : (i < 12 ? cake.mid : cake.front)).appendChild(button);
    candleButtons.push(button);
  }
  setCandleStatus();

  cake.blow.addEventListener('click', () => {
    for (const button of candleButtons) extinguish(button, false);
    setCandleStatus();
    launchCakeConfetti();
    // Focus sur le message seulement si ce geste a provoqué la révélation.
    cake.wish.focus({ preventScroll: true });
  });
  cake.reset.addEventListener('click', () => {
    cake.confetti.replaceChildren();
    cake.scene.classList.remove('is-celebrating');
    candlesOut = 0;
    for (const button of candleButtons) {
      button.classList.remove('is-out');
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Éteindre la bougie ${button.dataset.candle} sur ${CANDLE_COUNT}`);
    }
    setCandleStatus();
    cake.blow.focus({ preventScroll: true });
  });

  // Un balayage tactile sur les flammes peut en éteindre plusieurs à la fois.
  // Pas de capture de pointeur : le défilement vertical de la page reste naturel.
  let cakeSwipe = false;
  cake.scene.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    const target = event.target.closest('.cake-candle');
    cakeSwipe = Boolean(target);
    if (target) extinguish(target);
  }, { passive: true });
  cake.scene.addEventListener('touchmove', event => {
    if (!cakeSwipe || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.cake-candle');
    if (target && cake.scene.contains(target)) extinguish(target);
  }, { passive: true });
  cake.scene.addEventListener('touchend', () => { cakeSwipe = false; }, { passive: true });
  cake.scene.addEventListener('touchcancel', () => { cakeSwipe = false; }, { passive: true });

  // CHAPITRE 05 — ouverture de la lettre manuelle, sans lecture forcée ni minuterie.
  const letter = {
    cover: document.querySelector('#letter-cover'),
    open: document.querySelector('#letter-open'),
    content: document.querySelector('#letter-content'),
    close: document.querySelector('#letter-close')
  };
  let letterMotionTimer = null;
  function openLetter() {
    if (!letter.content.hidden) return;
    letter.cover.hidden = true;
    letter.content.hidden = false;
    letter.open.setAttribute('aria-expanded', 'true');
    letter.content.classList.remove('is-revealing');
    void letter.content.offsetWidth;
    if (!reduceMotion) letter.content.classList.add('is-revealing');
    if (letterMotionTimer !== null) clearTimeout(letterMotionTimer);
    // Le contenu apparait aussitôt et la lecture commence seulement au choix de Tsiky.
    letterMotionTimer = setTimeout(() => {
      letterMotionTimer = null;
      if (!letter.content.hidden) {
        letter.content.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
      }
    }, reduceMotion ? 0 : 80);
    letter.close.focus({ preventScroll: true });
  }
  function closeLetter() {
    if (letter.content.hidden) return;
    if (letterMotionTimer !== null) clearTimeout(letterMotionTimer);
    letterMotionTimer = null;
    letter.content.classList.remove('is-revealing');
    letter.content.hidden = true;
    letter.cover.hidden = false;
    letter.open.setAttribute('aria-expanded', 'false');
    letter.cover.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    letter.open.focus({ preventScroll: true });
  }
  letter.open.addEventListener('click', openLetter);
  letter.close.addEventListener('click', closeLetter);

  // Apparitions éditoriales au défilement : une fois par bloc, sans casser
  // la lecture si le navigateur ne supporte pas IntersectionObserver.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = Array.from(reveal.querySelectorAll([
      '.birthday-stage', '.reveal-heading-wrap', '.timeline-rule',
      '.age-intro', '.clock-panel', '.notes-heading', '.notes-reader',
      '.gallery-heading', '.gallery-viewer', '.cake-heading',
      '.cake-experience', '.letter-heading', '.blessing-card',
      '.letter-experience', '.letter-final-line', '.final-blessing'
    ].join(', ')));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { root: reveal, rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    revealTargets.forEach(target => {
      target.classList.add('motion-item');
      observer.observe(target);
    });
    reveal.classList.add('motion-ready');
  }

  launch.addEventListener('click', openReveal);
  back.addEventListener('click', closeReveal);
  musicButton.addEventListener('click', toggleMusic);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && reveal.classList.contains('is-open')) updateClock();
  });
  document.addEventListener('keydown', (event) => {
    if (!reveal.classList.contains('is-open')) return;
    if (gallery.dialog.open) return;
    if (event.key === 'Escape') closeReveal();
    if (event.key !== 'Tab') return;
    const focusable = Array.from(reveal.querySelectorAll('button:not([disabled])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  });
})();
