import { createFileRoute, notFound } from "@tanstack/react-router";
import { QUOTES } from "@/data/quotes";
import { createElement as h, type ReactNode } from "react";

export const Route = createFileRoute("/api/public/og/q/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { ImageResponse } = await import("workers-og");
        const quote = QUOTES.find((q) => q.id === params.id);
        if (!quote) throw notFound();

        const len = quote.text.length;
        const bodySize = len <= 140 ? 64 : len <= 260 ? 52 : len <= 400 ? 42 : 34;

        const card: ReactNode = h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              background: "#FAF8F4",
              padding: "72px 88px",
              fontFamily: "Inter",
              color: "#1A1A1A",
            },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 18,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#6B6B6B",
              },
            },
            h("span", null, "The Stoic Reference"),
            h(
              "span",
              { style: { display: "flex", alignItems: "center", gap: 10 } },
              h("span", {
                style: {
                  width: 8,
                  height: 8,
                  background: "#1E40AF",
                  borderRadius: 9999,
                },
              }),
              "askthestoics.org",
            ),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
                marginTop: 28,
              },
            },
            h(
              "div",
              {
                style: {
                  fontFamily: "Cormorant",
                  fontStyle: "italic",
                  fontSize: 140,
                  lineHeight: 0.7,
                  color: "#1E40AF",
                  marginBottom: 4,
                },
              },
              "\u201C",
            ),
            h(
              "div",
              {
                style: {
                  fontFamily: "Cormorant",
                  fontSize: bodySize,
                  lineHeight: 1.18,
                  color: "#1A1A1A",
                  maxWidth: 980,
                  display: "flex",
                },
              },
              quote.text,
            ),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid rgba(0,0,0,0.12)",
                paddingTop: 22,
              },
            },
            h(
              "div",
              { style: { fontSize: 26, fontWeight: 600, display: "flex" } },
              quote.author,
            ),
            h(
              "div",
              {
                style: {
                  fontSize: 18,
                  color: "#6B6B6B",
                  display: "flex",
                  gap: 10,
                  marginTop: 6,
                },
              },
              h("span", { style: { fontStyle: "italic" } }, quote.work),
              h("span", null, "\u00B7"),
              h(
                "span",
                { style: { letterSpacing: "0.08em" } },
                quote.section,
              ),
              quote.translator
                ? h(
                    "span",
                    { style: { display: "flex", gap: 10 } },
                    h("span", null, "\u00B7"),
                    h("span", null, `trans. ${quote.translator}`),
                  )
                : null,
            ),
          ),
        );

        try {
          const fonts = await loadFonts(request);
          return new ImageResponse(card, {
            width: 1200,
            height: 630,
            fonts,
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

type FontEntry = {
  name: string;
  data: ArrayBuffer;
  weight?: 400 | 500 | 600 | 700;
  style?: "normal" | "italic";
};

let cachedFonts: FontEntry[] | null = null;

async function loadFonts(request: Request): Promise<FontEntry[]> {
  if (cachedFonts) return cachedFonts;
  const origin = new URL(request.url).origin;
  const fetchFont = (path: string) =>
    fetch(`${origin}${path}`).then((r) => {
      if (!r.ok) throw new Error(`font fetch failed: ${path} ${r.status}`);
      return r.arrayBuffer();
    });

  const [inter400, inter600, cormorant, cormorantItalic] = await Promise.all([
    fetchFont("/fonts/Inter-Regular.woff"),
    fetchFont("/fonts/Inter-SemiBold.woff"),
    fetchFont("/fonts/CormorantGaramond-Medium.woff"),
    fetchFont("/fonts/CormorantGaramond-MediumItalic.woff"),
  ]);

  cachedFonts = [
    { name: "Inter", data: inter400, weight: 400, style: "normal" },
    { name: "Inter", data: inter600, weight: 600, style: "normal" },
    { name: "Cormorant", data: cormorant, weight: 500, style: "normal" },
    { name: "Cormorant", data: cormorantItalic, weight: 500, style: "italic" },
  ];
  return cachedFonts;
}