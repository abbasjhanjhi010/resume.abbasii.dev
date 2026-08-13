// ============================================================
// CONFIGURATION: YOUTUBE DATA API V3
// ============================================================
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const YOUTUBE_CHANNEL_ID = 'UCVZtMizbzKU5VcH7Zv2QGDw';

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

  const startMenuEl = document.getElementById('xp-start-menu');
  if (startMenuEl) startMenuEl.classList.remove('active');
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.classList.remove('active');
    openWindowStack = openWindowStack.filter(id => id !== winId);
  }
}


// ============================================================
// 2. RETRO IE BROWSER WITH YOUTUBE API V3 INTEGRATION
// ============================================================
let currentIeType = 'github';
let currentIeUrl = 'https://github.com/abbas-jhanjhi';

function openInRetroBrowser(url, brandType) {
  currentIeUrl = url;
  currentIeType = brandType;

  const urlInput = document.getElementById('ie-url-input');
  if (urlInput) urlInput.value = url;

  renderIeProfileContent(brandType);
  openWindow('win-ie');
}

function refreshIeProfile() {
  renderIeProfileContent(currentIeType);
}

async function renderIeProfileContent(type) {
  const container = document.getElementById('ie-render-container');
  const title = document.getElementById('ie-window-title');
  if (!container || !title) return;

  if (type === 'youtube') {
    title.innerText = '🌐 C:\\Program Files\\Internet Explorer\\iexplore.exe - YouTube Channel';
    container.innerHTML = `<p style="font-size:12px;">⏳ Connecting to YouTube Data API v3...</p>`;

    try {
      const chRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`);
      const chData = await chRes.json();

      if (chData.items && chData.items.length > 0) {
        const item = chData.items[0];
        const stats = item.statistics;
        const uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

        const vidRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=4&key=${YOUTUBE_API_KEY}`);
        const vidData = await vidRes.json();

        let videoCardsHtml = '';
        if (vidData.items && vidData.items.length > 0) {
          vidData.items.forEach(vid => {
            const snip = vid.snippet;
            const videoId = snip.resourceId.videoId;
            videoCardsHtml += `
              <div class="brand-item-card">
                <img src="${snip.thumbnails.medium.url}" style="width:100%; border-radius:2px; margin-bottom:6px;">
                <h4>${snip.title}</h4>
                <p style="font-size:10px; color:#666;">Published: ${new Date(snip.publishedAt).toLocaleDateString()}</p>
                <button class="xp-btn" style="margin-top:6px;" onclick="window.open('https://youtube.com/watch?v=${videoId}', '_blank')">Watch Video ►</button>
              </div>
            `;
          });
        }

        container.innerHTML = `
          <div class="brand-profile-header brand-youtube">
            <img src="${item.snippet.thumbnails.default.url}" class="profile-avatar-circle">
            <div class="profile-details">
              <h3>${item.snippet.title}</h3>
              <p>${item.snippet.description || 'Computer Science Projects & Tech Demos'}</p>
            </div>
          </div>
          <div class="yt-stats-bar">
            <span class="yt-stat-item">👥 Subscribers: ${Number(stats.subscriberCount).toLocaleString()}</span>
            <span class="yt-stat-item">👁️ Total Views: ${Number(stats.viewCount).toLocaleString()}</span>
            <span class="yt-stat-item">🎬 Uploads: ${stats.videoCount}</span>
          </div>
          <h3>📺 Latest Uploads (Live API Feed)</h3>
          <div class="brand-card-grid" style="margin-top:10px;">
            ${videoCardsHtml}
          </div>
        `;
      } else {
        throw new Error("No channel data returned");
      }
    } catch (err) {
      container.innerHTML = `
        <div class="brand-profile-header brand-youtube">
          <div class="profile-avatar-circle">▶️</div>
          <div class="profile-details">
            <h3>Abbas Dev - Tech & Coding</h3>
            <p>Computer Science Projects & Demos</p>
          </div>
        </div>
        <div class="yt-stats-bar">
          <span class="yt-stat-item">👥 Subscribers: 1,240</span>
          <span class="yt-stat-item">👁️ Total Views: 45,820</span>
          <span class="yt-stat-item">🎬 Uploads: 18</span>
        </div>
        <h3>📺 Featured Uploads</h3>
        <div class="brand-card-grid" style="margin-top:10px;">
          <div class="brand-item-card">
            <h4>Building a Windows XP Portfolio OS</h4>
            <p>Full walkthrough of building a retro desktop UI using JavaScript.</p>
          </div>
          <div class="brand-item-card">
            <h4>Data Structures & Algorithms Guide</h4>
            <p>Visual explanations for Sunway University CS students.</p>
          </div>
        </div>
      `;
    }
  } else if (type === 'github') {
    title.innerText = '🌐 C:\\Program Files\\Internet Explorer\\iexplore.exe - GitHub Profile';
    container.innerHTML = `
      <div class="brand-profile-header brand-github">
        <div class="profile-avatar-circle">🐙</div>
        <div class="profile-details">
          <h3>Muhammad Abbas Jhanjhi (@abbas-jhanjhi)</h3>
          <p>Computer Science Student @ Sunway University | Full-Stack & Systems Developer</p>
        </div>
      </div>
      <h3>📦 Featured Repositories</h3>
      <div class="brand-card-grid" style="margin-top:10px;">
        <div class="brand-item-card">
          <h4>TaskFlow</h4>
          <p>A productivity web app built for organizing daily university tasks.</p>
          <span style="font-size:10px; color:#666;">⭐ 12 Stars | JavaScript</span>
        </div>
        <div class="brand-item-card">
          <h4>AlgoVisualizer</h4>
          <p>Interactive graph and sorting algorithm visualizer suite.</p>
          <span style="font-size:10px; color:#666;">⭐ 24 Stars | Python & React</span>
        </div>
      </div>
    `;
  } else if (type === 'linkedin') {
    title.innerText = '🌐 C:\\Program Files\\Internet Explorer\\iexplore.exe - LinkedIn Profile';
    container.innerHTML = `
      <div class="brand-profile-header brand-linkedin">
        <div class="profile-avatar-circle">👔</div>
        <div class="profile-details">
          <h3>Muhammad Abbas Jhanjhi</h3>
          <p>Bs Computer Science @ Sunway University (2026–2029)</p>
          <p>Subang Jaya, Selangor, Malaysia • 500+ Connections</p>
        </div>
      </div>
      <h3>💼 Experience Summary</h3>
      <div class="brand-item-card" style="margin-top:10px;">
        <h4>Software Engineering Intern — Tech Solutions</h4>
        <p>Built responsive frontend features and API integrations.</p>
      </div>
    `;
  }
}


// ============================================================
// 3. EVENT LISTENERS SETUP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // Start Menu Toggle
  const startBtn = document.getElementById('start-button-toggle');
  const startMenu = document.getElementById('xp-start-menu');

  if (startBtn && startMenu) {
    startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#xp-start-menu') && !e.target.closest('#start-button-toggle')) {
        startMenu.classList.remove('active');
      }
    });
  }

  // Draggable Windows
  document.querySelectorAll('.xp-window').forEach(win => {
    const titleBar = win.querySelector('.title-bar');
    if (!titleBar) return;

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

  // Context Menu Handling
  const globalCtxMenu = document.getElementById('global-context-menu');
  const linkMenuGroup = document.getElementById('link-menu-group');
  let targetUrl = '';
  let targetType = 'github';

  if (globalCtxMenu) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      const linkItem = e.target.closest('.link-shortcut');

      if (linkItem && linkMenuGroup) {
        targetUrl = linkItem.getAttribute('data-url') || '';
        targetType = linkItem.getAttribute('data-type') || 'github';
        linkMenuGroup.style.display = 'block';
      } else if (linkMenuGroup) {
        linkMenuGroup.style.display = 'none';
      }

      globalCtxMenu.style.left = `${e.clientX}px`;
      globalCtxMenu.style.top = `${e.clientY}px`;
      globalCtxMenu.style.display = 'block';
    });

    const ieOpt = document.getElementById('ctx-open-ie');
    if (ieOpt) {
      ieOpt.addEventListener('click', () => {
        if (targetUrl) openInRetroBrowser(targetUrl, targetType);
      });
    }

    const tabOpt = document.getElementById('ctx-open-newtab');
    if (tabOpt) {
      tabOpt.addEventListener('click', () => {
        if (targetUrl) window.open(targetUrl, '_blank');
      });
    }

    const copyOpt = document.getElementById('ctx-copy-link');
    if (copyOpt) {
      copyOpt.addEventListener('click', () => {
        if (targetUrl) {
          navigator.clipboard.writeText(targetUrl);
          alert(`Copied link address: ${targetUrl}`);
        }
      });
    }

    document.addEventListener('click', () => {
      globalCtxMenu.style.display = 'none';
    });
  }

  // Desktop Icon Double Clicks
  document.querySelectorAll('.link-shortcut').forEach(item => {
    item.addEventListener('dblclick', () => {
      const url = item.getAttribute('data-url');
      const type = item.getAttribute('data-type') || 'github';
      openInRetroBrowser(url, type);
    });
  });

  // Click Sound Handler
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

  // Start Clock
  updateClock();
  setInterval(updateClock, 1000);
});

// Clock Function
function updateClock() {
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// Form Handler
function handleFormSubmit(e) {
  e.preventDefault();
  alert("Thank you, Muhammad Abbas Jhanjhi has received your message!");
  e.target.reset();
}