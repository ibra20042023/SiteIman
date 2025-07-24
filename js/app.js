const slides = document.querySelectorAll('.carousel-slide');
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

// Lecture automatique du carousel
setInterval(nextSlide, 5000);

// Audio Player - UN SEUL SON
const audio = document.getElementById('audioPlayer');
const muteBtn = document.getElementById('muteBtn');
const video = document.getElementById('myVideo');
const notification = document.getElementById('music-notification');

// Réglages initiaux
audio.volume = 0.1;
audio.muted = true; // Démarre muet obligatoire pour l'autoplay
audio.loop = true;  // Pour rejouer le son en boucle

function playUnique() {
  audio.src = 'music/fondiman.mp3';
  audio.play().catch(err => {
    console.warn("Autoplay bloqué : " + err.message);
  });
}

// Mute/Unmute via bouton
muteBtn.addEventListener('click', () => {
  const wasMuted = audio.muted;
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  if (!audio.muted && audio.paused && wasMuted) {
    audio.play().catch(err => {
      console.warn("Impossible de lancer l'audio : " + err.message);
    });
  }
});

// Lancer la lecture (MUET) au chargement
window.addEventListener('load', () => {
  playUnique();
});

// Fonction unique pour délocker l'audio et cacher notification
function unlockAudio() {
  if (audio.muted) {
    audio.muted = false;
    muteBtn.textContent = '🔊';
    if (audio.paused) {
      audio.play().catch(err => {
        console.warn("Impossible de lancer l'audio : " + err.message);
      });
    }
    if (notification) {
      notification.style.display = 'none';
    }
    // On retire les écouteurs après le premier déblocage pour éviter répétition
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('scroll', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  }
}

// Attacher les écouteurs d’événements une fois
window.addEventListener('click', unlockAudio);
window.addEventListener('scroll', unlockAudio);
window.addEventListener('keydown', unlockAudio);

// Si la notification existe, clic dessus déclenche également unlockAudio
if (notification) {
  notification.addEventListener('click', unlockAudio);
}

// Gestion de la vidéo : baisser volume audio lors de la lecture
video.addEventListener('play', () => {
  audio.volume = 0.05;
});

video.addEventListener('pause', () => {
  audio.volume = 0.1;
});

video.addEventListener('ended', () => {
  audio.volume = 0.1;
});
