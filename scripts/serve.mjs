import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT || 4173);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function sendFile(file, status, response) {
  const type = types[extname(file).toLowerCase()] || "application/octet-stream";
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  createReadStream(file).pipe(response);
}

const server = createServer((request, response) => {
  if (!existsSync(root)) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("No static build found. Run `npm run build` first.");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  const target = normalize(join(root, pathname));
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  if (existsSync(target) && statSync(target).isFile()) {
    sendFile(target, 200, response);
    return;
  }

  if (existsSync(target) && statSync(target).isDirectory()) {
    if (!pathname.endsWith("/")) {
      response.writeHead(301, { Location: `${pathname}/${request.url?.includes("?") ? request.url.slice(request.url.indexOf("?")) : ""}` });
      response.end();
      return;
    }
    const index = join(target, "index.html");
    if (existsSync(index)) {
      sendFile(index, 200, response);
      return;
    }
  }

  const notFound = join(root, "404.html");
  if (existsSync(notFound)) {
    sendFile(notFound, 404, response);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, () => {
  console.log(`AlgoAtlas preview: http://localhost:${port}`);
});
