# Prisma Migration Connection Fix - Diagnostic & Solution

## Current Problem
Prisma is using port 6543 (DATABASE_URL) for migrations instead of port 5432 (DIRECT_URL)

The error shows:
```
Datasource "db": ... at "db.thokvmcnxsxeswyezjwj.supabase.co:6543"
```

It SHOULD show port 5432 for migrations.

---

## Solution 1: Verify Your prisma.config.ts

### Check Location
Make sure `prisma.config.ts` is at the **ROOT** of your project:

```
instabiz/
├── prisma/
│   └── schema.prisma
├── prisma.config.ts      ← HERE (same level as package.json)
├── package.json
└── .env
```

### Check Content

Your `prisma.config.ts` should look EXACTLY like this:

```typescript
// prisma.config.ts
import { defineConfig } from '@prisma/client/generator-helper'

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL!,
    },
  },
})
```

**Common mistakes:**
- ❌ File is inside `prisma/` folder (wrong location)
- ❌ Named `config.ts` instead of `prisma.config.ts`
- ❌ Using `directURL` instead of `directUrl` (case matters!)
- ❌ Missing the `!` after environment variables

---

## Solution 2: Verify Your .env File

Open your `.env` and make sure you have BOTH variables:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres"
```

**Check:**
- ✓ Both URLs are present
- ✓ DIRECT_URL uses port **5432** (not 6543)
- ✓ DATABASE_URL uses port **6543**
- ✓ Same password in both
- ✓ No quotes inside the URL strings
- ✓ No spaces anywhere

---

## Solution 3: Alternative - Use Only Direct Connection

If the config still doesn't work, temporarily use ONLY the direct connection:

### Update your .env:

```env
# Temporarily use direct connection for everything
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres"
```

### Update prisma.config.ts:

```typescript
// prisma.config.ts
import { defineConfig } from '@prisma/client/generator-helper'

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
})
```

### Run migration:

```bash
npx prisma migrate dev --name init
```

**Note:** This uses direct connection for everything (migrations AND queries). Once working, you can optimize later by adding back the pooled connection.

---

## Solution 4: Get Fresh Supabase Connection Strings

Sometimes the connection strings need to be regenerated. Let's get them fresh:

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard/project/thokvmcnxsxeswyezjwj

2. **Go to Project Settings → Database**

3. **Scroll to "Connection string"**

4. **Copy BOTH strings:**

   **URI (for direct connection - port 5432):**
   ```
   Click "URI" tab
   Toggle "Display connection pooler"
   Copy the connection string that shows port 5432
   ```

   **Session pooling (for app - port 6543):**
   ```
   Click "URI" tab  
   Make sure "Display connection pooler" is toggled OFF
   Copy the connection string
   ```

5. **Update your .env with the EXACT strings from Supabase**

---

## Solution 5: Test Connection Directly

Let's verify the connection works at all:

### Test Direct Connection (Port 5432)

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres"
npx prisma db pull
```

If this works, it means:
- ✓ Your password is correct
- ✓ Direct connection works
- ✓ Problem is with config file

### Test if DIRECT_URL is being read

```bash
# Windows PowerShell - set environment variable manually
$env:DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres"
npx prisma migrate dev --name init
```

---

## Solution 6: Prisma Config Alternative Format

Try this alternative config format:

```typescript
// prisma.config.ts
const config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
      directUrl: process.env.DIRECT_URL || '',
    },
  },
}

export default config
```

---

## Diagnostic Commands

Run these to help diagnose:

### 1. Check if .env is being read

```bash
# Windows PowerShell
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50)); console.log('DIRECT_URL:', process.env.DIRECT_URL?.substring(0, 50))"
```

This should show both URLs (truncated for security).

### 2. Check Prisma config

```bash
npx prisma validate
```

Should show no errors.

### 3. Check what Prisma sees

```bash
npx prisma db pull
```

This will show which URL it's trying to use.

---

## Nuclear Option: Complete Reset

If nothing works, let's start completely fresh:

### 1. Delete existing Prisma artifacts

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force prisma\migrations -ErrorAction SilentlyContinue
```

### 2. Reinstall Prisma

```bash
npm uninstall prisma @prisma/client
npm install -D prisma@latest
npm install @prisma/client@latest
```

### 3. Simplify to bare minimum

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
}
```

**prisma.config.ts:**
```typescript
export default {
  datasources: {
    db: {
      url: "postgresql://postgres:YOUR_PASSWORD@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres",
    },
  },
}
```

**Note:** Hard-code the URL temporarily just to test.

### 4. Try migration

```bash
npx prisma migrate dev --name test
```

If this works, then gradually add back:
1. Environment variables
2. The full schema
3. The pooled connection

---

## What to Send Me for Further Help

Please run these and share the output:

```bash
# 1. Check Prisma version
npx prisma --version

# 2. Check if config file exists
ls prisma.config.ts

# 3. Show first few lines of config (hide password)
head -n 10 prisma.config.ts

# 4. Validate schema
npx prisma validate

# 5. Test pull
npx prisma db pull 2>&1
```

---

## Most Likely Issue

Based on the error, the most likely causes are:

1. **`prisma.config.ts` is not in the root directory**
   - Must be at same level as `package.json`
   - NOT inside `prisma/` folder

2. **DIRECT_URL is not set in .env**
   - Check with: `echo $env:DIRECT_URL` (PowerShell)
   - Should show the connection string

3. **Typo in prisma.config.ts**
   - `directUrl` not `directURL` (lowercase 'u')
   - Must be exact: `directUrl`

---

## Quick Fix to Try Right Now

1. **Delete your current prisma.config.ts**

2. **Create new one at ROOT with this EXACT content:**

```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL,
    },
  },
}
```

3. **Verify your .env has both URLs**

4. **Close and reopen your terminal**

5. **Run:**

```bash
npx prisma migrate dev --name init
```

---

Let me know what happens!
