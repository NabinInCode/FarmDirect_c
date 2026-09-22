import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FarmDirect. Questions about orders, products or partnerships — we'd love to hear from you.",
};

const contactInfo = [
  {
    title: "Email",
    value: "hello@farmdirect.in",
    href: "mailto:hello@farmdirect.in",
  },
  {
    title: "Phone",
    value: "067-545672",
    href: "tel:067-545672",
  },
  {
    title: "Office",
    value: "FarmDirect HQ, Pune, Maharashtra",
    href: undefined,
  },
  {
    title: "Hours",
    value: "Mon – Sat, 8:00 AM – 6:00 PM",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">Get in touch</p>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">We&apos;d love to hear from you.</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Questions about an order, a product, farming with us or anything else — drop us a line and
          our team will get back to you within one business day.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-ink">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-2">We usually reply within a day.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-4">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">
                {info.title}
              </p>
              {info.href ? (
                <a
                  href={info.href}
                  className="mt-2 block font-semibold text-ink transition hover:text-primary-bright"
                >
                  {info.value}
                </a>
              ) : (
                <p className="mt-2 font-semibold text-ink">{info.value}</p>
              )}
            </div>
          ))}

          <div className="rounded-2xl bg-primary-solid p-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
              Prefer to order?
            </p>
            <p className="mt-2 text-sm text-white/80">
              Skip the message and browse the freshest local harvest right now.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
            >
              Shop products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}