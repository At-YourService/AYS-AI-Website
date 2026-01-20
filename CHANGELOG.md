# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation (README, CONTRIBUTING, issue templates)

## [1.0.0] - 2026-01-20

### Added
- Initial release of At Your Service website
- Bilingual support (Dutch/English) with client-side switching
- GDPR-compliant cookie consent system
- Mobile-responsive design with dedicated mobile menu
- Dynamic header styling based on section backgrounds
- Smooth scroll navigation with URL hash updates
- Comprehensive test suite (166 tests total)
  - 112 unit tests (Vitest)
  - 25 build validation tests
  - 29 E2E tests (Playwright)
- Dual deployment strategy
  - GitHub Pages for staging/preview
  - OVHCloud for production
- CI/CD pipeline with GitHub Actions
- Cross-browser E2E testing (Chromium, Firefox, Mobile Chrome)

### Features
- **Services Section**: Four service categories (Discover, Build, Operations, Service)
- **Method Section**: Three-step methodology with USPs
- **Partners Section**: Partner logos with hover effects
- **Contact Section**: CTA with email link and footer
- **Cookie Banner**: Accept/decline with privacy policy links
- **Language Switcher**: Header and mobile menu language buttons
- **Mobile Menu**: Hamburger menu with smooth animations
- **Sticky Header**: Dynamic styling based on section backgrounds
- **Retro Design**: 80s-inspired styling with hard shadows and bold colors

### Technical
- Built with Vite for optimal performance
- Vanilla JavaScript (no framework dependencies)
- CSS variables for theming
- localStorage for language persistence
- Content Security Policy (CSP) headers
- Optimized asset loading and code splitting
- Lighthouse score: 95+

### Testing
- Unit test coverage: 80%+
- Build validation for output integrity
- E2E tests across multiple browsers and devices
- Automated CI/CD testing on every push

### Deployment
- Automated deployment to GitHub Pages (staging)
- Automated deployment to OVHCloud via FTP (production)
- Environment-based build configuration
- Separate base paths for each deployment target

---

## Release Notes Template

When creating a new release, copy this template:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
```

---

[Unreleased]: https://github.com/joren-biq/AYS-AI-Website/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/joren-biq/AYS-AI-Website/releases/tag/v1.0.0
