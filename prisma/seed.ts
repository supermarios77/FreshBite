/**
 * Database seed script
 * 
 * Populates the database with initial data for development/testing
 * 
 * Usage:
 *   bun run db:seed                    # Seed everything
 *   bun run db:seed categories          # Seed only categories
 *   bun run db:seed starters            # Seed only starters
 *   bun run db:seed biryani pilau       # Seed multiple sections
 * 
 * Available sections:
 *   - categories
 *   - starters
 *   - biryani
 *   - pilau
 *   - curries
 *   - bread
 *   - sides
 *   - desserts
 */

import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// Helper function to create or get category
async function getOrCreateCategory(
  nameEn: string,
  nameNl: string,
  nameFr: string,
  description?: string
) {
  const slug = generateSlug(nameEn);
  let category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: nameEn,
        nameEn,
        nameNl,
        nameFr,
        slug,
        description,
        isActive: true,
      },
    });
    console.log(`✅ Created category: ${nameEn}`);
  }

  return category;
}

// Helper function to create dish with variants
async function createDishWithVariants(
  categoryId: string | null,
  dishData: {
    nameEn: string;
    nameNl: string;
    nameFr: string;
    descriptionEn?: string;
    descriptionNl?: string;
    descriptionFr?: string;
    price: number;
    pricingModel?: "FIXED";
    quantity?: string;
    weight?: string;
    serves?: number; // Number of people this portion feeds
    allergens?: string[];
    ingredients?: string[];
    rating?: number;
  },
  variants?: Array<{
    nameEn: string;
    nameNl: string;
    nameFr: string;
    price?: number;
    sortOrder?: number;
  }>
) {
  const slug = generateSlug(dishData.nameEn);
  let dish = await prisma.dish.findUnique({
    where: { slug },
  });

  if (!dish) {
    dish = await prisma.dish.create({
      data: {
        name: dishData.nameEn,
        nameEn: dishData.nameEn,
        nameNl: dishData.nameNl,
        nameFr: dishData.nameFr,
        slug,
        description: dishData.descriptionEn,
        descriptionEn: dishData.descriptionEn,
        descriptionNl: dishData.descriptionNl,
        descriptionFr: dishData.descriptionFr,
        price: dishData.price,
        pricingModel: dishData.pricingModel || "FIXED",
        categoryId,
        rating: dishData.rating || 0,
        quantity: dishData.quantity || null,
        weight: dishData.weight || null,
        serves: dishData.serves || null,
        allergens: dishData.allergens || [],
        ingredients: dishData.ingredients || [],
        isActive: true,
        variants: variants
          ? {
              create: variants.map((variant, index) => ({
                name: variant.nameEn,
                nameEn: variant.nameEn,
                nameNl: variant.nameNl,
                nameFr: variant.nameFr,
                price: variant.price || null,
                sortOrder: variant.sortOrder ?? index,
                isActive: true,
              })),
            }
          : undefined,
      },
    });
    console.log(`✅ Created dish: ${dishData.nameEn}${variants ? ` (${variants.length} variants)` : ""}`);
  } else {
    console.log(`ℹ️  Dish already exists: ${dishData.nameEn}`);
  }

  return dish;
}

// Parse command-line arguments
const args = process.argv.slice(2);
const sectionsToSeed = args.length > 0 ? args.map(arg => arg.toLowerCase()) : null;

// Helper to check if a section should be seeded
function shouldSeed(section: string): boolean {
  if (!sectionsToSeed) return true; // Seed everything if no args
  return sectionsToSeed.includes(section.toLowerCase());
}

async function seedCategories() {
  console.log("\n📁 Creating Categories...");
  
  const startersCategory = await getOrCreateCategory(
      "Starters",
      "Voorgerechten",
      "Entrées",
      "Delicious appetizers to start your meal"
    );

    const biryaniCategory = await getOrCreateCategory(
      "Biryani",
      "Biryani",
      "Biryani",
      "Aromatic rice dishes with meat or vegetables"
    );

    const pilauCategory = await getOrCreateCategory(
      "Pilau",
      "Pilau",
      "Pilau",
      "Fragrant rice dishes"
    );

    const curriesCategory = await getOrCreateCategory(
      "Curries",
      "Curry's",
      "Currys",
      "Rich and flavorful curry dishes"
    );

    const breadCategory = await getOrCreateCategory(
      "Bread",
      "Brood",
      "Pain",
      "Freshly baked bread"
    );

    const sidesCategory = await getOrCreateCategory(
      "Sides",
      "Bijgerechten",
      "Accompagnements",
      "Perfect accompaniments to your meal"
    );

    const dessertsCategory = await getOrCreateCategory(
      "Desserts",
      "Desserts",
      "Desserts",
      "Sweet treats to end your meal"
    );

  return {
    startersCategory,
    biryaniCategory,
    pilauCategory,
    curriesCategory,
    breadCategory,
    sidesCategory,
    dessertsCategory,
  };
}

async function seedStarters(startersCategory: Awaited<ReturnType<typeof seedCategories>>['startersCategory']) {
  console.log("\n📦 Creating Starters...");
    
    await createDishWithVariants(startersCategory.id, {
        nameEn: "Spring Rolls",
        nameNl: "Loempia's",
        nameFr: "Rouleaux de printemps",
        descriptionEn: "Crispy golden spring rolls filled with fresh vegetables, served with our house-made sweet and sour dipping sauce.",
        descriptionNl: "Knapperige gouden loempia's gevuld met verse groenten, geserveerd met onze huisgemaakte zoetzure dipsaus.",
        descriptionFr: "Rouleaux de printemps dorés et croustillants farcis de légumes frais, servis avec notre sauce aigre-douce maison.",
        price: 1.50,
      quantity: "1 portion",
      weight: "50g",
      serves: 1,
      allergens: ["Gluten", "Wheat", "Soy"],
      rating: 4.5,
    });

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Samosas",
      nameNl: "Samosas",
      nameFr: "Samoussas",
      descriptionEn: "Crispy triangular pastries with a golden, flaky crust filled with perfectly spiced filling, served with fresh mint chutney.",
        descriptionNl: "Knapperige driehoekige pasteitjes met een gouden, brosse korst gevuld met perfect gekruide vulling, geserveerd met verse muntchutney.",
        descriptionFr: "Pâtisseries triangulaires croustillantes à la croûte dorée et feuilletée farcies de garniture parfaitement épicée, servies avec chutney à la menthe fraîche.",
      price: 8.50,
      quantity: "6 pieces",
      weight: "300g",
      serves: 2,
      allergens: ["Gluten", "Wheat"],
      rating: 4.7,
    }, [
      { nameEn: "Aloo", nameNl: "Aloo", nameFr: "Aloo", sortOrder: 0 },
      { nameEn: "Chicken", nameNl: "Kip", nameFr: "Poulet", sortOrder: 1 },
      { nameEn: "Mince", nameNl: "Gehakt", nameFr: "Viande hachée", sortOrder: 2 },
    ]);

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Patties",
      nameNl: "Pasteitjes",
      nameFr: "Pâtés",
      descriptionEn: "Buttery, flaky pastry shells filled with deliciously spiced mixture. The perfect balance of savory spices and rich pastry.",
        descriptionNl: "Boterachtige, brosse pasteitjes gevuld met heerlijk gekruid mengsel. De perfecte balans tussen hartige specerijen en rijke deeg.",
        descriptionFr: "Coquilles de pâte feuilletée beurrées farcies d'un mélange délicieusement épicé. L'équilibre parfait entre épices salées et pâte riche.",
      price: 2.50,
      quantity: "1 portion",
      weight: "80g",
      serves: 1,
      allergens: ["Gluten", "Wheat", "Dairy"],
      rating: 4.6,
    }, [
      { nameEn: "Cheese", nameNl: "Kaas", nameFr: "Fromage", sortOrder: 0 },
      { nameEn: "Chicken", nameNl: "Kip", nameFr: "Poulet", sortOrder: 1 },
    ]);

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Kebab",
      nameNl: "Kebab",
      nameFr: "Kebab",
      descriptionEn: "Tender, succulent kebabs made from premium meat marinated in aromatic spices and herbs, grilled to perfection.",
        descriptionNl: "Malse, sappige kebabs gemaakt van premium vlees gemarineerd in aromatische specerijen en kruiden, perfect gegrild.",
        descriptionFr: "Kebabs tendres et succulents préparés avec de la viande de qualité supérieure marinée dans des épices et herbes aromatiques, grillés à la perfection.",
      price: 6.00,
      quantity: "1 portion",
      weight: "100g",
      serves: 1,
      allergens: [],
      rating: 4.8,
    }, [
      { nameEn: "Shami", nameNl: "Shami", nameFr: "Shami", sortOrder: 0 },
      { nameEn: "Chapli", nameNl: "Chapli", nameFr: "Chapli", sortOrder: 1 },
      { nameEn: "Seekh", nameNl: "Seekh", nameFr: "Seekh", sortOrder: 2 },
    ]);

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Aloo Tikki",
      nameNl: "Aloo Tikki",
      nameFr: "Aloo Tikki",
      descriptionEn: "Crispy golden potato patties perfectly spiced with aromatic herbs, served with tangy tamarind and fresh mint chutney.",
        descriptionNl: "Knapperige gouden aardappel pasteitjes perfect gekruid met aromatische kruiden, geserveerd met zurige tamarindchutney en verse muntchutney.",
        descriptionFr: "Galettes de pommes de terre dorées et croustillantes parfaitement épicées aux herbes aromatiques, servies avec chutney tamarin acidulé et chutney à la menthe fraîche.",
      price: 5.00,
      quantity: "4 pieces",
      weight: "200g",
      serves: 2,
      allergens: ["Gluten"],
      rating: 4.5,
    });

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Chicken Malai Tikka",
      nameNl: "Kip Malai Tikka",
      nameFr: "Tikka Malai au Poulet",
      descriptionEn: "Succulent chicken pieces marinated in rich, creamy malai infused with aromatic spices, grilled until perfectly charred and tender.",
        descriptionNl: "Sappige kipstukjes gemarineerd in rijke, romige malai doordrenkt met aromatische specerijen, gegrild tot perfect geroosterd en mals.",
        descriptionFr: "Morceaux de poulet succulents marinés dans du malai riche et crémeux infusé d'épices aromatiques, grillés jusqu'à parfaitement dorés et tendres.",
      price: 9.00,
      quantity: "6 pieces",
      weight: "250g",
      serves: 2,
      allergens: ["Dairy"],
      rating: 4.9,
    });

    await createDishWithVariants(startersCategory.id, {
      nameEn: "Chicken Roast",
      nameNl: "Geroosterde Kip",
      nameFr: "Poulet Rôti",
      descriptionEn: "Whole chicken marinated in aromatic spices and slow-roasted to perfection. Tender, juicy meat with perfectly crisp skin.",
        descriptionNl: "Hele kip gemarineerd in aromatische specerijen en langzaam geroosterd tot perfectie. Mals, sappig vlees met perfect knapperige huid.",
        descriptionFr: "Poulet entier mariné dans des épices aromatiques et rôti lentement à la perfection. Viande tendre et juteuse avec peau parfaitement croustillante.",
      price: 12.00,
      quantity: "1 portion",
      weight: "300g",
      serves: 2,
      allergens: [],
      rating: 4.7,
    });
}

async function seedBiryani(biryaniCategory: Awaited<ReturnType<typeof seedCategories>>['biryaniCategory']) {
  console.log("\n🍚 Creating Biryani...");

    await createDishWithVariants(biryaniCategory.id, {
      nameEn: "Chicken Biryani",
      nameNl: "Kip Biryani",
      nameFr: "Biryani au Poulet",
      descriptionEn: "Layers of fragrant basmati rice and tender spiced chicken cooked using the traditional dum method, topped with crispy fried onions and fresh herbs.",
        descriptionNl: "Lagen geurige basmatirijst en malse gekruide kip gekookt met de traditionele dum-methode, afgewerkt met knapperige gefrituurde uien en verse kruiden.",
        descriptionFr: "Couches de riz basmati parfumé et poulet tendre épicé cuit selon la méthode traditionnelle dum, garni d'oignons frits croustillants et d'herbes fraîches.",
      price: 14.00,
      quantity: "1 portion",
      weight: "500g",
      serves: 3,
      allergens: [],
      rating: 4.8,
    });

    await createDishWithVariants(biryaniCategory.id, {
      nameEn: "Vegetable Biryani",
      nameNl: "Groente Biryani",
      nameFr: "Biryani aux Légumes",
      descriptionEn: "Aromatic basmati rice cooked with fresh seasonal vegetables and spices, finished with saffron, fried onions, and fresh herbs.",
        descriptionNl: "Aromatische basmatirijst gekookt met verse seizoensgroenten en specerijen, afgewerkt met saffraan, gefrituurde uien en verse kruiden.",
        descriptionFr: "Riz basmati aromatique cuit avec des légumes de saison frais et des épices, fini avec du safran, des oignons frits et des herbes fraîches.",
      price: 12.00,
      quantity: "1 portion",
      weight: "500g",
      serves: 3,
      allergens: [],
      rating: 4.6,
    });

    await createDishWithVariants(biryaniCategory.id, {
      nameEn: "Keema Biryani",
      nameNl: "Gehakt Biryani",
      nameFr: "Biryani au Hachis",
      descriptionEn: "Rich biryani with perfectly spiced minced meat slow-cooked until tender, layered with fragrant basmati rice infused with saffron and whole spices.",
        descriptionNl: "Rijke biryani met perfect gekruid gehakt langzaam gekookt tot mals, gelaagd met geurige basmatirijst doordrenkt met saffraan en hele specerijen.",
        descriptionFr: "Biryani riche avec de la viande hachée parfaitement épicée mijotée jusqu'à tendreté, superposée avec du riz basmati parfumé infusé de safran et d'épices entières.",
      price: 15.00,
      quantity: "1 portion",
      weight: "500g",
      serves: 3,
      allergens: [],
      rating: 4.7,
    });

    await createDishWithVariants(biryaniCategory.id, {
      nameEn: "Mutton Biryani",
      nameNl: "Lamsvlees Biryani",
      nameFr: "Biryani au Mouton",
      descriptionEn: "Tender mutton slow-cooked with aromatic spices until fall-off-the-bone tender, layered with fragrant basmati rice. Finished with saffron, fried onions, and fresh mint.",
        descriptionNl: "Mals lamsvlees langzaam gekookt met aromatische specerijen tot het van het bot valt, gelaagd met geurige basmatirijst. Afgewerkt met saffraan, gefrituurde uien en verse munt.",
        descriptionFr: "Mouton tendre mijoté lentement avec des épices aromatiques jusqu'à tendreté à tomber de l'os, superposé avec du riz basmati parfumé. Fini avec du safran, des oignons frits et de la menthe fraîche.",
      price: 16.00,
      quantity: "1 portion",
      weight: "500g",
      serves: 3,
      allergens: [],
      rating: 4.9,
    });
}

async function seedPilau(pilauCategory: Awaited<ReturnType<typeof seedCategories>>['pilauCategory']) {
  console.log("\n🍛 Creating Pilau...");

    await createDishWithVariants(pilauCategory.id, {
      nameEn: "Chicken Pilau",
      nameNl: "Kip Pilau",
      nameFr: "Pilau au Poulet",
      descriptionEn: "Aromatic basmati rice cooked with tender chicken pieces and whole spices. Each grain is perfectly separate and infused with rich flavors.",
        descriptionNl: "Aromatische basmatirijst gekookt met malse kipstukjes en hele specerijen. Elke korrel is perfect gescheiden en doordrenkt met rijke smaken.",
        descriptionFr: "Riz basmati aromatique cuit avec des morceaux de poulet tendres et des épices entières. Chaque grain est parfaitement séparé et infusé de saveurs riches.",
      price: 11.00,
      quantity: "1 portion",
      weight: "450g",
      serves: 2,
      allergens: [],
      rating: 4.6,
    });

    await createDishWithVariants(pilauCategory.id, {
      nameEn: "Mutton Pilau",
      nameNl: "Lamsvlees Pilau",
      nameFr: "Pilau au Mouton",
      descriptionEn: "Rich pilau with tender mutton slow-cooked until incredibly tender, imparting deep, meaty flavors to the aromatic rice.",
        descriptionNl: "Rijke pilau met mals lamsvlees langzaam gekookt tot ongelooflijk mals, waardoor diepe, vlezige smaken aan de aromatische rijst worden gegeven.",
        descriptionFr: "Pilau riche avec du mouton tendre mijoté lentement jusqu'à devenir incroyablement tendre, conférant des saveurs profondes et charnues au riz aromatique.",
      price: 13.00,
      quantity: "1 portion",
      weight: "450g",
      serves: 2,
      allergens: [],
      rating: 4.7,
    });

    await createDishWithVariants(pilauCategory.id, {
      nameEn: "Channa Pilau",
      nameNl: "Kikkererwten Pilau",
      nameFr: "Pilau aux Pois Chiches",
      descriptionEn: "Nutritious vegetarian pilau with tender chickpeas cooked with aromatic basmati rice and whole spices. A hearty, satisfying meal.",
        descriptionNl: "Voedzame vegetarische pilau met malse kikkererwten gekookt met aromatische basmatirijst en hele specerijen. Een hartige, bevredigende maaltijd.",
        descriptionFr: "Pilau végétarien nutritif avec des pois chiches tendres cuits avec du riz basmati aromatique et des épices entières. Un repas copieux et satisfaisant.",
      price: 10.00,
      quantity: "1 portion",
      weight: "450g",
      serves: 2,
      allergens: [],
      rating: 4.5,
    });

    await createDishWithVariants(pilauCategory.id, {
      nameEn: "Mixed Vegetable Pilau",
      nameNl: "Gemengde Groente Pilau",
      nameFr: "Pilau aux Légumes Mixtes",
      descriptionEn: "Colorful pilau with fresh seasonal vegetables cooked to perfection. Light yet satisfying, packed with nutrients and flavor.",
        descriptionNl: "Kleurrijke pilau met verse seizoensgroenten perfect gekookt. Licht maar bevredigend, boordevol voedingsstoffen en smaak.",
        descriptionFr: "Pilau coloré avec des légumes de saison frais cuits à la perfection. Léger mais satisfaisant, rempli de nutriments et de saveur.",
      price: 9.50,
      quantity: "1 portion",
      weight: "450g",
      serves: 2,
      allergens: [],
      rating: 4.4,
    });
}

async function seedCurries(curriesCategory: Awaited<ReturnType<typeof seedCategories>>['curriesCategory']) {
  console.log("\n🍲 Creating Curries...");

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Chicken Karahi",
      nameNl: "Kip Karahi",
      nameFr: "Karahi au Poulet",
      descriptionEn: "Bold and spicy curry cooked in a traditional karahi with fresh tomatoes, green chilies, and aromatic spices. Full of character and perfect for spice lovers.",
        descriptionNl: "Krachtige en pittige curry gekookt in een traditionele karahi met verse tomaten, groene pepers en aromatische specerijen. Vol karakter en perfect voor liefhebbers van pittig eten.",
        descriptionFr: "Curry audacieux et épicé cuit dans un karahi traditionnel avec des tomates fraîches, des piments verts et des épices aromatiques. Plein de caractère et parfait pour les amateurs d'épices.",
      price: 13.00,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.8,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Mutton Karahi",
      nameNl: "Lamsvlees Karahi",
      nameFr: "Karahi au Mouton",
      descriptionEn: "Rich and robust curry with tender mutton slow-cooked in a traditional karahi. Thick, flavorful sauce with perfect balance of heat and aromatic spices.",
        descriptionNl: "Rijke en robuuste curry met mals lamsvlees langzaam gekookt in een traditionele karahi. Dikke, smaakvolle saus met perfecte balans tussen hitte en aromatische specerijen.",
        descriptionFr: "Curry riche et robuste avec du mouton tendre mijoté lentement dans un karahi traditionnel. Sauce épaisse et savoureuse avec équilibre parfait entre chaleur et épices aromatiques.",
      price: 15.00,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.9,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Chicken Qorma",
      nameNl: "Kip Qorma",
      nameFr: "Qorma au Poulet",
      descriptionEn: "Luxurious and creamy curry with tender chicken in a velvety sauce made with yogurt, cream, and aromatic spices. Rich, mild, and deeply satisfying.",
        descriptionNl: "Luxueuze en romige curry met malse kip in een fluweelzachte saus gemaakt met yoghurt, room en aromatische specerijen. Rijk, mild en diep bevredigend.",
        descriptionFr: "Curry luxueux et crémeux avec du poulet tendre dans une sauce veloutée faite avec du yaourt, de la crème et des épices aromatiques. Riche, doux et profondément satisfaisant.",
      price: 13.50,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: ["Dairy"],
      rating: 4.7,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Mutton Qorma",
      nameNl: "Lamsvlees Qorma",
      nameFr: "Qorma au Mouton",
      descriptionEn: "Elegant and rich curry showcasing tender mutton slow-cooked until incredibly tender, finished in a creamy sauce with yogurt, cream, and aromatic spices.",
        descriptionNl: "Elegante en rijke curry met mals lamsvlees langzaam gekookt tot ongelooflijk mals, afgewerkt in een romige saus met yoghurt, room en aromatische specerijen.",
        descriptionFr: "Curry élégant et riche met du mouton tendre mijoté lentement jusqu'à devenir incroyablement tendre, fini dans une sauce crémeuse avec du yaourt, de la crème et des épices aromatiques.",
      price: 15.50,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: ["Dairy"],
      rating: 4.8,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Payee",
      nameNl: "Payee",
      nameFr: "Payee",
      descriptionEn: "Unique curry with tender trotters slow-cooked until incredibly tender, creating a rich, gelatinous texture. Deeply spiced and full of flavor.",
        descriptionNl: "Unieke curry met malse trotters langzaam gekookt tot ongelooflijk mals, waardoor een rijke, gelatineachtige textuur ontstaat. Diep gekruid en vol smaak.",
        descriptionFr: "Curry unique avec des trotters tendres mijotés lentement jusqu'à devenir incroyablement tendres, créant une texture riche et gélatineuse. Profondément épicé et plein de saveur.",
      price: 14.00,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.6,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Nihari",
      nameNl: "Nihari",
      nameFr: "Nihari",
      descriptionEn: "Legendary slow-cooked curry traditionally served for breakfast. Meat cooked for hours until fall-off-the-bone tender in a rich, thick, and incredibly flavorful sauce.",
        descriptionNl: "Legendarische langzaam gekookte curry traditioneel geserveerd als ontbijt. Vlees urenlang gekookt tot het van het bot valt in een rijke, dikke en ongelooflijk smaakvolle saus.",
        descriptionFr: "Curry légendaire mijoté traditionnellement servi au petit-déjeuner. Viande cuite pendant des heures jusqu'à tendreté à tomber de l'os dans une sauce riche, épaisse et incroyablement savoureuse.",
      price: 14.50,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.9,
    }, [
      { nameEn: "Chicken", nameNl: "Kip", nameFr: "Poulet", sortOrder: 0 },
      { nameEn: "Beef", nameNl: "Rundvlees", nameFr: "Bœuf", sortOrder: 1 },
    ]);

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Karele Gosht",
      nameNl: "Karele Gosht",
      nameFr: "Karele Gosht",
      descriptionEn: "Unique curry with bitter gourd cooked with tender meat. The bitterness is balanced by rich, spiced meat, creating a complex and delicious flavor profile.",
        descriptionNl: "Unieke curry met bittere pompoen gekookt met mals vlees. De bitterheid wordt in evenwicht gebracht door rijk, gekruid vlees, waardoor een complex en heerlijk smaakprofiel ontstaat.",
        descriptionFr: "Curry unique avec de la courge amère cuite avec de la viande tendre. L'amertume est équilibrée par la viande riche et épicée, créant un profil de saveur complexe et délicieux.",
      price: 13.00,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.5,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Mixed Vegetable",
      nameNl: "Gemengde Groente",
      nameFr: "Légumes Mixtes",
      descriptionEn: "Colorful and nutritious curry with fresh seasonal vegetables cooked to perfection and infused with aromatic spices. Hearty and satisfying.",
        descriptionNl: "Kleurrijke en voedzame curry met verse seizoensgroenten perfect gekookt en doordrenkt met aromatische specerijen. Hartig en bevredigend.",
        descriptionFr: "Curry coloré et nutritif avec des légumes de saison frais cuits à la perfection et infusés d'épices aromatiques. Copieux et satisfaisant.",
      price: 10.00,
      quantity: "1 portion",
      weight: "400g",
      serves: 2,
      allergens: [],
      rating: 4.4,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Bhindi",
      nameNl: "Okra",
      nameFr: "Gombo",
      descriptionEn: "Fresh okra cooked with onions, tomatoes, and aromatic spices until tender. A classic vegetarian dish with unique texture and rich flavor.",
        descriptionNl: "Verse okra gekookt met uien, tomaten en aromatische specerijen tot mals. Een klassiek vegetarisch gerecht met unieke textuur en rijke smaak.",
        descriptionFr: "Gombo frais cuit avec des oignons, des tomates et des épices aromatiques jusqu'à tendreté. Un plat végétarien classique avec une texture unique et une saveur riche.",
      price: 9.50,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: [],
      rating: 4.5,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Daal",
      nameNl: "Linzen",
      nameFr: "Lentilles",
      descriptionEn: "Comforting and nutritious lentil curry cooked until soft and creamy, finished with a tempering of spices. A simple, satisfying dish perfect for a healthy meal.",
        descriptionNl: "Troostende en voedzame linzencurry gekookt tot zacht en romig, afgewerkt met een tempering van specerijen. Een eenvoudig, bevredigend gerecht perfect voor een gezonde maaltijd.",
        descriptionFr: "Curry de lentilles réconfortant et nutritif cuit jusqu'à tendreté et crémeux, fini avec un tempérage d'épices. Un plat simple et satisfaisant parfait pour un repas sain.",
      price: 8.00,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: [],
      rating: 4.6,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Lahori Chanay",
      nameNl: "Lahori Kikkererwten",
      nameFr: "Pois Chiches Lahori",
      descriptionEn: "Spicy and flavorful curry with chickpeas in the Lahori style, known for bold spices and rich flavors. Hearty and satisfying.",
        descriptionNl: "Pittige en smaakvolle curry met kikkererwten in de Lahori-stijl, bekend om krachtige specerijen en rijke smaken. Hartig en bevredigend.",
        descriptionFr: "Curry épicé et savoureux avec des pois chiches dans le style Lahori, connu pour ses épices audacieuses et ses saveurs riches. Copieux et satisfaisant.",
      price: 9.00,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: [],
      rating: 4.7,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Daal Makhni",
      nameNl: "Linzen Makhni",
      nameFr: "Lentilles Makhni",
      descriptionEn: "Luxurious and creamy lentil curry with black lentils slow-cooked until soft and creamy, finished with butter and cream. Velvety smooth and deeply satisfying.",
        descriptionNl: "Luxueuze en romige linzencurry met zwarte linzen langzaam gekookt tot zacht en romig, afgewerkt met boter en room. Fluweelzacht en diep bevredigend.",
        descriptionFr: "Curry de lentilles luxueux et crémeux avec des lentilles noires mijotées lentement jusqu'à tendreté et crémeux, fini avec du beurre et de la crème. Velouté et profondément satisfaisant.",
      price: 9.50,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: ["Dairy"],
      rating: 4.8,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Rajma",
      nameNl: "Kidneybonen",
      nameFr: "Haricots Rouges",
      descriptionEn: "Hearty curry with kidney beans slow-cooked until tender and creamy in a rich, spicy sauce. A classic North Indian dish that's both nutritious and delicious.",
        descriptionNl: "Hartige curry met kidneybonen langzaam gekookt tot mals en romig in een rijke, pittige saus. Een klassiek Noord-Indisch gerecht dat zowel voedzaam als heerlijk is.",
        descriptionFr: "Curry copieux avec des haricots rouges mijotés lentement jusqu'à tendreté et crémeux dans une sauce riche et épicée. Un plat classique du Nord de l'Inde à la fois nutritif et délicieux.",
      price: 9.00,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: [],
      rating: 4.6,
    });

    await createDishWithVariants(curriesCategory.id, {
      nameEn: "Daal Maash",
      nameNl: "Urad Linzen",
      nameFr: "Lentilles Urad",
      descriptionEn: "Rich curry with black gram lentils (urad dal) that have a unique, earthy flavor and become incredibly creamy when cooked with aromatic spices.",
        descriptionNl: "Rijke curry met zwarte gram linzen (urad dal) met een unieke, aardse smaak die ongelooflijk romig worden wanneer gekookt met aromatische specerijen.",
        descriptionFr: "Curry riche avec des lentilles de gram noir (urad dal) qui ont une saveur unique et terreuse et deviennent incroyablement crémeuses une fois cuites avec des épices aromatiques.",
      price: 8.50,
      quantity: "1 portion",
      weight: "350g",
      serves: 2,
      allergens: [],
        rating: 4.5,
    });
}

async function seedBread(breadCategory: Awaited<ReturnType<typeof seedCategories>>['breadCategory']) {
  console.log("\n🍞 Creating Bread...");

    await createDishWithVariants(breadCategory.id, {
      nameEn: "Roti",
      nameNl: "Roti",
      nameFr: "Roti",
      descriptionEn: "Fresh, soft whole wheat flatbread made daily in our kitchen. Hand-rolled and cooked on a hot griddle until it puffs up beautifully.",
        descriptionNl: "Vers, zacht volkoren platbrood dagelijks gemaakt in onze keuken. Met de hand gerold en gekookt op een hete bakplaat tot het prachtig opzwelt.",
        descriptionFr: "Pain plat de blé entier frais et moelleux préparé quotidiennement dans notre cuisine. Roulé à la main et cuit sur une plaque chaude jusqu'à ce qu'il gonfle magnifiquement.",
      price: 1.00,
      quantity: "1 portion",
        weight: "50g",
      serves: 1,
      allergens: ["Gluten", "Wheat"],
      rating: 4.5,
    });

    await createDishWithVariants(breadCategory.id, {
      nameEn: "Naan",
      nameNl: "Naan",
      nameFr: "Naan",
      descriptionEn: "Soft, fluffy leavened flatbread baked in a traditional tandoor oven. Each naan is brushed with butter or ghee, adding richness and flavor.",
        descriptionNl: "Zacht, luchtig gezuurd platbrood gebakken in een traditionele tandoor oven. Elke naan wordt ingesmeerd met boter of ghee, waardoor rijkdom en smaak worden toegevoegd.",
        descriptionFr: "Pain plat levé moelleux et duveteux cuit dans un four tandoor traditionnel. Chaque naan est badigeonné de beurre ou de ghee, ajoutant richesse et saveur.",
      price: 2.00,
      quantity: "1 portion",
      weight: "80g",
      serves: 1,
      allergens: ["Gluten", "Wheat"],
      rating: 4.7,
    });
}

async function seedSides(sidesCategory: Awaited<ReturnType<typeof seedCategories>>['sidesCategory']) {
  console.log("\n🥗 Creating Sides...");

    await createDishWithVariants(sidesCategory.id, {
      nameEn: "Raita",
      nameNl: "Raita",
      nameFr: "Raita",
      descriptionEn: "Cooling yogurt dip perfect for balancing spicy dishes. Made with fresh yogurt and vegetables, it adds a refreshing, creamy element to your meal.",
        descriptionNl: "Verkoelende yoghurtdip perfect voor het in evenwicht brengen van pittige gerechten. Gemaakt met verse yoghurt en groenten, voegt het een verfrissend, romig element toe aan uw maaltijd.",
        descriptionFr: "Trempette de yaourt rafraîchissante parfaite pour équilibrer les plats épicés. Préparée avec du yaourt frais et des légumes, elle ajoute un élément rafraîchissant et crémeux à votre repas.",
      price: 3.00,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Dairy"],
      rating: 4.6,
    }, [
      { nameEn: "Baingan", nameNl: "Aubergine", nameFr: "Aubergine", sortOrder: 0 },
      { nameEn: "Cucumber", nameNl: "Komkommer", nameFr: "Concombre", sortOrder: 1 },
      { nameEn: "Mint", nameNl: "Munt", nameFr: "Menthe", sortOrder: 2 },
    ]);

    await createDishWithVariants(sidesCategory.id, {
      nameEn: "Chutney",
      nameNl: "Chutney",
      nameFr: "Chutney",
      descriptionEn: "Flavorful condiments made fresh daily with fruits, vegetables, and aromatic spices. Each variety brings unique flavors that complement your meal perfectly.",
        descriptionNl: "Smaakvolle condimenten dagelijks vers gemaakt met fruit, groenten en aromatische specerijen. Elke variëteit brengt unieke smaken die uw maaltijd perfect aanvullen.",
        descriptionFr: "Condiments savoureux préparés frais quotidiennement avec des fruits, légumes et épices aromatiques. Chaque variété apporte des saveurs uniques qui complètent parfaitement votre repas.",
      price: 2.50,
      quantity: "1 portion",
      weight: "100g",
      serves: 2,
      allergens: [],
      rating: 4.5,
    }, [
      { nameEn: "Green", nameNl: "Groen", nameFr: "Vert", sortOrder: 0 },
      { nameEn: "Red", nameNl: "Rood", nameFr: "Rouge", sortOrder: 1 },
      { nameEn: "Imli", nameNl: "Tamarinde", nameFr: "Tamarinde", sortOrder: 2 },
    ]);
}

async function seedDesserts(dessertsCategory: Awaited<ReturnType<typeof seedCategories>>['dessertsCategory']) {
  console.log("\n🍰 Creating Desserts...");

  await createDishWithVariants(dessertsCategory.id, {
      nameEn: "Gajjar Ka Halwa",
      nameNl: "Wortel Halwa",
      nameFr: "Halwa aux Carottes",
      descriptionEn: "Warm, comforting carrot dessert slow-cooked with milk, sugar, and cardamom until soft and creamy, finished with a generous sprinkling of nuts.",
        descriptionNl: "Warm, troostend worteldessert langzaam gekookt met melk, suiker en kardemom tot zacht en romig, afgewerkt met een royale besprenkeling van noten.",
        descriptionFr: "Dessert aux carottes chaud et réconfortant mijoté lentement avec du lait, du sucre et de la cardamome jusqu'à tendreté et crémeux, fini avec une généreuse saupoudrée de noix.",
      price: 6.00,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Dairy", "Nuts"],
      rating: 4.8,
    });

    await createDishWithVariants(dessertsCategory.id, {
      nameEn: "Gajrela",
      nameNl: "Gajrela",
      nameFr: "Gajrela",
      descriptionEn: "Rich carrot dessert made with condensed milk for an extra creamy, luxurious texture. Sweet, rich, and incredibly satisfying.",
        descriptionNl: "Rijke worteldessert gemaakt met gecondenseerde melk voor een extra romige, luxueuze textuur. Zoet, rijk en ongelooflijk bevredigend.",
        descriptionFr: "Dessert aux carottes riche préparé avec du lait condensé pour une texture extra crémeuse et luxueuse. Doux, riche et incroyablement satisfaisant.",
      price: 6.50,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Dairy", "Nuts"],
      rating: 4.7,
    });

    await createDishWithVariants(dessertsCategory.id, {
      nameEn: "Zafrani Kheer",
      nameNl: "Zafrani Kheer",
      nameFr: "Kheer au Safran",
      descriptionEn: "Luxurious rice pudding elevated with saffron and cardamom. Slow-cooked with milk until soft and creamy, finished with nuts.",
        descriptionNl: "Luxueuze rijstpudding verhoogd met saffraan en kardemom. Langzaam gekookt met melk tot zacht en romig, afgewerkt met noten.",
        descriptionFr: "Pudding de riz luxueux rehaussé avec du safran et de la cardamome. Mijoté lentement avec du lait jusqu'à tendreté et crémeux, fini avec des noix.",
      price: 5.50,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Dairy", "Nuts"],
      rating: 4.8,
    });

    await createDishWithVariants(dessertsCategory.id, {
      nameEn: "Shahi Tukray",
      nameNl: "Shahi Tukray",
      nameFr: "Shahi Tukray",
      descriptionEn: "Regal dessert meaning 'royal pieces'. Bread fried until golden and crispy, then soaked in sweetened, flavored milk and finished with nuts and saffron.",
        descriptionNl: "Koninklijk dessert dat letterlijk 'koninklijke stukken' betekent. Brood gefrituurd tot goudbruin en knapperig, dan gedrenkt in gezoete, gearomatiseerde melk en afgewerkt met noten en saffraan.",
        descriptionFr: "Dessert royal signifiant 'morceaux royaux'. Pain frit jusqu'à doré et croustillant, puis trempé dans du lait sucré et parfumé, fini avec des noix et du safran.",
      price: 6.00,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Gluten", "Wheat", "Dairy", "Nuts"],
      rating: 4.9,
    });

    await createDishWithVariants(dessertsCategory.id, {
      nameEn: "Rasmalai",
      nameNl: "Rasmalai",
      nameFr: "Rasmalai",
      descriptionEn: "Delicate, pillowy cheese dumplings soaked in sweetened, flavored milk. Rich, creamy, and delicately flavored with cardamom and saffron.",
        descriptionNl: "Delicate, kussenachtige kaasbolletjes gedrenkt in gezoete, gearomatiseerde melk. Rijk, romig en delicaat gearomatiseerd met kardemom en saffraan.",
        descriptionFr: "Boulettes de fromage délicates et moelleuses trempées dans du lait sucré et parfumé. Riche, crémeux et délicatement parfumé à la cardamome et au safran.",
      price: 6.50,
      quantity: "1 portion",
      weight: "200g",
      serves: 2,
      allergens: ["Dairy", "Nuts"],
      rating: 4.9,
    });
}

async function main() {
  const sections = sectionsToSeed ? sectionsToSeed.join(", ") : "all sections";
  console.log(`🌱 Seeding database (${sections})...\n`);

  try {
    // Always seed categories first if needed (they're required for dishes)
    let categories;
    const dishSections = ["starters", "biryani", "pilau", "curries", "bread", "sides", "desserts"];
    const hasDishSections = sectionsToSeed && sectionsToSeed.some(s => dishSections.includes(s));
    
    if (shouldSeed("categories") || !sectionsToSeed || hasDishSections) {
      categories = await seedCategories();
  } else {
      // If only seeding categories and they're already requested, fetch existing ones
      const startersCategory = await prisma.category.findUnique({ where: { slug: "starters" } });
      const biryaniCategory = await prisma.category.findUnique({ where: { slug: "biryani" } });
      const pilauCategory = await prisma.category.findUnique({ where: { slug: "pilau" } });
      const curriesCategory = await prisma.category.findUnique({ where: { slug: "curries" } });
      const breadCategory = await prisma.category.findUnique({ where: { slug: "bread" } });
      const sidesCategory = await prisma.category.findUnique({ where: { slug: "sides" } });
      const dessertsCategory = await prisma.category.findUnique({ where: { slug: "desserts" } });
      
      if (!startersCategory || !biryaniCategory || !pilauCategory || !curriesCategory || !breadCategory || !sidesCategory || !dessertsCategory) {
        throw new Error("Categories must be seeded first. Run: bun run db:seed categories");
      }
      
      categories = {
        startersCategory,
        biryaniCategory,
        pilauCategory,
        curriesCategory,
        breadCategory,
        sidesCategory,
        dessertsCategory,
      };
    }

    // Seed specific sections
    if (shouldSeed("starters")) {
      await seedStarters(categories.startersCategory);
    }

    if (shouldSeed("biryani")) {
      await seedBiryani(categories.biryaniCategory);
    }

    if (shouldSeed("pilau")) {
      await seedPilau(categories.pilauCategory);
    }

    if (shouldSeed("curries")) {
      await seedCurries(categories.curriesCategory);
    }

    if (shouldSeed("bread")) {
      await seedBread(categories.breadCategory);
    }

    if (shouldSeed("sides")) {
      await seedSides(categories.sidesCategory);
    }

    if (shouldSeed("desserts")) {
      await seedDesserts(categories.dessertsCategory);
  }

  console.log("\n🎉 Database seeded successfully!");
    if (sectionsToSeed) {
      console.log(`   Seeded sections: ${sectionsToSeed.join(", ")}\n`);
    } else {
      console.log("   All menu items have been added to the database.\n");
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error seeding database:", errorMessage);
    if (error instanceof Error && error.stack && process.env.NODE_ENV === "development") {
      console.error(error.stack);
    }
    throw error;
  }
}

main()
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Fatal error seeding database:", errorMessage);
    if (error instanceof Error && error.stack && process.env.NODE_ENV === "development") {
      console.error(error.stack);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
