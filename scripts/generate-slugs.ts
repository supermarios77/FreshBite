/**
 * Script to generate slugs for existing dishes that don't have slugs
 * Run with: bun run scripts/generate-slugs.ts
 */

import { PrismaClient } from "@prisma/client";
import { generateSlug } from "@/lib/utils";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function generateSlugsForExistingDishes() {
  console.log("🔧 Generating slugs for existing dishes...\n");

  try {
    // Get all dishes without slugs
    const dishes = await prisma.dish.findMany({
      where: {
        slug: null,
      },
    });

    if (dishes.length === 0) {
      console.log("✅ All dishes already have slugs!");
      return;
    }

    console.log(`Found ${dishes.length} dish(es) without slugs.\n`);

    for (const dish of dishes) {
      // Generate slug from English name
      const baseSlug = generateSlug(dish.nameEn);
      
      // Ensure slug is unique
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.dish.findFirst({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Update dish with slug
      await prisma.dish.update({
        where: { id: dish.id },
        data: { slug },
      });

      console.log(`✅ Generated slug "${slug}" for "${dish.nameEn}"`);
    }

    console.log("\n🎉 All slugs generated successfully!");
  } catch (error: any) {
    console.error("❌ Error generating slugs:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generateSlugsForExistingDishes();

