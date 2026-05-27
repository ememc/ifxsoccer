## IFX Soccer

Static Next.js site exported with `output: "export"` and deployed from the generated `out/` directory.

## Development

Run the local server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Instagram Static Sync

The Instagram section is generated at build time so it works with static export.

Setup:

1. Copy `.env.example` to `.env.local`.
2. Fill in `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID`.
3. Optionally adjust `INSTAGRAM_GRAPH_VERSION` and `INSTAGRAM_FEED_LIMIT`.
4. Run `npm run sync:instagram`.
5. Run `npm run build`.

Commands:

```bash
npm run sync:content
npm run sync:instagram
npm run build
npm run deploy
```

`npm run sync:content` refreshes the local `programs` and `categories` JSON snapshots used as a fallback during static export when the remote API is unavailable at build time.

What the sync does:

- Fetches the latest Instagram posts before build time.
- Writes feed data to `app/data/instagram-feed.json`.
- Downloads image assets to `public/assets/img/instagram-feed/`.
- Falls back to the existing local Instagram images if credentials are missing or the API request fails.
