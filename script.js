// ============================================================
// CONFIGURATION: GITHUB & YOUTUBE DATA
// ============================================================
const GITHUB_USERNAME = 'muhammadabbas010';
const YOUTUBE_API_KEY = 'AIzaSyBrCVa8EPOCb6A3WTXfT6n81CHok7obSEs';
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
// 2. DUAL GITHUB + YOUTUBE ACTIVITY STICKY NOTE HANDLER
// ============================================================
async function fetchLatestCombinedActivity() {
  const container = document.getElementById('sticky-activity-body');
  if (!container) return;

  let latestActivity = null;

  // 1. Check GitHub Activity
  try {
    const ghRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
    if (ghRes.ok) {
      const ghEvents = await ghRes.json();
      if (ghEvents && ghEvents.length > 0) {
        const ev = ghEvents[0];
        const date = new Date(ev.created_at);
        const repo = ev.repo.name.replace(`${GITHUB_USERNAME}/`, '');
        let msg = `Pushed code to ${repo}`;
        if (ev.type === 'PushEvent' && ev.payload.commits && ev.payload.commits.length > 0) {
          msg = `Pushed to ${repo}: "${ev.payload.commits[0].message}"`;
        }
        latestActivity = { type: 'github', text: msg, date: date };
      }
    }
  } catch (e) {
    console.error("GitHub Sticky Fetch Error:", e);
  }

  // 2. Check YouTube Activity
  try {
    if (YOUTUBE_API_KEY && YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY') {
      const playlistId = 'UU' + YOUTUBE_CHANNEL_ID.substring(2);
      const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1&key=${YOUTUBE_API_KEY}`);
      if (ytRes.ok) {
        const ytData = await ytRes.json();
        if (ytData.items && ytData.items.length > 0) {
          const item = ytData.items[0].snippet;
          const date = new Date(item.publishedAt);
          const msg = `Uploaded video: "${item.title}"`;

          if (!latestActivity || date > latestActivity.date) {
            latestActivity = { type: 'youtube', text: msg, date: date };
          }
        }
      }
    }
  } catch (e) {
    console.error("YouTube Sticky Fetch Error:", e);
  }

  // 3. Check 2-Week Window (14 Days)
  const now = new Date();
  const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

  if (!latestActivity || (now - latestActivity.date) > twoWeeksInMs) {
    container.innerHTML = `<p class="sticky-activity-item">No activity found for the last 2 weeks.</p>`;
    return;
  }

  const daysAgo = Math.floor((now - latestActivity.date) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor((now - latestActivity.date) / (1000 * 60 * 60));
  let timeStr = daysAgo > 0 ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago` : `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  if (daysAgo === 0 && hoursAgo === 0) timeStr = 'Just now';

  const icon = latestActivity.type === 'github' ? '🐙' : '📺';

  container.innerHTML = `
    <p class="sticky-activity-item">${icon} ${latestActivity.text}</p>
    <span class="sticky-time">🕒 ${timeStr}</span>
  `;
}


// ============================================================
// 3. RETRO IE BROWSER WITH YOUTUBE API INTEGRATION
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
// 4. EVENT LISTENERS & CONTEXT MENU / MARQUEE RESTORATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // Fetch Live Dual Activity
  fetchLatestCombinedActivity();

  // Desktop Selection Marquee
  const desktop = document.getElementById('desktop');
  const selectionBox = document.getElementById('selection-box');
  const iconItems = document.querySelectorAll('.desktop-icon-item');

  let isSelecting = false;
  let startX = 0, startY = 0;

  if (desktop && selectionBox) {
    desktop.addEventListener('mousedown', (e) => {
      if (
        e.target.closest('.xp-window') ||
        e.target.closest('#taskbar') ||
        e.target.closest('#xp-start-menu') ||
        e.target.closest('#global-context-menu') ||
        e.target.closest('#activity-sticky-note') ||
        e.button !== 0
      ) {
        return;
      }

      isSelecting = true;
      const rect = desktop.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;

      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = '0px';
      selectionBox.style.height = '0px';
      selectionBox.style.display = 'block';

      if (!e.target.closest('.desktop-icon-item')) {
        iconItems.forEach(icon => icon.classList.remove('selected'));
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isSelecting) return;

      const rect = desktop.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);

      selectionBox.style.left = `${left}px`;
      selectionBox.style.top = `${top}px`;
      selectionBox.style.width = `${width}px`;
      selectionBox.style.height = `${height}px`;

      const boxRect = selectionBox.getBoundingClientRect();
      iconItems.forEach(icon => {
        const iconRect = icon.getBoundingClientRect();
        const isColliding = !(
          boxRect.right < iconRect.left ||
          boxRect.left > iconRect.right ||
          boxRect.bottom < iconRect.top ||
          boxRect.top > iconRect.bottom
        );

        if (isColliding) {
          icon.classList.add('selected');
        } else {
          icon.classList.remove('selected');
        }
      });
    });

    document.addEventListener('mouseup', () => {
      if (isSelecting) {
        isSelecting = false;
        selectionBox.style.display = 'none';
      }
    });
  }

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

  // Window Dragging & Viewport Clamping
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
      if (!isDragging) return;

      const desktopRect = desktop.getBoundingClientRect();
      const winWidth = win.offsetWidth;
      const winHeight = win.offsetHeight;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      const maxLeft = desktopRect.width - winWidth;
      const maxTop = desktopRect.height - winHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });

  // RESTORED CUSTOM RIGHT-CLICK CONTEXT MENU
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

  // ============================================================
  // NEW LINK-SHORTCUT CLICK LISTENER (GITHUB REPO INSPECTOR)
  // ============================================================
  document.addEventListener('click', function (e) {
    const shortcut = e.target.closest('.link-shortcut');
    if (shortcut && !e.target.closest('#global-context-menu')) {
      const rawUrl = shortcut.getAttribute('data-url');
      
      if (rawUrl && rawUrl.includes('github.com/')) {
        const cleanPath = rawUrl.replace(/^https?:\/\/(www\.)?github\.com\//, '');
        const parts = cleanPath.split('/').filter(Boolean);
        
        // If it points to a specific repository (owner/repo)
        if (parts.length >= 2) {
          e.preventDefault();
          const owner = parts[0];
          const repo = parts[1];

          openWindow('win-ie');

          const ieInput = document.getElementById('ie-url-input');
          if (ieInput) ieInput.value = rawUrl;

          loadGitHubRepoData(owner, repo, 'ie-render-container');
        }
      }
    }
  });

  // Audio Handler
  const clickSound = new Audio("assets/audio/click.mp3");
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

// Form Handler (AJAX Formspree)
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      alert("Thank you! Your message has been sent directly to Muhammad Abbas Jhanjhi.");
      form.reset();
    } else {
      const errData = await response.json();
      alert(`Submission error: ${errData.errors ? errData.errors[0].message : 'Check Formspree Endpoint'}`);
    }
  } catch (error) {
    alert("Network error. Please try again later.");
  }
}


// Github Page API Refreshing 
// Github Page API Refreshing (Updated with README, Contributors & High-Vis Button)
async function loadGitHubRepoData(owner, repo, windowContentId) {
  const container = document.getElementById(windowContentId);
  container.innerHTML = `<p class="sticky-loading" style="padding:15px;">⏳ Fetching live repository data, contributors, and README from GitHub...</p>`;

  try {
    // Parallel API Requests for performance
    const [repoRes, commitsRes, contribRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=3`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { 'Accept': 'application/vnd.github.raw+json' }
      })
    ]);

    if (!repoRes.ok) throw new Error('Repository not found');
    const repoData = await repoRes.json();
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];
    const contribData = contribRes.ok ? await contribRes.json() : [];
    const readmeData = readmeRes.ok ? await readmeRes.text() : 'No README.md found in repository.';

    // Sanitize README HTML tags to avoid breaking the XP layout
    const cleanReadme = readmeData
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Build Contributors HTML
    const contribHtml = contribData.length > 0 ? contribData.map(c => `
      <a href="${c.html_url}" target="_blank" style="display:inline-flex; align-items:center; gap:4px; background:#fff; border:1px solid #7f9db9; padding:2px 6px; text-decoration:none; color:#000; font-size:11px;">
        <img src="${c.avatar_url}" style="width:14px; height:14px; border-radius:50%;">
        <strong>${c.login}</strong> (${c.contributions})
      </a>
    `).join(' ') : '<span>No contributors data.</span>';

    // Render Window Body
    container.innerHTML = `
      <div style="padding: 10px; font-family: Tahoma, sans-serif;">
        
        <!-- HIGH VISIBILITY TOP ACTION BAR -->
        <div style="background: linear-gradient(to bottom, #225ad2, #00309c); padding: 8px 12px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);">
          <span style="color: #fff; font-weight: bold; font-size: 12px;">🔗 Official Repository Source</span>
          <a class="xp-btn" href="${repoData.html_url}" target="_blank" rel="noopener noreferrer" 
             style="background: linear-gradient(to bottom, #39d114, #1f8008); color: white; font-weight: bold; border: 1px solid #144e04; padding: 5px 14px; text-decoration: none; border-radius: 3px; text-shadow: 1px 1px 1px #000; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             🚀 Open Live Repo on GitHub.com ►
          </a>
        </div>

        <!-- REPO DETAILS -->
        <div class="card" style="margin-bottom: 10px;">
          <h3 style="margin:0 0 6px 0;">📦 ${repoData.name} <span style="font-size: 11px; color: #666;">(${repoData.visibility})</span></h3>
          <p style="margin:0 0 8px 0; font-size: 12px;">${repoData.description || 'No description provided.'}</p>
          <div style="font-size: 11px; background: #f0f0f0; padding: 6px; border: 1px inset #d0d0d0; display: flex; gap: 12px; margin-bottom: 8px;">
            <span>⭐ Stars: <strong>${repoData.stargazers_count}</strong></span>
            <span>🍴 Forks: <strong>${repoData.forks_count}</strong></span>
            <span>🛠️ Language: <strong>${repoData.language || 'N/A'}</strong></span>
          </div>

          <!-- CONTRIBUTORS -->
          <div style="font-size: 11px;">
            <strong style="display:block; margin-bottom:4px;">👥 Contributors:</strong>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">${contribHtml}</div>
          </div>
        </div>

        <!-- GIT COMMIT TERMINAL -->
        <div class="cmd-terminal-box" style="margin-bottom: 10px;">
          <div class="cmd-bar">Git Commit Log — Latest Updates</div>
          <div class="cmd-body" style="font-size: 11px; max-height: 80px; overflow-y: auto;">
            ${commitsData.map(c => `
              <p style="margin: 2px 0;">
                <span class="cmd-prompt">${c.sha.substring(0, 7)}:</span> ${c.commit.message} 
                <br><small style="color: #888;">by ${c.commit.author.name} on ${new Date(c.commit.author.date).toLocaleDateString()}</small>
              </p>
            `).join('')}
          </div>
        </div>

        <!-- README PREVIEW TERMINAL -->
        <div class="cmd-terminal-box">
          <div class="cmd-bar">📄 README.md Preview</div>
          <div class="cmd-body" style="font-size: 11px; max-height: 140px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; color: #d0d0d0;">${cleanReadme}</div>
        </div>

      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p style="color: red; padding: 15px;">❌ Failed to load repo data: ${error.message}</p>`;
  }
}