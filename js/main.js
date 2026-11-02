document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('wedding-audio');
  const musicPlayer = document.getElementById('music-player');
  const musicBtn = document.getElementById('music-btn');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const welcomeScreen = document.getElementById('welcome-screen');

  // URL Google Apps Script pour l'enregistrement des RSVP
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwh2nGZFHlvIjeLWnZJ62O_vUUw8VFJISKdbekP_NgpwLT2SbwKC97zGUAkgoaN7YDgfw/exec";

  // 1. Animation Ouverture
  envelopeWrapper.addEventListener('click', () => {
    envelope.classList.add('open');

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
      welcomeScreen.classList.add('opacity-0');
      setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        musicPlayer.classList.remove('hidden');
      }, 700);

      audio.play().catch((err) => {
        console.log("Audio bloqué par le navigateur :", err);
      });
    }, 1300);
  });

  // 2. Contrôle Musique
  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      musicPlayer.classList.remove('music-paused');
      musicBtn.innerText = '🎵';
    } else {
      audio.pause();
      musicPlayer.classList.add('music-paused');
      musicBtn.innerText = '🔇';
    }
  });

  // 3. Gestion du Formulaire RSVP
  let selectedPresence = 'حاضر';

  window.selectPresence = function(status) {
    selectedPresence = status;
    const btnAttending = document.getElementById('btn-attending');
    const btnDeclining = document.getElementById('btn-declining');

    if (status === 'حاضر') {
      btnAttending.className = "presence-btn border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] py-2.5 rounded-xl text-xs font-bold transition";
      btnDeclining.className = "presence-btn border border-[#d4af37]/40 bg-transparent text-gray-400 py-2.5 rounded-xl text-xs font-bold transition";
    } else {
      btnDeclining.className = "presence-btn border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] py-2.5 rounded-xl text-xs font-bold transition";
      btnAttending.className = "presence-btn border border-[#d4af37]/40 bg-transparent text-gray-400 py-2.5 rounded-xl text-xs font-bold transition";
    }
  };

  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');
  const submitBtn = document.getElementById('submit-btn');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const guests = document.getElementById('guest-count').value;

    if (!name) return;

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري الإرسال...";

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        presence: selectedPresence,
        guests: guests
      })
    })
    .then(() => {
      rsvpStatus.innerText = "شكرًا لك! تم تسجيل إجابتك بنجاح ✨";
      rsvpStatus.className = "text-center text-xs font-bold mt-2 text-green-400 block";
      rsvpForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerText = "إرسال التأكيد ✉️";
    })
    .catch((err) => {
      console.error(err);
      rsvpStatus.innerText = "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.";
      rsvpStatus.className = "text-center text-xs font-bold mt-2 text-red-400 block";
      submitBtn.disabled = false;
      submitBtn.innerText = "إرسال التأكيد ✉️";
    });
  });

  // 4. Compte à rebours
  const weddingDate = new Date("January 23, 2027 19:00:00").getTime();
  const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(countdownTimer);
      return;
    }

    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
  }, 1000);
});