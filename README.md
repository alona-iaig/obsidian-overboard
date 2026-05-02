# Overboard for Obsidian

Embed [Overboard Studio](https://overboard.studio) AI whiteboards directly inside your Obsidian notes. Sketch, generate diagrams from a sentence with AI, and collaborate in real time — without leaving Obsidian.

## What you can do

- Drop a board into any note with a code block
- Edit it inline, AI-generate flow charts and mind maps, drag stickies — all without context-switching to a browser tab
- Real-time collaboration with up to 500 teammates on the same canvas
- 100+ templates (brainstorming, SWOT, Kanban, retrospectives, etc.)

## Usage

After installing, paste an Overboard board URL inside a fenced code block:

````
```overboard
https://overboard.studio/board/your-board-id
```
````

Or use the command palette: `Insert Overboard board` → paste URL.

To open a brand-new board: `Open new Overboard board in browser`.

## Pricing

[Overboard](https://overboard.studio) is free forever with full AI access. Pro is $0.99/mo, Enterprise $1.99/mo. No AI credit metering, no per-action caps.

## How it works (security)

This plugin is intentionally a thin client:

- It loads Overboard boards inside an iframe pointing at `https://overboard.studio/embed/board/<id>`.
- The iframe is sandboxed (`allow-scripts allow-same-origin allow-forms allow-popups`) — no filesystem access, no top-level navigation away from your note.
- You authenticate inside the iframe (Overboard cookies). The plugin never sees your credentials, your tokens, or your board data.
- All proprietary logic — AI generation, the board rendering engine, collaboration, user storage — runs on Overboard's servers. The plugin source is fully open and contains zero proprietary code.

## Install (manual, until accepted into the community plugins directory)

1. Download `main.js`, `manifest.json`, and `styles.css` (if any) from the [latest release](https://github.com/alona-iaig/obsidian-overboard/releases).
2. Drop them into `<your vault>/.obsidian/plugins/overboard/`.
3. In Obsidian: Settings → Community plugins → enable **Overboard**.

## Develop

```bash
npm install
npm run build
```

`main.js` is the compiled output. The plugin runs on Obsidian Desktop and Mobile.

## License

MIT
