# About

I’m **Anders Hofsten**, a junior frontend devoloper building 1 coding thing per week for 52 weeks.

This is **Week 1**.

# Marching Ants Selection Tool

*Week 1 — 52 Weeks of Code Challenge*

A lightweight **canvas-based selection tool** featuring animated marching-ants borders, drag-resize handles, and live UI controls.

Built to practice interaction logic, statemachines, and most importantly TypeScript :)

---

## Demo

**Live:** [https://gbsr.github.io/week-1-marching-ants-selection-tool/]()

---

## Features

- Drag to create a selection rectangle
- Animated “marching ants” border (dash offset animation)
- Resize handles: corners + edges
- Drag to move
- **Keyboard**
  - `Shift` — constrain to square
  - `Esc` — clear selection
- **Live controls**
  - Dash length
  - Gap length
  - Animation speed
  - Border width
  - Edge tolerance

---

## Why I built this

Week 1 of my **52 Weeks of Code** challenge.

Goals:

- Improve UI/UX engineering skills
- Build creative-tooling muscle
- Practice precision interaction logic
- Ship consistently and visibly
- Actually have fun while doing it

Core interaction behavior was implemented manually to reinforce understanding of rendering lifecycles, pointer events, and geometric constraints.

---

## Tech Stack

- Vite (build + dev server)
- TypeScript
- HTML Canvas
- CSS
- Vitest (planned tests)
- GitHub Pages for deployment

## Post-Mortem (Week 1)

## **Key Concepts Practiced**

* Finite State Machine (FSM) flow: **idle → select → move → resize**
* Separation of Concerns
  - clear split between input, state, and rendering
* Pure function utilities for geometry and math
* Event delegation + pointer capture for stable interactions
* Defensive programming with early returns and guards
* Progressive enhancement
  - layering behavior incrementally
* Intentional mutation
  updating state deliberately, never implicitly
* Keyboard modifiers (Shift for square constraint)
* Assertions to catch invalid state transitions early
* Breaking logic into small, testable helpers (geometry, normalization, math)

### What worked

- Clean `idle → select → move → resize` state flow
- Stable canvas loop and predictable rendering
- Dash-offset animation remained smooth
- Geometry helpers kept interaction math manageable
- Pointer capture prevented broken drags
- Assertions caught state issues early

### What hurt

- Resize math ballooned before simplification
- Shift-to-square required more thought than expected, but I still feel like it shouldn't and I am not sure why I feel that way
- Mixing render logic with state transitions (don't do that)
- Math intuition… let’s just say it needed assistance ;)

### Lessons learned

- Favour readable math over clever math
- Compute once; mutate intentionally
- Reduce cognitive load through early modularization, and refactor *early*
- Assertions are extremely effective for interaction debugging

### Minimal tests to add

- `normalizeRect`
- `pointInsideRect`
- `hitEdge` (with tolerance)
- Square-constraint logic
- Basic interaction-cycle tests

## Tests

There are none yet.
But the pure helper functions (geometry, math, normalize) are perfect candidates for small, targeted tests.

Run locally:

```bash
npm install
npm run dev
```

## **Next Steps / Stretch Ideas**

* Multi-selection regions (Cmd/Ctrl to add areas)
* Feather/blur preview mask
* Touch interaction support
* Arrow-key nudge (Alt = 10px)
* Export rect JSON to clipboard

---

## **Contact / Follow**

* **Portfolio**: [https://andershofsten.com]()
* **Threads**: [https://www.threads.com/@ruido_outpost]()
* **LinkedIn**: [https://www.linkedin.com/in/ahofsten/]()
* **X**: [https://x.com/soundsbyhofsten]()

Feel free to DM — I’m always open to feedback or discussion.
