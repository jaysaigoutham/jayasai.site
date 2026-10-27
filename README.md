# jayasai.site

Personal portfolio of **Jayasai (Jay) Gouthaman**: a hands-on software engineering leader in Auckland, New Zealand, working across mobile, frontend, backend services and cloud.

**Live site:** [jayasai.site](https://jayasai.site)

It's a warm, person-first introduction for New Zealand employers and recruiters, not a CV: highlights, career timeline, industry projects, credentials, community work, and a little about life away from the keyboard.

## Tech

- Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step at runtime.
- Mobile-first and responsive, with light and dark themes (`prefers-color-scheme`).
- Accessible: semantic HTML, alt text on every image, visible focus states, AA colour contrast, and `prefers-reduced-motion` support.
- Images optimised to WebP and lazy-loaded below the hero.
- Hosted on [Netlify](https://www.netlify.com/), with caching and security headers in [`_headers`](_headers).

## What's in this repo

This repository holds the **published build** only:

| Path | Purpose |
|---|---|
| `index.html` | The single-page site |
| `styles.css` | All styles, including the dark theme |
| `main.js` | Navigation, Technical/Leadership toggle, carousel and lightbox |
| `_headers` | Netlify caching and security headers |
| `assets/` | Optimised images used by the page |

The source project (original images, content notes and the build script) is kept separately. Changes are made there, built into this folder, then committed and pushed here; Netlify deploys every push to `main` automatically.

## Contact

The best way to reach me is on [LinkedIn](https://www.linkedin.com/in/jayasai-goutheman/). Let's grab a coffee ☕

© Jayasai Gouthaman. All rights reserved: the content and photos on this site are personal and may not be reused without permission.
