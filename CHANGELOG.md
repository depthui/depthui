# Changelog

All notable changes are listed here. The project follows [Semantic Versioning](https://semver.org).

## 0.18.0
- Five more 3D objects: `Gem3D`, `Can3D`, `Torus3D`, `GiftBox3D`, `Room3D`.

## 0.17.0
- Five more showpieces: `DiscoBall3D`, `AnalogClock3D`, `PopUpBook3D`, `SnowGlobe3D`, `Orrery3D`.

## 0.16.0
- Performance: the landing page mounts each live demo only when it is near the viewport and unmounts it when far away, so only a handful of animation loops run at once. The showpiece grid is its own lazy chunk, and every page is code-split.
- Docs are real routes: `/components` is an index with search, and every component has its own page, for example `/components/globe`. Each page loads only the code for its group. Old links such as `/components#globe-3d` and `/components/globe-3d` redirect.
- Previous and next links on every docs page.

## 0.15.0
- Five more showpieces: `DynamicIsland3D`, `ReorderList3D`, `ExpandCards3D`, `Tabs3D`, `Accordion3D`.

## 0.14.0
- Five more showpieces: `Tunnel3D`, `PinArt3D`, `TileFlip3D`, `ImageTrail3D`, `StackScroll3D`.

## 0.13.0
- Five more showpieces: `Helix3D`, `Vault3D`, `FoldPanels3D`, `EightBall3D`, `Compass3D`.

## 0.12.0
- Five more showpieces: `RubiksCube3D`, `Hourglass3D`, `Gyroscope3D`, `Badge3D`, `Pyramid3D`.

## 0.11.0
- Five more showpieces: `SlotMachine3D`, `NewtonsCradle3D`, `Bookshelf3D`, `Prism3D`, `Doors3D`.

## 0.10.0
- Five more showpieces: `Dice3D`, `Ticket3D`, `CardFan3D`, `PeelCard`, `Turntable3D`.

## 0.9.0
- Ten more showpieces: `BarChart3D`, `WheelPicker3D`, `RadialMenu3D`, `Extrude3D`, `Knob3D`, `TagCloud3D`, `Laptop3D`, `Folder3D`, `Envelope3D`, `Phone3D`.
- `TextCylinder3D` rebuilt: the word facing you is large and sharp, and the rest fade and shrink as they turn away.

## 0.8.0
- Eight new showpieces: `Globe3D`, `FlipClock3D`, `TextCylinder3D`, `Coin3D`, `GalleryWall3D`, `PageTurn`,
  `NotificationStack3D`, `ExpandingPanels3D`. Docs section and a showpieces section on the landing page.

## 0.7.1
- Vercel deploy config (`vercel.json`) and Vercel Web Analytics.
- Dependency updates: react and react-dom 19.3.1, react-router-dom 7, framer-motion 14 (typecheck, build and a browser smoke test pass).

## 0.7.0
- Landing page at `/`, docs at `/components`, with real routes (`react-router-dom`).
- GitHub Pages deploy workflow, CI, issue and PR templates, license, logo and social image.

## 0.6.0
- Demo page uses every component. `GitHubStarButton`. `ScrollReveal3D`, `TextReveal` and `TimelineSteps` now use
  `use-scroll-progress`, which re-measures every frame so they work anywhere on a page.

## 0.5.0
- 12 new button styles, 7 new cards plus a cards section, and 12 UI elements and effects
  (modal, toast, switch, input, tooltip, loader, avatar stack, progress ring, flip words, text reveal, aurora, dot glow).

## 0.4.0
- Page blocks: animated navbar, hero, feature grid and tabs, marquee, testimonials, stats, timeline, pricing, FAQ,
  call to action, footer, and a full landing template.

## 0.3.0
- Mobile menu drawer that mirrors the desktop sidebar.

## 0.2.0
- Light and dark themes with a toggle, and Preview / Usage / Source tabs for every component.

## 0.1.0
- First release: tilt card, flip card, depth stack, cube, ring carousel.
