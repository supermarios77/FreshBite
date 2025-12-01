# Admin Credentials

## Default Admin Account

After running the setup script, you can log in with:

- **Email**: `admin@freshbite.com`
- **Password**: `FreshBite2024!`

⚠️ **IMPORTANT**: Change this password after first login!

## Setup Instructions

1. Make sure your `.env` file has the required Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the setup script:
   ```bash
   bun run setup:admin
   ```

3. The script will create the admin user in Supabase.

4. Log in at one of these localized URLs:
   - English: `/en/admin/login`
   - Dutch: `/nl/admin/login`
   - French: `/fr/admin/login`

## Changing the Password

You can change the password in two ways:

1. **Via Supabase Dashboard**:
   - Go to Authentication → Users
   - Find `admin@freshbite.com`
   - Click "Reset Password" or update directly

2. **Via the app** (after logging in):
   - Use Supabase Auth password reset functionality
   - Or update via Supabase Dashboard

## Security Notes

- The service role key has full access - keep it secure
- Never commit `.env` files to version control
- Use strong passwords in production
- Consider using environment-specific admin accounts

