# Repository Guidance

- Use Tailwind CSS for styling components. Prefer utility classes directly in JSX and inline `style` attributes when necessary. Avoid `.module.css` files.
- Place test files alongside the pages or components they cover (e.g. `components/Button.tsx` and `components/Button.test.tsx`).
- Run `pnpm test` before committing to ensure all tests pass.
