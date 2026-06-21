import { createFileRoute, notFound } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";

export const Route = createFileRoute("/api/og/q/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const quote = QUOTES.find((q) => q.id === params.id);
        if (!quote) throw notFound();

        // Tier the body type size by length so long passages still fit.
        const len = quote.text.length;
        const bodySize = len <= 140 ? 64 : len <= 260 ? 52 : len <= 400 ? 42 : 34;

        const html = `
          <div style="
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            background: #FAF8F4;
            padding: 72px 88px;
            font-family: 'Inter';
            color: #1A1A1A;
            position: relative;
          ">
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 18px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #6B6B6B;
            ">
              <span>The Stoic Reference</span>
              <span style="display:flex;align-items:center;gap:10px;">
                <span style="width:8px;height:8px;background:#1E40AF;border-radius:9999px;"></span>
                askthestoics.org
              </span>
            </div>

            <div style="
              display: flex;
              flex-direction: column;
              flex: 1;
              justify-content: center;
              margin-top: 28px;
            ">
              <div style="
                font-family: 'Cormorant';
                font-style: italic;
                font-size: 140px;
                line-height: 0.7;
                color: #1E40AF;
                margin-bottom: 4px;
              ">&ldquo;</div>
              <div style="
                font-family: 'Cormorant';
                font-size: ${bodySize}px;
                line-height: 1.18;
                color: #1A1A1A;
                max-width: 980px;
                display: flex;
              ">${escapeHtml(quote.text)}</div>
            </div>

            <div style="
              display: flex;
              flex-direction: column;
              gap: 6px;
              border-top: 1px solid rgba(0,0,0,0.12);
              padding-top: 22px;
            ">
              <div style="font-size: 26px; font-weight: 600;">${escapeHtml(quote.author)}</div>
              <div style="font-size: 18px; color: #6B6B6B; display:flex; gap:10px;">
                <span style="font-style: italic;">${escapeHtml(quote.work)}</span>
                <span>·</span>
                <span style="letter-spacing: 0.08em;">${escapeHtml(quote.section)}</span>
                ${quote.translator ? `<span>·</span><span>trans. ${escapeHtml(quote.translator)}</span>` : ""}
              </div>
            </div>
          </div>
        `;

        try {
          const { ImageResponse } = await import("workers-og");
          return new ImageResponse(html, {
            width: 1200,
            height: 630,
            fonts: await loadFonts(),
            headers: {
              "Cache-Control":
                "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
            },
          });
        } catch (err) {
          console.error("og render failed", err);
          return Response.redirect(
            "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/479b7464-bd65-4a2b-b212-fb4d19586c84",
            302,
          );
        }
      },
    },
  },
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight?: 400 | 500 | 600 | 700;
  style?: "normal" | "italic";
};

let cachedFonts: FontEntry[] | null = null;

async function loadFonts(): Promise<FontEntry[]> {
  if (cachedFonts) return cachedFonts;
  const [inter400, inter600, cormorant, cormorantItalic] = await Promise.all([
    fetchFont(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
    ),
    fetchFont(
      "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap",
    ),
    fetchFont(
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&display=swap",
    ),
    fetchFont(
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&display=swap",
    ),
  ]);

  cachedFonts = [
    { name: "Inter", data: inter400, weight: 400, style: "normal" },
    { name: "Inter", data: inter600, weight: 600, style: "normal" },
    { name: "Cormorant", data: cormorant, weight: 500, style: "normal" },
    { name: "Cormorant", data: cormorantItalic, weight: 500, style: "italic" },
  ];
  return cachedFonts;
}

async function fetchFont(cssUrl: string): Promise<ArrayBuffer> {
  // Google Fonts CSS endpoint requires a real-browser UA to serve woff2 URLs.
  const cssRes = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    },
  });
  const css = await cssRes.text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]?(?:woff2|truetype)['"]?\)/);
  if (!match) throw new Error(`Could not parse font CSS from ${cssUrl}`);
  const fontRes = await fetch(match[1]);
  return await fontRes.arrayBuffer();
}