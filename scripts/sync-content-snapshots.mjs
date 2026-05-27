import https from "node:https";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BASE || "https://api.ifxsoccer.com";

const SNAPSHOT_TARGETS = [
  {
    endpoint: "/v1/category",
    collectionKeys: ["categories", "category", "items", "data", "results"],
    outputFile: path.join(process.cwd(), "app", "data", "categories.json"),
  },
  {
    endpoint: "/v1/programs/",
    collectionKeys: ["programs", "program", "items", "data", "results"],
    outputFile: path.join(process.cwd(), "app", "data", "programs.json"),
  },
];

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const parseCollection = (payload, collectionKeys) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (typeof payload.body === "string") {
    try {
      return parseCollection(JSON.parse(payload.body), collectionKeys);
    } catch {
      return [];
    }
  }

  if (payload.body) {
    return parseCollection(payload.body, collectionKeys);
  }

  for (const key of collectionKeys) {
    const collection = parseCollection(payload[key], collectionKeys);

    if (collection.length > 0) {
      return collection;
    }
  }

  return [];
};

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, { agent: httpsAgent }, (response) => {
        let body = "";

        response.on("data", (chunk) => {
          body += chunk;
        });

        response.on("end", () => {
          if ((response.statusCode ?? 500) >= 400) {
            reject(new Error(`Request failed for ${url}: ${response.statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });

for (const target of SNAPSHOT_TARGETS) {
  const payload = await fetchJson(`${API_BASE_URL}${target.endpoint}`);
  const collection = parseCollection(payload, target.collectionKeys);

  await writeFile(target.outputFile, `${JSON.stringify(collection, null, 2)}\n`, "utf8");
  console.log(`Snapshot written: ${target.outputFile} (${collection.length} items)`);
}
