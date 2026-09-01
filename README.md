# UxNote fork

A fork of [UxNote](https://github.com/ninefortyonestudio/uxnote), the single-script annotation bar for mockups and websites. Drop one `<script>` tag on a page and reviewers highlight text, pin elements, and leave numbered comments in the browser.

![UxNote on a demo page: a text highlight, an element pin, and the annotation panel](assets/readme/annotating.png)

## What it forks

[ninefortyonestudio/uxnote](https://github.com/ninefortyonestudio/uxnote) v1.0.0, MIT. Upstream keeps annotations in `localStorage` and hands them off as a JSON file or an email. This fork keeps the widget, its landing page, and its build.

## What it adds

- **Server sync.** Set a server URL and an API key, and annotations persist on that server per site. Leave the server unset and the widget stores them in `localStorage`, as upstream does.
- **Region screenshots.** Each annotation can carry a crop of the page around the annotated element or text.
- **Settings.** `jsonExport`, `jsonImport`, and `server` are script-tag attributes, and cards in the landing-page builder.
- **Dark mode.** The toolbar, panel, and dialogs follow the page's color scheme.
- **Comment-first notes.** A note is one comment, written on a card beside the toolbar so the annotated area stays visible. The panel starts closed.
- **Single-page apps.** A route change without a page load re-renders the annotations of the new page.
- **CI/CD.** Every pull request gets a live preview of the landing page and the demo. A version tag publishes a release with the minified script.

## Try it

- Landing page: https://qu4tro.github.io/uxnote-fork/
- Demo page: https://qu4tro.github.io/uxnote-fork/demo/

Locally:

```sh
npm install
npm start
```

Then open http://localhost:4173/demo/.

## Install

```html
<script src="https://qu4tro.github.io/uxnote-fork/dist/uxnote.min-v1.0.0.js"></script>
```

The landing page builder generates the tag with the options you pick.

## Develop

```sh
npm test         # Playwright smoke test against demo/
npm run build    # minified script in dist/
```

CI runs the syntax check, the build, and the smoke test on every pull request and on `main`. A preview of the site is deployed for every pull request, and its URL is posted as a comment. Pushes to `main` deploy the landing page. A `v*` tag, matching the version in `package.json`, publishes a GitHub release with the built script.

## License

MIT. The widget is © ninefortyonestudio; see `LICENSE`.
