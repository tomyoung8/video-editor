# Studio — CLAUDE.md

## What we're doing
I edit short social videos (Instagram Reels, TikTok, YouTube Shorts, LinkedIn) for my brother's software / AI agent company. He writes the scripts and films the footage. I edit the videos myself in the CapCut desktop app.

Your job is to make the ingredients I drop into CapCut:

1. **B-roll** — AI-generated video clips from Kie AI (kie.ai), made from text descriptions.
2. **Motion graphics** — animated titles, text pop-ups, stat cards, lower thirds, logo intros/outros, rendered as video files with transparent backgrounds.
3. **A shot plan** — read the script and suggest what B-roll and graphics go where.
4. **Social copy** — post captions, hooks and hashtags for each platform.
5. **File jobs** — convert, resize, compress or trim footage when I ask.

You do not edit inside CapCut and you do not post anything anywhere. I'm new to this, so explain things in plain English and keep answers short.

## Folder layout
The studio lives at `~/Movies/Studio/` (CapCut can only reliably open files under `~/Movies`, so everything stays in there).

```
~/Movies/Studio/
├── CLAUDE.md                 ← this file
├── brand/
│   ├── brand.md              ← colours, fonts, tone of voice (fill in with me)
│   ├── logo.png              ← transparent logo
│   └── fonts/                ← brand font files
├── tools/                    ← scripts you build (B-roll, graphics, etc.)
│   ├── kie-broll.sh          ← generate one B-roll clip + log its cost
│   ├── file-jobs.md          ← ffmpeg recipes for convert/resize/compress/trim
│   └── graphics/             ← Remotion project (motion graphic templates)
├── cost-log.md               ← every Kie AI generation + cost
└── videos/
    └── YYYY-MM-DD-short-name/
        ├── script.md         ← my brother's script
        ├── footage/          ← raw footage (NEVER modify or delete)
        ├── shot-plan.md      ← your plan, which I approve
        ├── broll/            ← generated B-roll clips
        ├── graphics/         ← rendered motion graphics
        └── social-copy.md    ← captions, hooks, hashtags
```

Name every output file with its order number and what it is, so I can drag them into CapCut in order, e.g. `03-broll-laptop-code-closeup.mp4`, `05-graphic-stat-10x-faster.mov`.

## Workflow for each video
1. I put the script (and footage, if filmed) in a new `videos/` folder.
2. You read the script and write `shot-plan.md`: a table with each script line, the B-roll shot for it (with the exact Kie AI prompt), and any graphic (with its exact on-screen text). Keep it realistic: a 30–60s video usually needs 3–6 B-roll shots and 2–4 graphics.
3. **Stop and wait for me to approve or change the plan.**
4. Generate the B-roll (see Kie AI rules below) and render the graphics.
5. Write `social-copy.md`: a caption for each platform, 3–5 hook options, and hashtags.
6. Tell me what's ready, in order, and anything that looked bad and should be redone.

## Kie AI rules (B-roll) — IMPORTANT, it costs money
- The API key is in the environment variable `KIE_AI_API_KEY`. Never print it, never write it into a file, never ask me to paste it into chat. If it's missing, tell me to add it to `~/.zshrc` myself.
- Call Kie's REST API directly with curl or a small script in `tools/` (not an MCP server). Use `tools/kie-broll.sh`. The general pattern is:
  - Create: `POST https://api.kie.ai/api/v1/jobs/createTask` with header `Authorization: Bearer $KIE_AI_API_KEY` and body `{"model": "<model>", "input": {...}}`
  - Poll: `GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId=<id>` until `data.state` is `success` (URLs in `data.resultJson.resultUrls`) or `fail`.
  - Some models use their own endpoints — check Kie's current docs (docs.kie.ai) for the model's exact endpoint, inputs and price before first use.
- **Always ask me before spending credits.** Tell me which model, how many clips and the estimated cost, then wait for a yes.
- For a new prompt style, generate one test clip first before doing a batch.
- Default settings: vertical 9:16, 5–8 seconds, no text or logos in the generated video (AI text looks bad — graphics handle text).
- Write good prompts: subject, action, camera move, lighting, style. E.g. "Slow push-in on a laptop screen showing lines of code, dark office, soft blue monitor glow, shallow depth of field, cinematic, realistic."
- Log every generation in `cost-log.md` (date, video, model, prompt, cost, file). `tools/kie-broll.sh` does this automatically.

## Motion graphics rules
- Built with Remotion (React-based video rendering) in `tools/graphics/`, as reusable templates: title card, text pop-up, stat card, lower third, logo intro, logo outro, call-to-action end card. See `tools/graphics/README.md` for render commands.
- Render as 1080×1920, 30fps, ProRes 4444 `.mov` with a transparent background, so they sit over the footage in CapCut. If I ask for a full-screen card, render an opaque `.mp4` instead.
- Always use the colours and fonts from `brand/brand.md` (mirrored in `tools/graphics/src/brand.ts` — keep them in sync). Keep animations clean and quick (in ~0.3s, hold, out ~0.3s). No cheesy effects.
- Instagram/TikTok safe zones: keep text out of the top ~250px and the bottom ~400px, and away from the right edge (the like/comment buttons go there).
- After rendering, grab a still frame and check it yourself (text readable, nothing cut off, correct colours) before telling me it's done.

## General rules
- Never modify or delete anything in `footage/`. Make new files instead.
- Ask before installing anything; tell me in one line what it is and why.
- If something fails, tell me simply what went wrong and what you'll try next.
- Keep the scripts in `tools/` reusable so each new video is quick.
