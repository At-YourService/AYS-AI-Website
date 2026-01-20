# At Your Service - AI Agency Website

> Applied AI Agency website showcasing services, methodology, and expertise in AI strategy, implementation, and operational intelligence.

[![CI/CD](https://github.com/joren-biq/AYS-AI-Website/actions/workflows/test-and-deploy.yml/badge.svg)](https://github.com/joren-biq/AYS-AI-Website/actions)

## 🌐 Live Sites

- **Production**: https://at-yourservice.ai
- **Staging (GitHub Pages)**: https://joren-biq.github.io/AYS-AI-Website/

## ✨ Features

- 🎨 Modern, responsive design with 80s-inspired retro styling
- 🌍 Bilingual support (Dutch/English) with client-side switching
- 🍪 GDPR-compliant cookie consent with localStorage persistence
- 📱 Mobile-first design with dedicated mobile menu
- ♿ Accessible navigation with smooth scroll and URL hash updates
- 🎭 Dynamic header styling based on section backgrounds
- ⚡ Optimized build with Vite (instant HMR, modern bundling)
- 🧪 Comprehensive test coverage (166 tests total)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/joren-biq/AYS-AI-Website.git
cd AYS-AI-Website

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at http://localhost:5173

## 📦 Scripts

### Development

```bash
npm run dev          # Start Vite dev server with HMR
npm run preview      # Preview production build locally
```

### Building

```bash
npm run build        # Build for production
```

### Testing

```bash
# Unit Tests (Vitest)
npm run test:unit              # Run once
npm run test:unit:watch        # Watch mode
npm run test:unit:coverage     # Generate coverage report

# Build Validation
npm run test:build             # Validate dist/ output

# E2E Tests (Playwright)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Open Playwright UI
npm run test:e2e:headed        # Run with browser visible
npm run test:e2e:debug         # Debug mode

# Install Playwright browsers
npm run playwright:install
```

### All Tests

```bash
npm test             # Run unit tests, build validation, and E2E tests
```

## 🧪 Test Coverage

| Type | Count | Coverage | Description |
|------|-------|----------|-------------|
| **Unit Tests** | 112 | 80%+ | Business logic, translations, state management |
| **Build Validation** | 25 | 100% | Output integrity, file structure, security headers |
| **E2E Tests** | 29 | - | Cross-browser integration tests |
| **Total** | **166** | - | Comprehensive test suite |

### Browser Coverage

- **Chromium** (Desktop): Cookie consent, language switching
- **Firefox** (Desktop): Navigation, URL hash updates
- **Mobile Chrome** (Pixel 5): Header scroll, mobile menu

## 🏗️ Project Structure

```
.
├── .github/
│   └── workflows/
│       └── test-and-deploy.yml    # CI/CD pipeline
├── tests/
│   ├── unit/                      # Vitest unit tests
│   ├── e2e/                       # Playwright E2E tests
│   └── build/                     # Build validation tests
├── dist/                          # Production build output
├── index.html                     # Entry HTML
├── main.js                        # Main application logic
├── style.css                      # Global styles
├── translations.js                # i18n translations
├── vite.config.js                 # Vite configuration
├── playwright.config.js           # Playwright configuration
├── vitest.config.js               # Vitest configuration
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                      # This file
```

## 🚢 Deployment

The project uses automated dual deployment:

### GitHub Pages (Staging)
- **Triggers**: Push to `main` after unit tests + build validation pass
- **URL**: https://joren-biq.github.io/AYS-AI-Website/
- **Base Path**: `/AYS-AI-Website/`

### OVHCloud (Production)
- **Triggers**: Push to `main` after ALL tests pass (including E2E)
- **URL**: https://at-yourservice.ai
- **Base Path**: `/`
- **Method**: FTP deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## 🛠️ Technology Stack

### Core
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Custom styling with CSS variables

### Testing
- **Vitest** - Unit testing framework
- **Playwright** - E2E browser testing
- **happy-dom** - Lightweight DOM for unit tests

### CI/CD
- **GitHub Actions** - Automated testing and deployment
- **FTP Deploy Action** - OVHCloud deployment

### Hosting
- **OVHCloud** - Production hosting (custom domain)
- **GitHub Pages** - Staging/preview environment

## 🌍 Internationalization

The site supports Dutch (default) and English:

```javascript
// translations.js
export const translations = {
  'nav.services': {
    nl: 'Diensten',
    en: 'Services'
  },
  // ... more translations
};
```

Language switching is handled client-side with localStorage persistence (when cookies are accepted).

## 🍪 Cookie Consent

GDPR-compliant cookie consent system:

- **Accept**: Language preference saved to localStorage
- **Decline**: No data persisted, language resets on reload
- **Banner**: Shown once per user with privacy/cookie policy links

## 🎨 Design System

### Colors
```css
--color-dark: #2A2A2A
--color-light: #F5F5F5
--color-accent: #E8C547 (golden yellow)
```

### Typography
- **Headings**: Manrope (800 weight, tight letter-spacing)
- **Body**: Manrope (400-600 weight)
- **Display**: Bold, large sizes for hero sections

### Components
- Sticky header with dynamic styling
- Card-based service grid
- Retro hard shadows on hover
- Smooth scroll navigation
- Mobile hamburger menu

## 🔒 Security

- Content Security Policy (CSP) meta tags
- Input validation and XSS prevention
- Secure localStorage usage
- No inline scripts (CSP compliant)
- HTTPS enforced in production

## 📊 Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Optimized asset loading (lazy images, code splitting)
- Minimal JavaScript bundle (<11kb gzipped)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with descriptive message
6. Push to your fork
7. Open a Pull Request

## 📝 License

Copyright © 2026 At Your Service. All rights reserved.

## 👥 Authors

- **Joren Janssens** - Initial work and development
- **Claude AI (Sonnet 4.5)** - Development assistance and automation

## 🙏 Acknowledgments

- Lucide Icons for beautiful iconography
- Vite team for excellent tooling
- Playwright and Vitest communities

## 📞 Support

For questions or support:
- **Email**: info@at-yourservice.ai
- **Website**: https://at-yourservice.ai
- **Issues**: https://github.com/joren-biq/AYS-AI-Website/issues

---

Made with ❤️ in Antwerp, Belgium
