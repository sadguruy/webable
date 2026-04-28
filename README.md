# webable-ui

Lightweight, accessible UI component library for React + TypeScript (Vite-powered).

This repository contains the source components (in `src/components`), Storybook stories, and build configuration used to publish the packaged library (`webable-ui`).

**Contents**

- Source components: `src/components/*`
- Stories: `src/components/*/*.stories.tsx` and `src/stories`
- Build output: `dist/` (published files)

**Key scripts** (run from repository root)

- `npm install` — install dependencies
- `npm run dev` — start the dev server (Vite)
- `npm run storybook` — run Storybook (component explorer) on port 6006
- `npm run build` — build library (`tsc -b && vite build`)
- `npm run build-storybook` — build Storybook static site
- `npm run preview` — preview the Vite production build
- `npm run lint` — run ESLint

See `package.json` for full script list and devDependencies.

## Quick start (consume the package)

Install from npm (when published):

```bash
npm install webable-ui
# or
yarn add webable-ui
```

Then import in your React app:

```tsx
import React from "react";
import { ActionButton } from "webable-ui";

export default function Example() {
	return (
		<div>
			<ActionButton
				variant="primary"
				label="Click me"
				onClick={() => alert("Clicked")}
			/>
		</div>
	);
}
```

Notes:

- Most components provide both named and default exports (e.g., `export function ActionButton` and `export default ActionButton`). You can import either as a named import or default import depending on your bundler configuration.
- Type definitions are included in the published package (`types` in package.json points to `dist/index.d.ts`).

## Local development

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd webable
npm install
```

2. Start a development site (Vite) while you iterate on components:

```bash
npm run dev
```

3. Run Storybook to see components and examples:

```bash
npm run storybook
```

4. Build the library for publishing:

```bash
npm run build
```

If you want to test the built package in a local project, you can `npm pack` or use `npm link` from the built output.

## Example component usage

ActionButton (JSX examples):

```tsx
import React from "react";
import { ActionButton } from "webable-ui";

export default function Sample() {
	return (
		<>
			<ActionButton label="Primary" variant="primary" />
			<ActionButton elementType="link" href="/about" label="Go" />
			<ActionButton icon={<svg />} iconPosition="right" label="With icon" />
		</>
	);
}
```

Other components follow a similar pattern — look in `src/components` for props and examples in the corresponding `*.stories.tsx` files.

## Publishing

- The package name is `webable-ui` (see `package.json`).
- `npm run build` is executed automatically before publish (`prepublishOnly` runs `npm run build`).
- To publish: `npm publish --access public` (requires npm auth and proper version in `package.json`).

## Contributing

- Please open issues or PRs on the repository. Follow existing code style and run `npm run lint` before submitting.
- Component stories live next to components; add or update stories when adding features or examples.

## License

This repository includes a top-level `LICENSE` file — see that file for licensing details.

---

File locations to check:

- Source: [src/components](src/components)
- Stories: [src/stories](src/stories)
- Package manifest: [package.json](package.json)

Happy building!
