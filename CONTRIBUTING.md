# Contributing to Depth UI

Thanks for helping. Depth UI is a copy-paste library, so the goal of every change is a component that is small,
fast, accessible and works in both themes.

## Setup

```bash
git clone https://github.com/depthui/depthui.git
cd depthui
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # must pass
npm run build      # must pass
```

Requires Node 20 or newer.

## Adding a component

1. Create one file in `src/components/depth/` (or `buttons/`, `cards/`, `ui/`, `blocks/`) and export it from the matching `index.ts`.
2. Accept `className` and merge it with `cn()`.
3. Use only `depth-*` Tailwind tokens or `var(--depth-*)` so it works in light and dark. Check both.
4. Follow the [performance rules](README.md#performance-rules): motion values not state, animate only `transform` and `opacity`, measure once, ignore touch for hover effects, respect `prefers-reduced-motion`, keyboard and ARIA for anything clickable.
5. Add a usage snippet to `src/demo/usage.ts` (or inline in the showcase) and a `<Showcase>` with its source files to the docs page. Add its id to `src/demo/nav.ts`.
6. If it fits the landing page, add it to `src/pages/demo-page.tsx`.

## Pull request checklist

- [ ] `npm run typecheck` and `npm run build` pass
- [ ] Checked in light and dark, desktop and a 390px phone width (no horizontal scroll)
- [ ] Works with the keyboard and with reduced motion on
- [ ] Docs entry added (Preview, Usage, Source)
- [ ] One focused change per PR

## Commit messages

Short, imperative, present tense: `Add RippleButton`, `Fix Modal3D focus return`.

## Reporting bugs and asking for components

Use the [issue templates](https://github.com/depthui/depthui/issues/new/choose). For security problems see
[SECURITY.md](SECURITY.md) and do not open a public issue.
