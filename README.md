# Carbon Footprint Awareness Platform

A comprehensive, production-grade full-stack platform designed to help users calculate, track, and forecast their individual and household greenhouse emissions under local country baselines, complete with custom AI-powered optimization planners.

## 🔗 Live Application Deployment

The application compiles for production and is deployed live at:
**[https://carbon-footprint-awareness-platform-326440519773.asia-east1.run.app](https://carbon-footprint-awareness-platform-326440519773.asia-east1.run.app)**

---

## 🏛️ System Architecture

The application implements a full-stack architecture that isolates user-sensitive data on the client side while keeping computation, AI parsing, and secrets safe on the server side.

```
       +--------------------------------------------------------+
       |                  CLIENT WEB BROWSER                     |
       |  (React SPA / Vite / Tailwind CSS / Recharts Modules)   |
       +------------+------------------------------+-------------+
                    | (Lazy Bundle Loading)        | (Data Cache)
                    v                              v
       +----------------------------+   +-----------------------+
       |   Lazy Loaded Modules      |   |   Local Storage Cache |
       | - UserProfileForm          |   |  - carbon_user_profile|
       | - ReportsTab               |   |  - carbon_calc_logs   |
       | - EducationalCenter        |   +-----------------------+
       +------------+---------------+
                    |
                    | (Strict validated JSON requests)
                    v
       +--------------------------------------------------------+
       |              EXPRESS APPLICATION ROUTER                |
       |  (Server-Side API / Custom Rate Limiting / XSS Shield) |
       +------------+-------------------------------------------+
                    |
                    | (Secure model inference prompt construction)
                    v
       +--------------------------------------------------------+
       |                 GEMINI-3.5-FLASH INF                 |
       |   - Structured Custom Recommendations Schema Outputs   |
       +--------------------------------------------------------+
```

### Module Breakdowns
1. **Frontend Layer (React & Vite)**:
   - Dynamic UI designed desktop-first and refined mobile-first.
   - Built on top of **React 19** and **Vite 6** to avoid overhead and keep bundle sizes small.
   - Leverages **Tailwind CSS** for custom-styled, unified interfaces.
   - Fully optimized utilizing React `lazy()` dynamic imports and visual `<Suspense>` backstops to prevent blockages on initial content painting.
2. **Server Layer (Express Backend)**:
   - Serves built static assets and holds `/api/advisor` endpoint logic.
   - Features custom **in-memory sliding window rate-limiting middleware** protecting against spamming and API overload.
   - Leverages robust text cleanups, input sanitization routines, and numeric bounding checks to block Cross-Site Scripting (XSS) and injection exploits.
3. **Storage & Caching Layer**:
   - Persists coordinates, historical measurement logs, and customizable profile paces inside client-side `localStorage`.
   - Isolates individual credentials, keeping user data local and protected.

---

## ♿ Accessibility Statement (WCAG 2.1 AA)

The platform is designed and audited from the ground up to comply with **WCAG 2.1 Level AA** standards:

*   **Skip-To-Content Navigation**: Includes a visually hidden but keyboard-interactable skipping link allowing power users to bypass the application header and immediately focus main elements.
*   **Semantic Landmarks**: Encased within correct HTML structures (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `fieldset`) so screen readers map out pages beautifully.
*   **Aria Integrations**: Enhanced with explicit accessibility markup (`aria-label`, `aria-describedby`, `aria-live="polite"`, `aria-pressed`, `aria-valuemin`) to translate dynamic state updates (e.g., active tabs, range inputs, loading states) to assistive technologies.
*   **Contrast Pairing**: Avoids low-contrast text. Styled in high-contrast deep emerald values paired with slate grays over warm white canvas blocks.
*   **Touch Targets**: All interactive elements (such as buttons, navigation pills, and option cards) are crafted with sizing exceeding standard touch bounds (minimum 44x44px target on mobile).

---

## 🧪 Testing and Quality Control

The application uses **Vitest** for extreme execution speeds and reliability. Unit tests cover all critical mathematical calculation blocks, user forms, and sorting algorithms.

### Test Coverage Targets
*   **Carbon Calculator**: Thorough checks verify calculation factors, compound commute math, and recycling waste-to-emission reduction ratios.
*   **Emissions Analysis**: Validates short/medium/long flight trip metrics, household electricity baselines, and scoring math.
*   **Recommendation Engine**: Tests impact metrics calculations and sorted outputs matching cost/feasibility parameters.
*   **Forms & Dashboard**: Validates in-sandbox profile structures, input character sanitization logic, and logs percentage trends.

### Running Tests Locally
To execute the test suites and check performance:
```bash
# Run Vitest test runner
npm run test

# Run code coverage report
npx vitest run --coverage
```


