import Image from "next/image";
import { JSX } from "react";

const gradients: Record<string, string> = {
  Vegetables: "from-green-200 via-[#EAF6EE] to-lime-100",
  Fruits: "from-rose-200 via-[#FDF2E9] to-amber-100",
  "Dairy & Eggs": "from-amber-100 via-[#F9F7F0] to-orange-200",
  "Pantry & Essentials": "from-stone-200 via-[#F5F4EE] to-amber-100",
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
      className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br ${gradients[category] ?? "from-[#D9F0E1] to-[#EAF6EE]"}`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-4xl font-bold text-[#1B4332] shadow-sm">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="rounded-full bg-[#1B4332]/85 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
          {category}
        </span>
      </div>
    </div>
  );
}