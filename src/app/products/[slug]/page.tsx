import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getRatingsFor, formatReviewDate } from "@/lib/reviews";
import ProductVisual from "@/app/components/products/ProductVisual";
import AddToCart from "@/app/components/products/AddToCart";
import RatingStars from "@/app/components/RatingStars";
import ReviewForm from "@/app/components/ReviewForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} — FarmDirect`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      farmer: { select: { id: true, name: true, address: true } },
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, slug: { not: product.slug } },
    take: 4,
    include: { category: true },
  });

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  const ratings = await getRatingsFor([
    ...related.map((item) => item.id),
    product.id,
  ]);
  const rating = ratings.get(product.id) ?? { avg: 0, count: 0 };

  const user = await getCurrentUser();
  const userReview = user ? reviews.find((r) => r.userId === user.id) ?? null : null;
  const purchased = user
    ? await prisma.orderItem.findFirst({
        where: { productId: product.id, order: { userId: user.id } },
        select: { id: true },
      })
    : null;

  const inStock = product.stock > 0;

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-[#2D6A4F]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className="transition hover:text-[#2D6A4F]">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="transition hover:text-[#2D6A4F]"
        >
          {product.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-gray-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <ProductVisual
            name={product.name}
            category={product.category.name}
            image={product.image}
            priority
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Link
              href={`/products?category=${product.category.slug}`}
              className="rounded-full bg-[#D9F0E1] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#1B4332] transition hover:bg-[#C8E7D5]"
            >
              {product.category.name}
            </Link>
            {product.featured && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-2">
            {rating.count > 0 ? (
              <RatingStars value={rating.avg} count={rating.count} size="sm" />
            ) : (
              <p className="text-sm text-gray-400">No reviews yet</p>
            )}
          </div>

          {product.farmer && (
            <p className="mt-2 text-sm text-gray-500">
              Grown and packed by{" "}
              <span className="font-semibold text-[#2D6A4F]">{product.farmer.name}</span>
              {product.farmer.address && <span> · {product.farmer.address}</span>}
            </p>
          )}

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-[#1B4332]">{formatPrice(product.price)}</p>
            <p className="pb-1 text-sm text-gray-500">per {product.unit}</p>
          </div>

          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${inStock ? "bg-[#2D6A4F]" : "bg-red-500"}`}
              aria-hidden="true"
            />
            <span className={inStock ? "font-medium text-[#2D6A4F]" : "font-medium text-red-500"}>
              {inStock ? `In stock — ${product.stock} available` : "Currently out of stock"}
            </span>
          </div>

          <div className="mt-8">
            <AddToCart
              productId={product.id}
              productName={product.name}
              productSlug={product.slug}
              inStock={inStock}
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs font-medium text-gray-500">Freshness</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">Farm to home in 24h</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs font-medium text-gray-500">Delivery</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">Free above ₹499</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-xs font-medium text-gray-500">Returns</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">Easy 7-day policy</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16" aria-labelledby="reviews-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">
              Customer reviews
            </p>
            <h2 id="reviews-heading" className="mt-1 text-2xl font-bold text-gray-900">
              What customers say
            </h2>
          </div>
          {rating.count > 0 && (
            <RatingStars value={rating.avg} count={rating.count} size="md" />
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-gray-500">
                <p className="text-sm font-medium">No reviews yet for {product.name}.</p>
                <p className="mt-1 text-xs">Be the first to share your experience.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
                    <time className="text-xs text-gray-400">
                      {formatReviewDate(review.createdAt)}
                    </time>
                  </div>
                  <RatingStars value={review.rating} size="sm" />
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{review.comment}</p>
                </article>
              ))
            )}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            {user ? (
              <ReviewForm
                productId={product.id}
                canReview={Boolean(purchased)}
                existing={
                  userReview
                    ? { id: userReview.id, rating: userReview.rating, comment: userReview.comment }
                    : null
                }
              />
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                <p className="text-sm text-gray-600">
                  <Link href="/login" className="font-semibold text-[#2D6A4F] hover:underline">
                    Log in
                  </Link>{" "}
                  to rate and review this product.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F]">
                You may also like
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">More from {product.category.name}</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-[#2D6A4F] hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <ProductVisual name={item.name} category={item.category.name} image={item.image} />
                <div className="p-4">
                  <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-[#2D6A4F]">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">{item.unit}</p>
                  {(() => {
                    const r = ratings.get(item.id);
                    return r && r.count > 0 ? (
                      <RatingStars value={r.avg} size="sm" />
                    ) : null;
                  })()}
                  <p className="mt-2 text-base font-bold text-[#1B4332]">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}