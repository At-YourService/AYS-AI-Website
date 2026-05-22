# AYS Website — Claude Code Routines

This file defines routines for Claude Code to assist with content management on the At Your Service website.

---

## Routine: New Blog Post

**Trigger:** When asked to create, write, or add a new blog post.

### What to do

1. **Ask for the topic or title** if not already provided.
2. **Scan existing posts** in `/news/` to:
   - Identify all tags/categories already in use (from `category:` frontmatter fields)
   - Match the writing tone and post length
3. **Generate the blog post** following the rules below.
4. **Save the file** to `/news/` using the filename convention: `DD_MM_YYYY_slug.md`
   - Derive the slug from the title (lowercase, words joined by underscores, max 5 words)
   - Use today's date for DD_MM_YYYY
5. **Confirm** by outputting the full file path and a summary of what was written.

---

### Frontmatter format

Every post must start with this exact frontmatter block:

```yaml
---
title: <Post title, sentence case>
category: <Single category — match an existing one from /news/ if possible>
excerpt: <One or two sentences. Enticing, punchy. Written in Dutch.>
---
```

**Rules:**
- `title`: Sentence case, no trailing period, max ~10 words
- `category`: Reuse an existing category from the `/news/` folder when relevant (e.g. `Events`, `Insights`, `News`). If none fit, propose a new one and confirm with the user.
- `excerpt`: Always in **Dutch**. Should make the reader want to click. Max 2 sentences.

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

*Wil je meer weten? [Contacteer ons](https://at-yourservice.ai/contact).*
```

**Rules:**
- Body language: **Dutch** (default) unless the user explicitly asks for English or French
- Tone: Warm, confident, forward-looking — not dry consulting-speak. AYS speaks like a knowledgeable colleague, not a brochure.
- Length: 200–400 words for event/news posts; 400–700 words for insight/opinion posts
- Always end with a CTA linking to `https://at-yourservice.ai/contact`
- Use `##` for section headings, never `###` or deeper in short posts
- No bullet-point-heavy posts — prefer flowing prose

---

### SEO metadata (add as HTML comment at bottom of file)

After the post body, append:

```html
<!--
seo_title: <Title tag — max 60 chars, include "At Your Service" or "AYS">
seo_description: <Meta description — max 155 chars, in Dutch>
seo_keywords: <Comma-separated, 4-6 keywords relevant to the post>
-->
```

---

### Tag suggestions

After scanning `/news/`, suggest 2–3 relevant tags based on:
- Existing categories in the folder
- Key topics in the new post

Present them to the user as suggestions before saving.

---

### Example invocations

```bash
# Minimal — Claude will ask for details
claude "write a new blog post"

# With topic
claude "write a new blog post about our partnership with Microsoft"

# With language override
claude "write a new blog post about AI in healthcare, in English"

# With category hint
claude "write a new Insights blog post about agentic AI trends in 2026"
```

---

### Example output file

**Filename:** `22_05_2026_microsoft_partnership.md`

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

## Wat staat er op de planning?

...

---

*Wil je meer weten? [Contacteer ons](https://at-yourservice.ai/contact).*

<!--
seo_title: AYS & Microsoft: samenwerking voor AI-adoptie in België
seo_description: At Your Service en Microsoft slaan de handen in elkaar om Belgische bedrijven sneller te laten groeien met AI.
seo_keywords: Microsoft partnership, AI consultancy België, At Your Service, AI adoptie
-->
```

---

## Routine: New Event

**Trigger:** When asked to create, write, or add a new event.

### What to do

1. **Ask for the event details** if not already provided (minimum needed: title, date, location).
2. **Scan existing events** in `/events/` to:
   - Match the writing tone and structure
   - Avoid duplicate slugs
3. **Generate the event post** following the rules below.
4. **Save the file** to `/events/` using the filename convention: `DD_MM_YYYY_slug.md`
   - Derive the slug from the event title (lowercase, words joined by underscores, max 5 words)
   - Use the **event date** (not today's date) for DD_MM_YYYY
5. **Confirm** by outputting the full file path and a summary of what was created.

---

### Frontmatter format

Every event must start with this exact frontmatter block:

```yaml
---
title: <Event title, title case>
category: Events
excerpt: <One punchy sentence in Dutch. Create urgency or excitement.>
date: <DD_MM_YYYY — the event date>
image: ./images/<slug>.jpg
---
```

**Rules:**
- `title`: Title case, max ~10 words
- `category`: Always `Events` — never change this
- `excerpt`: Always in **Dutch**. One sentence max. Make it feel exclusive or urgent.
- `date`: The actual event date in `DD_MM_YYYY` format
- `image`: Use `./images/<slug>.jpg` where slug matches the filename slug. Remind the user to add the image manually.

---

### Event body format

```markdown
# <Same as frontmatter title>

<Opening paragraph — 1-2 sentences, what is this event and why does it matter>

<Second paragraph — context, previous editions, momentum, partners>

<Third paragraph — what attendees will explore / agenda themes, written as flowing prose>

- <Bullet point theme 1>
- <Bullet point theme 2>
- <Bullet point theme 3>

<Closing paragraph — warm invite, forward-looking>

Locatie: <Venue name, City>

Inschrijven via: <registration_url>
```

**Rules:**
- Body language: **Dutch** (default) unless the user explicitly asks for English or French
- Tone: Enthusiastic and exclusive — this is an invite, not a press release. Make the reader feel they'd be missing out.
- Length: 150–300 words. Events are concise — no long essays.
- Use bullet points for agenda themes (unlike blog posts, bullets are appropriate here)
- Always end with `Locatie:` and `Inschrijven via:` as plain text lines (no markdown heading)
- No CTA link to at-yourservice.ai/contact — the registration URL replaces it

---

### Required details to collect

Before writing, ensure you have:

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

### SEO metadata (add as HTML comment at bottom of file)

After the event body, append:

```html
<!--
seo_title: <Title tag — max 60 chars, include event name and "AYS" or "At Your Service">
seo_description: <Meta description — max 155 chars, in Dutch, mention date and city>
seo_keywords: <Comma-separated, 4-6 keywords, include event name, city, AI>
-->
```

---

### Image reminder

After saving the file, remind the user:

> 📷 **Don't forget:** Add an event image at `/events/images/<slug>.jpg` to match the `image:` field in the frontmatter.

---

### Example invocations

```bash
# Minimal — Claude will ask for missing details
claude "add a new event"

# With key details
claude "add a new event: AI Summit Brussels on 15 September 2026 at Tour & Taxis, register at lu.ma/ai-summit-bxl"

# With language override
claude "add a new event about our London roadshow, in English"
```

---

### Example output file

**Filename:** `09_03_2026_devrev_leadership.md`

```markdown
---
title: DevRev Leadership Circle Amsterdam 2026
category: Events
excerpt: Early access voor DevRev Leadership Circle Amsterdam 2026!
date: 09_03_2026
image: ./images/devrev_leadership.jpg
---

# DevRev Leadership Circle Amsterdam 2026

Sluit je bij ons aan om AI-agents aan het werk te zien en ervaar hoe machines en mensen naadloos samenwerken.

Na onze succesvolle Leadership Circle vorig jaar en de overweldigende respons op ons Londense evenement, keren we terug naar Amsterdam voor een nieuwe editie gericht op de toekomst van intelligent werk.

Tijdens Leadership Circle Amsterdam verkennen we wat AI kan betekenen voor jouw organisatie:

- Hoe AI de besluitvorming op directieniveau versterkt
- De transformatie van leiderschap in een AI-first wereld
- Navigeren door informatie-asymmetrie met real-time intelligentie

We kijken ernaar uit u deze april te mogen verwelkomen.

Locatie: Capital C Amsterdam, Noord-Holland

Inschrijven via: https://luma.com/Leadership-Circle-Amsterdam

<!--
seo_title: DevRev Leadership Circle Amsterdam 2026 — At Your Service
seo_description: Ontdek de toekomst van intelligent werk op de DevRev Leadership Circle in Amsterdam op 9 maart 2026.
seo_keywords: DevRev, Leadership Circle, Amsterdam, AI evenement, At Your Service, intelligent werk
-->
```

---

## Brand voice reminder

**At Your Service** is a Belgian Applied AI consultancy.
- **Tagline:** *Helping companies to succeed with AI*
- **Tone:** Professional but human. Confident, clear, warm. Never corporate or stiff.
- **Audience:** Business leaders and decision-makers in the Benelux
- **Default language:** Dutch (unless stated otherwise)
