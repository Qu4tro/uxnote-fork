# The annotation wire protocol, version 1

This is the contract between the UxNote widget and a server that stores its
annotations. Set `data-server-url` on the script tag and the widget speaks it.

The protocol is small on purpose: one resource, four requests. Any stack can
implement it. `server/server.py` is a reference implementation in the Python
standard library.

## Terms

- **Base URL** — the value of `data-server-url`. It may be absolute
  (`https://notes.example.com`) or same-origin relative (`/uxnote`). The widget
  strips a trailing slash. Every path below is relative to the base URL.
- **Site key** — `location.protocol + '//' + location.host` of the annotated
  page, for example `http://localhost:8123`. The widget sends it URL-encoded in
  the `site` query parameter of every request. One annotation set exists per
  site key. The server treats the key as an opaque string.
- **Annotation** — a JSON object. The server reads two properties: `id`, which
  matches `^[A-Za-z0-9_-]{1,64}$` and is unique inside a site, and `type`, which
  is `text` or `element`. Past those two the annotation is opaque: the server
  stores it and returns it byte-faithfully, and it strips no property and
  re-keys nothing.

## Requests

| Method | Path | Body | Answer |
|---|---|---|---|
| `GET` | `{base}/annotations?site={site}` | — | `{"version":1,"annotations":[…]}` |
| `PUT` | `{base}/annotations/{id}?site={site}` | the annotation, JSON | `{"ok":true}` |
| `DELETE` | `{base}/annotations/{id}?site={site}` | — | `{"ok":true}` |
| `DELETE` | `{base}/annotations?site={site}` | — | `{"ok":true}` |

### Read the set

```
GET {base}/annotations?site={site}
```

The answer is `200`, `application/json`:

```json
{ "version": 1, "annotations": [ { "id": "…", "type": "text" }, … ] }
```

A site key the server never saw answers `200` with an empty array, not `404`.

The widget reads the set once, at load. What the server answers replaces
whatever the widget held.

### Write one annotation

```
PUT {base}/annotations/{id}?site={site}
Content-Type: application/json
```

The body is the one annotation. The server stores it under that id, in place if
the id is already there, appended otherwise, and keeps the order of the rest of
the set. An `id` in the path that the body disagrees with is the path's to
resolve: the reference server rejects the mismatch with `400`.

### Delete one annotation

```
DELETE {base}/annotations/{id}?site={site}
```

An id the server does not hold answers `200`, because the caller asked for a
state the server is already in.

### Delete the set

```
DELETE {base}/annotations?site={site}
```

This is the widget's **Delete all**. It is one request, never one request per
annotation.

## How the widget writes

The widget holds the set it last agreed on with the server. On every change it
compares the current set against that snapshot, and it sends one `PUT` per
annotation whose JSON differs and one `DELETE` per annotation that went away. It
sends the requests in order, on a promise chain.

A whole-set write would destroy a note that a second reviewer, or a hand edit of
the stored file, changed between two changes in this browser. There is no
locking and no merge: per annotation, the last write wins. That is enough for a
small review team, and it is the whole of the guarantee.

When the server is set, the server is the only store. A failed request raises
one toast and leaves the snapshot stale, so the next change sends it again. A
note written while the server is down is lost when the page reloads.

## The api key

`data-server-api-key` names a string the widget sends as `X-Uxnote-Key` on every
request. An empty key sends no header.

**The key sits in the page source.** Anybody who can read the page can read the
key. It stops a passer-by from writing to a review server. It is not a secret,
and it is not access control. Put the server behind a network boundary if the
notes matter.

A server that wants the key compares it in constant time and answers `401` when
it does not match.

## CSRF

The protocol carries no cookie and no session, so a CSRF header would protect
nothing. The widget sends none. A server that puts these routes behind a session
cookie takes on CSRF itself.

## CORS

The server can be a different origin from the page under review. Then it answers
`OPTIONS` and sends at least:

```
Access-Control-Allow-Origin: <page origin or *>
Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Uxnote-Key
```

## Appendix: annotation shapes

This section is informative. A server must not depend on it: it describes what
one widget release writes, and a later release can add a property or drop one.

Every annotation carries:

```
id          unique string, ^[A-Za-z0-9_-]{1,64}$
type        "text" or "element"
comment     the note itself
author      the name of the reviewer who wrote it
priority    "low", "medium" or "high"
snippet     an excerpt of the annotated content
pageUrl     the full URL the annotation was written on
pageKey     origin and pathname; annotations are stored per site, drawn per page
createdAt   epoch milliseconds
status      "active"
```

`type: "text"` adds `target`, a serialized text range. `type: "element"` adds
`target` as `{ xpath, css, tag }` and `rect` as `{ x, y, w, h }` in page
coordinates.
