# Accessibility rules (WCAG 2.1 AA)

## Semantic HTML

- Use correct elements: `<button>` for actions, `<a>` for navigation, `<input>` for input.
- Never use `<div onClick>` as a button substitute.
- Use landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- One `<h1>` per page. Heading hierarchy (`h1` → `h2` → `h3`) never skips levels.
- Use `<ul>/<ol>` for lists, `<table>` for tabular data (with `<thead>`, `<th scope>`).

## Keyboard navigation

- All interactive elements are reachable via Tab.
- Tab order follows visual layout (don't use `tabindex > 0`).
- Focus is visible — never remove `:focus` outline without replacing it.
- Modal dialogs trap focus. Escape closes the modal and returns focus to the trigger.
- Custom components (dropdowns, date pickers) support arrow key navigation.

## ARIA

- Use ARIA only when HTML semantics are insufficient.
- Every `<img>` has an `alt` attribute. Decorative images use `alt=""`.
- Form inputs have associated `<label>` elements (via `htmlFor` / `for` attribute).
- Dynamic content changes use `aria-live` regions (`polite` for updates, `assertive` for errors).
- Toggle buttons use `aria-pressed`. Expandable sections use `aria-expanded`.
- Loading states announce via `aria-busy="true"` + `aria-live` region.

## Color & contrast

- Text contrast ratio: 4.5:1 minimum (3:1 for large text ≥18px bold or ≥24px).
- Don't convey information by color alone — add icons, text, or patterns.
- UI must be functional in Windows High Contrast Mode.
- Test with simulated color blindness (protanopia, deuteranopia).

## Forms

- Every input has a visible label (placeholder is NOT a label).
- Error messages are associated with inputs via `aria-describedby`.
- Required fields marked with `aria-required="true"` and visible indicator.
- Form validation errors are announced immediately (not just on submit).
- Group related fields with `<fieldset>` and `<legend>`.

## Motion & animation

- Respect `prefers-reduced-motion`. Disable or reduce animations for users who set this.
- No auto-playing video/audio without user consent.
- No content flashing more than 3 times per second.

## Testing

- Run `axe-core` (or `@axe-core/react`) in CI — zero violations on every PR.
- Test with keyboard-only navigation as part of E2E tests.
- Test with screen reader (NVDA/VoiceOver) for critical user journeys at least once per release.
