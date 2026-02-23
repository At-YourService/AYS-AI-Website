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

// --- NEWS LOADING LOGIC ---
async function loadNews() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  try {
    const response = await fetch('./news/manifest.json');
    if (!response.ok) throw new Error('Could not load news manifest');
    const articleFiles = await response.json();

    const articles = await Promise.all(articleFiles.map(async (file) => {
      const res = await fetch(`./news/${file}`);
      if (!res.ok) return null;
      const content = await res.text();

      // Basic Frontmatter Parser (extracts everything between top ---)
      let title = '';
      let category = 'News';
      let excerpt = '';
      let cleanContent = content;

      if (content.startsWith('---')) {
        const parts = content.split('---');
        if (parts.length >= 3) {
          const frontmatter = parts[1];
          cleanContent = parts.slice(2).join('---').trim();

          frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              const value = valueParts.join(':').trim();
              if (key.trim() === 'title') title = value;
              if (key.trim() === 'category') category = value;
              if (key.trim() === 'excerpt') excerpt = value;
            }
          });
        }
      }

      // If title not in frontmatter, try to find first H1
      if (!title) {
        const h1Match = cleanContent.match(/^# (.*)$/m);
        title = h1Match ? h1Match[1] : file.replace('.md', '').replaceAll('_', ' ');
      }

      // Extract date from filename: dd_MM_yyyy_text.md
      const dateParts = file.split('_');
      let dateStr = 'Recent';
      if (dateParts.length >= 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = dateParts[0];
        const monthIndex = parseInt(dateParts[1]) - 1;
        const year = dateParts[2];
        if (monthIndex >= 0 && monthIndex < 12) {
          dateStr = `${day} ${months[monthIndex]} ${year}`;
        }
      }

      return { title, category, excerpt, date: dateStr, file };
    }));

    // Filter failed loads and render
    blogGrid.innerHTML = articles
      .filter(a => a !== null)
      .map(article => `
        <article class="blog-card">
            <div class="blog-image">
                <div class="placeholder-img"
                    style="background-color: #f1f3f6; width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; color: #666;">
                    <i data-lucide="image" style="width: 48px; height: 48px; opacity: 0.3;"></i>
                </div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${article.date}</span>
                    <span class="blog-category">${article.category}</span>
                </div>
                <h3 class="blog-title">${article.title}</h3>
                <p class="blog-excerpt">${article.excerpt || 'Lees meer over dit onderwerp.'}</p>
                <a href="#" class="blog-link" onclick="console.log('Open article: ${article.file}'); return false;">Lees meer <i data-lucide="arrow-right"></i></a>
            </div>
        </article>
      `).join('');

    // Re-initialize icons
    if (window.lucide) lucide.createIcons();

  } catch (error) {
    console.error('Error loading news:', error);
    blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Er is een fout opgetreden bij het laden van het nieuws.</p>';
  }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // 0. News Init
  loadNews();

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
