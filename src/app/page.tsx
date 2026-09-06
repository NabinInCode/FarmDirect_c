import Link from "next/link";

const features = [
  {
    title: "Fresh harvest",
    description: "Seasonal produce picked at peak quality and delivered with care.",
  },
  {
    title: "Farmer direct",
    description: "Support local growers and enjoy transparent sourcing from farm to table.",
  },
  {
    title: "Healthy living",
    description: "Nutritious groceries designed for everyday wellness and better meals.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7F4] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-[#D9F0E1] px-4 py-2 text-sm font-semibold text-[#1B4332]">
              Fresh from local farms
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Good food starts at the source.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Discover naturally grown fruits, vegetables, and pantry essentials delivered
              straight from trusted farmers to your home.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-[#1B4332] px-6 py-3 text-base font-medium text-white transition hover:bg-[#2C6B4A]"
              >
                Shop now
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-[#1B4332] px-6 py-3 text-base font-medium text-[#1B4332] transition hover:bg-[#EAF6EE]"
              >
                Learn more
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-600">
              <div>
                <p className="text-2xl font-bold text-slate-900">1200+</p>
                <p>Happy customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">45+</p>
                <p>Local partners</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p>Fresh guarantee</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-[#EAF6EE] via-[#F9F7F0] to-[#D9F0E1] p-6 shadow-xl shadow-slate-200/60">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-amber-500 p-5 text-white shadow-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Today&apos;s pick</p>
                <h2 className="mt-4 text-3xl font-bold">Organic</h2>
                <p className="mt-2 text-lg font-medium">Farm box</p>
              </div>

              <div className="rounded-2xl bg-[#1B4332] p-5 text-white shadow-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Best seller
                </p>
                <h2 className="mt-4 text-3xl font-bold">Fresh</h2>
                <p className="mt-2 text-lg font-medium text-emerald-100">Vegetables</p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-md md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Harvest basket
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Seasonal mix</h3>
                    <p className="mt-1 text-slate-600">Fruit, greens, roots & herbs</p>
                  </div>
                  <div className="rounded-full bg-[#D9F0E1] px-3 py-1 text-sm font-semibold text-[#1B4332]">
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1B4332]">
            Why choose us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Rooted in quality, made for everyday life.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-xl bg-[#D9F0E1]" />
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
