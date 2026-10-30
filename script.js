/* ═══════════════════════════════════════════════════════════
   JOYEUX ANNIVERSAIRE — SCRIPT PRINCIPAL v2
   Avec : Étoiles filantes, Pétales, Bougies, Flip Cards,
          Typewriter, Fullscreen Photo, Vibration, Loader, etc.
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   CONFIGURATION — Modifie ici sans toucher au reste du code
   ───────────────────────────────────────────────────────── */

const CONFIG = {

    // Prénom affiché sur l'écran de révélation
    prenom: "Iloniaina",

    // Date d'anniversaire (jour et mois pour l'affichage)
    anniversaire: {
        jour: 17,
        mois: "Novembre"
    },

    // Date de début du couple (pour le compteur)
    // Format : année, mois (0-indexé : janvier = 0), jour
    dateCouple: new Date(2024, 0, 7), // 7 janvier 2024

    // Texte affiché pour la date du couple
    dateCoupleTexte: "7 janvier 2024",

    // Photos (chemin uniquement — les légendes ont été retirées)
    photos: [
        "photos/1.jpg",
        "photos/2.jpg",
        "photos/3.jpg",
        "photos/4.jpg",
        "photos/5.jpg",
        "photos/6.jpg",
        "photos/7.jpg",
        "photos/8.jpg"
    ],

    // Raisons "Pourquoi je t'aime" (cartes à retourner)
    // Mets autant de raisons que tu veux (idéalement 6, 8 ou 10)
    reasons: [
        "Ton sourire qui illumine même mes jours les plus sombres",
        "Ta façon de me regarder comme si j'étais la plus belle chose au monde",
        "Ta gentillesse infinie envers tout le monde",
        "Ton rire contagieux qui remplit la pièce de bonheur",
        "Ta force et ton courage qui m'inspirent chaque jour",
        "La douceur de tes mains quand tu prends les miennes",
        "Ta patience et ta compréhension quand j'en ai besoin",
        "La façon dont tu me fais sentir aimé(e) sans même un mot",
        "Ton intelligence et ta curiosité qui m'émerveillent",
        "Tout simplement parce que tu es toi, et que toi c'est parfait 💜"
    ],

    // Message final — la lettre d'amour
    // Chaque élément du tableau = un paragraphe
    messageFinal: [
        "Ma chère Iloniaina,",
        "Aujourd'hui est un jour spécial, car c'est le jour où le monde a eu la chance de te recevoir. Et moi, j'ai eu la chance encore plus grande de te rencontrer et de t'aimer.",
        "Depuis que tu es entrée dans ma vie, tout est devenu plus beau, plus doux, plus lumineux. Tu es mon soleil les jours de pluie, mon étoile dans la nuit, et la raison pour laquelle je souris chaque matin.",
        "J'aime tout de toi. Ton rire qui remplit la pièce, ta gentillesse qui touche tous ceux qui te connaissent, ta force qui m'inspire chaque jour, et cette lumière dans tes yeux qui me fait tomber amoureux de toi encore et encore.",
        "En ce jour d'anniversaire, je veux que tu saches à quel point tu comptes pour moi. Tu n'es pas seulement ma copine, tu es ma meilleure amie, ma confidente, mon tout.",
        "Je te souhaite tout le bonheur du monde, toutes les étoiles du ciel, et tout l'amour que mon cœur peut contenir — et crois-moi, pour toi, il est infini.",
        "Joyeux anniversaire, mon amour. 🎂💜"
    ],

    // Vitesse de la machine à écrire (ms par caractère)
    typewriterSpeed: 35
};


/* ═══════════════════════════════════════════════════════════
   ÉLÉMENTS DOM
   ═══════════════════════════════════════════════════════════ */

const DOM = {
    // Loader
    loader: document.getElementById('loader'),
    // Écrans
    welcomeScreen: document.getElementById('welcome-screen'),
    countdownScreen: document.getElementById('countdown-screen'),
    mainContent: document.getElementById('main-content'),
    // Accueil
    starsCanvas: document.getElementById('stars-canvas'),
    openBtn: document.getElementById('open-btn'),
    // Compte à rebours
    countdownNumber: document.getElementById('countdown-number'),
    // Révélation
    revealName: document.getElementById('reveal-name'),
    revealDate: document.getElementById('reveal-date'),
    floatingHearts: document.getElementById('floating-hearts'),
    fallingPetals: document.getElementById('falling-petals'),
    // Bougies
    candlesCake: document.getElementById('candles-cake'),
    candlesRow: document.getElementById('candles-row'),
    candlesInstruction: document.getElementById('candles-instruction'),
    candlesWish: document.getElementById('candles-wish'),
    fireworksCanvas: document.getElementById('fireworks-canvas'),
    // Compteur
    coupleDateText: document.getElementById('couple-date-text'),
    counterDays: document.getElementById('counter-days'),
    counterHours: document.getElementById('counter-hours'),
    counterMinutes: document.getElementById('counter-minutes'),
    counterSeconds: document.getElementById('counter-seconds'),
    // Raisons
    reasonsGrid: document.getElementById('reasons-grid'),
    // Photos
    slideshowTrack: document.getElementById('slideshow-track'),
    slideshowDots: document.getElementById('slideshow-dots'),
    slideshowContainer: document.getElementById('slideshow-container'),
    slidePrev: document.getElementById('slide-prev'),
    slideNext: document.getElementById('slide-next'),
    // Photo overlay
    photoOverlay: document.getElementById('photo-overlay'),
    photoOverlayImg: document.getElementById('photo-overlay-img'),
    photoOverlayClose: document.getElementById('photo-overlay-close'),
    // Message
    messageBody: document.getElementById('message-body'),
    typewriterCursor: document.getElementById('typewriter-cursor'),
    messageSignature: document.getElementById('message-signature'),
    // Rejouer
    replayBtn: document.getElementById('replay-btn'),
    // Musique
    musicBtn: document.getElementById('music-btn'),
    musicIcon: document.getElementById('music-icon'),
    bgMusic: document.getElementById('bg-music'),
    // Confettis
    confettiCanvas: document.getElementById('confetti-canvas'),
};


/* ═══════════════════════════════════════════════════════════
   ÉTAT GLOBAL
   ═══════════════════════════════════════════════════════════ */

let currentSlide = 0;
let isMusicPlaying = false;
let candlesBlown = false;
let typewriterStarted = false;
let typewriterDone = false;
let counterInterval = null;


/* ═══════════════════════════════════════════════════════════
   INITIALISATION
   ═══════════════════════════════════════════════════════════ */

(function init() {
    // Injecter les données de la config dans le DOM
    DOM.revealName.textContent = CONFIG.prenom;
    DOM.revealDate.textContent = CONFIG.anniversaire.jour + " " + CONFIG.anniversaire.mois;
    DOM.coupleDateText.textContent = CONFIG.dateCoupleTexte;

    // Construire les composants
    buildSlideshow();
    buildReasonCards();

    // Boutons
    DOM.openBtn.addEventListener('click', handleOpenClick);
    DOM.musicBtn.addEventListener('click', toggleMusic);
    DOM.replayBtn.addEventListener('click', handleReplay);

    // Bougies
    DOM.candlesCake.addEventListener('click', blowCandles);

    // Photo overlay
    DOM.photoOverlayClose.addEventListener('click', closePhotoOverlay);
    DOM.photoOverlay.addEventListener('click', function (e) {
        if (e.target === DOM.photoOverlay) closePhotoOverlay();
    });

    // Attendre le chargement des fonts + DOM
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(showWelcome);
    } else {
        window.addEventListener('load', showWelcome);
    }
})();

function showWelcome() {
    // Petit délai pour l'effet
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
   ÉTOILES SCINTILLANTES + ÉTOILES FILANTES (Canvas)
   ═══════════════════════════════════════════════════════════ */

function initStars() {
    var canvas = DOM.starsCanvas;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var shootingStars = [];
    var animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        var count = Math.floor((canvas.width * canvas.height) / 3000);
        for (var i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                dAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
            });
        }
    }

    function spawnShootingStar() {
        var startX = Math.random() * canvas.width * 0.8;
        var startY = Math.random() * canvas.height * 0.4;
        shootingStars.push({
            x: startX,
            y: startY,
            len: Math.random() * 60 + 40,
            speed: Math.random() * 8 + 6,
            angle: (Math.PI / 6) + Math.random() * (Math.PI / 6), // 30-60°
            alpha: 1,
            life: 0,
            maxLife: 40 + Math.random() * 30
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Étoiles fixes scintillantes
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.alpha += s.dAlpha;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.dAlpha *= -1;
            s.alpha = Math.max(0.1, Math.min(1, s.alpha));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(212, 197, 226, " + s.alpha + ")";
            ctx.fill();
        }

        // Étoiles filantes
        for (var j = shootingStars.length - 1; j >= 0; j--) {
            var ss = shootingStars[j];
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.life++;

            if (ss.life > ss.maxLife * 0.6) {
                ss.alpha -= 0.05;
            }

            if (ss.alpha <= 0 || ss.life >= ss.maxLife) {
                shootingStars.splice(j, 1);
                continue;
            }

            var tailX = ss.x - Math.cos(ss.angle) * ss.len;
            var tailY = ss.y - Math.sin(ss.angle) * ss.len;

            var grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            grad.addColorStop(0, "rgba(255, 255, 255, 0)");
            grad.addColorStop(1, "rgba(255, 255, 255, " + ss.alpha + ")");

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(ss.x, ss.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Tête brillante
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, " + ss.alpha + ")";
            ctx.fill();
        }

        // Spawner des étoiles filantes aléatoirement
        if (Math.random() < 0.008) {
            spawnShootingStar();
        }

        animFrame = requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();

    window.addEventListener('resize', function () {
        resize();
        createStars();
    });

    window._starsAnim = {
        stop: function () { cancelAnimationFrame(animFrame); }
    };
}


/* ═══════════════════════════════════════════════════════════
   BOUTON PRINCIPAL : OUVRIR
   ═══════════════════════════════════════════════════════════ */

function handleOpenClick() {
    // Démarrer la musique (dans le click handler pour autoplay policy)
    playMusic();

    // Vibration légère
    vibrate(50);

    // Cacher l'écran d'accueil
    DOM.welcomeScreen.classList.add('fade-out');

    setTimeout(function () {
        DOM.welcomeScreen.classList.add('hidden');
        if (window._starsAnim) window._starsAnim.stop();

        // Afficher le compte à rebours
        DOM.countdownScreen.classList.remove('hidden');
        startCountdown();
    }, 800);
}


/* ═══════════════════════════════════════════════════════════
   COMPTE À REBOURS 3... 2... 1...
   ═══════════════════════════════════════════════════════════ */

function startCountdown() {
    var count = 3;

    function showNumber() {
        if (count <= 0) {
            DOM.countdownScreen.classList.add('hidden');
            showMainContent();
            return;
        }

        DOM.countdownNumber.textContent = count;
        DOM.countdownNumber.style.animation = 'none';
        void DOM.countdownNumber.offsetWidth; // force reflow
        DOM.countdownNumber.style.animation = 'countBounce 0.8s ease forwards';

        // Vibration sur chaque chiffre
        vibrate(30);

        setTimeout(function () {
            DOM.countdownNumber.style.animation = 'countFadeOut 0.3s ease forwards';
            setTimeout(function () {
                count--;
                showNumber();
            }, 300);
        }, 700);
    }

    showNumber();
}


/* ═══════════════════════════════════════════════════════════
   AFFICHER LE CONTENU PRINCIPAL
   ═══════════════════════════════════════════════════════════ */

function showMainContent() {
    DOM.mainContent.classList.remove('hidden');

    // Vibration « explosion »
    vibrate([50, 30, 80, 30, 50]);

    // Lancer les confettis
    launchConfetti();

    // Lancer les cœurs flottants + pétales
    startFloatingHearts();
    startFallingPetals();

    // Démarrer le compteur
    startCoupleCounter();

    // Observer les sections pour les animations
    initScrollObserver();

    // Scroll en haut
    window.scrollTo(0, 0);
}


/* ═══════════════════════════════════════════════════════════
   CONFETTIS (Canvas)
   ═══════════════════════════════════════════════════════════ */

function launchConfetti() {
    var canvas = DOM.confettiCanvas;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var colors = [
        '#B8A9C9', '#967BB6', '#D4C5E2',
        '#F4C2C2', '#E8A0BF',
        '#D4AF37', '#F0D78C',
        '#FFFFFF'
    ];
    var startTime = Date.now();
    var DURATION = 6000;
    var FADE_AFTER = 8000;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 6 + 2;
        return {
            x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
            y: canvas.height * 0.3 + (Math.random() - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - Math.random() * 4,
            r: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.08 + Math.random() * 0.04,
            alpha: 1,
            shape: Math.random() < 0.5 ? 'rect' : 'circle',
            width: Math.random() * 8 + 4,
            height: Math.random() * 4 + 2
        };
    }

    for (var i = 0; i < 80; i++) {
        particles.push(createParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var elapsed = Date.now() - startTime;

        if (elapsed < DURATION && Math.random() < 0.3) {
            particles.push(createParticle());
        }

        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.rotation += p.rotSpeed;

            if (elapsed > FADE_AFTER) {
                p.alpha -= 0.01;
            }

            if (p.y > canvas.height + 50 || p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.alpha);

            if (p.shape === 'rect') {
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            ctx.restore();
        }

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}


/* ═══════════════════════════════════════════════════════════
   CŒURS FLOTTANTS (DOM)
   ═══════════════════════════════════════════════════════════ */

function startFloatingHearts() {
    var container = DOM.floatingHearts;
    var hearts = ['💜', '💕', '💗', '💝', '🤍', '🩷', '💐', '🌸'];
    var heartCount = 0;
    var MAX = 50;

    function createHeart() {
        if (heartCount >= MAX) return;
        heartCount++;

        var el = document.createElement('span');
        el.className = 'floating-heart';
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';

        var dur = Math.random() * 5 + 6;
        var del = Math.random() * 2;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = del + 's';

        container.appendChild(el);

        setTimeout(function () {
            el.remove();
            heartCount--;
        }, (dur + del) * 1000);
    }

    for (var i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 200);
    }

    var interval = setInterval(createHeart, 800);
    setTimeout(function () { clearInterval(interval); }, 20000);
}


/* ═══════════════════════════════════════════════════════════
   PÉTALES TOMBANTS (DOM)
   ═══════════════════════════════════════════════════════════ */

function startFallingPetals() {
    var container = DOM.fallingPetals;
    var petalColors = [
        'rgba(244, 194, 194, 0.7)',   // rose clair
        'rgba(232, 160, 191, 0.6)',   // rose
        'rgba(212, 197, 226, 0.6)',   // lavande clair
        'rgba(184, 169, 201, 0.5)',   // lavande
        'rgba(240, 215, 140, 0.5)'    // doré pâle
    ];
    var petalCount = 0;
    var MAX = 40;

    function createPetal() {
        if (petalCount >= MAX) return;
        petalCount++;

        var el = document.createElement('div');
        el.className = 'petal';
        el.style.left = Math.random() * 100 + '%';
        el.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];

        var size = Math.random() * 8 + 8;
        el.style.width = size + 'px';
        el.style.height = (size * 1.3) + 'px';

        var dur = Math.random() * 6 + 7;
        var del = Math.random() * 4;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = del + 's';

        container.appendChild(el);

        setTimeout(function () {
            el.remove();
            petalCount--;
        }, (dur + del) * 1000);
    }

    for (var i = 0; i < 12; i++) {
        setTimeout(createPetal, i * 300);
    }

    var interval = setInterval(createPetal, 600);
    setTimeout(function () { clearInterval(interval); }, 25000);
}


/* ═══════════════════════════════════════════════════════════
   SOUFFLER LES BOUGIES + FEUX D'ARTIFICE
   ═══════════════════════════════════════════════════════════ */

function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    // Vibration
    vibrate([30, 20, 30, 20, 50]);

    // Souffler chaque bougie avec un délai
    var flames = DOM.candlesRow.querySelectorAll('.candle-flame');
    flames.forEach(function (flame, i) {
        setTimeout(function () {
            flame.classList.add('blown');
        }, i * 120);
    });

    // Changer le texte
    setTimeout(function () {
        DOM.candlesInstruction.style.opacity = '0';
        setTimeout(function () {
            DOM.candlesInstruction.textContent = '🎉 Bravo !';
            DOM.candlesInstruction.style.opacity = '1';
        }, 300);

        // Montrer le vœu
        DOM.candlesWish.classList.remove('hidden');
        DOM.candlesWish.classList.add('show');

        // Lancer les feux d'artifice
        launchFireworks();
    }, flames.length * 120 + 300);
}

function launchFireworks() {
    var canvas = DOM.fireworksCanvas;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var rockets = [];
    var colors = ['#D4AF37', '#F0D78C', '#B8A9C9', '#F4C2C2', '#FFFFFF', '#E8A0BF', '#967BB6'];

    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    resize();

    function createRocket() {
        rockets.push({
            x: canvas.width * (0.2 + Math.random() * 0.6),
            y: canvas.height,
            targetY: canvas.height * (0.15 + Math.random() * 0.3),
            speed: 4 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function explode(x, y, color) {
        vibrate(20);
        var count = 40 + Math.floor(Math.random() * 30);
        for (var i = 0; i < count; i++) {
            var angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
            var speed = 1.5 + Math.random() * 3;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: color,
                r: Math.random() * 2.5 + 1,
                gravity: 0.03 + Math.random() * 0.02,
                friction: 0.98
            });
        }
    }

    var rocketCount = 0;
    var maxRockets = 8;
    var rocketInterval = setInterval(function () {
        if (rocketCount >= maxRockets) {
            clearInterval(rocketInterval);
            return;
        }
        createRocket();
        rocketCount++;
    }, 400);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fusées
        for (var r = rockets.length - 1; r >= 0; r--) {
            var rk = rockets[r];
            rk.y -= rk.speed;

            // Traînée
            ctx.beginPath();
            ctx.arc(rk.x, rk.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = rk.color;
            ctx.fill();

            if (rk.y <= rk.targetY) {
                explode(rk.x, rk.y, rk.color);
                rockets.splice(r, 1);
            }
        }

        // Particules
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.012;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        if (particles.length > 0 || rockets.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}


/* ═══════════════════════════════════════════════════════════
   COMPTEUR DE JOURS ENSEMBLE
   ═══════════════════════════════════════════════════════════ */

function startCoupleCounter() {
    function update() {
        var now = new Date();
        var diff = now - CONFIG.dateCouple;
        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        DOM.counterDays.textContent = days.toLocaleString('fr-FR');
        DOM.counterHours.textContent = hours;
        DOM.counterMinutes.textContent = minutes;
        DOM.counterSeconds.textContent = seconds;
    }

    update();
    counterInterval = setInterval(update, 1000);
}


/* ═══════════════════════════════════════════════════════════
   CARTES "RAISONS JE T'AIME" (Flip Cards)
   ═══════════════════════════════════════════════════════════ */

function buildReasonCards() {
    var grid = DOM.reasonsGrid;
    grid.innerHTML = '';

    CONFIG.reasons.forEach(function (reason, index) {
        var card = document.createElement('div');
        card.className = 'reason-card';

        card.innerHTML =
            '<div class="reason-card-inner">' +
                '<div class="reason-front">' +
                    '<span class="reason-front-number">' + (index + 1) + '</span>' +
                    '<span class="reason-front-heart">💜</span>' +
                '</div>' +
                '<div class="reason-back">' +
                    '<span class="reason-back-text">' + reason + '</span>' +
                '</div>' +
            '</div>';

        card.addEventListener('click', function () {
            card.classList.toggle('flipped');
            vibrate(15);
        });

        grid.appendChild(card);
    });
}


/* ═══════════════════════════════════════════════════════════
   DIAPORAMA PHOTOS (sans légendes + fullscreen)
   ═══════════════════════════════════════════════════════════ */

function buildSlideshow() {
    var track = DOM.slideshowTrack;
    var dotsContainer = DOM.slideshowDots;
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    CONFIG.photos.forEach(function (photoSrc, index) {
        // Slide
        var slide = document.createElement('div');
        slide.className = 'slide';

        var imgWrapper = document.createElement('div');
        imgWrapper.className = 'slide-img-wrapper';

        var img = document.createElement('img');
        img.className = 'slide-img';
        img.src = photoSrc;
        img.alt = 'Photo ' + (index + 1);
        img.loading = index === 0 ? 'eager' : 'lazy';

        // Erreur → placeholder
        img.addEventListener('error', function () {
            img.style.display = 'none';
            var placeholder = document.createElement('div');
            placeholder.className = 'slide-placeholder';
            placeholder.innerHTML =
                '<span class="slide-placeholder-icon">📷</span>' +
                '<span class="slide-placeholder-text">Photo ' + (index + 1) + '</span>';
            imgWrapper.appendChild(placeholder);
        });

        // Click → fullscreen
        imgWrapper.addEventListener('click', function () {
            openPhotoOverlay(photoSrc);
        });

        imgWrapper.appendChild(img);
        slide.appendChild(imgWrapper);
        track.appendChild(slide);

        // Dot
        var dot = document.createElement('button');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Photo ' + (index + 1));
        dot.addEventListener('click', function () { goToSlide(index); });
        dotsContainer.appendChild(dot);
    });

    // Navigation boutons
    DOM.slidePrev.addEventListener('click', function () { goToSlide(currentSlide - 1); });
    DOM.slideNext.addEventListener('click', function () { goToSlide(currentSlide + 1); });

    // Navigation tactile
    initTouchSwipe();
}

function goToSlide(index) {
    var total = CONFIG.photos.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentSlide = index;
    DOM.slideshowTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

    var dots = DOM.slideshowDots.querySelectorAll('.dot');
    dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
    });
}

function initTouchSwipe() {
    var container = DOM.slideshowContainer;
    var startX = 0;
    var startY = 0;
    var isDragging = false;

    container.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    container.addEventListener('touchend', function (e) {
        if (!isDragging) return;
        isDragging = false;
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        var diffX = startX - endX;
        var diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
        }
    }, { passive: true });
}


/* ═══════════════════════════════════════════════════════════
   PHOTO FULLSCREEN OVERLAY
   ═══════════════════════════════════════════════════════════ */

function openPhotoOverlay(src) {
    DOM.photoOverlayImg.src = src;
    DOM.photoOverlay.classList.remove('hidden');
    // Empêcher le scroll
    document.body.style.overflow = 'hidden';
}

function closePhotoOverlay() {
    DOM.photoOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════════════════════
   MESSAGE FINAL — MACHINE À ÉCRIRE
   ═══════════════════════════════════════════════════════════ */

function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    var container = DOM.messageBody;
    container.innerHTML = '';
    DOM.typewriterCursor.classList.remove('hide');
    DOM.messageSignature.classList.remove('show');
    DOM.messageSignature.classList.add('hidden');

    // Construire tout le texte à taper
    var paragraphs = CONFIG.messageFinal;
    var currentParagraph = 0;
    var currentChar = 0;
    var currentP = null;

    function typeNext() {
        if (currentParagraph >= paragraphs.length) {
            // Fini !
            typewriterDone = true;
            DOM.typewriterCursor.classList.add('hide');
            // Afficher la signature
            DOM.messageSignature.classList.remove('hidden');
            DOM.messageSignature.classList.add('show');
            return;
        }

        if (currentP === null) {
            currentP = document.createElement('p');
            container.appendChild(currentP);
            currentChar = 0;
        }

        var text = paragraphs[currentParagraph];
        if (currentChar < text.length) {
            currentP.textContent += text[currentChar];
            currentChar++;
            // Déplacer le curseur après le dernier paragraphe
            container.appendChild(DOM.typewriterCursor);
            setTimeout(typeNext, CONFIG.typewriterSpeed);
        } else {
            // Paragraphe fini, passer au suivant
            currentParagraph++;
            currentP = null;
            setTimeout(typeNext, CONFIG.typewriterSpeed * 8);
        }
    }

    typeNext();
}


/* ═══════════════════════════════════════════════════════════
   MUSIQUE
   ═══════════════════════════════════════════════════════════ */

function playMusic() {
    var audio = DOM.bgMusic;
    audio.volume = 0.5;
    var promise = audio.play();
    if (promise !== undefined) {
        promise.then(function () {
            isMusicPlaying = true;
            DOM.musicBtn.classList.remove('muted');
            DOM.musicIcon.textContent = '🎵';
        }).catch(function () {
            isMusicPlaying = false;
            DOM.musicBtn.classList.add('muted');
            DOM.musicIcon.textContent = '🔇';
        });
    }
}

function toggleMusic() {
    var audio = DOM.bgMusic;
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        DOM.musicBtn.classList.add('muted');
        DOM.musicIcon.textContent = '🔇';
    } else {
        var promise = audio.play();
        if (promise !== undefined) {
            promise.then(function () {
                isMusicPlaying = true;
                DOM.musicBtn.classList.remove('muted');
                DOM.musicIcon.textContent = '🎵';
            }).catch(function () { /* silence */ });
        }
    }
}


/* ═══════════════════════════════════════════════════════════
   INTERSECTION OBSERVER (Animations au scroll + Typewriter)
   ═══════════════════════════════════════════════════════════ */

function initScrollObserver() {
    var elements = document.querySelectorAll('.animate-on-scroll');

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Si c'est la section message → déclencher la machine à écrire
                    if (entry.target.closest('#section-message')) {
                        startTypewriter();
                    }

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    elements.forEach(function (el) { observer.observe(el); });
}


/* ═══════════════════════════════════════════════════════════
   BOUTON REJOUER
   ═══════════════════════════════════════════════════════════ */

function handleReplay() {
    // Remettre à zéro
    candlesBlown = false;
    typewriterStarted = false;
    typewriterDone = false;
    currentSlide = 0;

    // Stopper le compteur
    if (counterInterval) clearInterval(counterInterval);

    // Réinitialiser les bougies
    var flames = DOM.candlesRow.querySelectorAll('.candle-flame');
    flames.forEach(function (f) { f.classList.remove('blown'); });
    DOM.candlesInstruction.textContent = 'Tape sur le gâteau pour souffler tes bougies 🕯️';
    DOM.candlesInstruction.style.opacity = '1';
    DOM.candlesWish.classList.add('hidden');
    DOM.candlesWish.classList.remove('show');

    // Réinitialiser le slideshow
    goToSlide(0);

    // Réinitialiser le message
    DOM.messageBody.innerHTML = '';
    DOM.typewriterCursor.classList.add('hide');
    DOM.messageSignature.classList.add('hidden');
    DOM.messageSignature.classList.remove('show');

    // Réinitialiser les flip cards
    var cards = DOM.reasonsGrid.querySelectorAll('.reason-card');
    cards.forEach(function (c) { c.classList.remove('flipped'); });

    // Réinitialiser les animations au scroll
    var animated = document.querySelectorAll('.animate-on-scroll');
    animated.forEach(function (el) { el.classList.remove('visible'); });

    // Cacher le contenu principal
    DOM.mainContent.classList.add('hidden');

    // Stopper la musique
    DOM.bgMusic.pause();
    DOM.bgMusic.currentTime = 0;
    isMusicPlaying = false;

    // Nettoyer les cœurs et pétales restants
    DOM.floatingHearts.innerHTML = '';
    DOM.fallingPetals.innerHTML = '';

    // Afficher l'écran d'accueil
    DOM.welcomeScreen.classList.remove('hidden', 'fade-out');
    initStars();
}


/* ═══════════════════════════════════════════════════════════
   VIBRATION HELPER
   ═══════════════════════════════════════════════════════════ */

function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}
