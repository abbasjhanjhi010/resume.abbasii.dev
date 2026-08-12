// ============================================================
// MOUSE CLICK AUDIO SCRIPT
// ============================================================

// Option A: Using an external audio file (e.g., click.mp3)
const clickSound = new Audio("click.mp3");

// Option B: Fallback inline base64 sound (works immediately without external file)
const base64Click = new Audio("data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUtvAACAgICAgICAgICAgICAgICAgICAgICAgICA3p2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ3Gvampqa3GzMbG3eTdy/Dy493k59/o5eXm6ODq6efm5+3v8/X2+f39");

// Set default volume level (0.0 to 1.0)
clickSound.volume = 0.4;
base64Click.volume = 0.3;

// Attach click sound event listener to interactive elements across the site
document.addEventListener('click', (e) => {
  // Check if clicked element or its parent is interactive
  if (e.target.closest('button, .card, .win-btn, .nav-btn, .tab-btn, a')) {
    // Try playing click.mp3, fallback to base64 if click.mp3 is missing
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      base64Click.currentTime = 0;
      base64Click.play().catch(() => {});
    });
  }
});


// ============================================================
// WINDOW & UI MANAGEMENT LOGIC
// ============================================================

function openWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.classList.add('active');
    // Bring clicked window to top layer
    document.querySelectorAll('.xp-window').forEach(w => w.style.zIndex = '1');
    win.style.zIndex = '10';
  }
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.classList.remove('active');
  }
}

// System Tray Clock Updates
function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();