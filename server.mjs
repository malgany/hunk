import { createReadStream } from "node:fs";
import { stat, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const preferredPort = Number(process.env.PORT || 5173);
const host = "127.0.0.1";
const mapSize = 16;
const maxJsonBodySize = 64 * 1024;
const mapConfigPath = path.join(root, "src", "map-config.js");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".glb", "model/gltf-binary"],
  [".gltf", "model/gltf+json"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

function createServer(port) {
  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);

      if (request.method === "POST" && requestUrl.pathname === "/api/map-config") {
        await saveMapConfig(request, response);
        return;
      }

      if (request.method !== "GET") {
        send(response, 405, "Method not allowed");
        return;
      }

      const route = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
      const relativePath = decodeURIComponent(route).replace(/^\/+/, "");
      const filePath = path.resolve(root, relativePath);

      if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        send(response, 403, "Forbidden");
        return;
      }

      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) {
        send(response, 404, "Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      send(response, 404, "Not found");
    }
  });
}

async function saveMapConfig(request, response) {
  try {
    const body = await readJsonBody(request);
    const config = normalizeMapConfig(body);
    await writeFile(mapConfigPath, serializeMapConfig(config), "utf8");
    sendJson(response, 200, { ok: true, config });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    send(response, statusCode, error.message || "Failed to save map");
  }
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk.toString("utf8");
    if (body.length > maxJsonBodySize) {
      throw httpError(413, "Request body too large");
    }
  }

  try {
    return JSON.parse(body || "{}");
  } catch {
    throw httpError(400, "Invalid JSON");
  }
}

function normalizeMapConfig(body) {
  if (!Array.isArray(body?.tiles)) {
    throw httpError(400, "tiles must be an array");
  }

  const uniqueTiles = new Map();
  for (const tile of body.tiles) {
    const source = Array.isArray(tile) ? { x: tile[0], z: tile[1] } : tile;
    const x = Number(source?.x);
    const z = Number(source?.z);

    if (!Number.isInteger(x) || !Number.isInteger(z) || x < 0 || z < 0 || x >= mapSize || z >= mapSize) {
      throw httpError(400, "tiles contains an invalid coordinate");
    }

    uniqueTiles.set(`${x},${z}`, [x, z]);
  }

  const tiles = [...uniqueTiles.values()].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  if (tiles.length === 0) {
    throw httpError(400, "tiles cannot be empty");
  }

  return {
    tiles,
    playerPosition: normalizeMapPlayerPosition(body.playerPosition, tiles),
    showTileEdges: false,
    isCovered: true,
  };
}

function normalizeMapPlayerPosition(position, tiles) {
  const x = Number(position?.x);
  const z = Number(position?.z);
  const tileKeys = new Set(tiles.map(([tileX, tileZ]) => `${tileX},${tileZ}`));

  if (Number.isFinite(x) && Number.isFinite(z)) {
    const clamped = {
      x: clamp(x, 0, mapSize),
      z: clamp(z, 0, mapSize),
    };

    if (isMapPointInsideTiles(clamped, tileKeys)) {
      return {
        x: roundMapCoordinate(clamped.x),
        z: roundMapCoordinate(clamped.z),
      };
    }
  }

  const [firstTile] = tiles;
  return {
    x: firstTile[0] + 0.5,
    z: firstTile[1] + 0.5,
  };
}

function isMapPointInsideTiles(position, tileKeys) {
  for (const x of candidateMapIndices(position.x)) {
    for (const z of candidateMapIndices(position.z)) {
      if (tileKeys.has(`${x},${z}`)) {
        return true;
      }
    }
  }

  return false;
}

function candidateMapIndices(value) {
  const clamped = clamp(value, 0, mapSize);
  const base = Math.floor(Math.min(clamped, mapSize - 0.0001));
  const candidates = new Set([base]);
  const rounded = Math.round(clamped);
  if (Math.abs(clamped - rounded) < 0.0001) {
    candidates.add(rounded);
    candidates.add(rounded - 1);
  }

  return [...candidates].filter((index) => index >= 0 && index < mapSize);
}

function serializeMapConfig(config) {
  const tileLines = config.tiles.map(([x, z]) => `    [${x}, ${z}],`);

  return [
    "export const defaultMapConfig = {",
    "  tiles: [",
    ...tileLines,
    "  ],",
    "  playerPosition: {",
    `    x: ${formatNumber(config.playerPosition.x)},`,
    `    z: ${formatNumber(config.playerPosition.z)},`,
    "  },",
    "  showTileEdges: false,",
    "  isCovered: true,",
    "};",
    "",
  ].join("\n");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundMapCoordinate(value) {
  return Number(Number(value).toFixed(3));
}

function formatNumber(value) {
  return String(roundMapCoordinate(value)).replace(/\.0+$/u, "");
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

listen(preferredPort);

function listen(port) {
  const server = createServer(port);

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < preferredPort + 20) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, host, () => {
    console.log(`Viewer running at http://${host}:${port}`);
  });
}

function send(response, statusCode, message) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
