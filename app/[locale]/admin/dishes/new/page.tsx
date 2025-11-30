import { requireAuth } from "@/lib/auth";
import { DishForm } from "../dish-form";
import { getCategories } from "@/lib/db/dish";

export default async function NewDishPage() {
  await requireAuth();
  const categories = await getCategories("en");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Add New Dish</h2>
        <p className="text-text-secondary mt-1">Create a new dish for the menu</p>
      </div>

      <DishForm categories={categories} />
    </div>
  );
}

