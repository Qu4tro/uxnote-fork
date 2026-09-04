# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-09-03
### Added
- Server sync. `data-server-url` and `data-server-api-key` name a server that stores the annotations, one set per site, over the protocol of `PROTOCOL.md`. `server/server.py` is a reference server in the Python standard library.
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
### Removed
- The reviewer name and the priority on new annotations, with the panel filters and the card chip that read them. Annotations written earlier keep both properties.
- The export dialog. It stood to pick reviewers and priorities, and once those left the annotation it had nothing to ask; the export button writes the file on the press, holding every annotation of the site.
- The landing page, with its option builder, its French translation, its analytics tag, and its donation button.

## [1.0.0] - 2026-01-08
### Added
- Initial release of Uxnote annotation tool and landing page.
