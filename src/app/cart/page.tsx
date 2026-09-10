import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import CartList from "./CartList";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cart");

  const cart = await getCart(user.id);
  const freeDelivery = cart.subtotal >= 49900;
  const deliveryFee = freeDelivery ? 0 : 4000;
  const total = cart.subtotal + deliveryFee;

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">Your basket</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Shopping cart</h1>
        <p className="mt-2 text-gray-500">
          {cart.count} item{cart.count === 1 ? "" : "s"} in your cart
        </p>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
          <p className="mt-2 text-sm text-gray-500">Browse our fresh produce and add something you like.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
          >
            Shop products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <CartList items={cart.items} />

          <aside className="h-max rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
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
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <p className="font-semibold text-gray-900">Total</p>
                <p className="text-lg font-bold text-[#1B4332]">{formatPrice(total)}</p>
              </div>
              {!freeDelivery && (
                <p className="mt-1 text-xs text-gray-500">
                  Add {formatPrice(49900 - cart.subtotal)} more for free delivery.
                </p>
              )}
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-[#1B4332] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#2C6B4A]"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm font-medium text-[#2D6A4F] hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}