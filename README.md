# UxNote fork

A fork of [UxNote](https://github.com/ninefortyonestudio/uxnote), the single-script annotation bar for mockups and websites. Drop one `<script>` tag on a page and reviewers highlight text, pin elements, and leave numbered comments in the browser.

![UxNote on a demo page: a text highlight, an element pin, and the annotation panel](assets/readme/annotating.png)

## What it forks

[ninefortyonestudio/uxnote](https://github.com/ninefortyonestudio/uxnote) v1.0.0, MIT. Upstream keeps annotations in `localStorage` and hands them off as a JSON file or an email. This fork keeps the widget, its landing page, and its build.

## What it adds

- **Server sync.** Set a server URL and an API key, and annotations persist on that server per site, with a copy in `localStorage` that carries them across a reload the server was down for. Leave the server unset and the widget stores them in `localStorage` only, as upstream does.
- **Region screenshots.** A note can be a picture of a region of the page, framed by the reviewer.
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

## Server sync

Name a server and the annotations live on it, one set per site, shared by every
reviewer who opens the page:

```html
<script src="https://qu4tro.github.io/uxnote-fork/dist/uxnote.min-v1.0.0.js"
  data-server-url="http://localhost:8123"
  data-server-api-key="review-key"></script>
```

| Attribute | Meaning |
|---|---|
| `data-server-url` | The base URL of the server. Leave it out and the widget stores the annotations in `localStorage`. |
| `data-server-api-key` | A key the widget sends as `X-Uxnote-Key` on every request. An empty key sends no header. |

A named server is the shared store, and your browser keeps a copy. The widget
draws that copy at once, reads the set from the server, settles the two, and
sends one request per annotation you write, edit, or delete. **A note written
while the server is down survives a reload**, and goes up when the server comes
back.

It asks the server whether it is there at load and every five minutes after,
backing off from ten seconds while it is not. So a server that comes back finds
its notes without anybody having to reload the page or write another one.

Two reviewers on one page settle per note, last write wins. A note you did not
touch takes the server's copy; a note you wrote or edited while the server was
away is yours and goes up; a note another reviewer deleted goes. `PROTOCOL.md`
has the table.

**A dot beside the wordmark carries the answer to the last request**, so the
state of the server is on the screen rather than in a toast that has gone. It
is drawn only on a page that names a server, and it has three states, each
with its own line on hover:

| Dot | Meaning |
|---|---|
| Green | The last request was answered and the notes are on the server. |
| Yellow | The address answered, but not as this API: a refused key, or something else serving that path. |
| Red | Nothing answered. The server is down, the address is wrong, or the browser refused to reach it. Notes are kept in this browser meanwhile. |

**The api key is public.** It sits in the source of every page that carries the
script tag, so anybody who can read the page can read the key. It stops a
passer-by from writing to a review server. It is not access control. Put the
server behind a network boundary if the notes matter.

`PROTOCOL.md` holds the contract: six routes, an optional health probe, and one
JSON shape. Any stack can implement it. `server/server.py` does, in the Python 3.9 standard library, and
it serves the repository too, so the page under review runs on the same origin:

```sh
python3 server/server.py --port 8123 --root . --api-key review-key
```

Then open http://localhost:8123/server/demo.html and annotate it. The
annotations land in `uxnote-data/`.

## Region screenshots

A note can be a picture of a region of the page. Load
[snapdom](https://github.com/zumerlab/snapdom) before the widget, on the same
page, and the toolbar offers a camera beside the two other capture modes:

```html
<script src="https://qu4tro.github.io/uxnote-fork/dist/snapdom.min.js"></script>
<script src="https://qu4tro.github.io/uxnote-fork/dist/uxnote.min-v1.0.0.js"></script>
```

Press the camera and drag to frame a region. Release the button and the comment
prompt opens, the way it does for a highlight or an element. Escape stops. Write
a comment and the region becomes an annotation: a numbered marker and a frame on
the page, a thumbnail on its card. The picture is taken while the comment is
written, from a copy of the page snapdom renders without the widget's own
interface: it carries no toolbar, no panel and no marker, and nothing on the page
moves while it is taken.

With a server the picture travels to it as a PNG, and the annotation keeps the
address the server answers with. With no server the picture rides on the
annotation itself, and the JSON export carries it.

A server that does not answer does not cost you the capture. The picture stays
on the annotation, the toast says so, and the note behaves like every other
one written while the server is away: it is held and sent again. The picture
goes up as a PNG on that later attempt, before the annotation that points at
it, so nothing carries a base64 document to the server.

`npm run build` writes `snapdom.min.js` into `dist/` beside the minified widget,
so both URLs above resolve against one directory.

## Export, import and mail

The toolbar offers a JSON export, a JSON import and a handoff to the mail
client. Each one is a button of its own, each one is on by default, and each one
has its own attribute. Turn any of them off per site:

```html
<script src="https://qu4tro.github.io/uxnote-fork/dist/uxnote.min-v1.0.0.js"
  data-json-export="false"
  data-json-import="false"
  data-mail-export="false"></script>
```

| Attribute | Meaning |
|---|---|
| `data-json-export` | `true` by default. `false` removes the export button and its dialog. |
| `data-json-import` | `true` by default. `false` removes the import button, its dialog, and its list of imported files. |
| `data-mail-export` | `true` by default. `false` removes the mail button and the handoff behind it. |

The three are independent. A site that wants the mail handoff and no JSON file
sets `data-json-export="false"` and leaves the mail button alone; a site that
wants the JSON file and no mail sets `data-mail-export="false"` and keeps the
export dialog.

`data-mailto` keeps its meaning: it names the recipient of the mail handoff.
It does nothing while `data-mail-export` is `false`.

The mail button hands every annotation of the page to the mail client at once;
it opens no dialog. The export dialog is where a reviewer or a priority is
picked before a file is written.

An annotation imported earlier stays in the store when the import is off. Only
the dialog that lists the imported files is gone. When all three options are
off, the toolbar drops the group between the capture modes and the panel
controls.

## Single-page apps

The widget follows a route change made without a document load. It wraps
`history.pushState` and `history.replaceState` and listens for `popstate`.
When the path changes, it removes the markers of the page you left, draws the
markers of the page you reached, and, with a server named, reads the
annotation set from the server again. It waits 120 ms first, so the router
has drawn the page that an annotation attaches to. An annotation whose target
arrives later is drawn when the target appears.

A page is its origin plus its pathname. A change of the query string or of the
hash alone is not a route change, so a router that keeps its routes in the
hash shows every route's annotations on every route.

## Develop

```sh
npm test         # Playwright smoke test against demo/
npm run build    # minified script in dist/
```

CI runs the syntax check, the build, and the smoke test on every pull request and on `main`. A preview of the site is deployed for every pull request, and its URL is posted as a comment. Pushes to `main` deploy the landing page. A `v*` tag, matching the version in `package.json`, publishes a GitHub release with the built script.

## License

MIT. The widget is © ninefortyonestudio; see `LICENSE`. `uxnote-tool/snapdom.min.js`
is SnapDOM, MIT © Juan Martin Muda, vendored unmodified; see
`uxnote-tool/LICENSE-snapdom.txt`.
