# Module 1 Video Production Guide
## Recording Scripts & Production Notes

---

## Video 1: Introduction (5 minutes)

### Pre-Recording Checklist
- [ ] Open VS Code with empty folder
- [ ] Have browser tabs ready: Neon, GitHub, Prisma docs
- [ ] Test audio levels
- [ ] Clean desktop (no personal info visible)
- [ ] Have final project open in another window for preview

### Recording Setup
- **Resolution:** 1920x1080
- **Frame Rate:** 30fps
- **Audio:** Clear voice, no background noise
- **Screen Recording:** OBS Studio or Loom
- **Cursor:** Large, visible cursor
- **Zoom:** Increase font size (16-18pt)

### Script

```
[SCENE 1 - Talking Head or Logo Screen - 30 sec]

"Hey everyone! Welcome to the InstaBiz course where we're building 
a complete, production-ready e-commerce platform from scratch.

My name is [Your Name], and over the next 16 modules, you'll learn 
everything you need to build modern web applications - from authentication 
to payments to deployment.

This isn't a toy project. We're building real features that real businesses use."

[SCENE 2 - Screen Recording - Module Overview - 1 min]

[SHOW: Simple slide with module topics]

"Today, in Module 1, we're laying the foundation. Here's what we'll cover:

✓ Next.js project setup with TypeScript
✓ Cloud PostgreSQL database with Neon
✓ Prisma ORM configuration
✓ E-commerce database schema design
✓ Git workflow and branching
✓ Running our first database migration

By the end of this module, you'll have a fully configured development 
environment with a real database containing tables for users, shops, 
products, orders, and reviews."

[SCENE 3 - Tech Stack Overview - 1.5 min]

[SHOW: Diagram of tech stack]

"Let's quickly look at our tech stack:

Next.js 14 - Our React framework with server components
TypeScript - For type safety
Tailwind CSS - For styling
shadcn/ui - Beautiful, accessible components
PostgreSQL - Our relational database
Neon - Cloud database hosting
Prisma - Type-safe database ORM
Git/GitHub - Version control

This is a professional, production-grade stack used by companies like 
Vercel, Airbnb, and many startups.

Everything we do follows industry best practices, so you're learning 
skills that directly apply to real jobs."

[SCENE 4 - What We'll Build Preview - 2 min]

[SHOW: Final folder structure in VS Code]

"Here's a preview of what we'll have by the end of this module."

[Open project folder structure]

"We'll have our Next.js app set up with the app router, our Prisma 
folder with our schema..."

[Open Prisma Studio]

"And when we open Prisma Studio, you'll see we have our complete 
database with all our tables - User, Shop, Product, Order, Review, 
and all the supporting tables."

[Click through a few tables]

"Look at the Product table - we have fields for name, description, 
price, stock, images, everything an e-commerce product needs."

[Show Git branches in terminal]

"And we'll have our Git repository set up with proper branching - 
main, develop, and feature branches."

[SCENE 5 - Call to Action - 30 sec]

"Alright, enough preview - let's start building! 

Before we begin, make sure you have:
- Node.js v18 or higher installed
- Git installed  
- VS Code or your favorite code editor
- About 2-3 hours to complete this module

Ready? Let's dive in!"

[END SCREEN: Module title card]
```

---

## Video 2: Theory (15 minutes)

### Pre-Recording Checklist
- [ ] Prepare diagrams in Excalidraw or similar
- [ ] Have example code snippets ready
- [ ] Browser tabs: Prisma docs, Next.js docs

### Script

```
[INTRO - 30 sec]

"Before we start coding, let's understand the architecture we're building.
Understanding WHY we make certain choices is just as important as 
knowing HOW to code them."

[PART 1: Tech Stack Deep Dive - 5 min]

[SHOW: Next.js logo/docs]

"First, Next.js. You might wonder - why Next.js and not plain React?

Next.js gives us:
- Server-side rendering for better SEO
- API routes so we don't need a separate backend
- File-based routing - your folder structure IS your routes
- Image optimization built-in
- Easy deployment to Vercel

For e-commerce, SEO matters. We want Google to index our product pages.
Server components help with that."

[SHOW: PostgreSQL logo]

"Next, PostgreSQL. Why not MongoDB or another database?

E-commerce needs relationships:
- A user HAS MANY shops
- A shop HAS MANY products  
- An order HAS MANY products through order items
- A product HAS MANY reviews

PostgreSQL excels at relationships. It's ACID compliant, which means 
when someone places an order, we KNOW that transaction completed 
correctly. No lost orders, no double charges.

That reliability is crucial for handling money."

[SHOW: Neon website]

"We're using Neon for hosting. Why cloud instead of local?

- No setup hassles
- Scales automatically
- Built-in backups
- Serverless - you only pay for what you use
- Perfect for Next.js edge functions

Plus, you can share your database with team members easily."

[SHOW: Prisma logo/code example]

"Finally, Prisma. What's an ORM and why use it?

Without Prisma, you write SQL:
```sql
SELECT * FROM products WHERE shopId = 123 AND status = 'ACTIVE'
```

With Prisma:
```typescript
await prisma.product.findMany({
  where: { 
    shopId: '123',
    status: 'ACTIVE'
  }
})
```

Prisma gives you:
- Type safety - your editor knows what fields exist
- Auto-complete
- Compile-time error checking
- Automatic SQL generation
- Easy migrations

You write TypeScript, Prisma handles the SQL."

[PART 2: Database Schema Design - 5 min]

[SHOW: ERD diagram]

"Now let's design our database. Here's our entity relationship diagram.

[Draw/show the following while explaining]

At the center, we have USERS. Users are people who use our platform.

A User can create SHOPS. This is multi-vendor - like Etsy or Amazon 
Marketplace. One person can run multiple shops if they want.

Each SHOP has PRODUCTS. Products have:
- Pricing information
- Inventory/stock
- Images
- Descriptions  
- Variants (like different sizes/colors)

When someone buys a product, we create an ORDER. Orders contain 
ORDER ITEMS - this is a join table connecting orders to products.

Why not put products directly in orders? Because we need to track:
- Quantity (bought 3 of this item)
- Price at time of purchase (prices change!)
- Which variant was purchased

We also have REVIEWS. Users review products they've purchased.

And CATEGORIES for organizing products.

[Highlight relationships]

Key relationships:
- User to Shop: One-to-Many (one user, many shops)
- Shop to Product: One-to-Many
- Order to OrderItem to Product: Many-to-Many through join table
- Category: Self-referencing (categories can have subcategories)

This structure supports:
- Multiple vendors
- Complex products with variants
- Order history
- Inventory tracking
- Customer reviews

It's battle-tested e-commerce architecture."

[PART 3: Prisma Configuration - 4 min]

[SHOW: Code examples]

"Let's talk about Prisma configuration.

You'll work with three files:

1. prisma.config.ts - Connection configuration
2. schema.prisma - Your data models
3. .env - Your secrets (passwords, connection strings)

[Show prisma.config.ts]

In prisma.config.ts, we:
- Import dotenv to read environment variables
- Define our datasource URL
- Set our migrations path

This separates configuration from schema, which is cleaner.

[Show schema.prisma]

In schema.prisma, we define our models:

```prisma
model Product {
  id    String @id @default(cuid())
  name  String
  price Decimal @db.Decimal(10, 2)
  shop  Shop @relation(fields: [shopId], references: [id])
}
```

Each model becomes a database table.
Each field becomes a column.
@relation defines relationships.

[Show .env file structure]

In .env, we keep secrets:

DATABASE_URL='postgresql://...'

NEVER commit this file to Git. It contains your password!
We use .gitignore to exclude it."

[PART 4: Git Workflow - 3 min]

[SHOW: Git branch diagram]

"Finally, our Git workflow. We'll use a feature branch strategy:

main branch - Production code, always working
  └─ develop branch - Integration, pre-production
      └─ feature branches - Individual features

For this course:
- main has stable checkpoints
- develop for ongoing work
- feature/module-X for each module

Why?
- Keeps main clean
- Easy to rollback if something breaks
- Multiple people can work simultaneously
- Best practice in real companies

Each module, we'll:
1. Create a feature branch
2. Build the feature
3. Merge to develop
4. Tag for the course

This is EXACTLY how professional teams work."

[WRAP UP - 30 sec]

"Alright! Now you understand:
- Our tech stack and why
- Database architecture
- Prisma configuration
- Git workflow

Let's put this into practice. In the next video, we'll build it all step by step.

See you there!"
```

---

## Video 3: Coding Tutorial (45 minutes)

### Pre-Recording Checklist
- [ ] Fresh, empty project folder
- [ ] Terminal ready
- [ ] Browser tabs: Neon dashboard, GitHub
- [ ] Increase terminal font size
- [ ] Test all commands work beforehand
- [ ] Have connection strings ready to copy

### Script (Detailed with timestamps)

```
[00:00 - 00:30] Introduction

"Alright! Time to build. Follow along with me - pause the video 
anytime you need to catch up.

By the end, you'll have a complete e-commerce database running in 
the cloud. Let's go!"

[00:30 - 05:00] Next.js Project Setup

[SHOW: Terminal]

"First, let's create our Next.js project. I'm in my projects folder.

We'll use create-next-app:

```bash
npx create-next-app@latest instabiz
```

Let me explain these options as they come up:

TypeScript? Yes - we want type safety
ESLint? Yes - catches errors
Tailwind CSS? Yes - for styling  
src/ directory? No - we'll use app/ directly
App Router? Yes - the modern Next.js way
Import alias? Yes - use @/* for cleaner imports

[Wait for installation]

Great! Let's see what we got:

```bash
cd instabiz
code .
```

[VS Code opens]

Quick tour of our structure:
- app/ - Our application code (pages, routes)
- public/ - Static files (images, icons)
- package.json - Dependencies

Let's test it works:

```bash
npm run dev
```

[Show browser at localhost:3000]

Perfect! We have Next.js running. Let's stop this (Ctrl+C) and set up 
our database."

[05:00 - 12:00] Neon Database Setup

[SHOW: Browser going to neon.tech]

"Now for our database. Open neon.tech in your browser.

I'll sign up with GitHub - it's the fastest way.

[Click Sign up with GitHub]

[After auth]

Great! Now let's create our first project.

[Click Create Project]

Project name: instabiz-dev
Region: Choose closest to you - I'm choosing [your region]
PostgreSQL version: 16 (the latest)

[Click Create Project]

While this provisions, let me explain what's happening. Neon is 
creating:
- A PostgreSQL 16 database
- Compute resources (serverless)
- Connection pooling
- Automatic backups

This takes about 30 seconds...

[Database appears]

Perfect! Here's our connection string. This is important - we need 
two versions of it.

[Click on Connection Details]

See 'Connection string'? Copy this entire string.

[Show connection string format]

It looks like: postgresql://user:password@host/database

See that password in the middle? That's unique to your database. 
Keep it safe!

We need two versions:

1. With `?sslmode=require&channel_binding=require` - for app queries
2. With just `?sslmode=require` - for migrations

[Copy to notepad to show]

Got it? Great! Let's head back to our code."

[12:00 - 20:00] Prisma Setup

[SHOW: VS Code]

"Back in our project, let's install Prisma:

```bash
npm install -D prisma
npm install @prisma/client @prisma/config dotenv
```

While this installs... what did we just install?

- prisma: CLI tool for migrations
- @prisma/client: Database client for our app
- @prisma/config: Configuration utilities
- dotenv: Reads .env files

[After installation]

Now let's create our configuration files.

First, create a .env file in the root:

[Create .env file]

```env
DATABASE_URL='postgresql://your-connection-string-here?sslmode=require&channel_binding=require'
```

Paste YOUR connection string from Neon here. [Paste but hide actual password on screen]

Next, create .env.local:

[Create .env.local]

```env
DIRECT_URL='postgresql://your-connection-string-here?sslmode=require'
DATABASE_URL='postgresql://your-connection-string-here?sslmode=require&channel_binding=require'
```

Why two files? 
- .env is for general config
- .env.local is for local development overrides

Now, create prisma.config.ts in the root:

[Create prisma.config.ts]

```typescript
import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: './prisma/migrations',
  },
});
```

Let me explain this:
- We import dotenv to load environment variables
- defineConfig creates our configuration
- We point to our schema file
- datasource.url pulls from DATABASE_URL
- migrations path tells Prisma where to save migrations

Now create the prisma folder:

```bash
mkdir prisma
```

[Folder created]

Perfect! Now for the fun part - designing our schema."

[20:00 - 35:00] Database Schema Creation

[SHOW: Create prisma/schema.prisma]

"Let's create our schema. This is where we define our data structure.

Create prisma/schema.prisma:

[Start typing slowly, explaining each part]

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

Every schema starts with these two blocks:
- generator: Creates the Prisma Client
- datasource: Tells Prisma we're using PostgreSQL

Now let's add our first model - User:

```prisma
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
```

Let me break this down:

id - Unique identifier, cuid() generates collision-resistant IDs
email - Has to be unique, we'll use this for login
role - User type (regular user, business, or admin)
createdAt/updatedAt - Timestamps, auto-managed
shops[], orders[], reviews[] - Relationships to other tables
@@index([email]) - Speeds up looking users up by email

See that question mark after name? That means optional/nullable.
No question mark means required.

Now let's add Shop:

```prisma
model Shop {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?    @db.Text
  logo        String?
  status      ShopStatus @default(PENDING)
  
  ownerId     String
  owner       User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  products    Product[]
  orders      Order[]
  
  @@index([ownerId])
  @@index([slug])
}

enum ShopStatus {
  PENDING
  ACTIVE
  SUSPENDED
  CLOSED
}
```

Key points here:

slug - URL-friendly version of name (like "bobs-shop")
owner relation - Links to User, onDelete: Cascade means if we delete 
  the user, their shops are deleted too
products[] and orders[] - One shop has many products and orders
@@index on ownerId and slug - We'll query these often

Now Product - this is a big one:

[Continue adding Product model, explaining key fields]

[Walk through Order, OrderItem, Review models similarly]

[When complete]

Our schema is done! We have:
- User authentication
- Multi-vendor shops
- Products with variants
- Order management  
- Review system

This is production-grade e-commerce structure."

[35:00 - 40:00] Running Migration

[SHOW: Terminal]

"Time to create our database! First, generate the Prisma Client:

```bash
npx prisma generate
```

[Wait for completion]

This reads our schema and generates TypeScript types. Now we can write 
type-safe database queries!

Now let's create our tables:

```bash
npx prisma migrate dev --name init
```

[As it runs]

What's happening:
1. Prisma reads our schema
2. Generates SQL CREATE TABLE statements  
3. Connects to Neon
4. Runs the SQL
5. Saves the migration file

[Wait for completion]

Success! Look at the output - it created our migration and applied it.

Let's check what it created:

[Show prisma/migrations folder]

See that folder? That's our migration history. The SQL file shows 
exactly what ran on the database.

Now let's see our actual database:

```bash
npx prisma studio
```

[Browser opens to localhost:5555]

Look at this! Prisma Studio is a GUI for our database.

[Click through tables]

User table - all our fields are here
Shop table - see the relationships?
Product table - look at all these fields!

[Show a table structure]

This is real. We have a production database running in the cloud 
right now!

Pretty cool, right?"

[40:00 - 45:00] Git Setup & Wrap Up

[SHOW: Terminal]

"Last step - let's get this into version control.

First, make sure .env is in .gitignore:

[Show .gitignore file]

See these lines?
```
.env
.env*.local
```

Perfect! Our secrets won't be committed.

Now initialize Git:

```bash
git init
git add .
git commit -m "Initial commit: Next.js + Prisma + Neon setup"
```

[Wait for commit]

Create our branches:

```bash
git branch -M main
git checkout -b develop  
git checkout -b feature/phase1-foundation
```

[Explain branches]

main - Production code
develop - Where we integrate features
feature/phase1-foundation - Our current work

Push to GitHub:

[Show creating repo on GitHub]

```bash
git remote add origin <your-repo-url>
git push -u origin main
git push origin develop
git push origin feature/phase1-foundation
```

[After push, show GitHub]

And there we go! Our code is safely in version control.

[WRAP UP]

We did it! In 45 minutes, we:
✓ Created a Next.js project
✓ Set up a cloud PostgreSQL database
✓ Configured Prisma ORM
✓ Designed a complete e-commerce schema
✓ Ran our first migration
✓ Set up Git with proper branching

You now have a production-ready foundation.

In the next module, we'll build authentication - login, signup, 
user roles, the works.

Great job! See you in Module 2!"
```

---

## Production Notes

### Common Recording Issues

**Issue: Typos while coding**
- Don't stop! Say "Oops, typo" and fix it naturally
- Shows students that mistakes happen

**Issue: Command fails**
- Perfect teaching moment!
- Show the error, read it, debug it
- Students need to see problem-solving

**Issue: Slow installation**
- Talk through what's being installed
- Explain what each package does
- Don't show silent waiting

### Editing Guidelines

**DO:**
- Cut long pauses
- Speed up package installations (2x)
- Add zoom-ins for important code
- Add on-screen text for key points
- Include chapter markers

**DON'T:**
- Over-edit - some "umms" are natural
- Cut errors - they're learning moments
- Speed up explanations
- Add music during coding (distracting)

### Equipment Recommendations

**Minimum:**
- USB microphone ($50-100)
- OBS Studio (free)
- 1080p screen resolution

**Ideal:**
- Blue Yeti or Rode microphone
- Camtasia or ScreenFlow
- 1440p or 4K recording
- Ring light for talking head shots

### File Naming Convention

```
M01_01_Introduction.mp4
M01_02_Theory_TechStack.mp4
M01_03_Coding_Part1_Setup.mp4
M01_04_Coding_Part2_Prisma.mp4
M01_05_Coding_Part3_Migration.mp4
M01_06_Exercise_Solution.mp4
```

---

## Publishing Checklist

Before publishing Module 1:

- [ ] All videos recorded and edited
- [ ] Videos uploaded to hosting (Vimeo/YouTube)
- [ ] Written guide completed with screenshots
- [ ] Code repository branch created and tagged
- [ ] Exercise files created
- [ ] Solution code available
- [ ] Quiz created in LMS
- [ ] Thumbnail images created
- [ ] Module description written
- [ ] Prerequisites clearly listed
- [ ] Estimated time to complete added
- [ ] Next module teaser included

---

## Student Support Plan

### Expected Questions

**Q: "My migration failed with connection error"**
A: Check your .env file. Make sure:
1. DATABASE_URL is correct
2. Password has no spaces
3. String ends with ?sslmode=require

**Q: "Prisma generate says 'cannot find module'"**  
A: Run `npm install` to ensure all packages installed

**Q: "I get 'datasource url' error"**
A: Make sure prisma.config.ts is at root level, not inside prisma/

**Q: "Git says .env is tracked"**
A: Run `git rm --cached .env` to untrack it

### Response Time Goal
- Forum questions: Within 24 hours
- Critical bugs: Within 12 hours
- General questions: Within 48 hours

---

This completes the Module 1 video production guide!
