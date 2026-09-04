# Changelog

All notable changes to this project will be documented in this file.

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
- Settings on the demo page. The page reads the widget's options from its query string, and a section below the pricing table writes it, says what each option does, and shows the matching script tag. `data-server-url` is taken only on a loopback address and `data-server-api-key` only beside one, so a link cannot point a visitor's notes at somebody else's server.
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
