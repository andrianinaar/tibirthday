/* ═══════════════════════════════════════════════════════════
   JOYEUX ANNIVERSAIRE — SCRIPT v4
   Auto-scroll, auto-play, SVG icons, 0 emoji
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   CONFIGURATION
   ───────────────────────────────────────────────────────── */

var CONFIG = {
    prenom: "Iloniaina",
    anniversaire: { jour: 17, mois: "Novembre" },
    dateCouple: new Date(2024, 0, 7),
    dateCoupleTexte: "7 janvier 2024",

    // Photos — nom complet AVEC extension (.jpg .jpeg .png .webp .avif .gif)
    photos: [
        "photos/1.jpeg",
        "photos/2.jpeg",
        "photos/3.jpeg",
        "photos/4.jpeg",
        "photos/5.jpeg",
        "photos/6.jpeg",
        "photos/7.webp",
        "photos/8.jpeg"
    ],

    reasons: [
        "Ton sourire qui illumine même mes jours les plus sombres",
        "Ta façon de me regarder comme si j'étais la plus belle chose au monde",
        "Ta gentillesse infinie envers tout le monde",
        "Ton rire contagieux qui remplit la pièce de bonheur",
        "Ta force et ton courage qui m'inspirent chaque jour",
        "La douceur de tes mains quand tu prends les miennes",
        "Ta patience et ta compréhension quand j'en ai besoin",
        "La façon dont tu me fais sentir aimé sans même un mot",
        "Ton intelligence et ta curiosité qui m'émerveillent",
        "Tout simplement parce que tu es toi, et que toi c'est parfait"
    ],

    messageFinal: [
        "Ma chère Iloniaina,",
        "Aujourd'hui est un jour spécial, car c'est le jour où le monde a eu la chance de te recevoir. Et moi, j'ai eu la chance encore plus grande de te rencontrer et de t'aimer.",
        "Depuis que tu es entrée dans ma vie, tout est devenu plus beau, plus doux, plus lumineux. Tu es mon soleil les jours de pluie, mon étoile dans la nuit, et la raison pour laquelle je souris chaque matin.",
        "J'aime tout de toi. Ton rire qui remplit la pièce, ta gentillesse qui touche tous ceux qui te connaissent, ta force qui m'inspire chaque jour, et cette lumière dans tes yeux qui me fait tomber amoureux de toi encore et encore.",
        "En ce jour d'anniversaire, je veux que tu saches à quel point tu comptes pour moi. Tu n'es pas seulement ma copine, tu es ma meilleure amie, ma confidente, mon tout.",
        "Je te souhaite tout le bonheur du monde, toutes les étoiles du ciel, et tout l'amour que mon cœur peut contenir — et crois-moi, pour toi, il est infini.",
        "Joyeux anniversaire, mon amour."
    ],

    typewriterSpeed: 30,

    // ─── TIMINGS AUTO-SCROLL (en millisecondes) ───
    // Ajuste ces valeurs pour laisser plus ou moins de temps sur chaque section
    timings: {
        revealDuration: 7000,        // Temps sur la révélation avant auto-scroll vers bougies
        afterCandlesBlow: 3500,      // Temps après bougies soufflées avant auto-scroll vers compteur
        counterDuration: 7000,       // Temps sur le compteur
        reasonFlipInterval: 1200,    // Intervalle entre chaque flip de carte
        reasonsAfterFlip: 2500,      // Temps après toutes les cartes retournées
        photoInterval: 3500,         // Temps par photo
        afterLastPhoto: 2000,        // Temps après la dernière photo
        afterTypewriter: 4000,       // Temps après la fin de la lettre
        scrollAnimDuration: 1200     // Durée estimée du scroll smooth (pour les délais)
    }
};

/* ═══════════════════════════════════════════════════════════
   SVG HEART (réutilisé partout en JS)
   ═══════════════════════════════════════════════════════════ */

var HEART_SVG_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

function createHeartSVG(size, color) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.fill = color;
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART_SVG_PATH);
    svg.appendChild(path);
    return svg;
}


/* ═══════════════════════════════════════════════════════════
   DOM
   ═══════════════════════════════════════════════════════════ */

var DOM = {
    loader: document.getElementById('loader'),
    welcomeScreen: document.getElementById('welcome-screen'),
    countdownScreen: document.getElementById('countdown-screen'),
    mainContent: document.getElementById('main-content'),
    starsCanvas: document.getElementById('stars-canvas'),
    openBtn: document.getElementById('open-btn'),
    countdownNumber: document.getElementById('countdown-number'),
    revealName: document.getElementById('reveal-name'),
    revealDate: document.getElementById('reveal-date'),
    floatingHearts: document.getElementById('floating-hearts'),
    fallingPetals: document.getElementById('falling-petals'),
    scrollIndicator: document.getElementById('scroll-indicator'),
    candlesCake: document.getElementById('candles-cake'),
    candlesInstruction: document.getElementById('candles-instruction'),
    candlesWish: document.getElementById('candles-wish'),
    fireworksCanvas: document.getElementById('fireworks-canvas'),
    coupleDateText: document.getElementById('couple-date-text'),
    counterDays: document.getElementById('counter-days'),
    counterHours: document.getElementById('counter-hours'),
    counterMinutes: document.getElementById('counter-minutes'),
    counterSeconds: document.getElementById('counter-seconds'),
    reasonsGrid: document.getElementById('reasons-grid'),
    slideshowTrack: document.getElementById('slideshow-track'),
    slideshowDots: document.getElementById('slideshow-dots'),
    slideshowContainer: document.getElementById('slideshow-container'),
    slidePrev: document.getElementById('slide-prev'),
    slideNext: document.getElementById('slide-next'),
    photoOverlay: document.getElementById('photo-overlay'),
    photoOverlayImg: document.getElementById('photo-overlay-img'),
    photoOverlayClose: document.getElementById('photo-overlay-close'),
    messageBody: document.getElementById('message-body'),
    typewriterCursor: document.getElementById('typewriter-cursor'),
    messageSignature: document.getElementById('message-signature'),
    replayBtn: document.getElementById('replay-btn'),
    musicBtn: document.getElementById('music-btn'),
    musicIconOn: document.getElementById('music-icon-on'),
    musicIconOff: document.getElementById('music-icon-off'),
    bgMusic: document.getElementById('bg-music'),
    confettiCanvas: document.getElementById('confetti-canvas')
};


/* ═══════════════════════════════════════════════════════════
   ÉTAT
   ═══════════════════════════════════════════════════════════ */

var currentSlide = 0;
var isMusicPlaying = false;
var candlesBlown = false;
var typewriterStarted = false;
var counterInterval = null;
var photoAutoInterval = null;


/* ═══════════════════════════════════════════════════════════
   AUTO-SCROLL CONTROLLER
   Gère tous les timers d'auto-avancement.
   On peut tout annuler d'un coup avec AutoPlay.clearAll()
   ═══════════════════════════════════════════════════════════ */

var AutoPlay = {
    timers: [],

    schedule: function (fn, delay) {
        var id = setTimeout(fn, delay);
        this.timers.push(id);
        return id;
    },

    clearAll: function () {
        this.timers.forEach(function (id) { clearTimeout(id); });
        this.timers = [];
        if (photoAutoInterval) { clearInterval(photoAutoInterval); photoAutoInterval = null; }
    },

    scrollTo: function (sectionId, callback) {
        var el = document.getElementById(sectionId);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Attendre que le scroll soit fini avant d'exécuter callback
        if (callback) {
            this.schedule(callback, CONFIG.timings.scrollAnimDuration);
        }
    }
};


/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */

(function init() {
    DOM.revealName.textContent = CONFIG.prenom;
    DOM.revealDate.textContent = CONFIG.anniversaire.jour + " " + CONFIG.anniversaire.mois;
    DOM.coupleDateText.textContent = CONFIG.dateCoupleTexte;

    buildSlideshow();
    buildReasonCards();

    DOM.openBtn.addEventListener('click', handleOpenClick);
    DOM.musicBtn.addEventListener('click', toggleMusic);
    DOM.replayBtn.addEventListener('click', handleReplay);
    DOM.candlesCake.addEventListener('click', blowCandles);
    DOM.photoOverlayClose.addEventListener('click', closePhotoOverlay);
    DOM.photoOverlay.addEventListener('click', function (e) {
        if (e.target === DOM.photoOverlay) closePhotoOverlay();
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(showWelcome);
    } else {
        window.addEventListener('load', showWelcome);
    }
})();

function showWelcome() {
    setTimeout(function () {
        DOM.loader.classList.add('fade-out');
        setTimeout(function () {
            DOM.loader.classList.add('hidden');
            DOM.welcomeScreen.classList.remove('hidden');
            initStars();
        }, 600);
    }, 800);
}


/* ═══════════════════════════════════════════════════════════
   ÉTOILES + ÉTOILES FILANTES
   ═══════════════════════════════════════════════════════════ */

function initStars() {
    var canvas = DOM.starsCanvas;
    var ctx = canvas.getContext('2d');
    var stars = [], shootingStars = [], animFrame;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

    function createStars() {
        stars = [];
        var count = Math.floor((canvas.width * canvas.height) / 3000);
        for (var i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5, alpha: Math.random(),
                dAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.alpha += s.dAlpha;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.dAlpha *= -1;
            s.alpha = Math.max(0.1, Math.min(1, s.alpha));
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212,197,226,' + s.alpha + ')'; ctx.fill();
        }
        for (var j = shootingStars.length - 1; j >= 0; j--) {
            var ss = shootingStars[j];
            ss.x += Math.cos(ss.angle) * ss.speed; ss.y += Math.sin(ss.angle) * ss.speed; ss.life++;
            if (ss.life > ss.maxLife * 0.6) ss.alpha -= 0.05;
            if (ss.alpha <= 0) { shootingStars.splice(j, 1); continue; }
            var tx = ss.x - Math.cos(ss.angle) * ss.len, ty = ss.y - Math.sin(ss.angle) * ss.len;
            var g = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
            g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,' + ss.alpha + ')');
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ss.x, ss.y);
            ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.stroke();
            ctx.beginPath(); ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,' + ss.alpha + ')'; ctx.fill();
        }
        if (Math.random() < 0.008) {
            shootingStars.push({
                x: Math.random() * canvas.width * 0.8, y: Math.random() * canvas.height * 0.4,
                len: Math.random() * 60 + 40, speed: Math.random() * 8 + 6,
                angle: Math.PI / 6 + Math.random() * Math.PI / 6,
                alpha: 1, life: 0, maxLife: 40 + Math.random() * 30
            });
        }
        animFrame = requestAnimationFrame(draw);
    }

    resize(); createStars(); draw();
    window.addEventListener('resize', function () { resize(); createStars(); });
    window._starsAnim = { stop: function () { cancelAnimationFrame(animFrame); } };
}


/* ═══════════════════════════════════════════════════════════
   BOUTON OUVRIR
   ═══════════════════════════════════════════════════════════ */

function handleOpenClick() {
    playMusic();
    vibrate(50);
    DOM.welcomeScreen.classList.add('fade-out');
    setTimeout(function () {
        DOM.welcomeScreen.classList.add('hidden');
        if (window._starsAnim) window._starsAnim.stop();
        DOM.countdownScreen.classList.remove('hidden');
        startCountdown();
    }, 800);
}


/* ═══════════════════════════════════════════════════════════
   COUNTDOWN
   ═══════════════════════════════════════════════════════════ */

function startCountdown() {
    var count = 3;
    function show() {
        if (count <= 0) { DOM.countdownScreen.classList.add('hidden'); showMainContent(); return; }
        DOM.countdownNumber.textContent = count;
        DOM.countdownNumber.style.animation = 'none';
        void DOM.countdownNumber.offsetWidth;
        DOM.countdownNumber.style.animation = 'countBounce 0.8s ease forwards';
        vibrate(30);
        setTimeout(function () {
            DOM.countdownNumber.style.animation = 'countFadeOut 0.3s ease forwards';
            setTimeout(function () { count--; show(); }, 300);
        }, 700);
    }
    show();
}


/* ═══════════════════════════════════════════════════════════
   AFFICHER CONTENU PRINCIPAL + LANCER L'AUTO-PLAY
   ═══════════════════════════════════════════════════════════ */

function showMainContent() {
    DOM.mainContent.classList.remove('hidden');
    vibrate([50, 30, 80, 30, 50]);

    launchConfetti();
    startFloatingHearts();
    startFallingPetals();
    startCoupleCounter();
    initScrollObserver();
    window.scrollTo(0, 0);

    // ═══ SÉQUENCE AUTO-SCROLL ═══
    // Étape 1 : Profiter de la révélation → auto-scroll vers bougies
    AutoPlay.schedule(function () {
        // Cacher l'indicateur scroll manuel
        var si = DOM.scrollIndicator;
        if (si) si.style.display = 'none';

        AutoPlay.scrollTo('section-candles');
        // Les bougies attendent le TAP de l'utilisateur (seule action manuelle)
    }, CONFIG.timings.revealDuration);
}


/* ═══════════════════════════════════════════════════════════
   SÉQUENCE APRÈS BOUGIES (déclenchée par blowCandles)
   ═══════════════════════════════════════════════════════════ */

function startPostCandlesSequence() {
    var T = CONFIG.timings;

    // Étape 2 : Compteur
    AutoPlay.schedule(function () {
        AutoPlay.scrollTo('section-counter', function () {
            // Étape 3 : Raisons
            AutoPlay.schedule(function () {
                AutoPlay.scrollTo('section-reasons', function () {
                    autoFlipReasonCards();
                });
            }, T.counterDuration);
        });
    }, T.afterCandlesBlow);
}

function autoFlipReasonCards() {
    var T = CONFIG.timings;
    var cards = DOM.reasonsGrid.querySelectorAll('.reason-card');
    var total = cards.length;

    cards.forEach(function (card, i) {
        AutoPlay.schedule(function () {
            card.classList.add('flipped');
            vibrate(10);
        }, i * T.reasonFlipInterval);
    });

    // Après toutes les cartes retournées → photos
    AutoPlay.schedule(function () {
        AutoPlay.scrollTo('section-photos', function () {
            startPhotoAutoPlay();
        });
    }, total * T.reasonFlipInterval + T.reasonsAfterFlip);
}

function startPhotoAutoPlay() {
    var T = CONFIG.timings;
    var total = CONFIG.photos.length;
    var count = 1; // on est déjà sur la photo 0

    photoAutoInterval = setInterval(function () {
        if (count >= total) {
            clearInterval(photoAutoInterval);
            photoAutoInterval = null;
            // Après la dernière photo → message
            AutoPlay.schedule(function () {
                AutoPlay.scrollTo('section-message');
                // Le typewriter démarre automatiquement via IntersectionObserver
                // Après le typewriter → replay (géré dans startTypewriter)
            }, T.afterLastPhoto);
            return;
        }
        goToSlide(count);
        count++;
    }, T.photoInterval);
}


/* ═══════════════════════════════════════════════════════════
   CONFETTIS
   ═══════════════════════════════════════════════════════════ */

function launchConfetti() {
    var canvas = DOM.confettiCanvas, ctx = canvas.getContext('2d');
    var particles = [];
    var colors = ['#B8A9C9','#967BB6','#D4C5E2','#F4C2C2','#E8A0BF','#D4AF37','#F0D78C','#FFFFFF'];
    var start = Date.now();

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    function make() {
        var a = Math.random() * Math.PI * 2, sp = Math.random() * 6 + 2;
        return {
            x: canvas.width/2 + (Math.random()-0.5)*canvas.width*0.4,
            y: canvas.height*0.3 + (Math.random()-0.5)*100,
            vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - Math.random()*4,
            r: Math.random()*6+3, color: colors[Math.floor(Math.random()*colors.length)],
            rot: Math.random()*360, rotS: (Math.random()-0.5)*10,
            g: 0.08+Math.random()*0.04, alpha: 1,
            shape: Math.random()<0.5?'r':'c', w: Math.random()*8+4, h: Math.random()*4+2
        };
    }
    for (var i = 0; i < 80; i++) particles.push(make());

    function anim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var el = Date.now() - start;
        if (el < 6000 && Math.random() < 0.3) particles.push(make());
        for (var i = particles.length-1; i >= 0; i--) {
            var p = particles[i];
            p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.rotS;
            if (el > 8000) p.alpha -= 0.01;
            if (p.y > canvas.height+50 || p.alpha <= 0) { particles.splice(i,1); continue; }
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot*Math.PI/180);
            ctx.globalAlpha = Math.max(0, p.alpha); ctx.fillStyle = p.color;
            if (p.shape==='r') ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
            else { ctx.beginPath(); ctx.arc(0,0,p.r,0,Math.PI*2); ctx.fill(); }
            ctx.restore();
        }
        if (particles.length > 0) requestAnimationFrame(anim);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    anim();
}


/* ═══════════════════════════════════════════════════════════
   CŒURS FLOTTANTS SVG
   ═══════════════════════════════════════════════════════════ */

function startFloatingHearts() {
    var container = DOM.floatingHearts;
    var heartColors = ['#E8A0BF','#F4C2C2','#B8A9C9','#D4C5E2','#967BB6'];
    var count = 0;

    function make() {
        if (count >= 35) return;
        count++;
        var wrapper = document.createElement('div');
        wrapper.className = 'floating-heart-el';
        wrapper.style.left = Math.random()*100 + '%';
        var size = 14 + Math.random()*16;
        var color = heartColors[Math.floor(Math.random()*heartColors.length)];
        wrapper.appendChild(createHeartSVG(size, color));
        var dur = Math.random()*5+6, del = Math.random()*2;
        wrapper.style.animationDuration = dur + 's';
        wrapper.style.animationDelay = del + 's';
        container.appendChild(wrapper);
        setTimeout(function () { wrapper.remove(); count--; }, (dur+del)*1000);
    }
    for (var i = 0; i < 12; i++) setTimeout(make, i*250);
    var iv = setInterval(make, 900);
    setTimeout(function () { clearInterval(iv); }, 20000);
}


/* ═══════════════════════════════════════════════════════════
   PÉTALES
   ═══════════════════════════════════════════════════════════ */

function startFallingPetals() {
    var container = DOM.fallingPetals;
    var colors = ['rgba(244,194,194,0.7)','rgba(232,160,191,0.6)','rgba(212,197,226,0.6)','rgba(184,169,201,0.5)','rgba(240,215,140,0.5)'];
    var count = 0;
    function make() {
        if (count >= 30) return; count++;
        var el = document.createElement('div'); el.className = 'petal';
        el.style.left = Math.random()*100+'%';
        el.style.background = colors[Math.floor(Math.random()*colors.length)];
        var s = Math.random()*8+8;
        el.style.width = s+'px'; el.style.height = s*1.3+'px';
        var dur = Math.random()*6+7, del = Math.random()*4;
        el.style.animationDuration = dur+'s'; el.style.animationDelay = del+'s';
        container.appendChild(el);
        setTimeout(function () { el.remove(); count--; }, (dur+del)*1000);
    }
    for (var i = 0; i < 10; i++) setTimeout(make, i*300);
    var iv = setInterval(make, 600);
    setTimeout(function () { clearInterval(iv); }, 25000);
}


/* ═══════════════════════════════════════════════════════════
   BOUGIES + FEUX D'ARTIFICE
   ═══════════════════════════════════════════════════════════ */

function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;
    vibrate([30,20,30,20,50]);

    var flames = document.querySelectorAll('.blow-flame');
    flames.forEach(function (f, i) {
        setTimeout(function () { f.classList.add('blown'); }, i * 100);
    });

    setTimeout(function () {
        DOM.candlesInstruction.style.opacity = '0';
        setTimeout(function () {
            DOM.candlesInstruction.textContent = 'Bravo !';
            DOM.candlesInstruction.style.opacity = '1';
        }, 300);
        DOM.candlesWish.classList.remove('hidden');
        DOM.candlesWish.classList.add('show');
        launchFireworks();

        // Lancer la suite automatique
        startPostCandlesSequence();
    }, flames.length * 100 + 300);
}

function launchFireworks() {
    var canvas = DOM.fireworksCanvas, ctx = canvas.getContext('2d');
    var particles = [], rockets = [];
    var colors = ['#D4AF37','#F0D78C','#B8A9C9','#F4C2C2','#FFFFFF','#E8A0BF','#967BB6'];
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    function explode(x, y, color) {
        vibrate(15);
        var n = 40 + Math.floor(Math.random()*30);
        for (var i = 0; i < n; i++) {
            var a = (Math.PI*2/n)*i + (Math.random()-0.5)*0.3, sp = 1.5+Math.random()*3;
            particles.push({ x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, alpha:1,
                color:color, r:Math.random()*2.5+1, g:0.03+Math.random()*0.02, f:0.98 });
        }
    }

    var rc = 0;
    var ri = setInterval(function () {
        if (rc >= 8) { clearInterval(ri); return; }
        rockets.push({
            x: canvas.width*(0.2+Math.random()*0.6), y: canvas.height,
            ty: canvas.height*(0.15+Math.random()*0.3), sp: 4+Math.random()*3,
            color: colors[Math.floor(Math.random()*colors.length)]
        });
        rc++;
    }, 400);

    function anim() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var r = rockets.length-1; r >= 0; r--) {
            var rk = rockets[r]; rk.y -= rk.sp;
            ctx.beginPath(); ctx.arc(rk.x,rk.y,2,0,Math.PI*2); ctx.fillStyle=rk.color; ctx.fill();
            if (rk.y <= rk.ty) { explode(rk.x,rk.y,rk.color); rockets.splice(r,1); }
        }
        for (var i = particles.length-1; i >= 0; i--) {
            var p = particles[i];
            p.vx*=p.f; p.vy*=p.f; p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.alpha-=0.012;
            if (p.alpha<=0) { particles.splice(i,1); continue; }
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.globalAlpha=Math.max(0,p.alpha); ctx.fillStyle=p.color; ctx.fill(); ctx.globalAlpha=1;
        }
        if (particles.length>0||rockets.length>0) requestAnimationFrame(anim);
        else ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    anim();
}


/* ═══════════════════════════════════════════════════════════
   COMPTEUR
   ═══════════════════════════════════════════════════════════ */

function startCoupleCounter() {
    function update() {
        var d = new Date() - CONFIG.dateCouple, t = Math.floor(d/1000);
        DOM.counterDays.textContent = Math.floor(t/86400).toLocaleString('fr-FR');
        DOM.counterHours.textContent = Math.floor((t%86400)/3600);
        DOM.counterMinutes.textContent = Math.floor((t%3600)/60);
        DOM.counterSeconds.textContent = t%60;
    }
    update();
    counterInterval = setInterval(update, 1000);
}


/* ═══════════════════════════════════════════════════════════
   RAISONS (Flip Cards)
   ═══════════════════════════════════════════════════════════ */

function buildReasonCards() {
    var grid = DOM.reasonsGrid; grid.innerHTML = '';
    CONFIG.reasons.forEach(function (reason, i) {
        var card = document.createElement('div'); card.className = 'reason-card';
        var heartSvg = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="' + HEART_SVG_PATH + '"/></svg>';
        card.innerHTML =
            '<div class="reason-card-inner">' +
                '<div class="reason-front"><span class="reason-front-number">'+(i+1)+'</span>'+heartSvg+'</div>' +
                '<div class="reason-back"><span class="reason-back-text">'+reason+'</span></div>' +
            '</div>';
        // Permettre aussi le flip manuel
        card.addEventListener('click', function () { card.classList.toggle('flipped'); vibrate(10); });
        grid.appendChild(card);
    });
}


/* ═══════════════════════════════════════════════════════════
   PHOTOS
   ═══════════════════════════════════════════════════════════ */

function buildSlideshow() {
    var track = DOM.slideshowTrack, dots = DOM.slideshowDots;
    track.innerHTML = ''; dots.innerHTML = '';

    CONFIG.photos.forEach(function (src, i) {
        var slide = document.createElement('div'); slide.className = 'slide';
        var wrap = document.createElement('div'); wrap.className = 'slide-img-wrapper';
        var img = document.createElement('img'); img.className = 'slide-img';
        img.src = src; img.alt = 'Photo '+(i+1); img.loading = i===0?'eager':'lazy';

        img.addEventListener('error', function () {
            img.style.display = 'none';
            var ph = document.createElement('div'); ph.className = 'slide-placeholder';
            ph.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>' +
                '<span class="slide-placeholder-text">Photo '+(i+1)+'</span>';
            wrap.appendChild(ph);
        });

        wrap.addEventListener('click', function () {
            if (img.complete && img.naturalWidth > 0) openPhotoOverlay(src);
        });

        wrap.appendChild(img); slide.appendChild(wrap); track.appendChild(slide);

        var dot = document.createElement('button');
        dot.className = 'dot'+(i===0?' active':'');
        dot.addEventListener('click', function () { goToSlide(i); });
        dots.appendChild(dot);
    });

    DOM.slidePrev.addEventListener('click', function () { goToSlide(currentSlide-1); });
    DOM.slideNext.addEventListener('click', function () { goToSlide(currentSlide+1); });
    initTouchSwipe();
}

function goToSlide(idx) {
    var total = CONFIG.photos.length;
    if (idx < 0) idx = total-1; if (idx >= total) idx = 0;
    currentSlide = idx;
    DOM.slideshowTrack.style.transform = 'translateX(-'+idx*100+'%)';
    DOM.slideshowDots.querySelectorAll('.dot').forEach(function (d,i) { d.classList.toggle('active', i===idx); });
}

function initTouchSwipe() {
    var c = DOM.slideshowContainer, sx = 0, sy = 0, dr = false;
    c.addEventListener('touchstart', function (e) { sx=e.touches[0].clientX; sy=e.touches[0].clientY; dr=true; }, {passive:true});
    c.addEventListener('touchend', function (e) {
        if (!dr) return; dr=false;
        var dx=sx-e.changedTouches[0].clientX, dy=sy-e.changedTouches[0].clientY;
        if (Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40) goToSlide(currentSlide+(dx>0?1:-1));
    }, {passive:true});
}


/* ═══════════════════════════════════════════════════════════
   PHOTO OVERLAY
   ═══════════════════════════════════════════════════════════ */

function openPhotoOverlay(src) {
    // Pause l'auto-play des photos
    if (photoAutoInterval) { clearInterval(photoAutoInterval); photoAutoInterval = null; }
    DOM.photoOverlayImg.src = src;
    DOM.photoOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePhotoOverlay() {
    DOM.photoOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════════ */

function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;
    var container = DOM.messageBody; container.innerHTML = '';
    DOM.typewriterCursor.classList.remove('hide');
    DOM.messageSignature.classList.remove('show'); DOM.messageSignature.classList.add('hidden');

    var paragraphs = CONFIG.messageFinal, pIdx = 0, cIdx = 0, curP = null;

    function next() {
        if (pIdx >= paragraphs.length) {
            DOM.typewriterCursor.classList.add('hide');
            DOM.messageSignature.classList.remove('hidden');
            DOM.messageSignature.classList.add('show');
            // Auto-scroll vers la section replay
            AutoPlay.schedule(function () {
                AutoPlay.scrollTo('section-replay');
            }, CONFIG.timings.afterTypewriter);
            return;
        }
        if (!curP) { curP = document.createElement('p'); container.appendChild(curP); cIdx = 0; }
        var txt = paragraphs[pIdx];
        if (cIdx < txt.length) {
            curP.textContent += txt[cIdx]; cIdx++;
            container.appendChild(DOM.typewriterCursor);
            setTimeout(next, CONFIG.typewriterSpeed);
        } else {
            pIdx++; curP = null;
            setTimeout(next, CONFIG.typewriterSpeed * 8);
        }
    }
    next();
}


/* ═══════════════════════════════════════════════════════════
   MUSIQUE
   ═══════════════════════════════════════════════════════════ */

function playMusic() {
    DOM.bgMusic.volume = 0.5;
    var p = DOM.bgMusic.play();
    if (p) p.then(function () {
        isMusicPlaying = true; updateMusicIcon();
    }).catch(function () {
        isMusicPlaying = false; updateMusicIcon();
    });
}

function toggleMusic() {
    if (isMusicPlaying) { DOM.bgMusic.pause(); isMusicPlaying = false; }
    else {
        var p = DOM.bgMusic.play();
        if (p) p.then(function () { isMusicPlaying = true; updateMusicIcon(); }).catch(function(){});
    }
    updateMusicIcon();
}

function updateMusicIcon() {
    if (isMusicPlaying) {
        DOM.musicBtn.classList.remove('muted');
        DOM.musicIconOn.classList.remove('hidden');
        DOM.musicIconOff.classList.add('hidden');
    } else {
        DOM.musicBtn.classList.add('muted');
        DOM.musicIconOn.classList.add('hidden');
        DOM.musicIconOff.classList.remove('hidden');
    }
}


/* ═══════════════════════════════════════════════════════════
   INTERSECTION OBSERVER
   ═══════════════════════════════════════════════════════════ */

function initScrollObserver() {
    var els = document.querySelectorAll('.animate-on-scroll');
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.closest('#section-message')) startTypewriter();
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (el) { obs.observe(el); });
}


/* ═══════════════════════════════════════════════════════════
   REJOUER
   ═══════════════════════════════════════════════════════════ */

function handleReplay() {
    // Tout arrêter
    AutoPlay.clearAll();
    candlesBlown = false; typewriterStarted = false; currentSlide = 0;
    if (counterInterval) { clearInterval(counterInterval); counterInterval = null; }

    // Reset bougies
    document.querySelectorAll('.blow-flame').forEach(function (f) { f.classList.remove('blown'); });
    DOM.candlesInstruction.textContent = 'Tape sur le gâteau pour souffler tes bougies';
    DOM.candlesInstruction.style.opacity = '1';
    DOM.candlesWish.classList.add('hidden'); DOM.candlesWish.classList.remove('show');

    // Reset photos
    goToSlide(0);

    // Reset message
    DOM.messageBody.innerHTML = '';
    DOM.typewriterCursor.classList.add('hide');
    DOM.messageSignature.classList.add('hidden'); DOM.messageSignature.classList.remove('show');

    // Reset raisons
    DOM.reasonsGrid.querySelectorAll('.reason-card').forEach(function (c) { c.classList.remove('flipped'); });

    // Reset animations scroll
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { el.classList.remove('visible'); });

    // Cacher contenu
    DOM.mainContent.classList.add('hidden');

    // Reset musique
    DOM.bgMusic.pause(); DOM.bgMusic.currentTime = 0; isMusicPlaying = false; updateMusicIcon();

    // Nettoyer
    DOM.floatingHearts.innerHTML = '';
    DOM.fallingPetals.innerHTML = '';

    // Reset scroll indicator
    if (DOM.scrollIndicator) DOM.scrollIndicator.style.display = '';

    // Retour accueil
    DOM.welcomeScreen.classList.remove('hidden', 'fade-out');
    initStars();
}


/* ═══════════════════════════════════════════════════════════
   VIBRATION
   ═══════════════════════════════════════════════════════════ */

function vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }
