import { useState } from "react";
import { Link as LinkIcon, Twitter, Linkedin, Facebook, Copy, Check, Share2 } from "lucide-react";

type Props = {
  text: string;
  author: string;
  source: string;
  /** Permalink path on this site, e.g. /q/ma-4-7. Optional for non-canonical passages. */
  permalinkPath?: string;
  /** Optional interpretation to include in copy/share payload. */
  interpretation?: string;
};

function buildShareText(p: Props, includeReading = false) {
  const head = `"${p.text}"\n— ${p.author}, ${p.source}`;
  if (includeReading && p.interpretation) {
    return `${head}\n\nModern reading: ${p.interpretation}`;
  }
  return head;
}

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function ShareQuote(props: Props) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const url = props.permalinkPath ? `${getOrigin()}${props.permalinkPath}` : getOrigin();
  const shareText = buildShareText(props);

  async function copy(value: string, kind: "link" | "text") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied((c) => (c === kind ? null : c)), 1600);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: `${props.author} — ${props.source}`,
          text: shareText,
          url: props.permalinkPath ? url : undefined,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copy(`${shareText}${props.permalinkPath ? `\n${url}` : ""}`, "text");
    }
  }

  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}${
    props.permalinkPath ? `&url=${encodeURIComponent(url)}` : ""
  }`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    props.permalinkPath ? url : `${url}/`,
  )}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    props.permalinkPath ? url : `${url}/`,
  )}&quote=${encodeURIComponent(shareText)}`;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-1.5">
      <span className="small-caps text-[11px] text-muted-foreground mr-2">Share</span>

      <button
        type="button"
        onClick={nativeShare}
        className="md:hidden inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
        aria-label="Share"
      >
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>

      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
        aria-label="Share on X"
      >
        <Twitter className="h-3.5 w-3.5" /> X
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
      </a>
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-3.5 w-3.5" /> Facebook
      </a>
      <button
        type="button"
        onClick={() => copy(buildShareText(props, true), "text")}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
      >
        {copied === "text" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied === "text" ? "Copied" : "Copy quote"}
      </button>
      {props.permalinkPath ? (
        <button
          type="button"
          onClick={() => copy(url, "link")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-secondary transition"
        >
          {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
          {copied === "link" ? "Copied" : "Copy link"}
        </button>
      ) : null}
    </div>
  );
}