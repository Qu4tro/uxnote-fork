#!/usr/bin/env python3
"""Reference server for the UxNote annotation wire protocol, version 1.

Python 3.9 and the standard library, no packages. PROTOCOL.md holds the
contract this implements. The server also serves static files from --root, so
the page under review runs on the same origin with one command:

    python3 server/server.py --port 8123 --root . --api-key review-key
    # then open http://localhost:8123/server/demo.html

Routes, under --prefix (empty by default):

    GET    /health                      is the server there, and is the key right
    GET    /annotations?site=...        read the annotation set of a site
    PUT    /annotations/<id>?site=...   write one annotation
    DELETE /annotations/<id>?site=...   delete one annotation
    DELETE /annotations?site=...        delete the set
    PUT    /screenshots/<id>?site=...   store the screenshot of one annotation
    GET    /screenshots/<name>          read a stored screenshot
    GET    /<anything else>             a file under --root

Storage is one file per site under --data (./uxnote-data by default), named
after the site key and holding the set as the protocol sends it. Screenshots are
PNG files under --data/screenshots, named after the site key and the annotation.

This is a review tool. It has no TLS, it writes world-readable files, and the
api key it compares travels in the source of every annotated page. Put it
behind a network boundary if the notes matter.
"""

import argparse
import hmac
import json
import mimetypes
import re
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
SCREENSHOT_NAME_PATTERN = re.compile(r"^[A-Za-z0-9._-]{1,192}\.png$")
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Uxnote-Key",
}


def site_slug(site):
    slug = re.sub(r"[^A-Za-z0-9.-]+", "_", site).strip("_")
    return slug or "default"


class UxnoteHandler(BaseHTTPRequestHandler):
    server_version = "uxnote-reference/1.0"
    # main() sets these: static docroot, storage directory, API base path, the
    # api key or None, and one lock over every read-and-write of a site file.
    root = Path(".")
    data = Path("./uxnote-data")
    prefix = ""
    api_key = None
    lock = threading.Lock()

    # ------------------------------------------------------------- answering
    def _send(self, code, body=b"", ctype="application/json; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for key, value in CORS_HEADERS.items():
            self.send_header(key, value)
        self.end_headers()
        if body:
            self.wfile.write(body)

    def _json(self, code, obj):
        self._send(code, json.dumps(obj).encode("utf-8"))

    def _error(self, code, message):
        self._json(code, {"error": message})

    # -------------------------------------------------------------- requests
    def _authorized(self):
        if not self.api_key:
            return True
        return hmac.compare_digest(self.headers.get("X-Uxnote-Key", ""), self.api_key)

    def _site(self, query):
        values = parse_qs(query).get("site", [])
        return values[0] if values and values[0] else ""

    def _route_id(self, path, resource):
        """The id of a /<resource>/<id> path, or '' when the path is not one."""
        head = f"{self.prefix}/{resource}/"
        if not path.startswith(head):
            return ""
        candidate = path[len(head):]
        return candidate if ID_PATTERN.match(candidate) else ""

    # --------------------------------------------------------------- storage
    def _site_file(self, site):
        return self.data / f"{site_slug(site)}.json"

    def _read_set(self, site):
        site_file = self._site_file(site)
        if not site_file.exists():
            return {"version": 1, "annotations": []}
        payload = json.loads(site_file.read_text("utf-8"))
        if not isinstance(payload, dict) or not isinstance(payload.get("annotations"), list):
            raise ValueError("the stored set has the wrong shape")
        return payload

    def _write_set(self, site, payload):
        self.data.mkdir(parents=True, exist_ok=True)
        site_file = self._site_file(site)
        tmp = site_file.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(payload, indent=2), "utf-8")
        tmp.replace(site_file)

    def _screenshot_file(self, name):
        return self.data / "screenshots" / name

    def _screenshot_name(self, site, annotation_id):
        # The name is the site and the annotation, so a second screenshot of the
        # same annotation replaces the first instead of leaving an orphan.
        return f"{site_slug(site)}-{annotation_id}.png"

    # ---------------------------------------------------------------- routes
    def do_OPTIONS(self):
        self._send(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        if path == f"{self.prefix}/health":
            if not self._authorized():
                return self._error(401, "the api key does not match")
            return self._json(200, {"status": "ok", "version": 1})

        if path == f"{self.prefix}/annotations":
            if not self._authorized():
                return self._error(401, "the api key does not match")
            site = self._site(parsed.query)
            if not site:
                return self._error(400, "the site query parameter is required")
            with self.lock:
                try:
                    payload = self._read_set(site)
                except (OSError, ValueError):
                    return self._error(500, "the stored annotation set is unreadable")
            return self._json(200, payload)

        head = f"{self.prefix}/screenshots/"
        if path.startswith(head):
            return self._serve_screenshot(path[len(head):])

        return self._serve_static(path)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if not self._authorized():
            return self._error(401, "the api key does not match")
        screenshot_id = self._route_id(path, "screenshots")
        annotation_id = self._route_id(path, "annotations")
        if not screenshot_id and not annotation_id:
            return self._error(404, "no route answers that path")
        site = self._site(parsed.query)
        if not site:
            return self._error(400, "the site query parameter is required")
        if screenshot_id:
            return self._store_screenshot(site, screenshot_id)

        try:
            length = int(self.headers.get("Content-Length", 0))
            annotation = json.loads(self.rfile.read(length))
        except ValueError:
            return self._error(400, "the body is not valid JSON")
        if not isinstance(annotation, dict):
            return self._error(400, "the body must be one annotation object")
        if annotation.get("id") != annotation_id:
            return self._error(400, "the id in the body differs from the id in the path")

        with self.lock:
            try:
                payload = self._read_set(site)
            except (OSError, ValueError):
                return self._error(500, "the stored annotation set is unreadable")
            annotations = payload["annotations"]
            # In place when the id is known, so the order of the set holds.
            for index, stored in enumerate(annotations):
                if isinstance(stored, dict) and stored.get("id") == annotation_id:
                    annotations[index] = annotation
                    break
            else:
                annotations.append(annotation)
            payload["version"] = 1
            self._write_set(site, payload)
        return self._json(200, {"ok": True})

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if not self._authorized():
            return self._error(401, "the api key does not match")
        site = self._site(parsed.query)
        if not site:
            return self._error(400, "the site query parameter is required")

        if path == f"{self.prefix}/annotations":
            with self.lock:
                self._write_set(site, {"version": 1, "annotations": []})
            return self._json(200, {"ok": True})

        annotation_id = self._route_id(path, "annotations")
        if not annotation_id:
            return self._error(404, "no route answers that path")
        with self.lock:
            try:
                payload = self._read_set(site)
            except (OSError, ValueError):
                return self._error(500, "the stored annotation set is unreadable")
            payload["annotations"] = [
                stored
                for stored in payload["annotations"]
                if not (isinstance(stored, dict) and stored.get("id") == annotation_id)
            ]
            payload["version"] = 1
            self._write_set(site, payload)
        # An id the server does not hold is a state the caller asked for and
        # the server is already in.
        return self._json(200, {"ok": True})

    # -------------------------------------------------------------- screenshots
    def _store_screenshot(self, site, annotation_id):
        ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        if ctype != "image/png":
            return self._error(415, "the body must be a PNG, as image/png")
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return self._error(400, "the content length is not a number")
        if length <= 0:
            return self._error(400, "the body is empty")
        if length > MAX_SCREENSHOT_BYTES:
            return self._error(413, "the screenshot is larger than this server stores")
        body = self.rfile.read(length)
        if not body.startswith(PNG_MAGIC):
            return self._error(400, "the body is not a PNG")

        name = self._screenshot_name(site, annotation_id)
        with self.lock:
            screenshot_file = self._screenshot_file(name)
            screenshot_file.parent.mkdir(parents=True, exist_ok=True)
            tmp = screenshot_file.with_suffix(".png.tmp")
            tmp.write_bytes(body)
            tmp.replace(screenshot_file)
        # The address is relative to the api base, because the server can be a
        # different origin from the page under review.
        return self._json(201, {"url": f"screenshots/{name}"})

    # The widget shows a screenshot in an <img>, which sends no header, so this
    # route asks for no api key: a screenshot is as readable as its page.
    def _serve_screenshot(self, name):
        if not SCREENSHOT_NAME_PATTERN.match(name):
            return self._error(404, "no screenshot answers that name")
        screenshot_file = self._screenshot_file(name)
        if not screenshot_file.is_file():
            return self._error(404, "no screenshot answers that name")
        self._send(200, screenshot_file.read_bytes(), "image/png")

    # ----------------------------------------------------------------- files
    def _serve_static(self, path):
        root = self.root.resolve()
        candidate = (root / path.lstrip("/")).resolve()
        if candidate.is_dir():
            candidate = candidate / "index.html"
        if not candidate.is_relative_to(root):
            return self._error(403, "that path is outside the root")
        # The notes are what the api key guards; a static route must not hand
        # them out beside it.
        if candidate.is_relative_to(self.data.resolve()):
            return self._error(403, "that path is inside the data directory")
        if not candidate.is_file():
            return self._error(404, "no file answers that path")
        ctype = mimetypes.guess_type(candidate.name)[0] or "application/octet-stream"
        self._send(200, candidate.read_bytes(), ctype)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--port", type=int, default=8123)
    parser.add_argument("--bind", default="127.0.0.1")
    parser.add_argument("--root", type=Path, default=Path("."), help="static docroot")
    parser.add_argument("--data", type=Path, default=Path("./uxnote-data"), help="storage directory")
    parser.add_argument("--prefix", default="", help="path the API answers under")
    parser.add_argument("--api-key", default="", help="the key the widget must send")
    args = parser.parse_args()

    UxnoteHandler.root = args.root
    UxnoteHandler.data = args.data
    UxnoteHandler.prefix = args.prefix.rstrip("/")
    UxnoteHandler.api_key = args.api_key or None

    server = ThreadingHTTPServer((args.bind, args.port), UxnoteHandler)
    print(f"UxNote reference server on http://{args.bind}:{args.port}")
    print(f"  static root : {args.root.resolve()}")
    print(f"  data        : {args.data.resolve()}")
    print(f"  api base    : {UxnoteHandler.prefix}/")
    print(f"  api key     : {'set' if UxnoteHandler.api_key else 'none'}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
