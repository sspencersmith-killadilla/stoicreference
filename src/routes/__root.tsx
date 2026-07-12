import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Stoic Reference" },
      {
        name: "description",
        content:
          "A working reference of Stoicism. Ask a question, get sourced quotes from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus — with modern interpretations.",
      },
      { name: "author", content: "The Stoic Reference" },
      { property: "og:title", content: "The Stoic Reference" },
      {
        property: "og:description",
        content:
          "A working reference of Stoicism. Ask a question, get sourced quotes from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus — with modern interpretations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Stoic Reference" },
      {
        name: "twitter:description",
        content:
          "A working reference of Stoicism. Ask a question, get sourced quotes from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus — with modern interpretations.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/479b7464-bd65-4a2b-b212-fb4d19586c84",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/479b7464-bd65-4a2b-b212-fb4d19586c84",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "The Stoic Reference",
          alternateName: "Ask the Stoics",
          url: "https://askthestoics.org",
          description:
            "A working reference of Stoicism. Ask a question, get sourced quotes from Marcus Aurelius, Seneca, Epictetus, and Musonius Rufus — with modern interpretations.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://askthestoics.org/ask?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Stoic Reference",
          url: "https://askthestoics.org",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-6 flex items-end justify-between gap-6">
        <Link to="/" className="group block">
          <p className="small-caps text-[10px] text-foreground/60 mb-1">
            A working reference of Stoicism
          </p>
          <span className="font-display italic text-xl md:text-2xl text-ink leading-none">
            The Stoic Reference
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 small-caps text-[10px]">
          <Link
            to="/philosophers"
            className="text-foreground/60 hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            Philosophers
          </Link>
          <Link
            to="/themes"
            className="text-foreground/60 hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            Themes
          </Link>
          <Link
            to="/wordsearch"
            className="text-foreground/60 hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            Word Search
          </Link>
          <Link
            to="/history"
            className="text-foreground/60 hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            History
          </Link>
          <Link
            to="/about"
            className="text-foreground/60 hover:text-ink transition-colors"
            activeProps={{ className: "text-ink" }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 text-[11px] text-foreground/60 flex flex-col gap-4">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 small-caps text-[10px]">
          <Link
            to="/what-is-stoicism"
            className="text-foreground/70 hover:text-ink transition-colors"
          >
            What is Stoicism?
          </Link>
          <Link to="/stoic-quotes" className="text-foreground/70 hover:text-ink transition-colors">
            Stoic Quotes
          </Link>
          <Link to="/philosophers" className="text-foreground/70 hover:text-ink transition-colors">
            Philosophers
          </Link>
          <Link to="/themes" className="text-foreground/70 hover:text-ink transition-colors">
            Themes
          </Link>
          <Link to="/history" className="text-foreground/70 hover:text-ink transition-colors">
            History
          </Link>
          <Link to="/ask" className="text-foreground/70 hover:text-ink transition-colors">
            Ask
          </Link>
          <Link to="/wordsearch" className="text-foreground/70 hover:text-ink transition-colors">
            Word Search
          </Link>
          <Link to="/about" className="text-foreground/70 hover:text-ink transition-colors">
            About
          </Link>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="small-caps text-foreground/80">The Stoic Reference — Ref. 4.01</span>
          <span className="font-sans">
            Sourced from public-domain translations · Interpretations are AI-assisted; verify before
            quoting.
          </span>
        </div>
      </div>
    </footer>
  );
}
