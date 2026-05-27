# AYS Website — Claude Code Routines

This file defines routines for Claude Code to assist with content management on the At Your Service website.

---

## Bilingual file convention (applies to ALL content types)

Every piece of content — blog posts, events, and jobs — must always be created as **two separate files**: one in Dutch (`_nl.md`) and one in English (`_en.md`).

### Filename pattern

```
DD_MM_YYYY_slug_nl.md   ← Dutch version
DD_MM_YYYY_slug_en.md   ← English version
```

### Rules
- Both files are created in the **same folder** — no language subfolders
- The slug is identical in both filenames — only the `_nl` / `_en` suffix differs
- For **events and jobs**, use the event/posting date for DD_MM_YYYY; for **news**, use today's date
- All frontmatter fields are translated — including `title` and `excerpt`
- The `image` field (where applicable) is identical in both files — same image, both languages
- Always write and save **both files** in one go — never create only one language version

---

## Routine: New Blog Post

**Trigger:** When asked to create, write, or add a new blog post.

### What to do

1. **Ask for the topic or title** if not already provided.
2. **Scan existing posts** in `/news/` to:
   - Identify all categories already in use (from `category:` frontmatter fields)
   - Match the writing tone and post length
3. **Generate both language versions** following the rules below.
4. **Save both files** to `/news/`:
   - `/news/DD_MM_YYYY_slug_nl.md`
   - `/news/DD_MM_YYYY_slug_en.md`
5. **Confirm** by listing both file paths and a one-line summary of the post.

---

### Frontmatter format

```yaml
---
title: <Post title, sentence case — translated per language>
category: <Single category — match an existing one from /news/ if possible>
excerpt: <One or two sentences, enticing and punchy — translated per language>
---
```

**Rules:**
- `title`: Sentence case, no trailing period, max ~10 words
- `category`: Reuse an existing category from `/news/` when relevant (e.g. `Events`, `Insights`, `News`). If none fit, propose one and confirm with the user.
- `excerpt`: Max 2 sentences. Should make the reader want to click.

---

### Post body format

```markdown
# <Same as frontmatter title>

<Opening paragraph — 2-3 sentences, sets context>

## <Section heading>

<Body content>

## <Section heading>

<Body content>

---

*[NL] Wil je meer weten? [Contacteer ons](https://at-yourservice.ai/contact).*
*[EN] Want to know more? [Contact us](https://at-yourservice.ai/contact).*
```

**Rules:**
- Tone: Warm, confident, forward-looking — not dry consulting-speak. AYS speaks like a knowledgeable colleague, not a brochure.
- Length: 200–400 words for news posts; 400–700 words for insight/opinion posts
- Always end with a CTA linking to `https://at-yourservice.ai/contact`
- Use `##` for section headings, never `###` or deeper in short posts
- No bullet-point-heavy posts — prefer flowing prose

---

### SEO metadata (add as HTML comment at bottom of each file)

```html
<!--
seo_title: <Title tag — max 60 chars, include "At Your Service" or "AYS">
seo_description: <Meta description — max 155 chars, in the file's language>
seo_keywords: <Comma-separated, 4-6 keywords relevant to the post>
-->
```

---

### Tag suggestions

After scanning `/news/`, suggest 2–3 relevant categories based on existing ones and the post topic. Present suggestions before saving.

---

### Example invocations

```bash
claude "write a new blog post about our partnership with Microsoft"
claude "write a new Insights blog post about agentic AI trends in 2026"
```

### Example output files

**`/news/22_05_2026_microsoft_partnership_nl.md`**
```markdown
---
title: At Your Service en Microsoft bundelen krachten
category: News
excerpt: We zijn trots om onze nieuwe samenwerking met Microsoft aan te kondigen. Samen maken we AI-adoptie toegankelijker voor Belgische bedrijven.
---

# At Your Service en Microsoft bundelen krachten

We zijn verheugd om een nieuwe strategische samenwerking met Microsoft België aan te kondigen...

## Wat betekent dit voor onze klanten?

...

---

*Wil je meer weten? [Contacteer ons](https://at-yourservice.ai/contact).*

<!--
seo_title: AYS & Microsoft: samenwerking voor AI-adoptie in België
seo_description: At Your Service en Microsoft slaan de handen in elkaar om Belgische bedrijven sneller te laten groeien met AI.
seo_keywords: Microsoft partnership, AI consultancy België, At Your Service, AI adoptie
-->
```

**`/news/22_05_2026_microsoft_partnership_en.md`**
```markdown
---
title: At Your Service and Microsoft join forces
category: News
excerpt: We're proud to announce our new partnership with Microsoft. Together we make AI adoption more accessible for Belgian businesses.
---

# At Your Service and Microsoft join forces

We are excited to announce a new strategic partnership with Microsoft Belgium...

## What does this mean for our clients?

...

---

*Want to know more? [Contact us](https://at-yourservice.ai/contact).*

<!--
seo_title: AYS & Microsoft: AI adoption partnership in Belgium
seo_description: At Your Service and Microsoft are joining forces to help Belgian businesses grow faster with AI.
seo_keywords: Microsoft partnership, AI consultancy Belgium, At Your Service, AI adoption
-->
```

---

## Routine: New Event

**Trigger:** When asked to create, write, or add a new event.

### What to do

1. **Ask for event details** if not already provided (minimum: title, date, location, registration URL).
2. **Scan existing events** in `/events/` to match tone and avoid duplicate slugs.
3. **Generate both language versions** following the rules below.
4. **Save both files** to `/events/`:
   - `/events/DD_MM_YYYY_slug_nl.md`
   - `/events/DD_MM_YYYY_slug_en.md`
   - Use the **event date** for DD_MM_YYYY
5. **Confirm** by listing both file paths, then show the image reminder.

---

### Frontmatter format

```yaml
---
title: <Event title, title case — translated per language>
category: Events
excerpt: <One punchy sentence — translated per language. Create urgency or excitement.>
date: <DD_MM_YYYY — the event date, identical in both files>
image: ./images/<slug>.jpg
---
```

**Rules:**
- `category`: Always `Events` — never change this
- `excerpt`: One sentence max. Make it feel exclusive or urgent.
- `date`: Actual event date in `DD_MM_YYYY` — same value in both files
- `image`: Identical path in both files — same image, both languages

---

### Event body format

```markdown
# <Same as frontmatter title>

<Opening paragraph — 1-2 sentences, what is this event and why does it matter>

<Second paragraph — context, previous editions, momentum, partners>

<Third paragraph or bullet list — agenda themes>

- <Theme 1>
- <Theme 2>
- <Theme 3>

<Closing paragraph — warm invite>

[NL] Locatie: <Venue, City>
[EN] Location: <Venue, City>

[NL] Inschrijven via: <registration_url>
[EN] Register at: <registration_url>
```

**Rules:**
- Tone: Enthusiastic and exclusive — an invite, not a press release
- Length: 150–300 words per file
- Bullet points are appropriate for agenda themes
- Always end with location and registration URL as plain text (no markdown heading)
- No CTA to at-yourservice.ai/contact — the registration URL replaces it

---

### Required details to collect

| Field | Required | Ask if missing |
|-------|----------|----------------|
| Event title | ✅ | Yes |
| Event date | ✅ | Yes |
| Location / venue | ✅ | Yes |
| Registration URL | ✅ | Yes |
| Event description / themes | ✅ | Yes — or generate based on title |
| Partner or co-organiser | ❌ | Optional |
| Previous editions to reference | ❌ | Optional |

---

### SEO metadata

```html
<!--
seo_title: <Max 60 chars, include event name and "At Your Service">
seo_description: <Max 155 chars, in the file's language, mention date and city>
seo_keywords: <4-6 keywords, include event name, city, AI>
-->
```

---

### Image reminder

After saving both files, remind the user:

> 📷 **Don't forget:** Add an event image at `/events/images/<slug>.jpg` — referenced in both language files.

---

### Example invocations

```bash
claude "add a new event: AI Summit Brussels on 15 September 2026 at Tour & Taxis, register at lu.ma/ai-summit-bxl"
claude "add a new event about our London AI roadshow on 3 October 2026"
```

---

## Routine: New Job Posting

**Trigger:** When asked to create, write, or add a new job posting or vacancy.

### What to do

1. **Ask for job details** if not already provided (minimum: job title, role description, requirements).
2. **Scan existing jobs** in `/jobs/` to match tone and avoid duplicate slugs.
3. **Generate both language versions** following the rules below.
4. **Save both files** to `/jobs/`:
   - `/jobs/DD_MM_YYYY_slug_nl.md`
   - `/jobs/DD_MM_YYYY_slug_en.md`
   - Use today's date for DD_MM_YYYY
5. **Confirm** by listing both file paths and a one-line summary of the role.

---

### Frontmatter format

```yaml
---
title: <Job title — translated per language>
excerpt: <One or two punchy sentences — translated per language. Make the role sound exciting.>
image: images/<slug>.jpg
---
```

**Rules:**
- `title`: Clear job title, no trailing period
- `excerpt`: Max 2 sentences. Lead with impact — what will this person build or achieve?
- `image`: Identical path in both files. Remind user to add the image manually.

---

### Job body format

```markdown
# <Same as frontmatter title>

<Opening paragraph — 2-3 sentences. Who is AYS, what's the mission, why this role exists now.>

## [NL] Wat ga je doen? / [EN] What will you do?

### [NL] <Responsibility area 1> / [EN] <Responsibility area 1>

- <Task>
- <Task>
- <Task>

### [NL] <Responsibility area 2> / [EN] <Responsibility area 2>

- <Task>
- <Task>

## [NL] Wie ben jij? / [EN] Who are you?

- <Requirement>
- <Requirement>
- <Requirement>

[NL] Bonuspunten als je: / [EN] Bonus points if you:

- <Nice to have>
- <Nice to have>

## [NL] Wat bieden wij? / [EN] What do we offer?

- <Benefit>
- <Benefit>
- <Benefit>
```

**Rules:**
- Tone: Direct, energetic, and human. AYS is a scale-up — avoid stiff HR language. Speak to builders and doers.
- Length: 350–600 words per file
- Use `##` for main sections, `###` for sub-areas within responsibilities
- Bullet points are the norm for tasks, requirements, and benefits
- No CTA link needed — applicants will find the contact page themselves
- Do **not** include salary figures unless the user explicitly provides them

---

### Required details to collect

| Field | Required | Ask if missing |
|-------|----------|----------------|
| Job title | ✅ | Yes |
| Role description / responsibilities | ✅ | Yes — or generate based on title |
| Requirements / profile | ✅ | Yes — or generate based on title |
| What AYS offers | ❌ | Use standard benefits from example if not provided |
| Image filename | ❌ | Default to `images/job_<slug>.jpg` |

---

### Standard benefits (use if not specified by user)

- Een uitdagende rol in een snelgroeiend team / A challenging role in a fast-growing team
- Werken met de nieuwste AI-technologieën / Working with the latest AI technologies
- Competitief salarispakket en flexibele werkomstandigheden / Competitive salary and flexible working conditions

---

### SEO metadata

```html
<!--
seo_title: <Job title + "— At Your Service" — max 60 chars>
seo_description: <Max 155 chars, in the file's language, mention the role and AYS mission>
seo_keywords: <4-6 keywords: job title, AI, Belgium/Benelux, consultancy, hiring>
-->
```

---

### Image reminder

After saving both files, remind the user:

> 📷 **Don't forget:** Add a job image at `/jobs/images/<slug>.jpg` — referenced in both language files.

---

### Example invocations

```bash
claude "add a new job posting for an AI Engineer"
claude "add a new vacancy: AI Project Manager, focus on enterprise clients"
claude "create a job post for a Marketing Manager at AYS"
```

### Example output files

**`/jobs/22_05_2026_ai_development_manager_nl.md`**
```markdown
---
title: Business Development Manager – AI Services
excerpt: Bouw mee aan de toekomst van AI. Van strategie tot implementatie.
image: images/ai_development_manager.jpg
---

# Business Development Manager – AI Services

Wij zijn een snelgroeiende AI scale-up met één missie: organisaties écht slimmer maken met AI...

## Wat ga je doen?

### Nieuwe business creëren

- Jij opent deuren bij middelgrote en grote organisaties.
- Je bouwt je eigen pipeline en sluit zelfstandig deals.

## Wie ben jij?

- 5+ jaar ervaring in business development of AI/IT-sales.
- Je begrijpt AI écht (machine learning, LLM's, automatisering).

## Wat bieden wij?

- Een uitdagende rol in een snelgroeiend team.
- Werken met de nieuwste AI-technologieën.

<!--
seo_title: Business Development Manager AI — At Your Service
seo_description: Zoek jij een rol waar je AI-strategie en business development combineert? At Your Service zoekt een BDM.
seo_keywords: business development manager, AI sales, At Your Service, vacature, Benelux
-->
```

**`/jobs/22_05_2026_ai_development_manager_en.md`**
```markdown
---
title: Business Development Manager – AI Services
excerpt: Help shape the future of AI. From strategy to implementation.
image: images/ai_development_manager.jpg
---

# Business Development Manager – AI Services

We are a fast-growing AI scale-up with one mission: making organisations genuinely smarter with AI...

## What will you do?

### Creating new business

- You open doors at mid-sized and large organisations.
- You build your own pipeline and close deals independently.

## Who are you?

- 5+ years of experience in business development or AI/IT sales.
- You truly understand AI (machine learning, LLMs, automation).

## What do we offer?

- A challenging role in a fast-growing team.
- Working with the latest AI technologies.

<!--
seo_title: Business Development Manager AI — At Your Service
seo_description: Looking for a role combining AI strategy and business development? At Your Service is hiring a BDM.
seo_keywords: business development manager, AI sales, At Your Service, vacancy, Benelux
-->
```

---

## Brand voice reminder

**At Your Service** is a Belgian Applied AI consultancy.
- **Tagline:** *Helping companies to succeed with AI*
- **Tone:** Professional but human. Confident, clear, warm. Never corporate or stiff.
- **Audience:** Business leaders and decision-makers in the Benelux
- **Default languages:** Always produce both Dutch (`_nl.md`) and English (`_en.md`) — never create only one version
