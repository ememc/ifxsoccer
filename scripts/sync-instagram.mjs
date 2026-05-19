import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const feedOutputPath = path.join(projectRoot, "app", "data", "instagram-feed.json");
const imageOutputDir = path.join(projectRoot, "public", "assets", "img", "instagram-feed");
const instagramUrl = "https://www.instagram.com/ifx.soccer.agency/";

const fallbackFeed = {
  updatedAt: null,
  source: "fallback",
  items: Array.from({ length: 6 }, (_, index) => {
    const imageNumber = index + 1;

    return {
      id: `fallback-${imageNumber}`,
      alt: `IFX Soccer Instagram post ${imageNumber}`,
      imageUrl: `/assets/img/insta-${imageNumber}.jpg`,
      permalink: instagramUrl,
      caption: "",
      timestamp: null,
    };
  }),
};

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;
const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION || "v23.0";
const limit = Number.parseInt(process.env.INSTAGRAM_FEED_LIMIT || "6", 10);

const buildFeedEndpoint = () =>
  `https://graph.facebook.com/${graphVersion}/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`;

const getFileExtension = (contentType, sourceUrl) => {
  if (contentType?.includes("png")) {
    return ".png";
  }

  if (contentType?.includes("webp")) {
    return ".webp";
  }

  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
    return ".jpg";
  }

  try {
    const pathname = new URL(sourceUrl).pathname;
    const extension = path.extname(pathname);

    return extension || ".jpg";
  } catch {
    return ".jpg";
  }
};

const sanitizeCaption = (caption) => {
  if (!caption) {
    return "";
  }

  return caption.replace(/\s+/g, " ").trim();
};

const truncateCaption = (caption, maxLength = 120) => {
  if (caption.length <= maxLength) {
    return caption;
  }

  return `${caption.slice(0, maxLength - 1).trimEnd()}...`;
};

const downloadAsset = async (assetUrl, itemId) => {
  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Unable to download Instagram asset ${itemId}: ${response.status}`);
  }

  const extension = getFileExtension(response.headers.get("content-type"), assetUrl);
  const filename = `${itemId}${extension}`;
  const absolutePath = path.join(imageOutputDir, filename);
  const assetBuffer = Buffer.from(await response.arrayBuffer());

  await writeFile(absolutePath, assetBuffer);

  return `/assets/img/instagram-feed/${filename}`;
};

const writeFeed = async (feed) => {
  await mkdir(path.dirname(feedOutputPath), { recursive: true });
  await writeFile(feedOutputPath, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
};

const readExistingFeed = async () => {
  try {
    const raw = await readFile(feedOutputPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const syncInstagramFeed = async () => {
  await mkdir(imageOutputDir, { recursive: true });

  if (!accessToken || !userId) {
    await writeFeed(fallbackFeed);
    console.warn(
      "[instagram] Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID. Wrote fallback feed."
    );
    return;
  }

  const endpoint = buildFeedEndpoint();
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Instagram Graph API request failed with ${response.status}`);
  }

  const payload = await response.json();
  const mediaItems = Array.isArray(payload.data) ? payload.data : [];

  const items = [];

  for (const item of mediaItems) {
    const assetUrl = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;

    if (!assetUrl) {
      continue;
    }

    const normalizedCaption = sanitizeCaption(item.caption);
    const altText = truncateCaption(normalizedCaption) || "IFX Soccer Instagram post";
    const imageUrl = await downloadAsset(assetUrl, item.id);

    items.push({
      id: item.id,
      alt: altText,
      imageUrl,
      permalink: item.permalink || instagramUrl,
      caption: normalizedCaption,
      timestamp: item.timestamp || null,
    });
  }

  await writeFeed({
    updatedAt: new Date().toISOString(),
    source: "instagram-graph-api",
    items: items.length > 0 ? items : fallbackFeed.items,
  });

  console.log(`[instagram] Synced ${items.length} post(s).`);
};

try {
  await syncInstagramFeed();
} catch (error) {
  const existingFeed = await readExistingFeed();

  if (existingFeed) {
    console.warn("[instagram] Sync failed. Keeping existing generated feed.");
    console.warn(error);
    process.exit(0);
  }

  await writeFeed(fallbackFeed);
  console.warn("[instagram] Sync failed. Wrote fallback feed instead.");
  console.warn(error);
}
