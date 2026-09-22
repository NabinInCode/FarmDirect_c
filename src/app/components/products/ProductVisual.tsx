import Image from "next/image";
import { JSX } from "react";

const gradients: Record<string, string> = {
  Vegetables: "from-green-200 via-primary-softer to-lime-100 dark:from-green-900 dark:via-primary-dark dark:to-lime-950",
  Fruits: "from-rose-200 via-cream to-amber-100 dark:from-rose-900 dark:via-primary-dark dark:to-amber-950",
  "Dairy & Eggs": "from-amber-100 via-cream to-orange-200 dark:from-amber-900 dark:via-primary-dark dark:to-orange-950",
  "Pantry & Essentials": "from-stone-200 via-cream to-amber-100 dark:from-stone-800 dark:via-primary-dark dark:to-stone-900",
};

export default function ProductVisual({
  name,
  category,
  image,
  priority = false,
}: {
  name: string;
  category: string;
  image?: string;
  priority?: boolean;
}): JSX.Element {
  if (image && image.trim()) {
    return (
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br ${gradients[category] ?? "from-primary-soft to-primary-softer dark:from-primary-dark dark:to-primary-deep"}`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface/70 text-4xl font-bold text-primary shadow-sm">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="rounded-full bg-primary-solid/85 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          {category}
        </span>
      </div>
    </div>
  );
}