# Prisma 6 Configuration Fix - InstaBiz

## Problem
Prisma 6 moved connection URLs from `schema.prisma` to `prisma.config.ts`

## Solution

### 1. Update `prisma/schema.prisma`

Remove the `url` and `directUrl` from datasource:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // No url or directUrl here anymore!
}

// Rest of your models stay the same...
```

### 2. Create `prisma.config.ts` in Your Project Root

Create a new file `prisma.config.ts` in the **root** of your project (same level as `package.json`):

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

### 3. Keep Your `.env` File the Same

```env
# For app queries (pooled connection - port 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.thokvmcnxsxeswyezjwj.supabase.co:6543/postgres?pgbouncer=true"

# For migrations (direct connection - port 5432)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.thokvmcnxsxeswyezjwj.supabase.co:5432/postgres"
```

### 4. Now Run Migration

```bash
npx prisma migrate dev --name init
```

This should now work! ✅

---

## Complete Files Reference

### File Structure
```
instabiz/
├── prisma/
│   └── schema.prisma
├── prisma.config.ts          # NEW FILE (at root level)
├── .env
├── package.json
└── ...
```

### Complete `prisma/schema.prisma` (Updated for Prisma 6)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// ============================================
// USER & AUTHENTICATION MODELS
// ============================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(INDIVIDUAL)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  shops    Shop[]
  orders   Order[]
  reviews  Review[]
  
  @@index([email])
}

enum UserRole {
  INDIVIDUAL
  CORPORATE
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// SHOP/STORE MODELS
// ============================================

model Shop {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?    @db.Text
  logo        String?
  banner      String?
  status      ShopStatus @default(PENDING)
  
  ownerId     String
  owner       User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  settings    Json?
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  products    Product[]
  orders      Order[]
  
  @@index([ownerId])
  @@index([slug])
  @@index([status])
}

enum ShopStatus {
  PENDING
  ACTIVE
  SUSPENDED
  CLOSED
}

// ============================================
// PRODUCT MODELS
// ============================================

model Product {
  id          String        @id @default(cuid())
  name        String
  slug        String
  description String?       @db.Text
  price       Decimal       @db.Decimal(10, 2)
  comparePrice Decimal?     @db.Decimal(10, 2)
  costPrice   Decimal?      @db.Decimal(10, 2)
  
  sku         String?       @unique
  stock       Int           @default(0)
  trackStock  Boolean       @default(true)
  
  images      String[]
  
  status      ProductStatus @default(DRAFT)
  featured    Boolean       @default(false)
  
  metaTitle       String?
  metaDescription String?
  
  shopId      String
  shop        Shop          @relation(fields: [shopId], references: [id], onDelete: Cascade)
  
  categoryId  String?
  category    Category?     @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  variants    ProductVariant[]
  orderItems  OrderItem[]
  reviews     Review[]
  
  @@unique([shopId, slug])
  @@index([shopId])
  @@index([categoryId])
  @@index([status])
  @@index([featured])
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  name        String
  sku         String?  @unique
  price       Decimal? @db.Decimal(10, 2)
  stock       Int      @default(0)
  
  options     Json
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orderItems  OrderItem[]
  
  @@index([productId])
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  image       String?
  
  parentId    String?
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children    Category[] @relation("CategoryHierarchy")
  
  products    Product[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([slug])
  @@index([parentId])
}

// ============================================
// ORDER MODELS
// ============================================

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  
  userId          String
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  shopId          String
  shop            Shop        @relation(fields: [shopId], references: [id], onDelete: Cascade)
  
  status          OrderStatus @default(PENDING)
  
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2) @default(0)
  shippingCost    Decimal     @db.Decimal(10, 2) @default(0)
  discount        Decimal     @db.Decimal(10, 2) @default(0)
  total           Decimal     @db.Decimal(10, 2)
  
  shippingAddress Json
  billingAddress  Json?
  
  paymentStatus   PaymentStatus @default(PENDING)
  paymentMethod   String?
  paymentId       String?
  
  customerNote    String?       @db.Text
  internalNote    String?       @db.Text
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?
  
  items           OrderItem[]
  
  @@index([userId])
  @@index([shopId])
  @@index([status])
  @@index([orderNumber])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model OrderItem {
  id              String          @id @default(cuid())
  orderId         String
  order           Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId       String
  product         Product         @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  variantId       String?
  variant         ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Restrict)
  
  quantity        Int
  price           Decimal         @db.Decimal(10, 2)
  total           Decimal         @db.Decimal(10, 2)
  
  productSnapshot Json
  
  @@index([orderId])
  @@index([productId])
}

// ============================================
// REVIEW MODELS
// ============================================

model Review {
  id          String   @id @default(cuid())
  
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  rating      Int
  title       String?
  comment     String?  @db.Text
  
  verified    Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([productId, userId])
  @@index([productId])
  @@index([userId])
}
```

### Complete `prisma.config.ts` (Root Level)

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

---

## Verification Steps

### 1. Check Your Files

```bash
# Your project should have these files:
ls prisma/schema.prisma     # ✓ Schema without URL
ls prisma.config.ts          # ✓ Config file at root
cat .env                     # ✓ Both DATABASE_URL and DIRECT_URL
```

### 2. Validate Configuration

```bash
npx prisma validate
```

Should output: "The schema is valid"

### 3. Run Migration

```bash
npx prisma migrate dev --name init
```

Expected output:
```
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "postgres", schema "public" at "db.xxx.supabase.co:5432"

Applying migration `20240212_init`
✔ Generated Prisma Client
```

### 4. Open Prisma Studio

```bash
npx prisma studio
```

You should see all your tables at http://localhost:5555

---

## Common Issues with Prisma 6

### Issue: "Cannot find module '@prisma/client/generator-helper'"

**Solution:** Update Prisma to latest version

```bash
npm install -D prisma@latest
npm install @prisma/client@latest
```

### Issue: Config file not found

**Make sure `prisma.config.ts` is:**
- At the **root** of your project (not inside prisma folder)
- Named exactly `prisma.config.ts` (not config.ts)
- Has proper TypeScript syntax

### Issue: Still getting directUrl error

**Make sure you:**
1. Removed `url` and `directUrl` completely from `schema.prisma`
2. Created `prisma.config.ts` at root level
3. Restarted your terminal/IDE

---

## Quick Commands to Run Now

```bash
# 1. Make sure you're on latest Prisma
npm install -D prisma@latest
npm install @prisma/client@latest

# 2. Create prisma.config.ts at root (use the content above)

# 3. Update schema.prisma (remove url and directUrl)

# 4. Validate
npx prisma validate

# 5. Migrate
npx prisma migrate dev --name init

# 6. Open Studio
npx prisma studio
```

---

## Summary of Changes

**OLD (Prisma 5):**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**NEW (Prisma 6):**

`schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

`prisma.config.ts` (at root):
```typescript
export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL!,
    },
  },
})
```

---

Let me know if the migration works now! 🚀
