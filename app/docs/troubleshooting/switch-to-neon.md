# Switching from Supabase to Neon - InstaBiz

## Why Neon?
- Simpler connection strings (no pooling complexity)
- Better Prisma compatibility
- Faster setup
- Also has a generous free tier

---

## Step 1: Create Neon Account & Database

### 1. Go to Neon
Visit: https://neon.tech

### 2. Sign Up
- Click "Sign Up"
- Use GitHub login (fastest)

### 3. Create New Project
- Click "Create Project"
- Project name: `instabiz-dev`
- Region: Choose closest to you (Europe/Asia/US)
- PostgreSQL version: 16 (latest)
- Click "Create Project"

### 4. Get Connection String
After project creation, you'll see a connection string immediately:

```
postgresql://neondb_owner:XXXXX@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Copy this entire string!**

---

## Step 2: Update Your Project

### 1. Delete Prisma Config File

Since it's causing issues, let's remove it completely:

```bash
rm prisma.config.mjs
# or if you have .js or .ts
rm prisma.config.js
rm prisma.config.ts
```

### 2. Update `prisma/schema.prisma`

Go back to the old simple format that works:



### 3. Update `.env` File

Replace your entire `.env` with this (using your Neon connection string):

```env

```

**Important:** Replace the DATABASE_URL with YOUR actual Neon connection string!

---

## Step 3: Run Migration

Now that we've removed the config file and simplified everything:

```bash
# Clean up any previous migration attempts
rm -rf prisma/migrations

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name init
```

Expected output:
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "neondb" at "ep-xxx.region.aws.neon.tech"

Applying migration `20240212_init`

✔ Generated Prisma Client
```

### 4. Verify with Prisma Studio

```bash
npx prisma studio
```

Open http://localhost:5555 - you should see all your tables! 🎉

---

## Why This Works

1. **No config file needed** - Prisma 5.x style (url in schema.prisma)
2. **Simple Neon connection** - No pooling complexity
3. **Single connection string** - Works for everything

---

## Neon vs Supabase

| Feature | Neon | Supabase |
|---------|------|----------|
| Setup | Simpler | Complex pooling |
| Prisma | Better compatibility | Connection issues |
| Free tier | 0.5GB | 0.5GB |
| Serverless | Yes (autoscaling) | Limited |
| Perfect for | Next.js apps | Full-stack apps with auth |

---

## Complete File Structure After Changes

```
instabiz/
├── prisma/
│   └── schema.prisma          # Updated with url in datasource
├── lib/
│   └── prisma.ts              # Keep as is
├── .env                        # Updated with Neon connection
├── package.json
└── (NO prisma.config.* files)
```

---

## Troubleshooting

### If migration still fails:

1. **Check connection string format:**
   ```
   postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```

2. **Test connection:**
   ```bash
   npx prisma db pull
   ```

3. **Check Neon dashboard:**
   - Make sure database is running (green status)
   - Check if you're on free tier limits

---

## Quick Setup Summary

```bash
# 1. Delete config file
rm prisma.config.*

# 2. Update schema.prisma (add url back to datasource)

# 3. Update .env with Neon connection string

# 4. Run migration
npx prisma migrate dev --name init

# 5. Open Studio to verify
npx prisma studio
```

---

This should work smoothly! Neon is designed specifically for serverless/edge deployments and has excellent Prisma support.
