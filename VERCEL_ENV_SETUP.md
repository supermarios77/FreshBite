# Vercel Environment Variables Setup

This document lists all required environment variables for Vercel deployment.

## Required Environment Variables

Add these in your Vercel project settings under **Settings → Environment Variables**:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

### Database
- `DATABASE_URL` - Your Supabase Postgres connection string
  - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
  - Get this from Supabase Dashboard → Settings → Database → Connection string

### Stripe (Optional for development)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key (keep secret!)
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (keep secret!)

### Application
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables**
4. Add each variable:
   - **Name**: The variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select which environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Important Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit secrets to your repository
- After adding environment variables, you must redeploy for them to take effect
- Use Vercel's environment variable encryption for sensitive values

## Troubleshooting

If you see "Something went wrong" error:

1. **Check all environment variables are set** - Missing variables will cause runtime errors
2. **Verify DATABASE_URL format** - Must be a valid Postgres connection string
3. **Check Supabase keys** - Ensure they match your Supabase project
4. **Redeploy after adding variables** - Changes require a new deployment
5. **Check Vercel logs** - Go to Deployments → Select deployment → View Function Logs

## Testing Environment Variables

After deployment, check the Vercel function logs to see if there are any environment variable errors.

