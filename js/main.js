// 1. Déclaration globale de selectPresence pour garantir son accès depuis onclick="" dans index.html
let selectedPresence = 'حاضر';

window.selectPresence = function(status) {
  selectedPresence = status;
  const btnAttending = document.getElementById('btn-attending');
  const btnDeclining = document.getElementById('btn-declining');

  if (btnAttending && btnDeclining) {
    if (status === 'حاضر') {
      btnAttending.className = "presence-btn border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] py-2.5 rounded-xl text-xs font-bold transition";
      btnDeclining.className = "presence-btn border border-[#d4af37]/40 bg-transparent text-gray-400 py-2.5 rounded-xl text-xs font-bold transition";
    } else {
      btnDeclining.className = "presence-btn border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] py-2.5 rounded-xl text-xs font-bold transition";
      btnAttending.className = "presence-btn border border-[#d4af37]/40 bg-transparent text-gray-400 py-2.5 rounded-xl text-xs font-bold transition";
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('wedding-audio');
  const musicPlayer = document.getElementById('music-player');
  const musicBtn = document.getElementById('music-btn');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const welcomeScreen = document.getElementById('welcome-screen');

  // URL Google Apps Script pour l'enregistrement des RSVP
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwh2nGZFHlvIjeLWnZJ62O_vUUw8VFJISKdbekP_NgpwLT2SbwKC97zGUAkgoaN7YDgfw/exec";

  // 2. Animation Ouverture & Lancement Audio Immédiat
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
      // Déclencher l'audio TOUT DE SUITE au moment du clic physique
      if (audio) {
        audio.play().then(() => {
          if (musicPlayer) musicPlayer.classList.remove('music-paused');
        }).catch((err) => {
          console.log("Audio bloqué par le navigateur :", err);
        });
      }

      if (envelope) envelope.classList.add('open');

      setTimeout(() => {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#bf953f', '#fcf6ba', '#b38728', '#ffffff']
          });
        }
      }, 400);

      setTimeout(() => {
        if (welcomeScreen) welcomeScreen.classList.add('opacity-0');
        setTimeout(() => {
          if (welcomeScreen) welcomeScreen.classList.add('hidden');
          if (musicPlayer) musicPlayer.classList.remove('hidden');
        }, 700);
      }, 1300);
    });
  }

  // 3. Contrôle Musique
  if (musicBtn && audio) {
    musicBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        if (musicPlayer) musicPlayer.classList.remove('music-paused');
        musicBtn.innerText = '🎵';
      } else {
        audio.pause();
        if (musicPlayer) musicPlayer.classList.add('music-paused');
        musicBtn.innerText = '🔇';
      }
    });
  }

  // 4. Formulaire RSVP avec compatibilité Google Apps Script
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');
  const submitBtn = document.getElementById('submit-btn');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('guest-name');
      const countInput = document.getElementById('guest-count');

      const name = nameInput ? nameInput.value.trim() : '';
      const guests = countInput ? countInput.value : '0';

      if (!name) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "جاري الإرسال...";
      }

      // Formatage compatible Google Apps Script no-cors
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: name,
          presence: selectedPresence,
          guests: guests
        })
      })
      .then(() => {
        if (rsvpStatus) {
          rsvpStatus.innerText = "شكرًا لك! تم تسجيل إجابتك بنجاح ✨";
          rsvpStatus.className = "text-center text-xs font-bold mt-2 text-green-400 block";
        }
        rsvpForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "إرسال التأكيد ✉️";
        }
      })
      .catch((err) => {
        console.error(err);
        if (rsvpStatus) {
          rsvpStatus.innerText = "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.";
          rsvpStatus.className = "text-center text-xs font-bold mt-2 text-red-400 block";
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "إرسال التأكيد ✉️";
        }
      });
    });
  }

  // 5. Bouton Google Calendar
  const calendarBtn = document.getElementById('calendar-btn');
  if (calendarBtn) {
    const calendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("حفل زفاف وديع و آمنة 💍") +
      "&dates=20270123T180000Z/20270123T230000Z" +
      "&details=" + encodeURIComponent("يتشرف السيد عماد لحكيمي والسيد مراد بن عثمان بدعوتكم لحضور حفل زفاف نجليهما وديع و آمنة.") +
      "&location=" + encodeURIComponent("Salle des fêtes La Reine, Ain Zaghouane, Tunis");
    calendarBtn.setAttribute('href', calendarUrl);
  }

  // 6. Compte à rebours optimisé avec format 2 chiffres
  const weddingDate = new Date("January 23, 2027 19:00:00").getTime();
  
  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(countdownTimer);
      return;
    }

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
  }

  const countdownTimer = setInterval(updateTimer, 1000);
  updateTimer(); // Exécution immédiate
});