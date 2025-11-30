import { requireAuth } from "@/lib/auth";
import { getDishes } from "@/lib/db/dish";
import { DishesList } from "./dishes-list";

export default async function AdminDishesPage() {
  await requireAuth();
  const dishes = await getDishes({ isActive: undefined }); // Get all dishes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Manage Dishes</h2>
          <p className="text-text-secondary mt-1">Add, edit, or remove dishes from the menu</p>
        </div>
        <a
          href="/admin/dishes/new"
          className="px-6 py-3 rounded-lg bg-accent text-foreground font-medium hover:bg-accent/90 transition-colors shadow-soft"
        >
          Add New Dish
        </a>
      </div>

      <DishesList initialDishes={dishes} />
    </div>
  );
}

