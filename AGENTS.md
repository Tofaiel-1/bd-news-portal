# Project Design & Architecture Guidelines

## 1. Visual & UI/UX Standards (Gorgeous Aesthetics)
- **Design Style:** Modern, clean, and premium (Bento grids, subtle borders, ambient shadows, glassmorphism accents).
- **Transitions:** Every interactive element must have smooth hover, focus, and active states (`transition-all duration-200`).
- **Loading & Empty States:** Never show a blank screen. Always use modern skeleton loaders (`SkeletonCard`, `SkeletonList`) and informative empty states.
- **Color & Typography:** Strict hierarchical typography (Inter/Geist), balanced contrast (WCAG AA compliant), and a consistent 8pt spacing grid.
- **Mobile First:** Ensure full responsiveness across all breakpoints with touch-friendly targets (min 44px).

## 2. Software Architecture & Engineering
- **Separation of Concerns:** 
  - Components only render UI.
  - Business logic belongs in custom hooks (`useFeature.ts`).
  - API and data fetching belong in service modules (`services/` or `lib/api/`).
- **Strict Typing:** No `any`. Use TypeScript interfaces/types for all data structures and Zod schemas for input validation.
- **Component Size:** Keep components under 200 lines. Break complex interfaces into atomic, reusable sub-components.
- **State Management:** Separate server cache (React Query/SWR) from local client state (Zustand).

## 3. Reliability & Accessibility
- Proper error boundaries and toast notifications for async operations.
- Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<section>`).
