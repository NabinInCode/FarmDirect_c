import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "FarmDirect connects you directly with local farmers. Fresh produce, transparent sourcing, and farm-to-home delivery.",
};

const values = [
  {
    title: "Farmer direct",
    description:
      "We skip the middlemen. Every purchase goes straight to the grower who produced it, so farmers earn what they deserve.",
  },
  {
    title: "Fresh harvest",
    description:
      "Produce is picked at peak ripeness and delivered within 24 hours — never stored for weeks in cold warehouses.",
  },
  {
    title: "Healthy living",
    description:
      "Chemical-free, naturally grown fruits, vegetables, dairy and pantry essentials for everyday wellness.",
  },
  {
    title: "Farming the future",
    description:
      "Fair prices, transparent sourcing and community support help small farms thrive for generations to come.",
  },
];

const steps = [
  {
    title: "Grown on the farm",
    description: "Our partner farmers grow every product with care, using sustainable practices.",
  },
  {
    title: "Harvested fresh",
    description: "The harvest is picked at peak quality — often the very same morning it ships.",
  },
  {
    title: "Packed & delivered",
    description: "We pack the produce gently and get it to your door within 24 hours.",
  },
  {
    title: "Enjoyed at home",
    description: "From our farm to your table — fresh, honest and full of flavour.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">Our story</p>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl lg:text-5xl">
            Good food starts at the source.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            FarmDirect began with a simple belief: the people who grow your food deserve a fair
            share, and you deserve to know exactly where it comes from. We connect local farmers
            directly with the families eating their harvest.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-md bg-primary-solid px-6 py-3 text-base font-medium text-white transition hover:bg-primary-solid-light"
            >
              Shop the harvest
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-primary px-6 py-3 text-base font-medium text-primary transition hover:bg-primary-softer"
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-primary-softer via-cream to-primary-soft p-8 shadow-xl shadow-black/20">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-solid p-6 text-white shadow-md">
              <p className="text-3xl font-bold">1200+</p>
              <p className="mt-1 text-sm text-emerald-100">Happy customers</p>
            </div>
            <div className="rounded-2xl bg-amber-500 p-6 text-white shadow-md">
              <p className="text-3xl font-bold">45+</p>
              <p className="mt-1 text-sm text-amber-50">Local partner farms</p>
            </div>
            <div className="rounded-2xl bg-surface p-6 shadow-md">
              <p className="text-3xl font-bold text-ink">24h</p>
              <p className="mt-1 text-sm text-muted-2">Farm to doorstep</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">What we stand for</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">Rooted in quality, made for everyday life.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-ink">{value.title}</h3>
              <p className="mt-3 text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">From our farm to your table.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[2rem] bg-primary-solid px-8 py-12 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready to eat closer to the source?</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Browse the freshest local harvest, order in a few taps, and have it at your door tomorrow.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-md bg-amber-500 px-6 py-3 text-base font-medium text-white transition hover:bg-amber-600"
        >
          Shop now
        </Link>
      </section>
    </main>
  );
}