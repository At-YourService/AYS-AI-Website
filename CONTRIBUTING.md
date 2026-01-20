# Contributing to At Your Service Website

Thank you for considering contributing to our project! This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/AYS-AI-Website.git
cd AYS-AI-Website

# Add upstream remote
git remote add upstream https://github.com/joren-biq/AYS-AI-Website.git

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npm run playwright:install

# Start development server
npm run dev
```

## 📋 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Feature branches
git checkout -b feature/add-new-service
git checkout -b feature/improve-navigation

# Bug fix branches
git checkout -b fix/mobile-menu-issue
git checkout -b fix/translation-typo

# Documentation branches
git checkout -b docs/update-readme
```

### 2. Make Your Changes

**Guidelines:**
- Follow existing code style and conventions
- Write meaningful commit messages
- Keep changes focused and atomic
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

**Before committing, always run:**

```bash
# Run all tests
npm test

# Or run specific test suites
npm run test:unit           # Unit tests (fast)
npm run test:build          # Build validation
npm run test:e2e            # E2E tests (slower)
```

**All tests must pass before submitting a PR.**

### 4. Commit Your Changes

Follow conventional commit format:

```bash
# Format: <type>: <description>
#
# Types: feat, fix, docs, style, refactor, test, chore

git commit -m "feat: add contact form component"
git commit -m "fix: resolve mobile menu overflow issue"
git commit -m "docs: update deployment instructions"
git commit -m "style: reduce service card whitespace"
git commit -m "test: add E2E tests for language switching"
```

**Commit Message Guidelines:**
- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Keep first line under 72 characters
- Add detailed description if needed (after blank line)
- Reference issues: "fix: resolve #123"

**Example of detailed commit:**

```bash
git commit -m "feat: add bilingual support for service descriptions

- Add translation keys for all service content
- Implement language switcher in service cards
- Update tests to cover translation switching
- Add documentation for adding new translations

Closes #45"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to https://github.com/joren-biq/AYS-AI-Website
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template (see below)
5. Wait for review

## 📝 Pull Request Guidelines

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Build validation passes
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

## 🧪 Testing Guidelines

### Writing Unit Tests

Use Vitest with happy-dom:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyFeature', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Writing E2E Tests

Use Playwright:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correctly', async ({ page }) => {
    const element = page.locator('#my-element');
    await expect(element).toBeVisible();
  });
});
```

### Test Coverage Requirements

- **Unit Tests**: Aim for 80%+ line coverage
- **E2E Tests**: Cover critical user flows
- **Edge Cases**: Test error conditions and boundary values

## 💅 Code Style Guidelines

### JavaScript

```javascript
// Use const/let, never var
const API_URL = 'https://api.example.com';
let counter = 0;

// Use arrow functions for callbacks
items.map(item => item.name);

// Use template literals
const message = `Hello, ${name}!`;

// Use meaningful variable names
const userEmail = user.email; // Good
const e = user.email;          // Bad

// Handle errors explicitly
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed to fetch data:', error);
}
```

### CSS

```css
/* Use CSS custom properties for colors */
.element {
  color: var(--color-dark);
  background: var(--color-light);
}

/* Use BEM-like naming for specificity */
.service-card { }
.service-card__title { }
.service-card--featured { }

/* Mobile-first media queries */
.element {
  width: 100%;
}

@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

### HTML

```html
<!-- Use semantic HTML -->
<header>
<nav>
<main>
<article>
<section>
<footer>

<!-- Add ARIA labels for accessibility -->
<button aria-label="Close menu">×</button>

<!-- Use data attributes for i18n -->
<h1 data-i18n="hero.title">Title</h1>
```

## 🌍 Adding Translations

To add new translations:

1. **Update translations.js:**

```javascript
export const translations = {
  'new.key': {
    nl: 'Nederlandse tekst',
    en: 'English text'
  }
};
```

2. **Add to HTML:**

```html
<p data-i18n="new.key">Default text</p>
```

3. **Add tests:**

```javascript
it('should have new translation key', () => {
  expect(translations['new.key'].nl).toBeTruthy();
  expect(translations['new.key'].en).toBeTruthy();
});
```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug report template:

**Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14.0]
- Device: [e.g., iPhone 15, Desktop]

**Additional context**
Any other context about the problem.
```

## 💡 Suggesting Features

Use GitHub Issues with the feature request template:

**Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context, screenshots, or examples.
```

## 🔍 Code Review Process

### What We Look For

- **Functionality**: Does it work as intended?
- **Tests**: Are tests included and passing?
- **Code Quality**: Is the code clean and maintainable?
- **Documentation**: Is documentation updated?
- **Performance**: Are there performance concerns?
- **Security**: Are there security implications?

### Review Timeline

- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Complex PRs may take longer

## 🚫 What Not to Do

- ❌ Don't commit directly to `main`
- ❌ Don't include unrelated changes in your PR
- ❌ Don't commit `node_modules/`, `dist/`, or build artifacts
- ❌ Don't commit sensitive information (API keys, passwords)
- ❌ Don't submit PRs without running tests
- ❌ Don't use generic commit messages ("fix stuff", "update code")

## ✅ What to Do

- ✅ Write descriptive commit messages
- ✅ Keep PRs focused and small
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Respond to review feedback promptly
- ✅ Rebase on latest `main` before submitting
- ✅ Run all tests locally before pushing

## 🎓 Learning Resources

### Vite
- Official docs: https://vitejs.dev/
- Guide: https://vitejs.dev/guide/

### Playwright
- Official docs: https://playwright.dev/
- Best practices: https://playwright.dev/docs/best-practices

### Vitest
- Official docs: https://vitest.dev/
- API reference: https://vitest.dev/api/

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue with bug report template
- **Features**: Create an issue with feature request template
- **Chat**: Contact maintainers at info@at-yourservice.ai

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Project README (for major contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same terms as the project.

---

Thank you for contributing! 🎉
