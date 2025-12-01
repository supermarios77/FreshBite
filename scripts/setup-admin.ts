/**
 * Setup script to create an admin user in Supabase
 * 
 * Run with: bun run setup:admin
 * 
 * This will create an admin user with the following credentials:
 * Email: admin@freshbite.com
 * Password: FreshBite2024!
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupAdmin() {
  const adminEmail = "admin@freshbite.com";
  const adminPassword = "FreshBite2024!"; // Change this after first login!

  console.log("🔧 Setting up admin user...\n");

  try {
    // Try to list users and check if admin exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ Error checking users:", listError.message);
      process.exit(1);
    }

    const existingUser = users?.users?.find((user: any) => user.email === adminEmail);

    if (existingUser) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Email: ${adminEmail}`);
      console.log("\n💡 To reset password, use Supabase Dashboard or delete the user first.");
      return;
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: "admin",
        name: "Admin",
      },
    });

    if (createError) {
      console.error("❌ Error creating admin user:", createError.message);
      process.exit(1);
    }

    console.log("✅ Admin user created successfully!\n");
    console.log("📧 Admin Credentials:");
    console.log("   Email:    " + adminEmail);
    console.log("   Password: " + adminPassword);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("   Login at: /admin/login\n");
  } catch (error: any) {
    console.error("❌ Unexpected error:", error.message);
    process.exit(1);
  }
}

setupAdmin();

