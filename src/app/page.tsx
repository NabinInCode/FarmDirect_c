import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Fresh harvest",
    description: "Seasonal produce picked at peak quality and delivered with care.",
    image: "/fresh harvest.png",
  },
  {
    title: "Farmer direct",
    description: "Support local growers and enjoy transparent sourcing from farm to table.",
    image: "/farm direct.png",
  },
  {
    title: "Healthy living",
    description: "Nutritious groceries designed for everyday wellness and better meals.",
    image: "/healthy living.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-softer text-ink">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
              Fresh from local farms
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Good food starts at the source.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-muted">
              Discover naturally grown fruits, vegetables, and pantry essentials delivered
              straight from trusted farmers to your home.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-primary-solid px-6 py-3 text-base font-medium text-white transition hover:bg-primary-solid-light"
              >
                Shop now
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-primary px-6 py-3 text-base font-medium text-primary transition hover:bg-primary-softer"
              >
                Learn more
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-muted">
              <div>
                <p className="text-2xl font-bold text-ink">1200+</p>
                <p>Happy customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">45+</p>
                <p>Local partners</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">100%</p>
                <p>Fresh guarantee</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-primary-softer via-cream to-primary-soft p-6 shadow-xl shadow-black/20">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-amber-500 p-5 text-white shadow-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Today&apos;s pick</p>
                <h2 className="mt-4 text-3xl font-bold">Organic</h2>
                <p className="mt-2 text-lg font-medium">Farm box</p>
              </div>

              <div className="rounded-2xl bg-primary-solid p-5 text-white shadow-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Best seller
                </p>
                <h2 className="mt-4 text-3xl font-bold">Fresh</h2>
                <p className="mt-2 text-lg font-medium text-emerald-100">Vegetables</p>
              </div>

              <div className="rounded-2xl bg-surface p-5 shadow-md md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-2">
                  Harvest basket
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-ink">Seasonal mix</h3>
                    <p className="mt-1 text-muted">Fruit, greens, roots & herbs</p>
                  </div>
                  <div className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                    20% off
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Why choose us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink">Rooted in quality, made for everyday life.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <div className="relative h-48">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-ink">{feature.title}</h3>
                <p className="mt-3 text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
