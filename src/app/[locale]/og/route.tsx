import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && ["ko", "en", "uz"].includes(seg) ? seg : "en";
}

function defaultSubtitle(locale: string) {
  if (locale === "ko") return "TypeScript + Next.js 다국어 블로그";
  if (locale === "uz") return "TypeScript + Next.js ko‘p tilli blog";
  return "TypeScript + Next.js multi-language blog";
}

export async function GET(req: NextRequest) {
  const { searchParams, pathname } = req.nextUrl;
  const locale = getLocaleFromPath(pathname);

  const title = searchParams.get("title")?.trim() || "Multi-Lang Blog";
  const subtitle = searchParams.get("subtitle")?.trim() || defaultSubtitle(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0b1220 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, opacity: 0.9 }}>
          <span style={{ fontSize: 26 }}>🌐</span>
          <span>Multi-Lang Blog</span>
          <span style={{ marginLeft: 10, fontSize: 16, opacity: 0.7 }}>
            {locale.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, opacity: 0.85, lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.75 }}>
          <span>multi-lang blog</span>
          <span>next.js • typescript</span>
        </div>
      </div>
    ),
    size
  );
}
