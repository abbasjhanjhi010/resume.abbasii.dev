// ============================================================
// 1. OPEN WINDOW TRACKER (MAX 3 WINDOWS ALLOWED)
// ============================================================
let openWindowStack = ['win-home']; 
const MAX_OPEN_WINDOWS = 3;

function openWindow(winId) {
  const win = document.getElementById(winId);
  if (!win) return;

  if (openWindowStack.includes(winId)) {
    openWindowStack = openWindowStack.filter(id => id !== winId);
  } else if (openWindowStack.length >= MAX_OPEN_WINDOWS) {
    const oldestWinId = openWindowStack.shift();
    const oldestWin = document.getElementById(oldestWinId);
    if (oldestWin) {
      oldestWin.classList.remove('active');
    }
  }

  openWindowStack.push(winId);
  win.classList.add('active');

  document.querySelectorAll('.xp-window').forEach(w => w.style.zIndex = '1');
  win.style.zIndex = '100';

  // Close Start menu if open
  document.getElementById('xp-start-menu').classList.remove('active');
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.classList.remove('active');
    openWindowStack = openWindowStack.filter(id => id !== winId);
  }
}


// ============================================================
// 2. START MENU TOGGLE SCRIPT
// ============================================================
const startBtn = document.getElementById('start-button-toggle');
const startMenu = document.getElementById('xp-start-menu');

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#xp-start-menu') && !e.target.closest('#start-button-toggle')) {
    startMenu.classList.remove('active');
  }
});


// ============================================================
// 3. DRAGGABLE WINDOWS SCRIPT
// ============================================================
document.querySelectorAll('.xp-window').forEach(win => {
  const titleBar = win.querySelector('.title-bar');
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  titleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('win-btn') || e.button !== 0) return;

    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    document.querySelectorAll('.xp-window').forEach(w => w.style.zIndex = '1');
    win.style.zIndex = '100';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});


// ============================================================
// 4. UNIVERSAL RIGHT-CLICK CONTEXT MENU
// ============================================================
const globalCtxMenu = document.getElementById('global-context-menu');

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  
  globalCtxMenu.style.left = `${e.clientX}px`;
  globalCtxMenu.style.top = `${e.clientY}px`;
  globalCtxMenu.style.display = 'block';
});

document.addEventListener('click', () => {
  globalCtxMenu.style.display = 'none';
});


// ============================================================
// 5. MOUSE CLICK AUDIO SCRIPT
// ============================================================
const clickSound = new Audio("click.mp3");
const base64Click = new Audio("data:audio/wav;base64,UklGRl9vAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUtvAACAgICAgICAgICAgICAgICAgICAgICAgICA3p2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ3Gvampqa3GzMbG3eTdy/Dy493k59/o5eXm6ODq6efm5+3v8/X2+f39");

clickSound.volume = 0.4;
base64Click.volume = 0.3;

document.addEventListener('click', (e) => {
  if (e.target.closest('button, .card, .win-btn, .nav-btn, .tab-btn, .project-item, .skill-card-pixel, .desktop-icon-item, .menu-row, .start-item, .start-right-item')) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      base64Click.currentTime = 0;
      base64Click.play().catch(() => {});
    });
  }
});


// ============================================================
// 6. FORM SUBMISSION HANDLER
// ============================================================
function handleFormSubmit(e) {
  e.preventDefault();
  alert("Thank you, Muhammad Abbas Jhanjhi has received your message!");
  e.target.reset();
}


// ============================================================
// 7. SYSTEM TRAY CLOCK SCRIPT
// ============================================================
function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();