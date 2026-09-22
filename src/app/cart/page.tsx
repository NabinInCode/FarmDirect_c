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
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-bright">Your basket</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Shopping cart</h1>
        <p className="mt-2 text-muted-2">
          {cart.count} item{cart.count === 1 ? "" : "s"} in your cart
        </p>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong py-20 text-center">
          <p className="text-lg font-medium text-ink-muted">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-2">Browse our fresh produce and add something you like.</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-primary-solid px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-solid-light"
          >
            Shop products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <CartList items={cart.items} />

          <aside className="h-max rounded-2xl border border-line bg-surface p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-2">Subtotal</dt>
                <dd className="font-medium text-ink">{formatPrice(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-2">Delivery</dt>
                <dd className={`font-medium ${freeDelivery ? "text-primary-bright" : "text-ink"}`}>
                  {freeDelivery ? "Free" : formatPrice(4000)}
                </dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex justify-between">
                <p className="font-semibold text-ink">Total</p>
                <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
              </div>
              {!freeDelivery && (
                <p className="mt-1 text-xs text-muted-2">
                  Add {formatPrice(49900 - cart.subtotal)} more for free delivery.
                </p>
              )}
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-primary-solid px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-primary-solid-light"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm font-medium text-primary-bright hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}