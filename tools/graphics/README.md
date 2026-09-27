# Motion graphics (Remotion)

First-time setup on the Mac (needs Node.js — `brew install node`):

    cd ~/Movies/Studio/tools/graphics && npm install

Preview and tweak templates in the browser: `npm run studio`

Render: `tools/graphics/render.sh <Template> <output> '<props JSON>' [--opaque]`

| Template   | Props                                                             |
|------------|-------------------------------------------------------------------|
| TitleCard  | `title`, `subtitle?`                                              |
| TextPopup  | `text`, `position?` (`top` / `middle` / `bottom`)                 |
| StatCard   | `value` (number), `prefix?`, `suffix?`, `label`, `decimals?`      |
| LowerThird | `name`, `role?`                                                   |
| LogoIntro  | `tagline?` (uses `brand/logo.png`)                                |
| LogoOutro  | `tagline?` (uses `brand/logo.png`)                                |
| CtaCard    | `headline`, `action`                                              |

Every template also takes `seconds` (length) and `fullscreen` (true = solid brand
background; pair it with `--opaque` to get an `.mp4`).

Colours and fonts live in `src/brand.ts` — keep it in sync with `brand/brand.md`.
All text stays inside the Instagram/TikTok safe zone (`SAFE` in `src/shared.tsx`).
