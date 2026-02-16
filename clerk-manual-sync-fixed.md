# Clerk User Sync for InstaBiz - Development Setup
## Using Manual Sync (No Webhooks Required)

---

## Step 1: Create Manual Sync Utility

Create `lib/sync-clerk-user.ts`:

```typescript
// lib/sync-clerk-user.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // ✅ Correct import path

export async function syncClerkUser(clerkId: string) {
  try {
    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);
    
    // Sync to your database
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
        image: clerkUser.imageUrl || null,
        role: "INDIVIDUAL",
      },
      update: {
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
        image: clerkUser.imageUrl || null,
      },
    });
    
    console.log("User synced to database:", user.id);
    return user;
  } catch (error) {
    console.error("Error syncing Clerk user:", error);
    throw error;
  }
}

// Helper to get current user with auto-sync
export async function getCurrentUser(clerkId: string) {
  // Try to get user from database
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // If not found in database, sync from Clerk
  if (!user) {
    console.log("User not in database, syncing from Clerk...");
    user = await syncClerkUser(clerkId);
  }

  return user;
}
```

---

## Step 2: Use in Protected Routes

### Server Components (Most Common)

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/sync-clerk-user";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user (auto-syncs if not in database)
  const user = await getCurrentUser(userId);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome, {user.name}!
      </h1>
      <p className="text-muted-foreground">
        Email: {user.email}
      </p>
      <p className="text-muted-foreground">
        Role: {user.role}
      </p>
    </div>
  );
}
```

### API Routes

```typescript
// app/api/shops/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/sync-clerk-user";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user with auto-sync
    const user = await getCurrentUser(userId);

    // Get user's shops
    const shops = await prisma.shop.findMany({
      where: { ownerId: user.id },
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("[SHOPS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

---

## Step 3: Update Your Existing API Routes

### Fix the Tutor Video Upload Route

Update `app/api/admins/[adminId]/courses/[courseId]/tutors/[tutorId]/route.ts`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ Fixed import
import { getCurrentUser } from "@/lib/sync-clerk-user";

// Initialize Mux with proper error handling
function getMuxClient() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("Mux credentials not configured");
  }

  return new Mux({ tokenId, tokenSecret });
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ adminId: string; courseId: string; tutorId: string }>;
  }
) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    const body = await request.json();
    const { userId } = await auth();
    const { adminId, courseId, tutorId } = await params;

    console.log(`[${requestId}] PATCH Request:`, {
      adminId,
      courseId,
      tutorId,
      userId,
      bodyKeys: Object.keys(body),
    });

    // Auth checks
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user with auto-sync
    const currentUser = await getCurrentUser(userId);

    // Verify admin ownership
    const admin = await prisma.admin.findUnique({
      where: { 
        id: adminId, 
        userId: currentUser.id // ✅ Use database user ID
      },
    });

    if (!admin) {
      return new NextResponse("Unauthorized - Invalid admin", { status: 401 });
    }

    // ... rest of your existing code ...
  } catch (error: any) {
    console.error(`[${requestId}] Unhandled error:`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
```

---

## Step 4: Create Helper Functions (Optional)

Create `lib/auth-helpers.ts` for common auth patterns:

```typescript
// lib/auth-helpers.ts
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "./sync-clerk-user";
import { redirect } from "next/navigation";

/**
 * Require authentication - returns user or redirects
 * Use in Server Components
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getCurrentUser(userId);
  return user;
}

/**
 * Require specific role
 * Use in admin pages
 */
export async function requireRole(role: "INDIVIDUAL" | "CORPORATE" | "ADMIN") {
  const user = await requireAuth();
  
  if (user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Get current user or null (no redirect)
 * Use when auth is optional
 */
export async function getOptionalUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await getCurrentUser(userId);
  return user;
}
```

Usage:

```typescript
// app/admin/page.tsx
import { requireRole } from "@/lib/auth-helpers";

export default async function AdminPage() {
  const admin = await requireRole("ADMIN");
  
  return <div>Admin Dashboard for {admin.name}</div>;
}

// app/profile/page.tsx
import { requireAuth } from "@/lib/auth-helpers";

export default async function ProfilePage() {
  const user = await requireAuth();
  
  return <div>Profile: {user.name}</div>;
}

// app/page.tsx (homepage - auth optional)
import { getOptionalUser } from "@/lib/auth-helpers";

export default async function HomePage() {
  const user = await getOptionalUser();
  
  return (
    <div>
      {user ? (
        <p>Welcome back, {user.name}!</p>
      ) : (
        <p>Welcome to InstaBiz!</p>
      )}
    </div>
  );
}
```

---

## Step 5: Update Prisma Schema (if needed)

Make sure your User model has the `clerkId` field:

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  clerkId       String    @unique  // ✅ Required for Clerk sync
  email         String    @unique
  name          String?
  image         String?
  role          UserRole  @default(INDIVIDUAL)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  shops         Shop[]
  orders        Order[]
  reviews       Review[]
  
  @@index([clerkId])
  @@index([email])
}

enum UserRole {
  INDIVIDUAL
  CORPORATE
  ADMIN
}
```

If you just added `clerkId`, run migration:

```bash
npx prisma migrate dev --name add_clerk_id
```

---

## Step 6: Test the Setup

### 1. Start your app:

```bash
npm run dev
```

### 2. Sign up:

Visit `http://localhost:3000/sign-in` and create an account

### 3. Access protected route:

Visit `http://localhost:3000/dashboard`

### 4. Check logs:

You should see:
```
User not in database, syncing from Clerk...
User synced to database: cuid_xxxxx
```

### 5. Verify database:

```bash
npx prisma studio
```

Check the User table - your user should be there with `clerkId` populated!

### 6. Second visit:

Refresh the dashboard - this time you should NOT see the sync message (user already in DB)

---

## Common Issues & Solutions

### Issue 1: "Cannot find module '@/lib/db'"

**Fix:** Update all imports to use `@/lib/prisma`:

```typescript
// ❌ Wrong
import { prisma } from "@/lib/db";

// ✅ Correct
import { prisma } from "@/lib/prisma";
```

### Issue 2: "Property 'clerkId' does not exist on type 'User'"

**Fix:** 
1. Add `clerkId` to Prisma schema
2. Run: `npx prisma migrate dev --name add_clerk_id`
3. Run: `npx prisma generate`

### Issue 3: "User is not assignable to type..."

**Fix:** Make sure `lib/prisma.ts` exports the prisma client correctly:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Issue 4: "Cannot read properties of null (reading 'emailAddresses')"

**Cause:** Clerk user not found (wrong userId)

**Fix:** Add error handling:

```typescript
export async function syncClerkUser(clerkId: string) {
  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    
    if (!clerkUser) {
      throw new Error("Clerk user not found");
    }
    
    // ... rest of sync logic
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}
```

---

## Production Considerations

### When to Move to Webhooks:

This manual sync approach is great for development, but for production you should set up webhooks because:

1. **Real-time sync** - User created immediately when they sign up
2. **Updates** - Profile changes sync automatically
3. **Deletions** - User deletions handled properly
4. **Performance** - No delay on first login

### Migration Path:

**Development:**
```typescript
// Use manual sync
const user = await getCurrentUser(userId);
```

**Production:**
```typescript
// Assume user exists (webhook handles sync)
const user = await prisma.user.findUnique({ 
  where: { clerkId: userId } 
});

if (!user) {
  // This shouldn't happen in production with webhooks
  // But good to have fallback
  return redirect("/setup-account");
}
```

---

## Summary

✅ **What you have now:**
- Manual user sync on first access
- No ngrok needed
- Works perfectly in development
- Simple, clean code

✅ **What happens:**
1. User signs up in Clerk
2. User visits your app
3. `getCurrentUser()` checks database
4. Not found → syncs from Clerk automatically
5. Future visits → user already in DB

✅ **For production:**
- Add webhooks later
- Keep manual sync as fallback
- Best of both worlds!

---

## Complete File Checklist

Make sure you have:

- [ ] `lib/sync-clerk-user.ts` - User sync utility
- [ ] `lib/auth-helpers.ts` - Auth helper functions (optional)
- [ ] `lib/prisma.ts` - Prisma client (already have)
- [ ] Updated all `@/lib/db` → `@/lib/prisma`
- [ ] `clerkId` field in User model
- [ ] Migration run

Ready to build! 🚀
