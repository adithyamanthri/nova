# BIG PAINTS 🎨

A premium, immersive 3D website for **BIG PAINTS** — a professional paint and
home-decoration shop. Built as a cinematic product showcase: React + Vite +
Tailwind CSS v4, Three.js (React Three Fiber + Drei), Framer Motion and Lenis.

## Features

- **Cinematic hero** — full-screen R3F scene: liquid blobs, glossy spheres,
  falling paint droplets, sparkles, volumetric-style lights and mouse parallax.
- **3D paint can experience** — a procedural, reflective paint can that spins,
  tilts toward the cursor, orbits droplets and responds to scroll.
- **Interactive color collection** — hover ripples, spread halos, and a
  fullscreen liquid color-preview transition with hex/RGB/finish details.
- **Room transformation** — draggable before/after slider with parallax.
- **Color visualizer** — pick a room (living / bedroom / kitchen) and a wall
  color; preview updates live, with a reset option.
- **Why BIG PAINTS** — animated stat counters, premium quality banner.
- **Services** — animated icon cards with hover gradients and glows.
- **Testimonials** — scroll-driven horizontal gallery (vertical on mobile).
- **Store / location** — animated map backdrop, contact cards, Google Maps CTA.
- **Contact** — accessible form with a success animation (swap in a real
  endpoint — see below).
- **Premium chrome** — paint-stroke loader, glass navbar that shrinks on scroll,
  fullscreen mobile menu, magnetic buttons, cursor paint trail, scroll progress
  bar, grain overlay, section transition splashes.

## Performance & accessibility

- 3D scenes are **lazy-loaded** and only mount after the loader finishes.
- The `three` vendor bundle is split into its own lazy chunk.
- Reduced particle counts and lower DPR on **mobile**.
- `prefers-reduced-motion` support disables heavy animation and 3D effects.
- Semantic HTML, ARIA labels, keyboard-navigable controls, focus states.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

Deploy the `dist/` folder to **Vercel**, **Netlify** or **GitHub Pages**
(no build-time secrets needed).

## Customizing content

All copy, colors, products, services and testimonials live in
[`src/data/content.js`](src/data/content.js) — edit that file to rebrand or add
real products. The product card illustrations are SVG placeholders in
[`src/components/Products.jsx`](src/components/Products.jsx) and can be
swapped for real photography.

## Wiring up the contact form

The form in [`src/components/Contact.jsx`](src/components/Contact.jsx)
currently simulates submission. Point it at any free form backend
(e.g. Formspree, Web3Forms) by replacing the `setTimeout` with a `fetch` POST
to your endpoint, then show the success state on a 2xx response.

## Stack

React 19 · Vite 7 · Tailwind CSS v4 · Three.js · React Three Fiber · Drei ·
Framer Motion · Lenis · Lucide React
