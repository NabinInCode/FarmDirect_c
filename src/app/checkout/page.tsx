import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import ProductVisual from "@/app/components/products/ProductVisual";
import PlaceOrder from "./PlaceOrder";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const cart = await getCart(user.id);

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto min-h-[70vh] w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
          <p className="mt-2 text-sm text-gray-500">Add some fresh produce before checking out.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
          >
            Shop products
          </Link>
        </div>
      </main>
    );
  }

  const freeDelivery = cart.subtotal >= 49900;
  const total = cart.subtotal + (freeDelivery ? 0 : 4000);

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Almost there</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      <form id="checkout-form" className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Contact & delivery</h2>
            <div className="mt-4 space-y-1 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Name</p>
                <p className="mt-0.5 font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</p>
                <p className="mt-0.5 font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Delivery details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={user.phone ?? ""}
                  required
                  placeholder="e.g. 98765 43210"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Delivery address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  defaultValue={user.address ?? ""}
                  required
                  placeholder="Street address, city, pincode"
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#2D6A4F] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 resize-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Payment</h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition has-[:checked]:border-[#2D6A4F]/50 has-[:checked]:bg-[#EAF6EE]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  defaultChecked
                  aria-label="Cash on delivery"
                  className="mt-0.5 h-4 w-4 accent-[#1B4332]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Cash on delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives at your door.</p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition has-[:checked]:border-[#2D6A4F]/50 has-[:checked]:bg-[#EAF6EE]">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  aria-label="Pay with eSewa"
                  className="mt-0.5 h-4 w-4 accent-[#1B4332]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">eSewa</p>
                  <p className="text-xs text-gray-500">
                    Pay now with your eSewa wallet. You&apos;ll be redirected to complete the payment.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-max rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
          <ul className="mt-4 space-y-4">
            {cart.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="w-14 shrink-0 overflow-hidden rounded-lg">
                  <ProductVisual
                    name={item.product.name}
                    category={item.product.categoryName}
                    image={item.product.image}
                  />
                </div>
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.product.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium text-gray-900">{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery</dt>
              <dd className={`font-medium ${freeDelivery ? "text-[#2D6A4F]" : "text-gray-900"}`}>
                {freeDelivery ? "Free" : formatPrice(4000)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <p className="font-semibold text-gray-900">Total</p>
            <p className="text-lg font-bold text-[#1B4332]">{formatPrice(total)}</p>
          </div>

          <div className="mt-6">
            <PlaceOrder />
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            By placing this order you agree to our delivery terms.
          </p>
        </aside>
      </form>
    </main>
  );
}