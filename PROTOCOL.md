# The annotation wire protocol, version 1

This is the contract between the UxNote widget and a server that stores its
annotations. Set `data-server-url` on the script tag and the widget speaks it.

The protocol is small on purpose: two resources, six requests, and one optional
probe. Any stack can implement it. `server/server.py` is a reference
implementation in the Python standard library.

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
  re-keys nothing. Re-keying is not cosmetic here: the widget decides whether a
  note changed under it by hashing the JSON, so a server that reorders the keys
  costs a `PUT` per note per load. The widget writes uuids, but the pattern is
  the contract and a server must take any id that matches it.
- **Screenshot** — a PNG of the region of the page one annotation is about. The
  widget sends at most one screenshot per annotation.

## Requests

| Method | Path | Body | Answer |
|---|---|---|---|
| `GET` | `{base}/annotations?site={site}` | — | `{"version":1,"annotations":[…]}` |
| `PUT` | `{base}/annotations/{id}?site={site}` | the annotation, JSON | `{"ok":true}` |
| `DELETE` | `{base}/annotations/{id}?site={site}` | — | `{"ok":true}` |
| `DELETE` | `{base}/annotations?site={site}` | — | `{"ok":true}` |
| `PUT` | `{base}/screenshots/{id}?site={site}` | the PNG, `image/png` | `201 {"url":"screenshots/…"}` |
| `GET` | `{base}/screenshots/{name}` | — | the PNG |
| `GET` | `{base}/health` | — | `{"status":"ok","version":1}` |

### Read the set

```
GET {base}/annotations?site={site}
```

The answer is `200`, `application/json`:

```json
{ "version": 1, "annotations": [ { "id": "…", "type": "text" }, … ] }
```

A site key the server never saw answers `200` with an empty array, not `404`.

The widget reads the set at load, and again whenever the probe finds a server
that was not answering and now is. What the server answers does not replace
what the widget held: the two are reconciled, under **How the widget writes**.

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

### Store a screenshot

```
PUT {base}/screenshots/{id}?site={site}
Content-Type: image/png
```

The body is the PNG itself, so a server needs no multipart parser. `{id}` is the
annotation the screenshot belongs to.

The answer is `201`:

```json
{ "url": "screenshots/example.com-a1b2c3.png" }
```

`url` is relative to the base URL, and the widget resolves it against
`{base}/`. The server can be a different origin from the page under review, so
an absolute path off the page origin reaches the wrong host. The server chooses
the name. The widget stores the answer on the annotation and asks for nothing
else about it.

A second screenshot on the same annotation replaces the first.

### Read a screenshot

```
GET {base}/screenshots/{name}
```

`{name}` is the tail of a `url` a store answered with. The answer is the PNG,
as `image/png`.

## How the widget writes

The widget holds the set it last agreed on with the server. On every change it
compares the current set against that snapshot, and it sends one `PUT` per
annotation whose JSON differs and one `DELETE` per annotation that went away. It
sends the requests in order, on a promise chain.

A whole-set write would destroy a note that a second reviewer, or a hand edit of
the stored file, changed between two changes in this browser. There is no
locking and no merge: per annotation, the last write wins. That is enough for a
small review team, and it is the whole of the guarantee.

### What a browser keeps

The server is the shared store, and each browser keeps a copy of the set it has
and the digests of the set the server agreed to, both in `localStorage`. A
failed request raises one toast and leaves the digest stale, so the note is sent
again by the next change, by the next pull, by the probe finding the server
back, and by the next load of the page. Nothing written while a server was down
is lost to a reload.

A browser that has no stored digests has never synced this site. The set beside
them was then written before a server was named, and it is that reviewer's
alone: the first pull adopts the server's set rather than pushing private notes
onto a shared one.

### Settling two sets

A pull compares three things per id — the set here, the digests, and the set the
server answered with:

| Here | Agreed | On the server | Outcome |
|---|---|---|---|
| yes | absent | either | written here while away: kept, and `PUT` |
| yes | differs | either | edited here while away: kept, and `PUT` |
| yes | matches | yes | nobody here touched it: the server's copy wins |
| yes | matches | no | another reviewer deleted it: dropped |
| no | present | yes | deleted here while away: stays deleted, and `DELETE` |
| no | present | no | deleted at both ends: nothing to send |
| no | absent | yes | new to this browser: taken |

The digests are what separate the second row from the third: without them a
browser cannot tell a note it changed from a note it merely holds.

One case reads badly and is left as it reads. A note deleted here while the
server was away, which another reviewer re-created in the meantime, is deleted
again. Last write wins, and the delete is the later write from this browser's
side. There is no way to tell that from an ordinary stale delete without
per-note versions, which this protocol does not carry.

### Is the server there

```
GET {base}/health
```

The answer is `200` and a JSON body, of any shape. The widget reads the status
code and that the body parses: a `200` of HTML is a website at that address, not
this API, and a probe that took the status alone would paint the dot green over
a read that is failing on the same address. The route takes the api key like
every other, so a wrong key shows on the dot at load rather than at the first
write.

**This route is optional.** A server that answers `404` to it says so, and the
widget probes with `GET {base}/annotations` for the rest of that page's life. A
server written against this protocol before the probe existed needs no change.

The widget probes at load, then every five minutes while the server answers.
When it does not, the probe backs off from ten seconds, doubling to a ceiling
of the same five minutes, and resets on the first answer.

## The api key

`data-server-api-key` names a string the widget sends as `X-Uxnote-Key` on every
request. An empty key sends no header.

**The key sits in the page source.** Anybody who can read the page can read the
key. It stops a passer-by from writing to a review server. It is not a secret,
and it is not access control. Put the server behind a network boundary if the
notes matter.

A server that wants the key compares it in constant time and answers `401` when
it does not match.

`GET {base}/screenshots/{name}` is the one route that asks for no key. The
widget shows a screenshot in an `<img>`, which sends no header. A screenshot
is as readable as the page it is of.

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

An annotation that carries a screenshot adds `screenshot`:

```
url         the address the store answered with, relative to the base URL
w           the width of the PNG in pixels
h           the height of the PNG in pixels
capturedAt  epoch milliseconds
```

With no server the widget has nowhere to send the PNG, so it writes the picture
into `screenshot.dataUrl` instead of `screenshot.url` and the JSON export
carries it. A server never sees that form.
