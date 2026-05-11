# AGENTS.md

## Project Overview

This is a Chinese entertainment quiz website called 「汉东人格档案」.

The website lets users answer 16 questions and receive a fictional character-style result inspired by the TV drama 《人民的名义》. It should be treated as entertainment and organizational-behavior parody, not political analysis or psychological diagnosis.

## Commands

Use the commands appropriate for the generated project. Recommended defaults:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Technical Rules

- Use TypeScript.
- Use React components.
- Use Tailwind CSS for styling.
- Keep quiz data in `/data`.
- Do not hardcode questions or results inside page components.
- Keep scoring logic in `/utils/scoring.ts` or equivalent.
- Ensure mobile-first responsive design.
- Avoid unnecessary dependencies.
- The app should run without a backend or database.

## Content Rules

- Tone: serious shell, humorous core.
- Use original copywriting.
- Do not use official stills, actor photos, official logos, or long quotations from the show.
- Avoid real-world political claims.
- Avoid mapping results to real people or real institutions.
- Do not insult users, even when the result is a negative character.
- For negative characters, frame problems as risk, boundary, ambition, fear, avoidance, or desire management.

## UX Rules

- The quiz must be smooth on mobile.
- Every question has exactly 4 options.
- The result must never be random.
- Result page should be screenshot-friendly.
- Add a short disclaimer on the landing page or footer.

## Acceptance Rules

- The app must run locally.
- The user must always receive one valid result after completing all questions.
- No console errors.
- No horizontal overflow at 375px viewport width.
