import { translations } from './translations.js';

// --- STATE MANAGEMENT ---
const state = {
  lang: 'nl', // Default
  cookieConsent: localStorage.getItem('cookieConsent') // null, 'accepted', 'declined'
};

// --- DOM ELEMENTS ---
const elements = {
  langBtns: document.querySelectorAll('.lang-text-btn'), // Changed from single toggle
  cookieBanner: document.getElementById('cookie-banner'),
  btnAccept: document.getElementById('cookie-accept'),
  btnDecline: document.getElementById('cookie-decline'),
  header: document.querySelector('header'),
  partnersSection: document.getElementById('partners'),
  mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
  mobileNav: document.querySelector('.mobile-nav')
};

// --- LANGUAGE LOGIC ---
function setLanguage(lang) {
  state.lang = lang;

  // Update UI Text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang]) {
      const translatedText = translations[key][lang];

      // Safely handle <br> tags by replacing with actual DOM elements
      if (translatedText.includes('<br>')) {
        // Clear the element
        el.textContent = '';
        // Split by <br> and create text nodes with br elements
        const parts = translatedText.split('<br>');
        parts.forEach((part, index) => {
          el.appendChild(document.createTextNode(part));
          if (index < parts.length - 1) {
            el.appendChild(document.createElement('br'));
          }
        });
      } else {
        // Use textContent for everything else (safe from XSS)
        el.textContent = translatedText;
      }
    }
  });

  // Update Switcher State (Bold active) - both header and mobile nav
  document.querySelectorAll('.lang-text-btn').forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Persist if consented
  if (state.cookieConsent === 'accepted') {
    localStorage.setItem('lang', lang);
  }
}

// Remove toggleLanguage(), replace with specific listeners

// --- COOKIE LOGIC ---
function initCookies() {
  if (!state.cookieConsent) {
    // Show banner if no choice made
    if (elements.cookieBanner) elements.cookieBanner.classList.remove('hidden');
  } else if (state.cookieConsent === 'accepted') {
    // Load persisted language if accepted
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }
}

function acceptCookies() {
  state.cookieConsent = 'accepted';
  localStorage.setItem('cookieConsent', 'accepted');
  localStorage.setItem('lang', state.lang); // Save current lang immediately
  if (elements.cookieBanner) elements.cookieBanner.classList.add('hidden');
}

function declineCookies() {
  state.cookieConsent = 'declined';
  localStorage.setItem('cookieConsent', 'declined');
  // Clear any potential leftovers
  localStorage.removeItem('lang');
  if (elements.cookieBanner) elements.cookieBanner.classList.add('hidden');
}

// --- HEADER / SCROLL LOGIC ---
function checkHeaderState() {
  const scrollY = window.scrollY;
  const headerHeight = elements.header ? elements.header.offsetHeight : 100;

  // Get all sections to check which one the header is over
  const darkSections = document.querySelectorAll('.dark-section');
  const lightSections = document.querySelectorAll('.light-section');
  const accentSections = document.querySelectorAll('.accent-section');

  let isOnDark = false;
  let isOnLight = false;
  let isOnAccent = false;

  // Check dark sections (method section)
  darkSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= headerHeight && rect.bottom >= 0) {
      isOnDark = true;
    }
  });

  // Check light sections (services)
  lightSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= headerHeight && rect.bottom >= 0) {
      isOnLight = true;
      isOnDark = false;
    }
  });

  // Check accent sections (partners)
  accentSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= headerHeight && rect.bottom >= 0) {
      isOnAccent = true;
      isOnDark = false;
      isOnLight = false;
    }
  });

  // Check footer-cta specifically (it's dark)
  const footerCta = document.querySelector('.footer-cta');
  if (footerCta) {
    const rect = footerCta.getBoundingClientRect();
    if (rect.top <= headerHeight && rect.bottom >= 0) {
      isOnDark = true;
      isOnLight = false;
      isOnAccent = false;
    }
  }

  // Handle Scrolled Mode
  if (scrollY > 50) {
    elements.header.classList.add('header-scrolled');
  } else {
    elements.header.classList.remove('header-scrolled');
  }

  // Handle Dark Mode
  if (isOnDark) {
    elements.header.classList.add('header-on-dark');
  } else {
    elements.header.classList.remove('header-on-dark');
  }

  // Handle Light Mode
  if (isOnLight) {
    elements.header.classList.add('header-on-light');
  } else {
    elements.header.classList.remove('header-on-light');
  }

  // Handle Accent Mode
  if (isOnAccent) {
    elements.header.classList.add('header-on-accent');
  } else {
    elements.header.classList.remove('header-on-accent');
  }
}

// --- MOBILE MENU ---
function toggleMobileMenu() {
  if (elements.mobileMenuBtn && elements.mobileNav) {
    elements.mobileMenuBtn.classList.toggle('active');
    elements.mobileNav.classList.toggle('active');
    document.body.style.overflow = elements.mobileNav.classList.contains('active') ? 'hidden' : '';
  }
}

function closeMobileMenu() {
  if (elements.mobileMenuBtn && elements.mobileNav) {
    elements.mobileMenuBtn.classList.remove('active');
    elements.mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- CONTENT LOADING LOGIC (News & Jobs) ---
async function loadContent(type) {
  const gridId = type === 'news' ? 'blog-grid' : 'jobs-grid';
  const grid = document.getElementById(gridId);
  if (!grid) return;

  console.log(`[ContentLoader] Loading ${type}...`);
  const folder = `./${type}`;

  try {
    const response = await fetch(`${folder}/manifest.json`);
    if (!response.ok) throw new Error(`Could not load ${type} manifest at ${folder}/manifest.json`);
    const files = await response.json();
    console.log(`[ContentLoader] Found ${files.length} files for ${type}`);

    const items = await Promise.all(files.map(async (file) => {
      try {
        const res = await fetch(`${folder}/${file}`);
        if (!res.ok) {
          console.warn(`[ContentLoader] Failed to fetch ${file}: ${res.status}`);
          return null;
        }
        const content = await res.text();

        // Basic Frontmatter Parser
        let title = '';
        let category = type === 'news' ? 'News' : 'Job';
        let excerpt = '';
        let dateText = '';
        let cleanContent = content;

        if (content.startsWith('---')) {
          const parts = content.split('---');
          if (parts.length >= 3) {
            const frontmatter = parts[1];
            cleanContent = parts.slice(2).join('---').trim();

            frontmatter.split('\n').forEach(line => {
              const colonIndex = line.indexOf(':');
              if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).trim().toLowerCase();
                const value = line.substring(colonIndex + 1).trim();
                if (key === 'title') title = value;
                if (key === 'category') category = value;
                if (key === 'excerpt') excerpt = value;
                if (key === 'date') dateText = value;
              }
            });
          }
        }

        // Fallbacks
        if (!title) {
          const h1Match = cleanContent.match(/^# (.*)$/m);
          title = h1Match ? h1Match[1] : file.replace('.md', '').replaceAll('_', ' ');
        }

        // Date parsing for news (dd_MM_yyyy_text.md)
        if (!dateText && type === 'news') {
          const dateParts = file.split('_');
          if (dateParts.length >= 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = dateParts[0];
            const monthIndex = parseInt(dateParts[1]) - 1;
            const year = dateParts[2];
            if (monthIndex >= 0 && monthIndex < 12) {
              dateText = `${day} ${months[monthIndex]} ${year}`;
            }
          }
        }

        if (!dateText) dateText = 'Recent';

        return { title, category, excerpt, date: dateText, file };
      } catch (e) {
        console.error(`[ContentLoader] Error processing ${file}:`, e);
        return null;
      }
    }));

    const validItems = items.filter(i => i !== null);
    if (validItems.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Geen ${type} gevonden.</p>`;
      return;
    }

    grid.innerHTML = validItems
      .map(item => `
        <article class="blog-card">
            <div class="blog-image">
                <div class="placeholder-img"
                    style="background-color: #f1f3f6; width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; color: #666;">
                    <i data-lucide="${type === 'news' ? 'image' : 'briefcase'}" style="width: 48px; height: 48px; opacity: 0.3;"></i>
                </div>
            </div>
            <div class="blog-content">
                ${type === 'news' ? `
                <div class="blog-meta">
                    <span class="blog-date">${item.date}</span>
                    <span class="blog-category">${item.category}</span>
                </div>` : ''}
                <h3 class="blog-title">${item.title}</h3>
                <p class="blog-excerpt">${item.excerpt || (type === 'news' ? 'Lees meer over dit onderwerp.' : 'Bekijk deze vacature.')}</p>
                <a href="post.html?type=${type}&file=${item.file}" class="blog-link">
                    ${type === 'news' ? 'Lees meer' : 'Bekijk vacature'} <i data-lucide="arrow-right"></i>
                </a>
            </div>
        </article>
      `).join('');

    if (window.lucide) lucide.createIcons();
    console.log(`[ContentLoader] Successfully rendered ${validItems.length} ${type} items`);

  } catch (error) {
    console.error(`[ContentLoader] Critical error loading ${type}:`, error);
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Er is een fout opgetreden bij het laden van de ${type}.</p>`;
  }
}

// --- POST DETAIL LOGIC ---
async function initPostDetail() {
  const heroContainer = document.getElementById('post-hero-container');
  const bodyContainer = document.getElementById('post-body-container');
  if (!heroContainer || !bodyContainer) return;

  console.log('[PostDetail] Initializing...');
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  const file = urlParams.get('file');

  if (!type || !file) {
    console.warn('[PostDetail] Missing type or file in URL parameters');
    heroContainer.innerHTML = '<h1>Bericht niet gevonden.</h1>';
    return;
  }

  try {
    const fetchPath = `./${type}/${file}`;
    console.log(`[PostDetail] Fetching content from: ${fetchPath}`);
    const response = await fetch(fetchPath);
    if (!response.ok) throw new Error(`Could not load content from ${fetchPath} (Status: ${response.status})`);
    const content = await response.text();

    let cleanContent = content;
    let title = '';
    let category = '';
    let dateStr = '';

    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        const frontmatter = parts[1];
        cleanContent = parts.slice(2).join('---').trim();

        frontmatter.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const k = line.substring(0, colonIndex).trim().toLowerCase();
            const v = line.substring(colonIndex + 1).trim();
            if (k === 'title') title = v;
            if (k === 'category') category = v;
            if (k === 'date') dateStr = v;
          }
        });
      }
    }

    // Fallback title from filename or H1
    if (!title) {
      const h1Match = cleanContent.match(/^# (.*)$/m);
      title = h1Match ? h1Match[1] : file.split('_').slice(3).join(' ').replace('.md', '');
    }

    console.log(`[PostDetail] Rendering post: ${title}`);

    // Process markdown
    if (!window.marked) {
      throw new Error('Marked.js library is not loaded');
    }

    const markdownToRender = cleanContent.replace(/^# .*$/m, '').trim();
    const htmlContent = marked.parse(markdownToRender);

    // Hero Injection
    heroContainer.innerHTML = `
      <div class="hero-content">
        ${type === 'news' ? `
        <div class="post-meta">
          ${dateStr ? `<span class="post-date">${dateStr}</span>` : ''}
          ${category ? `<span class="post-category">${category}</span>` : ''}
        </div>` : ''}
        <h1 class="post-title">${title}</h1>
      </div>
    `;

    // Body Injection
    bodyContainer.innerHTML = `
      <div class="post-body">
        ${htmlContent}
      </div>
    `;

    document.title = `${title} | at your service`;

  } catch (error) {
    console.error('[PostDetail] Critical error:', error);
    heroContainer.innerHTML = `<h1>Fout</h1>`;
    bodyContainer.innerHTML = `<p style="text-align: center; color: red;">Er is een fout opgetreden bij het laden van de inhoud: ${error.message}</p>`;
  }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // 0. Content Init
  loadContent('news');
  loadContent('jobs');
  initPostDetail();

  // 1. Language Init
  if (elements.langBtns) {
    elements.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  // 2. Cookie Init
  initCookies();
  if (elements.btnAccept) elements.btnAccept.addEventListener('click', acceptCookies);
  if (elements.btnDecline) elements.btnDecline.addEventListener('click', declineCookies);

  // 3. Scroll Init
  window.addEventListener('scroll', checkHeaderState);
  checkHeaderState();

  // 4. Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 5. Mobile Menu
  if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking nav links
  if (elements.mobileNav) {
    elements.mobileNav.querySelectorAll('.mobile-nav-links a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Also handle lang buttons in mobile nav
    elements.mobileNav.querySelectorAll('.mobile-nav-lang .lang-text-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  // 6. Handle anchor navigation for sticky sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Temporarily remove sticky positioning from all sections
        const sections = document.querySelectorAll('.section-card');
        sections.forEach(section => {
          section.style.position = 'relative';
        });

        // Scroll to target
        targetElement.scrollIntoView({ behavior: 'smooth' });

        // Update URL hash manually since we prevented default
        window.location.hash = targetId;

        // Restore sticky positioning after scroll completes
        setTimeout(() => {
          sections.forEach(section => {
            section.style.position = '';
          });
        }, 800);
      }
    });
  });
});
