import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const lionessProducts = [
  {
    name: "Lioness Queen Ring",
    description: "Bold. Fearless. Beautiful. The Lioness Queen Collection by WWJ Studio is inspired by the strength, grace, and wild beauty of a queen. Each handcrafted piece is designed to celebrate confidence and individuality with artistic floral details and majestic lioness motifs. From statement necklaces to elegant earrings and rings, every creation is carefully handmade to bring wearable art into your everyday style.",
    price: 220,
    category: "Rings",
    images: ["/images/products/lioness_queen_ring.png"],
    inStock: true,
    featured: true
  },
  {
    name: "Lioness Queen Necklace",
    description: "Lioness Queen Necklace A royal statement piece inspired by courage, beauty, and feminine strength. The handcrafted Lioness Queen Necklace features an elegant lioness design adorned with delicate floral details and tiny leaf charms for a magical woodland touch. Lightweight yet eye-catching, this necklace is perfect for adding a bold artistic vibe to any outfit.",
    price: 560,
    category: "Necklaces",
    images: ["/images/products/lioness_queen_necklace.png"],
    inStock: true,
    featured: false
  },
  {
    name: "Lioness Queen - The Royal Collection",
    description: "Graceful. Fearless. Regal. Inspired by the strength and elegance of the lioness, the Lioness Queen Set from Wildlife Wonder Jewelry’s Royal Collection is a symbol of courage, leadership, and feminine power. Handcrafted with intricate detailing, each piece captures the majestic beauty of the wild while crowned with a blooming crimson rose — representing love, resilience, and royalty.",
    price: 2350,
    category: "Sets",
    images: ["/images/products/lioness_royal_set.png"],
    inStock: true,
    featured: true
  }
];

async function main() {
  console.log("Seeding Lioness Products...");
  for (const p of lionessProducts) {
    await prisma.product.create({
      data: p
    });
    console.log(`Created: ${p.name}`);
  }
  console.log("Done seeding lioness products!");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
