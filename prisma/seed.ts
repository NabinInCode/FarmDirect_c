import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoPassword = bcrypt.hashSync("changeme123", 10);

const DELIVERY_FEE = 4000;

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  categorySlug: string;
  stock: number;
  featured?: boolean;
  image?: string;
  farmerEmail: string;
};

const categories = [
  { name: "Vegetables", slug: "vegetables" },
  { name: "Fruits", slug: "fruits" },
  { name: "Dairy & Eggs", slug: "dairy-eggs" },
  { name: "Pantry & Essentials", slug: "pantry-essentials" },
];

const products: SeedProduct[] = [
  // ---- Vegetables ----
  {
    name: "Fresh Carrots",
    slug: "fresh-carrots",
    description: "Crisp, sweet carrots freshly harvested from sandy local soil.",
    price: 12000,
    unit: "1 kg",
    categorySlug: "vegetables",
    stock: 80,
    image: "/products/carrot.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Ripe Tomatoes",
    slug: "ripe-tomatoes",
    description: "Juicy, sun-ripened tomatoes perfect for salads and curries.",
    price: 8000,
    unit: "1 kg",
    categorySlug: "vegetables",
    stock: 120,
    featured: true,
    image: "/products/tomato.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Organic Spinach",
    slug: "organic-spinach",
    description: "Tender, chemical-free spinach leaves, picked the same morning.",
    price: 4000,
    unit: "250 g bunch",
    categorySlug: "vegetables",
    stock: 60,
    featured: true,
    image: "/products/spinach.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Potatoes",
    slug: "potatoes",
    description: "Firm all-rounder potatoes from high-altitude grown farms.",
    price: 7000,
    unit: "2 kg",
    categorySlug: "vegetables",
    stock: 150,
    image: "/products/potato.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Green Capsicum",
    slug: "green-capsicum",
    description: "Crunchy, mildly sweet peppers excellent for roasting and stir-fries.",
    price: 6000,
    unit: "500 g",
    categorySlug: "vegetables",
    stock: 70,
    image: "/products/capsicum.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Fresh Coriander",
    slug: "fresh-coriander",
    description: "Fragrant, freshly cut coriander bunches to finish every dish.",
    price: 2000,
    unit: "100 g bunch",
    categorySlug: "vegetables",
    stock: 60,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  // ---- Fruits ----
  {
    name: "Alphonso Mangoes",
    slug: "alphonso-mangoes",
    description: "The king of mangoes — sweet, saffron-hued, and orchard fresh.",
    price: 45000,
    unit: "dozen",
    categorySlug: "fruits",
    stock: 40,
    featured: true,
    image: "/products/Mangoes.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Organic Bananas",
    slug: "organic-bananas",
    description: "Naturally ripened bananas, full of potassium and flavour.",
    price: 9000,
    unit: "dozen",
    categorySlug: "fruits",
    stock: 100,
    image: "/products/bananas.png",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Fresh Oranges",
    slug: "fresh-oranges",
    description: "Zesty and juicy, hand-picked at peak ripeness.",
    price: 15000,
    unit: "1 kg",
    categorySlug: "fruits",
    stock: 90,
    image: "/products/oranges.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Seedless Watermelon",
    slug: "seedless-watermelon",
    description: "Cooling and sweet, grown with drip irrigation for full flavour.",
    price: 12000,
    unit: "whole",
    categorySlug: "fruits",
    stock: 35,
    featured: true,
    image: "/products/Watermelons.png",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Ripe Papaya",
    slug: "ripe-papaya",
    description: "Sweet, buttery papaya — great for breakfast bowls and smoothies.",
    price: 11000,
    unit: "whole",
    categorySlug: "fruits",
    stock: 45,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  // ---- Dairy & Eggs ----
  {
    name: "Farm Fresh Eggs",
    slug: "farm-fresh-eggs",
    description: "Free-range eggs from chickens raised on a grain-rich diet.",
    price: 9600,
    unit: "tray of 12",
    categorySlug: "dairy-eggs",
    stock: 110,
    featured: true,
    image: "/products/eggs.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "A2 Cow Milk",
    slug: "a2-cow-milk",
    description: "Unprocessed, unhomogenised milk straight from desi cows.",
    price: 7000,
    unit: "1 L",
    categorySlug: "dairy-eggs",
    stock: 130,
    image: "/products/milk.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  {
    name: "Fresh Paneer",
    slug: "fresh-paneer",
    description: "Soft, handmade cottage cheese prepared daily from A2 milk.",
    price: 11000,
    unit: "250 g",
    categorySlug: "dairy-eggs",
    stock: 45,
    image: "/products/paneer.png",
    farmerEmail: "ramesh@farmdirect.in",
  },
  // ---- Pantry & Essentials ----
  {
    name: "Wild Forest Honey",
    slug: "wild-forest-honey",
    description: "Raw, unfiltered honey collected from remote forest bee hives.",
    price: 35000,
    unit: "500 g",
    categorySlug: "pantry-essentials",
    stock: 40,
    featured: true,
    image: "/products/honey.png",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Premium Basmati Rice",
    slug: "premium-basmati-rice",
    description: "Aged long-grain basmati with an aroma that fills the kitchen.",
    price: 9000,
    unit: "1 kg",
    categorySlug: "pantry-essentials",
    stock: 120,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Split Moong Dal",
    slug: "split-moong-dal",
    description: "Stone-ground yellow lentils, hulled and easy to cook.",
    price: 11000,
    unit: "500 g",
    categorySlug: "pantry-essentials",
    stock: 90,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    description: "Freshly ground high-curcumin turmeric with a rich golden colour.",
    price: 16000,
    unit: "250 g",
    categorySlug: "pantry-essentials",
    stock: 70,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Whole Wheat Flour",
    slug: "whole-wheat-flour",
    description: "Stone-ground chakki atta from organically grown wheat.",
    price: 8000,
    unit: "5 kg",
    categorySlug: "pantry-essentials",
    stock: 110,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
  {
    name: "Raw Peanuts",
    slug: "raw-peanuts",
    description: "Hand-shelled groundnuts, perfect for roasting or making chutney.",
    price: 6500,
    unit: "500 g",
    categorySlug: "pantry-essentials",
    stock: 85,
    image: "",
    farmerEmail: "sunita@farmdirect.in",
  },
];

type SeedOrder = {
  id: string;
  status: OrderStatus;
  daysAgo: number;
  paymentMethod: string;
  paid: boolean;
  items: Array<{ slug: string; qty: number }>;
};

const seedOrders: SeedOrder[] = [
  {
    id: "demo-order-1",
    status: OrderStatus.DELIVERED,
    daysAgo: 24,
    paymentMethod: "ESEWA",
    paid: true,
    items: [
      { slug: "ripe-tomatoes", qty: 2 },
      { slug: "fresh-carrots", qty: 1 },
      { slug: "alphonso-mangoes", qty: 1 },
    ],
  },
  {
    id: "demo-order-2",
    status: OrderStatus.SHIPPED,
    daysAgo: 9,
    paymentMethod: "ESEWA",
    paid: true,
    items: [
      { slug: "a2-cow-milk", qty: 2 },
      { slug: "farm-fresh-eggs", qty: 1 },
    ],
  },
  {
    id: "demo-order-3",
    status: OrderStatus.PENDING,
    daysAgo: 0,
    paymentMethod: "COD",
    paid: false,
    items: [{ slug: "organic-spinach", qty: 2 }],
  },
];

async function main() {
  const farmer = await prisma.user.upsert({
    where: { email: "ramesh@farmdirect.in" },
    update: { password: demoPassword },
    create: {
      name: "Ramesh Patel",
      email: "ramesh@farmdirect.in",
      password: demoPassword,
      role: Role.FARMER,
      phone: "067-545672",
      address: "Green Valley Organic Farm, Anand, Gujarat",
    },
  });

  const farmer2 = await prisma.user.upsert({
    where: { email: "sunita@farmdirect.in" },
    update: { password: demoPassword },
    create: {
      name: "Sunita Devi",
      email: "sunita@farmdirect.in",
      password: demoPassword,
      role: Role.FARMER,
      phone: "078-221903",
      address: "Kisan Organic Garden, Nashik, Maharashtra",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@farmdirect.in" },
    update: { password: demoPassword },
    create: {
      name: "Demo Customer",
      email: "demo@farmdirect.in",
      password: demoPassword,
      role: Role.CUSTOMER,
      phone: "012-345678",
      address: "12 Rosewood Street, Pune, Maharashtra",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@farmdirect.in" },
    update: { password: demoPassword },
    create: {
      name: "FarmDirect Admin",
      email: "admin@farmdirect.in",
      password: demoPassword,
      role: Role.ADMIN,
      phone: "000-000000",
      address: "FarmDirect HQ, Pune, Maharashtra",
    },
  });

  const farmersByEmail: Record<string, string> = {
    "ramesh@farmdirect.in": farmer.id,
    "sunita@farmdirect.in": farmer2.id,
  };

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  for (const product of products) {
    const { categorySlug, farmerEmail, ...data } = product;
    const createData = { ...data, image: data.image ?? "" };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...createData, farmerId: farmersByEmail[farmerEmail] },
      create: {
        ...createData,
        farmer: { connect: { id: farmersByEmail[farmerEmail] } },
        category: { connect: { slug: categorySlug } },
      },
    });
  }

  const reviews: Array<{
    slug: string;
    rating: number;
    comment: string;
  }> = [
    {
      slug: "ripe-tomatoes",
      rating: 5,
      comment:
        "So fresh you can smell the fields. Made the best curry with these — highly recommend!",
    },
    {
      slug: "fresh-carrots",
      rating: 4,
      comment: "Sweet and crunchy, great for snacking. Some were smaller than expected though.",
    },
    {
      slug: "alphonso-mangoes",
      rating: 5,
      comment:
        "Absolutely delicious! Sweet, juicy and delivered perfectly ripe. My family loved them.",
    },
    {
      slug: "a2-cow-milk",
      rating: 5,
      comment: "Tastes like real milk from childhood. Excellent freshness.",
    },
    {
      slug: "farm-fresh-eggs",
      rating: 4,
      comment: "Great yolks and very fresh. Prices are a bit on the higher side.",
    },
    {
      slug: "organic-bananas",
      rating: 5,
      comment: "Naturally sweet and perfectly yellow. Every order has been consistent.",
    },
    {
      slug: "premium-basmati-rice",
      rating: 4,
      comment: "Long, aromatic grains. Weigh per kg would be nice, but the quality is superb.",
    },
  ];

  for (const review of reviews) {
    const product = await prisma.product.findUnique({ where: { slug: review.slug } });
    if (!product) continue;
    await prisma.review.upsert({
      where: {
        userId_productId: { userId: demoUser.id, productId: product.id },
      },
      update: {},
      create: {
        userId: demoUser.id,
        productId: product.id,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  for (const seedOrder of seedOrders) {
    const items = await Promise.all(
      seedOrder.items.map(async ({ slug, qty }) => {
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) throw new Error(`Missing product for seed order: ${slug}`);
        return { productId: product.id, quantity: qty, price: product.price };
      })
    );

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 49900 ? 0 : DELIVERY_FEE;
    const createdAt = new Date(Date.now() - seedOrder.daysAgo * 24 * 60 * 60 * 1000);

    await prisma.order.upsert({
      where: { id: seedOrder.id },
      update: {},
      create: {
        id: seedOrder.id,
        userId: demoUser.id,
        status: seedOrder.status,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        address: demoUser.address ?? "",
        phone: demoUser.phone ?? "",
        paymentMethod: seedOrder.paymentMethod,
        paymentRef: seedOrder.paid ? `${seedOrder.id}-ref` : null,
        paidAt: seedOrder.paid ? createdAt : null,
        createdAt,
        items: { create: items },
      },
    });
  }

  console.log(
    `Seed complete: ${categories.length} categories, ${products.length} products, ${reviews.length} reviews, ${seedOrders.length} sample orders.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });