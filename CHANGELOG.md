# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- A form factor the widget reads on two axes instead of one. `(pointer: coarse) and (hover: none)` decides behaviour and target size; `(max-width: 640px), (max-height: 480px)` decides layout density. Both are subscribed, so a rotation rebuilds the toolbar rather than only moving it. A phone in landscape is wider than 640px and now gets the compact layout it needs, and a narrow desktop window keeps its hover previews.
- Mobile checks in the test suite, on four phone viewports with touch emulation: the toolbar neither scrolls nor wraps, no control is clipped or off screen, every target is at least 44px, the demo page does not widen the document, and the landscape case gets the compact layout.
- A check that the server under test is serving the working copy, because a run outside CI reuses a server already listening on the port.
- A sheet shell the notes panel, the comment prompt and the confirm dialogs share on a compact layout: anchored to the bottom edge, 85% of the viewport at most, a handle that dismisses it on a drag, a close button of its own, safe-area padding, its list scrolling inside it, and the page held still underneath. The panel had no way to dismiss itself at all -- the only exit was a toolbar button the panel was painted over, along with its own footer.
- A close button on the screenshot lightbox. `Escape` closed it and nothing else did, and a phone has no `Escape`.
- Sheet checks on the four phone viewports: the panel is dismissable without the toolbar, no sheet runs past the viewport or under the toolbar, the page is held still under an open sheet and let go after, a note tapped in the list still carries the page to itself, the import dialog is not built at all, and export opens no modal.
- An `Add note` bar above the toolbar on a coarse pointer. The selection is watched and given time to settle instead of being read off the release, so the handles can be dragged out to the end of the phrase before anything is committed.
- A preview on the element picker. On a coarse pointer the first tap outlines the element under the finger and names it, with `Wider` and `Narrower` to walk the chain it sits in and `Pin here` to commit. Wider is also the answer to a fat finger: start anywhere inside a block and climb to the block.
- A guard on the screenshot render. snapdom draws the whole document before the crop comes out of it, and a long page on a slow device could sit on it with no end; the wait is bounded now and the toast says which of the two happened.
- Touch checks on the four phone viewports, driving real touch events: a release mid-selection commits nothing, a multi-word selection reaches the prompt whole, the element preview stands before the commit and the picker stops at the page, one tap of the camera writes an annotation carrying the viewport rect, and the bars follow the toolbar to whichever edge it is on.
### Changed
- The toolbar carries five controls on a compact layout -- hide, highlight text, annotate an element, capture, notes -- each 48px, in one row, with no scrolling strip. Import and the top/bottom toggle are left out there, and export moves to the panel head beside delete-all.
- Fixed chrome is placed with `left` and `right` insets and sized in percent rather than `vw`. A host page that overflows horizontally makes the containing block wider than `100vw`, which used to size the toolbar by one box and position it against another. The rules meant to anchor the bar to the edges on a small screen now carry enough specificity to apply at all.
- `env(safe-area-inset-*)` on the toolbar, the floating visibility button and the full-screen panel, and `100dvh` with a `100vh` fallback wherever a viewport height is measured.
- Targets and fields sized for a finger wherever the pointer is coarse: 44px markers, card buttons, delete-all, modal buttons, and 16px fields at every width, under which iOS Safari zooms the page on focus and does not zoom back.
- The tooltips are drawn only where hover exists. Without it they never opened.
- The page dimmer is off by default on a coarse pointer. `isBackdropVisible` still turns it on by name.
- A marker is held inside its host. A touch-sized marker on a block that runs the full width of the screen used to hang past the edge, which widened the document and moved every fixed element on the page with it.
- The demo page's pricing table scrolls on its own instead of widening the page, and its subscribe row wraps on a narrow screen.
- Export takes the share sheet where the layout is compact and the browser has one, and the download the widget already used where it has not. A wide window keeps the download, and keeps the mail button beside it: a `mailto:` carries the whole document in a URL, the first long comment overruns it, and a share sheet is where a handoff belongs on a phone anyway.
- The comment card's `opacity: 0.55` and the `:hover` that undid it are drawn only where a pointer can hover. Without one the card never came back, and the page read straight through the comment being written.
- The sheet surfaces are named in the `color-scheme: dark` selector list, so the native controls they hold follow the theme rather than rendering light on dark.
- A narrow window on a desktop gets the sheets too, and keeps its tooltips and its parked comment card. How much room there is and what kind of pointer is driving are separate questions.
- The camera takes the visible viewport in one tap on a coarse pointer, and the drag overlay is not built there at all. The framing gesture is the page's own scroll. The annotation carries the same `rect` a dragged frame would, so markers, frames and the hop to a note are unchanged.
- A highlight is committed from the `Add note` bar rather than from a release where the pointer is coarse. A mouse still commits on the release.
- An element is committed from `Pin here` rather than from the tap that found it where the pointer is coarse. A mouse still previews on hover and commits on the click.
- The mode tip names the gesture the form factor actually takes, and stands down while a capture bar holds the same strip of screen.
### Fixed
- The visibility button was built with a French label and tooltip before the first sync replaced them.
- Region capture did nothing at all on a touch screen. `selectRegion()` bound mouse events only, so a touch drag framed nothing, opened no prompt, and left the reviewer inside an overlay whose hint named the Escape key.
- A highlight was committed on the first `touchend`. A press and hold selects one word and every drag of a handle after it is another release, so the widget wrote down the first word and cleared the selection out from under the reviewer mid-gesture.
- An annotation the server refused is sent again when the tab is hidden, when the page goes away, and when the connection comes back. A failed upsert waited for the next change to retry it, and on a phone there often is no next change. `pagehide` rather than `beforeunload`, which iOS does not fire reliably.
- Annotating in element mode no longer calls the widget's own toolbar a popup. Its controls were never a target, and saying so on every press of them was noise.
- The element outline is drawn to what the page actually shows of the element. Outlining a row of the demo page's pricing table, which sits in a scroller narrower than itself, took the document from 375px to 459px -- and fixed chrome is positioned against that width, so the toolbar went with it.
- A store with no room left says so. The write failed silently, and a capture on a coarse pointer is a whole viewport rather than a hand-framed corner of one, so the room runs out sooner.

## [2.1.0] - 2026-09-03
### Added
- Settings on the demo page. The page reads the widget's options from its query string, and a section below the pricing table writes it, says what each option does, and shows the matching script tag. `data-server-url` is taken only on a loopback address and `data-server-api-key` only beside one, so a link cannot point a visitor's notes at somebody else's server.
### Changed
- A new mark. The hyphen of `uxnote-fork` is now a branch: a stem that splits into two curved arms, each ending in a dot. The dining fork icon is gone. The toolbar takes the wordmark ink from the panel text colour and the branch and `fork` from `--wn-accent`, so the mark follows the theme; the standalone asset keeps two fixed inks that read on a light and on a dark page.

## [2.0.0] - 2026-09-03
### Added
- Server sync. `data-server-url` and `data-server-api-key` name a server that stores the annotations, one set per site, over the protocol of `PROTOCOL.md`. `server/server.py` is a reference server in the Python standard library.
- A copy of the annotations in `localStorage` beside a named server, with the digests of the set the server last agreed to. A note written, edited, or deleted while the server is down survives a reload, and a pull reconciles the two sets per annotation instead of taking the server's whole.
- `GET /health`, asked at load and every five minutes after, backing off from ten seconds while the server does not answer. A server that comes back finds the notes it missed with nobody writing or reloading. The route is optional: a server that answers 404 to it is probed with the read instead.
- Region screenshots. With snapdom loaded, the toolbar offers a camera. Drag to frame a region and release; the frame becomes an annotation with a comment and a picture, uploaded as a PNG when a server is set and kept inline otherwise.
- `data-json-export`, `data-json-import`, and `data-mail-export` turn the JSON export, the JSON import, and the mail handoff off per site. The three are independent of one another: the mail handoff has a toolbar button of its own, and it stays when the JSON export is off.
- `data-theme` and a dark theme for the widget, `auto` by default. `reverse-auto` follows the system preference to the other side of it, for a site that follows it too.
- An explicit light or dark for the demo page itself, switched in the note at the top of it and held in this browser. The page never follows the system, so the widget's `auto`, `reverse-auto`, `light`, and `dark` each read against a background you chose.
- Route changes. The widget follows `pushState`, `replaceState`, and `popstate`, so a single-page app keeps its annotations per route.
- `snapdom.min.js` ships beside the minified widget in every release.
### Changed
- A note is a comment. The comment card asks for the comment alone, sits beside the toolbar, and saves on Enter.
- The annotation panel starts closed.
- The site root is the demo page, with the widget live on it. The README carries the install snippet and every option.
- The toolbar shows the uxnote-fork logo, the panel footer links to this repository, and the install URL points at this fork's releases.
- Every widget message is English.
### Fixed
- Annotation ids are uuids. Two browsers writing against a server that is down settle their sets against each other when it comes back, and the six characters of `Math.random` behind the old ids collided often enough over a review to merge one reviewer's note onto another's.
- A route change made after the server came back no longer drops the notes it has not seen. The pull it starts reconciles rather than replacing, so nothing goes without a word on the screen.

### Removed
- The reviewer name and the priority on new annotations, with the panel filters and the card chip that read them. Annotations written earlier keep both properties.
- The export dialog. It stood to pick reviewers and priorities, and once those left the annotation it had nothing to ask; the export button writes the file on the press, holding every annotation of the site.
- The landing page, with its option builder, its French translation, its analytics tag, and its donation button.

## [1.0.0] - 2026-01-08
### Added
- Initial release of Uxnote annotation tool and landing page.
