import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">404 error</p>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s
        get you back to fresh produce.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary-solid px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-solid-light"
        >
          Go to homepage
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-line-strong bg-surface px-6 py-3 text-sm font-semibold text-ink-muted transition hover:border-primary-bright hover:text-primary-bright"
        >
          Browse products
        </Link>
      </div>
    </main>
  );
}