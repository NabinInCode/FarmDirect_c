import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">404 error</p>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-gray-900">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-relaxed text-gray-600">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s
        get you back to fresh produce.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
        >
          Go to homepage
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
        >
          Browse products
        </Link>
      </div>
    </main>
  );
}