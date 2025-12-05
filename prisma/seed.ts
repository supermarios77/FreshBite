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
        descriptionEn: "Golden, crispy spring rolls filled with a medley of fresh vegetables. Each bite delivers a satisfying crunch followed by the delicate flavors of cabbage, carrots, and bean sprouts. Served with our house-made sweet and sour dipping sauce that perfectly balances tangy and sweet notes.",
        descriptionNl: "Gouden, knapperige loempia's gevuld met een mix van verse groenten. Elke hap biedt een bevredigende knapperigheid gevolgd door de delicate smaken van kool, wortelen en taugé. Geserveerd met onze huisgemaakte zoetzure dipsaus die perfect de balans vindt tussen zuur en zoet.",
        descriptionFr: "Rouleaux de printemps dorés et croustillants farcis d'un mélange de légumes frais. Chaque bouchée offre un croquant satisfaisant suivi des saveurs délicates de chou, carottes et germes de soja. Servis avec notre sauce aigre-douce maison qui équilibre parfaitement les notes acidulées et sucrées.",
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
      descriptionEn: "Perfectly spiced triangular pastries with a golden, flaky crust that shatters with each bite. Inside, you'll find a warmly spiced filling that's been slow-cooked to develop deep, complex flavors. These samosas are served with fresh mint chutney that adds a cool, refreshing contrast to the rich spices.",
        descriptionNl: "Perfect gekruide driehoekige pasteitjes met een gouden, brosse korst die bij elke hap breekt. Binnenin vind je een warm gekruide vulling die langzaam is gekookt om diepe, complexe smaken te ontwikkelen. Deze samosas worden geserveerd met verse muntchutney die een koele, verfrissende tegenstelling vormt met de rijke specerijen.",
        descriptionFr: "Pâtisseries triangulaires parfaitement épicées avec une croûte dorée et feuilletée qui se brise à chaque bouchée. À l'intérieur, vous trouverez une garniture chaudement épicée qui a été mijotée lentement pour développer des saveurs profondes et complexes. Ces samoussas sont servies avec un chutney à la menthe fraîche qui ajoute un contraste frais et rafraîchissant aux épices riches.",
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
      descriptionEn: "Buttery, flaky pastry shells that melt in your mouth, filled with a deliciously spiced mixture. Each patty is carefully crafted with layers of flavor that unfold as you eat. The perfect balance of savory spices and rich pastry makes these an irresistible starter.",
        descriptionNl: "Boterachtige, brosse pasteitjes die in je mond smelten, gevuld met een heerlijk gekruid mengsel. Elke pasteitje is zorgvuldig gemaakt met lagen van smaak die zich ontvouwen terwijl je eet. De perfecte balans tussen hartige specerijen en rijke deeg maakt deze een onweerstaanbaar voorgerecht.",
        descriptionFr: "Coquilles de pâte feuilletée beurrées qui fondent dans la bouche, farcies d'un mélange délicieusement épicé. Chaque pâté est soigneusement préparé avec des couches de saveur qui se déploient au fur et à mesure que vous mangez. L'équilibre parfait entre épices salées et pâte riche en fait un entrée irrésistible.",
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
      descriptionEn: "Tender, succulent kebabs made from premium meat that's been marinated for hours in a secret blend of spices and herbs. Grilled to perfection over an open flame, each kebab has a beautiful char on the outside while remaining incredibly juicy inside. The aromatic spices create a flavor profile that's both bold and balanced.",
        descriptionNl: "Malse, sappige kebabs gemaakt van premium vlees dat urenlang is gemarineerd in een geheime mix van specerijen en kruiden. Perfect gegrild boven een open vuur, heeft elke kebab een prachtige korst aan de buitenkant terwijl het binnenin ongelooflijk sappig blijft. De aromatische specerijen creëren een smaakprofiel dat zowel krachtig als gebalanceerd is.",
        descriptionFr: "Kebabs tendres et succulents préparés avec de la viande de qualité supérieure marinée pendant des heures dans un mélange secret d'épices et d'herbes. Grillés à la perfection sur une flamme vive, chaque kebab a une belle croûte à l'extérieur tout en restant incroyablement juteux à l'intérieur. Les épices aromatiques créent un profil de saveur à la fois audacieux et équilibré.",
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
      descriptionEn: "Crispy golden potato patties that are perfectly spiced with aromatic herbs and warming spices. Each tikki has a satisfying crunch on the outside while the inside remains soft and flavorful. Served with tangy tamarind chutney and fresh mint chutney that complement the earthy potato flavors beautifully.",
        descriptionNl: "Knapperige gouden aardappel pasteitjes die perfect gekruid zijn met aromatische kruiden en verwarmende specerijen. Elke tikki heeft een bevredigende knapperigheid aan de buitenkant terwijl de binnenkant zacht en smaakvol blijft. Geserveerd met zurige tamarindchutney en verse muntchutney die de aardse aardappelsmaken prachtig aanvullen.",
        descriptionFr: "Galettes de pommes de terre dorées et croustillantes parfaitement épicées avec des herbes aromatiques et des épices réchauffantes. Chaque tikki a un croquant satisfaisant à l'extérieur tandis que l'intérieur reste doux et savoureux. Servies avec chutney tamarin acidulé et chutney à la menthe fraîche qui complètent magnifiquement les saveurs terreuses de la pomme de terre.",
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
      descriptionEn: "Succulent pieces of chicken that have been marinated in a rich, creamy malai (cream) mixture infused with aromatic spices. The marinade tenderizes the meat while infusing it with incredible flavor. Grilled until beautifully charred, these tikkas are incredibly tender and juicy, with a subtle creaminess that makes them truly special.",
        descriptionNl: "Sappige stukjes kip die zijn gemarineerd in een rijke, romige malai (room) mix doordrenkt met aromatische specerijen. De marinade maakt het vlees mals terwijl het wordt doordrenkt met ongelooflijke smaak. Gegrild tot prachtig geroosterd, zijn deze tikkas ongelooflijk mals en sappig, met een subtiele romigheid die ze echt bijzonder maakt.",
        descriptionFr: "Morceaux de poulet succulents qui ont été marinés dans un mélange riche et crémeux de malai (crème) infusé d'épices aromatiques. La marinade attendrit la viande tout en l'imprégnant d'une saveur incroyable. Grillés jusqu'à obtenir une belle croûte, ces tikkas sont incroyablement tendres et juteux, avec une onctuosité subtile qui les rend vraiment spéciaux.",
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
      descriptionEn: "A whole chicken that's been marinated in a blend of aromatic spices and slow-roasted to perfection. The result is incredibly tender, juicy meat with a beautifully spiced flavor that permeates every bite. The skin is perfectly crisp while the meat falls off the bone. This is comfort food at its finest.",
        descriptionNl: "Een hele kip die is gemarineerd in een mix van aromatische specerijen en langzaam geroosterd tot perfectie. Het resultaat is ongelooflijk mals, sappig vlees met een prachtig gekruide smaak die elke hap doordringt. De huid is perfect knapperig terwijl het vlees van het bot valt. Dit is comfort food op zijn best.",
        descriptionFr: "Un poulet entier qui a été mariné dans un mélange d'épices aromatiques et rôti lentement à la perfection. Le résultat est une viande incroyablement tendre et juteuse avec une saveur magnifiquement épicée qui imprègne chaque bouchée. La peau est parfaitement croustillante tandis que la viande se détache de l'os. C'est le confort alimentaire à son meilleur.",
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
      descriptionEn: "Our signature biryani features layers of fragrant basmati rice and tender, spiced chicken that have been cooked together using the traditional dum method. Each grain of rice is perfectly separate and infused with the rich flavors of saffron, cardamom, and other aromatic spices. The chicken is incredibly tender and falls apart with each forkful. Topped with crispy fried onions and fresh herbs, this is a dish that's both elegant and deeply satisfying.",
        descriptionNl: "Onze kenmerkende biryani bevat lagen geurige basmatirijst en malse, gekruide kip die samen zijn gekookt met de traditionele dum-methode. Elke korrel rijst is perfect gescheiden en doordrenkt met de rijke smaken van saffraan, kardemom en andere aromatische specerijen. De kip is ongelooflijk mals en valt uiteen bij elke vork. Afgewerkt met knapperige gefrituurde uien en verse kruiden, dit is een gerecht dat zowel elegant als diep bevredigend is.",
        descriptionFr: "Notre biryani signature présente des couches de riz basmati parfumé et de poulet tendre et épicé qui ont été cuits ensemble en utilisant la méthode traditionnelle dum. Chaque grain de riz est parfaitement séparé et infusé des saveurs riches du safran, de la cardamome et d'autres épices aromatiques. Le poulet est incroyablement tendre et se défait à chaque bouchée. Garni d'oignons frits croustillants et d'herbes fraîches, c'est un plat à la fois élégant et profondément satisfaisant.",
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
      descriptionEn: "A vibrant and flavorful biryani that celebrates fresh vegetables. Tender pieces of seasonal vegetables are cooked with aromatic basmati rice, creating layers of texture and flavor. The vegetables are perfectly spiced and retain their natural sweetness, while the rice absorbs all the wonderful flavors. Finished with saffron, fried onions, and fresh herbs, this vegetarian biryani is a complete meal that's both nutritious and delicious.",
        descriptionNl: "Een levendige en smaakvolle biryani die verse groenten viert. Malse stukjes seizoensgroenten worden gekookt met aromatische basmatirijst, waardoor lagen van textuur en smaak ontstaan. De groenten zijn perfect gekruid en behouden hun natuurlijke zoetheid, terwijl de rijst alle prachtige smaken opneemt. Afgewerkt met saffraan, gefrituurde uien en verse kruiden, deze vegetarische biryani is een complete maaltijd die zowel voedzaam als heerlijk is.",
        descriptionFr: "Un biryani vibrant et savoureux qui célèbre les légumes frais. Des morceaux tendres de légumes de saison sont cuits avec du riz basmati aromatique, créant des couches de texture et de saveur. Les légumes sont parfaitement épicés et conservent leur douceur naturelle, tandis que le riz absorbe toutes les merveilleuses saveurs. Finis avec du safran, des oignons frits et des herbes fraîches, ce biryani végétarien est un repas complet à la fois nutritif et délicieux.",
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
      descriptionEn: "A rich and hearty biryani made with perfectly spiced minced meat that's been slow-cooked until incredibly tender. The keema is packed with flavor from a blend of warming spices, and it's layered with fragrant basmati rice that's been infused with saffron and whole spices. Each bite delivers a perfect balance of spiced meat and aromatic rice. This is comfort food that warms you from the inside out.",
        descriptionNl: "Een rijke en hartige biryani gemaakt met perfect gekruid gehakt dat langzaam is gekookt tot ongelooflijk mals. De keema zit boordevol smaak van een mix van verwarmende specerijen, en het is gelaagd met geurige basmatirijst die is doordrenkt met saffraan en hele specerijen. Elke hap biedt een perfecte balans tussen gekruid vlees en aromatische rijst. Dit is comfort food dat je van binnenuit verwarmt.",
        descriptionFr: "Un biryani riche et copieux préparé avec de la viande hachée parfaitement épicée qui a été mijotée lentement jusqu'à devenir incroyablement tendre. Le keema est rempli de saveur grâce à un mélange d'épices réchauffantes, et il est superposé avec du riz basmati parfumé infusé de safran et d'épices entières. Chaque bouchée offre un équilibre parfait entre viande épicée et riz aromatique. C'est un plat réconfortant qui vous réchauffe de l'intérieur.",
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
      descriptionEn: "The crown jewel of our biryani collection. Tender pieces of mutton are slow-cooked with aromatic spices until they're fall-off-the-bone tender, then layered with fragrant basmati rice. The mutton imparts a rich, deep flavor to the rice, while the rice helps to balance the intensity of the meat. Finished with saffron, fried onions, and fresh mint, this is a biryani that's fit for a celebration. Every bite is a journey through layers of complex, well-developed flavors.",
        descriptionNl: "De kroonjuweel van onze biryani-collectie. Malse stukjes lamsvlees worden langzaam gekookt met aromatische specerijen tot ze van het bot vallen, en vervolgens gelaagd met geurige basmatirijst. Het lamsvlees geeft een rijke, diepe smaak aan de rijst, terwijl de rijst helpt om de intensiteit van het vlees in evenwicht te brengen. Afgewerkt met saffraan, gefrituurde uien en verse munt, dit is een biryani die geschikt is voor een feest. Elke hap is een reis door lagen van complexe, goed ontwikkelde smaken.",
        descriptionFr: "Le joyau de la couronne de notre collection de biryani. Des morceaux tendres de mouton sont mijotés lentement avec des épices aromatiques jusqu'à ce qu'ils soient tendres à tomber de l'os, puis superposés avec du riz basmati parfumé. Le mouton confère une saveur riche et profonde au riz, tandis que le riz aide à équilibrer l'intensité de la viande. Finis avec du safran, des oignons frits et de la menthe fraîche, c'est un biryani digne d'une célébration. Chaque bouchée est un voyage à travers des couches de saveurs complexes et bien développées.",
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
      descriptionEn: "Aromatic basmati rice cooked with tender pieces of chicken and a blend of whole spices. The rice is perfectly fluffy and each grain is separate, infused with the rich flavors of the chicken and spices. The chicken is incredibly tender and flavorful, having been cooked together with the rice so that all the flavors meld beautifully. This is a simple yet elegant dish that showcases the beauty of well-cooked rice and perfectly spiced chicken.",
        descriptionNl: "Aromatische basmatirijst gekookt met malse stukjes kip en een mix van hele specerijen. De rijst is perfect luchtig en elke korrel is gescheiden, doordrenkt met de rijke smaken van de kip en specerijen. De kip is ongelooflijk mals en smaakvol, omdat het samen met de rijst is gekookt zodat alle smaken prachtig samensmelten. Dit is een eenvoudig maar elegant gerecht dat de schoonheid van goed gekookte rijst en perfect gekruide kip toont.",
        descriptionFr: "Riz basmati aromatique cuit avec des morceaux tendres de poulet et un mélange d'épices entières. Le riz est parfaitement moelleux et chaque grain est séparé, infusé des saveurs riches du poulet et des épices. Le poulet est incroyablement tendre et savoureux, ayant été cuit avec le riz pour que toutes les saveurs se fondent magnifiquement. C'est un plat simple mais élégant qui met en valeur la beauté du riz bien cuit et du poulet parfaitement épicé.",
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
      descriptionEn: "Rich and flavorful pilau made with tender mutton that's been slow-cooked until it's incredibly tender. The mutton imparts a deep, meaty flavor to the rice, while the whole spices add layers of aromatic complexity. Each grain of rice is perfectly cooked and infused with the rich flavors. This is a hearty, satisfying dish that's perfect for when you want something substantial and deeply flavorful.",
        descriptionNl: "Rijke en smaakvolle pilau gemaakt met mals lamsvlees dat langzaam is gekookt tot het ongelooflijk mals is. Het lamsvlees geeft een diepe, vlezige smaak aan de rijst, terwijl de hele specerijen lagen van aromatische complexiteit toevoegen. Elke korrel rijst is perfect gekookt en doordrenkt met de rijke smaken. Dit is een hartige, bevredigende schotel die perfect is voor wanneer je iets substantieels en diep smaakvols wilt.",
        descriptionFr: "Pilau riche et savoureux préparé avec du mouton tendre qui a été mijoté lentement jusqu'à devenir incroyablement tendre. Le mouton confère une saveur profonde et charnue au riz, tandis que les épices entières ajoutent des couches de complexité aromatique. Chaque grain de riz est parfaitement cuit et infusé des saveurs riches. C'est un plat copieux et satisfaisant, parfait pour quand vous voulez quelque chose de substantiel et profondément savoureux.",
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
      descriptionEn: "A vegetarian pilau that's both nutritious and delicious. Tender chickpeas are cooked with aromatic basmati rice and whole spices, creating a dish that's hearty and satisfying. The chickpeas add a lovely texture and protein, while the spices create layers of flavor. This is a complete meal that's perfect for vegetarians or anyone looking for a lighter option that doesn't compromise on taste.",
        descriptionNl: "Een vegetarische pilau die zowel voedzaam als heerlijk is. Malse kikkererwten worden gekookt met aromatische basmatirijst en hele specerijen, waardoor een gerecht ontstaat dat hartig en bevredigend is. De kikkererwten voegen een mooie textuur en eiwit toe, terwijl de specerijen lagen van smaak creëren. Dit is een complete maaltijd die perfect is voor vegetariërs of iedereen die op zoek is naar een lichtere optie die niet inboet op smaak.",
        descriptionFr: "Un pilau végétarien à la fois nutritif et délicieux. Des pois chiches tendres sont cuits avec du riz basmati aromatique et des épices entières, créant un plat copieux et satisfaisant. Les pois chiches ajoutent une belle texture et des protéines, tandis que les épices créent des couches de saveur. C'est un repas complet parfait pour les végétariens ou quiconque cherche une option plus légère qui ne compromet pas le goût.",
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
      descriptionEn: "A colorful and vibrant pilau featuring a medley of fresh seasonal vegetables. Each vegetable is cooked to perfection, retaining its natural texture and flavor, while the rice absorbs all the wonderful vegetable juices and spices. This is a light yet satisfying dish that's packed with nutrients and flavor. Perfect for vegetarians or anyone looking for a healthy, delicious meal.",
        descriptionNl: "Een kleurrijke en levendige pilau met een mix van verse seizoensgroenten. Elke groente is perfect gekookt, behoudt zijn natuurlijke textuur en smaak, terwijl de rijst alle prachtige groentesappen en specerijen opneemt. Dit is een licht maar bevredigend gerecht dat boordevol voedingsstoffen en smaak zit. Perfect voor vegetariërs of iedereen die op zoek is naar een gezonde, heerlijke maaltijd.",
        descriptionFr: "Un pilau coloré et vibrant présentant un mélange de légumes de saison frais. Chaque légume est cuit à la perfection, conservant sa texture et sa saveur naturelles, tandis que le riz absorbe tous les merveilleux jus de légumes et épices. C'est un plat léger mais satisfaisant, rempli de nutriments et de saveur. Parfait pour les végétariens ou quiconque cherche un repas sain et délicieux.",
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
      descriptionEn: "A bold and spicy curry that's cooked in a traditional karahi (wok) to create intense, concentrated flavors. Tender pieces of chicken are cooked with fresh tomatoes, green chilies, and a blend of aromatic spices until the sauce is rich and flavorful. The high-heat cooking method creates a beautiful depth of flavor that's both spicy and tangy. This is a curry that's full of character and perfect for spice lovers.",
        descriptionNl: "Een krachtige en pittige curry die wordt gekookt in een traditionele karahi (wok) om intense, geconcentreerde smaken te creëren. Malse stukjes kip worden gekookt met verse tomaten, groene pepers en een mix van aromatische specerijen tot de saus rijk en smaakvol is. De hoge-temperatuur kookmethode creëert een prachtige diepte van smaak die zowel pittig als zuur is. Dit is een curry vol karakter en perfect voor liefhebbers van pittig eten.",
        descriptionFr: "Un curry audacieux et épicé cuit dans un karahi (wok) traditionnel pour créer des saveurs intenses et concentrées. Des morceaux tendres de poulet sont cuits avec des tomates fraîches, des piments verts et un mélange d'épices aromatiques jusqu'à ce que la sauce soit riche et savoureuse. La méthode de cuisson à feu vif crée une belle profondeur de saveur à la fois épicée et acidulée. C'est un curry plein de caractère et parfait pour les amateurs d'épices.",
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
      descriptionEn: "A rich and robust curry featuring tender mutton that's been slow-cooked in a traditional karahi. The mutton becomes incredibly tender and absorbs all the wonderful spices and flavors. The sauce is thick, rich, and full of depth, with a perfect balance of heat and aromatic spices. This is a curry that's deeply satisfying and perfect for those who love bold, meaty flavors.",
        descriptionNl: "Een rijke en robuuste curry met mals lamsvlees dat langzaam is gekookt in een traditionele karahi. Het lamsvlees wordt ongelooflijk mals en neemt alle prachtige specerijen en smaken op. De saus is dik, rijk en vol diepte, met een perfecte balans tussen hitte en aromatische specerijen. Dit is een curry die diep bevredigend is en perfect voor degenen die houden van krachtige, vlezige smaken.",
        descriptionFr: "Un curry riche et robuste avec du mouton tendre qui a été mijoté lentement dans un karahi traditionnel. Le mouton devient incroyablement tendre et absorbe toutes les merveilleuses épices et saveurs. La sauce est épaisse, riche et pleine de profondeur, avec un équilibre parfait entre chaleur et épices aromatiques. C'est un curry profondément satisfaisant et parfait pour ceux qui aiment les saveurs audacieuses et charnues.",
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
      descriptionEn: "A luxurious and creamy curry that's rich, mild, and incredibly flavorful. Tender pieces of chicken are cooked in a velvety sauce made with yogurt, cream, and a blend of aromatic spices. The result is a curry that's smooth, elegant, and deeply satisfying. The creaminess helps to balance the spices, creating a dish that's flavorful without being too spicy. This is perfect for those who prefer milder curries but still want incredible depth of flavor.",
        descriptionNl: "Een luxueuze en romige curry die rijk, mild en ongelooflijk smaakvol is. Malse stukjes kip worden gekookt in een fluweelzachte saus gemaakt met yoghurt, room en een mix van aromatische specerijen. Het resultaat is een curry die soepel, elegant en diep bevredigend is. De romigheid helpt om de specerijen in evenwicht te brengen, waardoor een gerecht ontstaat dat smaakvol is zonder te pittig te zijn. Dit is perfect voor degenen die de voorkeur geven aan mildere curry's maar nog steeds een ongelooflijke diepte van smaak willen.",
        descriptionFr: "Un curry luxueux et crémeux qui est riche, doux et incroyablement savoureux. Des morceaux tendres de poulet sont cuits dans une sauce veloutée faite avec du yaourt, de la crème et un mélange d'épices aromatiques. Le résultat est un curry lisse, élégant et profondément satisfaisant. L'onctuosité aide à équilibrer les épices, créant un plat savoureux sans être trop épicé. C'est parfait pour ceux qui préfèrent des curry plus doux mais qui veulent toujours une profondeur de saveur incroyable.",
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
      descriptionEn: "An elegant and rich curry that showcases the best of mutton. The meat is slow-cooked until it's incredibly tender, then finished in a creamy sauce made with yogurt, cream, and aromatic spices. The mutton's rich flavor pairs beautifully with the creamy, mild sauce, creating a curry that's sophisticated and deeply satisfying. This is a dish that's fit for special occasions.",
        descriptionNl: "Een elegante en rijke curry die het beste van lamsvlees toont. Het vlees wordt langzaam gekookt tot het ongelooflijk mals is, en vervolgens afgewerkt in een romige saus gemaakt met yoghurt, room en aromatische specerijen. De rijke smaak van het lamsvlees combineert prachtig met de romige, milde saus, waardoor een curry ontstaat die verfijnd en diep bevredigend is. Dit is een gerecht dat geschikt is voor speciale gelegenheden.",
        descriptionFr: "Un curry élégant et riche qui met en valeur le meilleur du mouton. La viande est mijotée lentement jusqu'à devenir incroyablement tendre, puis finie dans une sauce crémeuse faite avec du yaourt, de la crème et des épices aromatiques. La saveur riche du mouton se marie magnifiquement avec la sauce crémeuse et douce, créant un curry sophistiqué et profondément satisfaisant. C'est un plat digne d'occasions spéciales.",
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
      descriptionEn: "A unique and flavorful curry made with tender trotters that have been slow-cooked until they're incredibly tender and the collagen has melted into the sauce, creating a rich, gelatinous texture. The curry is deeply spiced and full of flavor, with the trotters adding a unique richness that's both satisfying and comforting. This is a traditional dish that's beloved for its rich, complex flavors.",
        descriptionNl: "Een unieke en smaakvolle curry gemaakt met malse trotters die langzaam zijn gekookt tot ze ongelooflijk mals zijn en het collageen is gesmolten in de saus, waardoor een rijke, gelatineachtige textuur ontstaat. De curry is diep gekruid en vol smaak, waarbij de trotters een unieke rijkdom toevoegen die zowel bevredigend als troostend is. Dit is een traditioneel gerecht dat geliefd is om zijn rijke, complexe smaken.",
        descriptionFr: "Un curry unique et savoureux préparé avec des trotters tendres qui ont été mijotés lentement jusqu'à devenir incroyablement tendres et le collagène a fondu dans la sauce, créant une texture riche et gélatineuse. Le curry est profondément épicé et plein de saveur, les trotters ajoutant une richesse unique qui est à la fois satisfaisante et réconfortante. C'est un plat traditionnel apprécié pour ses saveurs riches et complexes.",
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
      descriptionEn: "A legendary slow-cooked curry that's traditionally served for breakfast but is perfect any time of day. The meat is cooked for hours until it's fall-off-the-bone tender, and the sauce is rich, thick, and incredibly flavorful. The long cooking process allows all the spices to meld together, creating a complex, well-developed flavor profile. This is a curry that's deeply satisfying and perfect for when you want something truly special.",
        descriptionNl: "Een legendarische langzaam gekookte curry die traditioneel wordt geserveerd als ontbijt maar perfect is op elk moment van de dag. Het vlees wordt urenlang gekookt tot het van het bot valt, en de saus is rijk, dik en ongelooflijk smaakvol. Het lange kookproces zorgt ervoor dat alle specerijen samensmelten, waardoor een complex, goed ontwikkeld smaakprofiel ontstaat. Dit is een curry die diep bevredigend is en perfect voor wanneer je iets echt bijzonders wilt.",
        descriptionFr: "Un curry légendaire mijoté qui est traditionnellement servi au petit-déjeuner mais qui est parfait à tout moment de la journée. La viande est cuite pendant des heures jusqu'à ce qu'elle soit tendre à tomber de l'os, et la sauce est riche, épaisse et incroyablement savoureuse. Le long processus de cuisson permet à toutes les épices de se fondre ensemble, créant un profil de saveur complexe et bien développé. C'est un curry profondément satisfaisant et parfait quand vous voulez quelque chose de vraiment spécial.",
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
      descriptionEn: "A unique curry that features bitter gourd cooked with tender meat. The bitterness of the gourd is balanced by the rich, spiced meat, creating a complex flavor profile that's both interesting and delicious. The gourd becomes tender and absorbs the flavors of the curry, while the meat adds richness and depth. This is a dish for adventurous eaters who appreciate bold, complex flavors.",
        descriptionNl: "Een unieke curry met bittere pompoen gekookt met mals vlees. De bitterheid van de pompoen wordt in evenwicht gebracht door het rijke, gekruide vlees, waardoor een complex smaakprofiel ontstaat dat zowel interessant als heerlijk is. De pompoen wordt mals en neemt de smaken van de curry op, terwijl het vlees rijkdom en diepte toevoegt. Dit is een gerecht voor avontuurlijke eters die houden van krachtige, complexe smaken.",
        descriptionFr: "Un curry unique qui présente de la courge amère cuite avec de la viande tendre. L'amertume de la courge est équilibrée par la viande riche et épicée, créant un profil de saveur complexe qui est à la fois intéressant et délicieux. La courge devient tendre et absorbe les saveurs du curry, tandis que la viande ajoute de la richesse et de la profondeur. C'est un plat pour les mangeurs aventureux qui apprécient les saveurs audacieuses et complexes.",
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
      descriptionEn: "A colorful and nutritious curry featuring a variety of fresh seasonal vegetables. Each vegetable is cooked to perfection, retaining its natural texture and flavor, while being infused with aromatic spices. The curry sauce is flavorful and well-balanced, complementing the natural sweetness of the vegetables. This is a hearty, satisfying dish that's perfect for vegetarians or anyone looking for a healthy, delicious meal.",
        descriptionNl: "Een kleurrijke en voedzame curry met een verscheidenheid aan verse seizoensgroenten. Elke groente is perfect gekookt, behoudt zijn natuurlijke textuur en smaak, terwijl het wordt doordrenkt met aromatische specerijen. De currysaus is smaakvol en goed gebalanceerd, complementeert de natuurlijke zoetheid van de groenten. Dit is een hartige, bevredigende schotel die perfect is voor vegetariërs of iedereen die op zoek is naar een gezonde, heerlijke maaltijd.",
        descriptionFr: "Un curry coloré et nutritif présentant une variété de légumes de saison frais. Chaque légume est cuit à la perfection, conservant sa texture et sa saveur naturelles, tout en étant infusé d'épices aromatiques. La sauce curry est savoureuse et bien équilibrée, complétant la douceur naturelle des légumes. C'est un plat copieux et satisfaisant, parfait pour les végétariens ou quiconque cherche un repas sain et délicieux.",
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
      descriptionEn: "Fresh okra cooked with onions, tomatoes, and aromatic spices until tender. The okra has a unique texture that some people love - it's slightly sticky when cooked, which helps to thicken the curry naturally. The spices complement the okra's natural flavor beautifully, creating a curry that's both simple and delicious. This is a classic vegetarian dish that's packed with flavor.",
        descriptionNl: "Verse okra gekookt met uien, tomaten en aromatische specerijen tot mals. De okra heeft een unieke textuur waar sommige mensen van houden - het is licht plakkerig wanneer gekookt, wat helpt om de curry natuurlijk te verdikken. De specerijen complementeren de natuurlijke smaak van de okra prachtig, waardoor een curry ontstaat die zowel eenvoudig als heerlijk is. Dit is een klassiek vegetarisch gerecht dat boordevol smaak zit.",
        descriptionFr: "Gombo frais cuit avec des oignons, des tomates et des épices aromatiques jusqu'à tendreté. Le gombo a une texture unique que certaines personnes adorent - il est légèrement collant une fois cuit, ce qui aide à épaissir naturellement le curry. Les épices complètent magnifiquement la saveur naturelle du gombo, créant un curry à la fois simple et délicieux. C'est un plat végétarien classique rempli de saveur.",
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
      descriptionEn: "A comforting and nutritious lentil curry that's a staple in many households. The lentils are cooked until they're soft and creamy, then finished with a tempering of spices that adds layers of flavor. This is a simple, humble dish that's incredibly satisfying. The lentils provide protein and fiber, while the spices add warmth and flavor. Perfect for a healthy, comforting meal.",
        descriptionNl: "Een troostende en voedzame linzencurry die een hoofdbestanddeel is in veel huishoudens. De linzen worden gekookt tot ze zacht en romig zijn, en vervolgens afgewerkt met een tempering van specerijen die lagen van smaak toevoegt. Dit is een eenvoudig, nederig gerecht dat ongelooflijk bevredigend is. De linzen leveren eiwit en vezels, terwijl de specerijen warmte en smaak toevoegen. Perfect voor een gezonde, troostende maaltijd.",
        descriptionFr: "Un curry de lentilles réconfortant et nutritif qui est un aliment de base dans de nombreux foyers. Les lentilles sont cuites jusqu'à ce qu'elles soient tendres et crémeuses, puis finies avec un tempérage d'épices qui ajoute des couches de saveur. C'est un plat simple et humble qui est incroyablement satisfaisant. Les lentilles fournissent des protéines et des fibres, tandis que les épices ajoutent de la chaleur et de la saveur. Parfait pour un repas sain et réconfortant.",
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
      descriptionEn: "A spicy and flavorful curry made with chickpeas in the style of Lahore. The chickpeas are cooked until they're tender but still have a bit of bite, and they're simmered in a rich, spicy sauce that's full of flavor. The Lahori style is known for its bold spices and rich flavors. This is a hearty, satisfying curry that's perfect for vegetarians or anyone who loves chickpeas.",
        descriptionNl: "Een pittige en smaakvolle curry gemaakt met kikkererwten in de stijl van Lahore. De kikkererwten worden gekookt tot ze mals zijn maar nog steeds een beetje bite hebben, en ze worden gepocheerd in een rijke, pittige saus die vol smaak zit. De Lahori-stijl staat bekend om zijn krachtige specerijen en rijke smaken. Dit is een hartige, bevredigende curry die perfect is voor vegetariërs of iedereen die van kikkererwten houdt.",
        descriptionFr: "Un curry épicé et savoureux préparé avec des pois chiches dans le style de Lahore. Les pois chiches sont cuits jusqu'à ce qu'ils soient tendres mais conservent encore un peu de mordant, et ils sont mijotés dans une sauce riche et épicée pleine de saveur. Le style Lahori est connu pour ses épices audacieuses et ses saveurs riches. C'est un curry copieux et satisfaisant, parfait pour les végétariens ou quiconque aime les pois chiches.",
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
      descriptionEn: "A luxurious and creamy lentil curry that's rich, smooth, and incredibly flavorful. Black lentils are slow-cooked until they're soft and creamy, then finished with butter and cream. The result is a curry that's velvety smooth and deeply satisfying. The richness of the butter and cream balances the earthiness of the lentils, creating a dish that's both elegant and comforting. This is a special dish that's perfect for when you want something truly indulgent.",
        descriptionNl: "Een luxueuze en romige linzencurry die rijk, soepel en ongelooflijk smaakvol is. Zwarte linzen worden langzaam gekookt tot ze zacht en romig zijn, en vervolgens afgewerkt met boter en room. Het resultaat is een curry die fluweelzacht en diep bevredigend is. De rijkdom van de boter en room balanceert de aardse smaak van de linzen, waardoor een gerecht ontstaat dat zowel elegant als troostend is. Dit is een speciaal gerecht dat perfect is voor wanneer je iets echt verrukkelijks wilt.",
        descriptionFr: "Un curry de lentilles luxueux et crémeux qui est riche, lisse et incroyablement savoureux. Les lentilles noires sont mijotées lentement jusqu'à ce qu'elles soient tendres et crémeuses, puis finies avec du beurre et de la crème. Le résultat est un curry velouté et profondément satisfaisant. La richesse du beurre et de la crème équilibre le caractère terreux des lentilles, créant un plat à la fois élégant et réconfortant. C'est un plat spécial parfait quand vous voulez quelque chose de vraiment indulgent.",
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
      descriptionEn: "A hearty and flavorful curry made with kidney beans that have been slow-cooked until they're tender and creamy. The beans are simmered in a rich, spicy sauce that's full of flavor. This is a classic North Indian dish that's both nutritious and delicious. The kidney beans provide protein and fiber, while the spices add warmth and complexity. Perfect for a satisfying, healthy meal.",
        descriptionNl: "Een hartige en smaakvolle curry gemaakt met kidneybonen die langzaam zijn gekookt tot ze mals en romig zijn. De bonen worden gepocheerd in een rijke, pittige saus die vol smaak zit. Dit is een klassiek Noord-Indisch gerecht dat zowel voedzaam als heerlijk is. De kidneybonen leveren eiwit en vezels, terwijl de specerijen warmte en complexiteit toevoegen. Perfect voor een bevredigende, gezonde maaltijd.",
        descriptionFr: "Un curry copieux et savoureux préparé avec des haricots rouges qui ont été mijotés lentement jusqu'à ce qu'ils soient tendres et crémeux. Les haricots sont mijotés dans une sauce riche et épicée pleine de saveur. C'est un plat classique du Nord de l'Inde à la fois nutritif et délicieux. Les haricots rouges fournissent des protéines et des fibres, tandis que les épices ajoutent de la chaleur et de la complexité. Parfait pour un repas satisfaisant et sain.",
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
      descriptionEn: "A rich and flavorful curry made with black gram lentils (urad dal). These lentils have a unique, earthy flavor and become incredibly creamy when cooked. They're simmered with aromatic spices until they're soft and the flavors have melded together beautifully. This is a traditional dish that's both simple and deeply satisfying. The lentils provide protein and fiber, making this a healthy, nutritious meal.",
        descriptionNl: "Een rijke en smaakvolle curry gemaakt met zwarte gram linzen (urad dal). Deze linzen hebben een unieke, aardse smaak en worden ongelooflijk romig wanneer gekookt. Ze worden gepocheerd met aromatische specerijen tot ze zacht zijn en de smaken prachtig zijn samengesmolten. Dit is een traditioneel gerecht dat zowel eenvoudig als diep bevredigend is. De linzen leveren eiwit en vezels, waardoor dit een gezonde, voedzame maaltijd is.",
        descriptionFr: "Un curry riche et savoureux préparé avec des lentilles de gram noir (urad dal). Ces lentilles ont une saveur unique et terreuse et deviennent incroyablement crémeuses une fois cuites. Elles sont mijotées avec des épices aromatiques jusqu'à ce qu'elles soient tendres et que les saveurs se soient magnifiquement fondues. C'est un plat traditionnel à la fois simple et profondément satisfaisant. Les lentilles fournissent des protéines et des fibres, faisant de ceci un repas sain et nutritif.",
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
      descriptionEn: "Fresh, soft whole wheat flatbread that's made daily in our kitchen. Each roti is hand-rolled and cooked on a hot griddle until it puffs up beautifully. The result is a soft, slightly chewy bread that's perfect for scooping up curries and soaking up all those delicious sauces. There's something incredibly satisfying about tearing into a fresh, warm roti.",
        descriptionNl: "Vers, zacht volkoren platbrood dat dagelijks in onze keuken wordt gemaakt. Elke roti wordt met de hand gerold en gekookt op een hete bakplaat tot het prachtig opzwelt. Het resultaat is een zacht, licht taai brood dat perfect is voor het opscheppen van curry's en het opzuigen van al die heerlijke sauzen. Er is iets ongelooflijk bevredigends aan het scheuren van een verse, warme roti.",
        descriptionFr: "Pain plat de blé entier frais et moelleux préparé quotidiennement dans notre cuisine. Chaque roti est roulé à la main et cuit sur une plaque chaude jusqu'à ce qu'il gonfle magnifiquement. Le résultat est un pain doux et légèrement moelleux, parfait pour ramasser les curry et absorber toutes ces délicieuses sauces. Il y a quelque chose d'incroyablement satisfaisant à déchirer un roti frais et chaud.",
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
      descriptionEn: "Soft, fluffy leavened flatbread that's baked in a traditional tandoor oven. The high heat of the tandoor creates a beautiful char on the outside while keeping the inside soft and pillowy. Each naan is brushed with butter or ghee, adding richness and flavor. There's nothing quite like tearing into a warm, buttery naan fresh from the tandoor. It's the perfect accompaniment to any curry.",
        descriptionNl: "Zacht, luchtig gezuurd platbrood dat wordt gebakken in een traditionele tandoor oven. De hitte van de tandoor creëert een prachtige korst aan de buitenkant terwijl de binnenkant zacht en kussenachtig blijft. Elke naan wordt ingesmeerd met boter of ghee, waardoor rijkdom en smaak worden toegevoegd. Er is niets zoals het scheuren van een warme, boterachtige naan vers uit de tandoor. Het is de perfecte begeleiding bij elke curry.",
        descriptionFr: "Pain plat levé moelleux et duveteux cuit dans un four tandoor traditionnel. La chaleur intense du tandoor crée une belle croûte à l'extérieur tout en gardant l'intérieur doux et moelleux. Chaque naan est badigeonné de beurre ou de ghee, ajoutant richesse et saveur. Il n'y a rien de tel que de déchirer un naan chaud et beurré frais du tandoor. C'est l'accompagnement parfait pour n'importe quel curry.",
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
      descriptionEn: "A cooling yogurt dip that's the perfect accompaniment to spicy dishes. Made with fresh yogurt and a variety of vegetables, our raita helps to balance the heat of curries while adding a refreshing, creamy element to your meal. It's light, tangy, and incredibly refreshing. Whether you choose the cucumber, mint, or eggplant version, each one brings its own unique flavor profile that complements spicy food beautifully.",
        descriptionNl: "Een verkoelende yoghurtdip die de perfecte begeleiding is bij pittige gerechten. Gemaakt met verse yoghurt en een verscheidenheid aan groenten, helpt onze raita om de hitte van curry's in evenwicht te brengen terwijl het een verfrissend, romig element toevoegt aan uw maaltijd. Het is licht, zuur en ongelooflijk verfrissend. Of u nu kiest voor de komkommer-, munt- of aubergineversie, elk brengt zijn eigen unieke smaakprofiel dat pittig eten prachtig aanvult.",
        descriptionFr: "Une trempette de yaourt rafraîchissante qui est l'accompagnement parfait pour les plats épicés. Préparée avec du yaourt frais et une variété de légumes, notre raita aide à équilibrer la chaleur des curry tout en ajoutant un élément rafraîchissant et crémeux à votre repas. Elle est légère, acidulée et incroyablement rafraîchissante. Que vous choisissiez la version concombre, menthe ou aubergine, chacune apporte son propre profil de saveur unique qui complète magnifiquement la nourriture épicée.",
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
      descriptionEn: "Flavorful condiments that add a burst of flavor to any meal. Our chutneys are made fresh daily using a combination of fruits, vegetables, and aromatic spices. Each variety brings something different - the green chutney is fresh and herby, the red is tangy and slightly sweet, and the tamarind (imli) is both sweet and sour. They're the perfect way to add an extra dimension of flavor to your meal.",
        descriptionNl: "Smaakvolle condimenten die een uitbarsting van smaak toevoegen aan elke maaltijd. Onze chutneys worden dagelijks vers gemaakt met een combinatie van fruit, groenten en aromatische specerijen. Elke variëteit brengt iets anders - de groene chutney is vers en kruidig, de rode is zuur en licht zoet, en de tamarinde (imli) is zowel zoet als zuur. Ze zijn de perfecte manier om een extra dimensie van smaak toe te voegen aan uw maaltijd.",
        descriptionFr: "Condiments savoureux qui ajoutent une explosion de saveur à n'importe quel repas. Nos chutneys sont préparés frais quotidiennement en utilisant une combinaison de fruits, légumes et épices aromatiques. Chaque variété apporte quelque chose de différent - le chutney vert est frais et herbeux, le rouge est acidulé et légèrement sucré, et le tamarin (imli) est à la fois sucré et acide. Ils sont le moyen parfait d'ajouter une dimension supplémentaire de saveur à votre repas.",
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
      descriptionEn: "A warm, comforting dessert that's like a hug in a bowl. Grated carrots are slow-cooked with milk, sugar, and cardamom until they become soft and the milk has reduced to create a rich, creamy texture. The dessert is finished with a generous sprinkling of nuts, adding crunch and richness. Each spoonful is sweet, creamy, and deeply satisfying. This is a traditional dessert that's perfect for ending a meal on a sweet note.",
        descriptionNl: "Een warm, troostend dessert dat als een knuffel in een kom is. Geraspte wortelen worden langzaam gekookt met melk, suiker en kardemom tot ze zacht worden en de melk is gereduceerd om een rijke, romige textuur te creëren. Het dessert wordt afgewerkt met een royale besprenkeling van noten, waardoor knapperigheid en rijkdom worden toegevoegd. Elke lepel is zoet, romig en diep bevredigend. Dit is een traditioneel dessert dat perfect is om een maaltijd op een zoete noot te beëindigen.",
        descriptionFr: "Un dessert chaud et réconfortant qui est comme un câlin dans un bol. Les carottes râpées sont mijotées lentement avec du lait, du sucre et de la cardamome jusqu'à ce qu'elles deviennent tendres et que le lait soit réduit pour créer une texture riche et crémeuse. Le dessert est fini avec une généreuse saupoudrée de noix, ajoutant du croquant et de la richesse. Chaque cuillerée est douce, crémeuse et profondément satisfaisante. C'est un dessert traditionnel parfait pour terminer un repas sur une note sucrée.",
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
      descriptionEn: "A rich and indulgent carrot dessert that's made with condensed milk, giving it an extra creamy, luxurious texture. The carrots are cooked until they're soft and have absorbed all the sweetness from the condensed milk. Finished with nuts, this dessert is sweet, rich, and incredibly satisfying. It's the perfect treat for when you want something truly special and indulgent.",
        descriptionNl: "Een rijke en verrukkelijke worteldessert die wordt gemaakt met gecondenseerde melk, waardoor het een extra romige, luxueuze textuur krijgt. De wortelen worden gekookt tot ze zacht zijn en alle zoetheid van de gecondenseerde melk hebben opgenomen. Afgewerkt met noten, dit dessert is zoet, rijk en ongelooflijk bevredigend. Het is de perfecte traktatie voor wanneer je iets echt speciaal en verrukkelijks wilt.",
        descriptionFr: "Un dessert aux carottes riche et indulgent préparé avec du lait condensé, lui donnant une texture extra crémeuse et luxueuse. Les carottes sont cuites jusqu'à ce qu'elles soient tendres et aient absorbé toute la douceur du lait condensé. Finies avec des noix, ce dessert est doux, riche et incroyablement satisfaisant. C'est la friandise parfaite quand vous voulez quelque chose de vraiment spécial et indulgent.",
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
      descriptionEn: "A luxurious rice pudding that's been elevated with the addition of saffron and cardamom. The rice is slow-cooked with milk until it becomes soft and creamy, and the saffron adds a beautiful golden color and delicate floral notes. The cardamom adds warmth and complexity. Finished with nuts, this is a dessert that's elegant, sophisticated, and deeply satisfying. Each spoonful is creamy, aromatic, and absolutely delicious.",
        descriptionNl: "Een luxueuze rijstpudding die is verhoogd met de toevoeging van saffraan en kardemom. De rijst wordt langzaam gekookt met melk tot het zacht en romig wordt, en de saffraan voegt een prachtige gouden kleur en delicate bloemige noten toe. De kardemom voegt warmte en complexiteit toe. Afgewerkt met noten, dit is een dessert dat elegant, verfijnd en diep bevredigend is. Elke lepel is romig, aromatisch en absoluut heerlijk.",
        descriptionFr: "Un pudding de riz luxueux qui a été rehaussé avec l'ajout de safran et de cardamome. Le riz est mijoté lentement avec du lait jusqu'à ce qu'il devienne tendre et crémeux, et le safran ajoute une belle couleur dorée et des notes florales délicates. La cardamome ajoute de la chaleur et de la complexité. Finie avec des noix, c'est un dessert élégant, sophistiqué et profondément satisfaisant. Chaque cuillerée est crémeuse, aromatique et absolument délicieuse.",
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
      descriptionEn: "A regal dessert that literally means 'royal pieces'. Bread is fried until golden and crispy, then soaked in sweetened, flavored milk until it becomes soft and absorbs all the wonderful flavors. The dessert is finished with nuts and saffron, creating a dish that's rich, indulgent, and fit for royalty. Each piece is sweet, creamy, and incredibly satisfying. This is a dessert that's truly special.",
        descriptionNl: "Een koninklijk dessert dat letterlijk 'koninklijke stukken' betekent. Brood wordt gefrituurd tot goudbruin en knapperig, en vervolgens gedrenkt in gezoete, gearomatiseerde melk tot het zacht wordt en alle prachtige smaken opneemt. Het dessert wordt afgewerkt met noten en saffraan, waardoor een gerecht ontstaat dat rijk, verrukkelijk en geschikt is voor royalty. Elk stuk is zoet, romig en ongelooflijk bevredigend. Dit is een dessert dat echt speciaal is.",
        descriptionFr: "Un dessert royal qui signifie littéralement 'morceaux royaux'. Le pain est frit jusqu'à ce qu'il soit doré et croustillant, puis trempé dans du lait sucré et parfumé jusqu'à ce qu'il devienne tendre et absorbe toutes les merveilleuses saveurs. Le dessert est fini avec des noix et du safran, créant un plat riche, indulgent et digne de la royauté. Chaque morceau est doux, crémeux et incroyablement satisfaisant. C'est un dessert vraiment spécial.",
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
      descriptionEn: "Delicate, pillowy cheese dumplings that are soaked in sweetened, flavored milk. The dumplings are incredibly soft and melt in your mouth, while the milk is rich, creamy, and delicately flavored with cardamom and saffron. Each bite is a perfect balance of sweet, creamy, and aromatic. This is a dessert that's elegant, sophisticated, and absolutely delightful. It's the perfect way to end a meal.",
        descriptionNl: "Delicate, kussenachtige kaasbolletjes die zijn gedrenkt in gezoete, gearomatiseerde melk. De bolletjes zijn ongelooflijk zacht en smelten in je mond, terwijl de melk rijk, romig en delicaat gearomatiseerd is met kardemom en saffraan. Elke hap is een perfecte balans tussen zoet, romig en aromatisch. Dit is een dessert dat elegant, verfijnd en absoluut heerlijk is. Het is de perfecte manier om een maaltijd te beëindigen.",
        descriptionFr: "Des boulettes de fromage délicates et moelleuses qui sont trempées dans du lait sucré et parfumé. Les boulettes sont incroyablement douces et fondent dans la bouche, tandis que le lait est riche, crémeux et délicatement parfumé à la cardamome et au safran. Chaque bouchée est un équilibre parfait entre doux, crémeux et aromatique. C'est un dessert élégant, sophistiqué et absolument délicieux. C'est la façon parfaite de terminer un repas.",
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
