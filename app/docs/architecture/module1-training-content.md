# Module 1: Project Foundation & Database Setup
## Project based Programming for beginners: InstaBiz Course - InstaSkul.com

---

## Module Overview

**What Students Will Learn:**
- Setting up a production-grade Next.js e-commerce project
- Configuring PostgreSQL with Neon cloud database
- Implementing Prisma ORM with complex schemas
- Git workflow and branching strategies
- Environment variable management
- Database migrations and schema design for e-commerce

**Prerequisites:**
- Basic JavaScript/TypeScript knowledge
- Node.js installed (v18+)
- Git basics
- Text editor (VS Code recommended)

**Time to Complete:** 2-3 hours

---

## Lesson Structure

### 1. Introduction Video (5 minutes)
**Title:** "Building InstaBiz: Full-Stack E-commerce Platform - Module 1"

**Script Outline:**

```
[INTRO - 30 seconds]
"Welcome to InstaBiz - where we'll build a complete multi-vendor e-commerce platform from scratch. I'm [Your Name], and over the next 16 modules, you'll learn everything from authentication to payments to deployment.

Today in Module 1, we're laying the foundation. We'll set up our Next.js project, connect to a cloud PostgreSQL database, design our e-commerce schema, and run our first migration.

By the end of this module, you'll have a fully configured development environment with a database containing users, shops, products, and orders tables - ready to build features on top of."

[WHAT WE'LL BUILD - 1 minute]
Show diagram:
- Next.js App (with App Router)
- Neon PostgreSQL Database
- Prisma ORM
- shadcn/ui Components
- Git Repository

"This is a real-world tech stack used by production companies. Everything we do here follows industry best practices."

[LEARNING OUTCOMES - 1 minute]
"After this module, you'll be able to:
✓ Initialize a Next.js project with TypeScript
✓ Set up cloud PostgreSQL with Neon
✓ Configure Prisma ORM with complex relationships
✓ Design an e-commerce database schema
✓ Manage environment variables securely
✓ Use Git with feature branches
✓ Run database migrations

Let's dive in!"

[PREVIEW - 2 minutes]
Quick demo:
- Show final folder structure
- Open Prisma Studio showing all tables
- Show one table (Products) with fields
- Show the Git repository with branches

"Let's get started building!"
```

---

### 2. Theory Video (15 minutes)
**Title:** "E-commerce Database Architecture & Modern Stack Explained"

**Topics to Cover:**

#### Part 1: Tech Stack Overview (5 min)
```
[Next.js App Router]
- Why Next.js for e-commerce?
- Server components vs Client components
- API routes for backend logic
- File-based routing

[PostgreSQL + Neon]
- Why PostgreSQL for e-commerce?
- Relational data (users → shops → products → orders)
- ACID compliance for financial transactions
- Why cloud database (Neon) vs local?
- Serverless PostgreSQL advantages

[Prisma ORM]
- What is an ORM?
- Type-safe database queries
- Auto-generated TypeScript types
- Migration management
- Why Prisma over raw SQL?
```

#### Part 2: Database Schema Design (5 min)
```
[E-commerce Data Model]
Show ERD (Entity Relationship Diagram):

User ──┬── Shop ──── Product ──── OrderItem ──── Order
       │                │
       └── Order        └── Review
       └── Review

Explain each entity:
- User: Authentication, roles (individual/corporate/admin)
- Shop: Multi-vendor support, each user can have multiple shops
- Product: Inventory, pricing, variants
- Order: Shopping cart → Order conversion
- Review: Product ratings and feedback

[Key Relationships]
- One-to-Many: User → Shops, Shop → Products
- Many-to-Many: Products ← OrderItems → Orders
- Self-referencing: Category hierarchy
```

#### Part 3: Environment & Configuration (5 min)
```
[Environment Variables]
- What are they?
- Why use .env files?
- .env vs .env.local
- Security: Never commit passwords
- DATABASE_URL structure explained

[Prisma Configuration]
- prisma.config.ts vs schema.prisma
- Why separate config and schema?
- Migration strategy

[Git Workflow]
- Feature branch strategy
- main → develop → feature branches
- Why this matters for teams and training
```

---

### 3. Coding Tutorial (45 minutes)
**Title:** "Setting Up InstaBiz: Step-by-Step Implementation"

**Timestamps & Content:**

```
[00:00 - 05:00] Project Initialization
- npx create-next-app@latest instabiz
- Options explained (TypeScript, Tailwind, App Router)
- Install shadcn/ui
- Project tour: folder structure

[05:00 - 12:00] Neon Database Setup
- Sign up at neon.tech (use GitHub)
- Create new project
- Understanding the dashboard
- Copy connection string
- Explain connection string components

[12:00 - 20:00] Prisma Installation & Configuration
- npm install prisma @prisma/client @prisma/config dotenv
- Create .env and .env.local
- Paste connection strings
- Create prisma.config.ts
- Explain the config structure

[20:00 - 35:00] Database Schema Design
- Create prisma/schema.prisma
- Walk through each model:
  * User model fields explained
  * Shop model and multi-tenancy
  * Product with variants and inventory
  * Order with status workflow
  * Reviews with ratings
- Explain relationships (@relation)
- Explain indexes (@@index) and why they matter
- Explain unique constraints (@@unique)

[35:00 - 40:00] Running First Migration
- npx prisma generate (what it does)
- npx prisma migrate dev --name init
- Troubleshooting common errors
- Explain migration files

[40:00 - 45:00] Verification & Git Setup
- npx prisma studio
- Tour of database in browser
- Git initialization
- Create .gitignore
- First commit
- Create feature branch
- Push to GitHub
```

**Code Snippets Shown:**

All commands typed on screen with explanations:
```bash
# Project setup
npx create-next-app@latest instabiz
cd instabiz

# Prisma setup
npm install -D prisma
npm install @prisma/client @prisma/config dotenv
npx prisma init

# Migration
npx prisma generate
npx prisma migrate dev --name init

# Git workflow
git init
git add .
git commit -m "Initial commit: Next.js + Prisma + Neon setup"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
git checkout -b develop
git checkout -b feature/phase1-foundation
```

---

### 4. Written Guide
**Title:** "Complete Setup Guide: InstaBiz Module 1"

**Document Structure:**

```markdown
# Module 1: Project Foundation & Database Setup

## Table of Contents
1. Prerequisites
2. Project Initialization
3. Neon Database Setup
4. Prisma Configuration
5. Database Schema Design
6. Running Migrations
7. Git Workflow
8. Troubleshooting
9. What's Next

## 1. Prerequisites

Before starting, ensure you have:
- [ ] Node.js v18 or higher installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Basic understanding of JavaScript/TypeScript
- [ ] A GitHub account

Test your setup:
```bash
node --version  # Should show v18+
git --version   # Should show git version
```

## 2. Project Initialization

[Step by step instructions with screenshots]

## 3. Neon Database Setup

[Detailed instructions with screenshots of Neon dashboard]

... (Continue with all sections)

## 8. Troubleshooting

### Issue: "Can't reach database server"
**Symptom:** Migration fails with connection error
**Cause:** Wrong connection string or password
**Solution:**
1. Check your .env file
2. Verify password matches Neon dashboard
3. Ensure DATABASE_URL has ?sslmode=require

[More common issues...]

## 9. What's Next

In Module 2, we'll:
- Set up authentication with NextAuth.js
- Create login and registration pages
- Implement role-based access control
- Build user profile pages

See you in Module 2!
```

---

### 5. Code Repository
**Branch:** `module-1-foundation`

**README.md for branch:**

```markdown
# InstaBiz - Module 1: Foundation

This branch contains the completed code for Module 1.

## What's Included

- ✅ Next.js 14 with App Router
- ✅ TypeScript configured
- ✅ Tailwind CSS + shadcn/ui
- ✅ Prisma ORM with complete e-commerce schema
- ✅ Neon PostgreSQL connection
- ✅ Initial migration applied

## How to Use This Code

### Clone and Setup
```bash
git clone <repo-url>
git checkout module-1-foundation
npm install
```

### Configure Environment
1. Create `.env` file
2. Add your Neon DATABASE_URL
3. Create `.env.local` file
4. Add DIRECT_URL

### Run Migration
```bash
npx prisma generate
npx prisma migrate dev
```

### Verify Setup
```bash
npx prisma studio
```

## Folder Structure
```
instabiz/
├── app/              # Next.js App Router
├── prisma/           # Database schema
├── lib/              # Utilities
├── components/       # React components
├── prisma.config.ts  # Prisma configuration
├── .env              # Environment variables (create this)
└── package.json
```

## Key Files to Study

1. `prisma/schema.prisma` - Database schema
2. `prisma.config.ts` - Database connection config
3. `lib/prisma.ts` - Prisma client instance

## Next Steps

Continue to Module 2: Authentication & User Management
```

---

### 6. Practice Exercise
**Title:** "Build Your Own Schema: Blog Platform"

**Objective:** Apply what you learned by creating a different schema

**Requirements:**

```
Create a blog platform database schema with:

1. User model
   - id, email, name, password, role (AUTHOR/READER/ADMIN)
   - createdAt, updatedAt

2. Post model
   - id, title, slug, content, published status
   - authorId (relation to User)
   - categoryId (optional)
   - views, likes
   - createdAt, updatedAt, publishedAt

3. Category model
   - id, name, slug, description
   - Support parent/child categories

4. Comment model
   - id, content, authorId, postId
   - parentId (for nested comments)
   - createdAt, updatedAt

5. Like model
   - Track which users liked which posts
   - userId, postId

Required Features:
- Proper relationships between models
- Indexes on frequently queried fields
- Unique constraints where needed
- Timestamps on all models

Bonus Challenge:
- Add a Tag model with many-to-many relation to Posts
- Add a Follow model so users can follow authors
```

**Starter Template:**

```prisma
// Your schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// YOUR CODE HERE
// Create the models described above

model User {
  // Start here!
}
```

**Deliverables:**
1. Complete schema.prisma file
2. Screenshot of Prisma Studio showing tables
3. Screenshot of successful migration

---

### 7. Solution Video (15 minutes)
**Title:** "Exercise Solution: Blog Platform Schema"

**Content:**

```
[Introduction - 2 min]
"Let's walk through the solution for the blog platform exercise. 
I'll show you my approach, explain the decisions I made, and 
highlight common mistakes students make."

[User Model - 2 min]
Show and explain User model code

[Post Model - 3 min]
Show Post model with relationships
Explain why certain indexes were added

[Category Model - 2 min]
Self-referencing relation explained

[Comment Model - 3 min]
Nested comments with parentId
Why we need both postId and authorId

[Like Model - 2 min]
Many-to-many relationship
@@unique constraint explained

[Bonus Features - 1 min]
Tag model (if attempted)
Follow model (if attempted)

[Wrap Up - 1 min]
"Great job! You now understand schema design. 
Let's apply this to InstaBiz features next!"
```

---

### 8. Quiz (10 Questions)
**Title:** "Module 1 Knowledge Check"

**Questions:**

1. **What command initializes a new Prisma project?**
   - A) `npx prisma start`
   - B) `npx prisma init`
   - C) `npm install prisma`
   - D) `prisma create`
   
   **Answer:** B
   **Explanation:** `npx prisma init` creates the prisma folder and schema.prisma file

2. **In Prisma, what does the @relation attribute do?**
   - A) Creates a database table
   - B) Defines relationships between models
   - C) Adds validation rules
   - D) Creates indexes
   
   **Answer:** B
   **Explanation:** @relation defines how models are connected (one-to-many, etc.)

3. **Why do we use .env files?**
   - A) To make code faster
   - B) To store configuration separately from code
   - C) To create backups
   - D) To test the application
   
   **Answer:** B
   **Explanation:** .env files store sensitive config (like passwords) outside of code

4. **What's the difference between DATABASE_URL and DIRECT_URL?**
   - A) There is no difference
   - B) DIRECT_URL is faster
   - C) DATABASE_URL for pooled connections, DIRECT_URL for migrations
   - D) DIRECT_URL is more secure
   
   **Answer:** C
   **Explanation:** Pooled connections for app queries, direct for migrations

5. **What does @@index do in a Prisma model?**
   - A) Creates a unique constraint
   - B) Improves query performance on that field
   - C) Makes the field required
   - D) Adds validation
   
   **Answer:** B
   **Explanation:** Indexes speed up database queries on indexed fields

6. **Which relationship type is Shop → Products in our schema?**
   - A) One-to-One
   - B) One-to-Many
   - C) Many-to-Many
   - D) No relationship
   
   **Answer:** B
   **Explanation:** One shop has many products

7. **What command runs database migrations?**
   - A) `npx prisma push`
   - B) `npx prisma migrate`
   - C) `npx prisma migrate dev`
   - D) `npx prisma update`
   
   **Answer:** C
   **Explanation:** migrate dev creates and applies migrations

8. **What does Prisma Studio do?**
   - A) Records videos
   - B) Visual database browser and editor
   - C) Code editor
   - D) Testing tool
   
   **Answer:** B
   **Explanation:** Prisma Studio is a GUI for viewing/editing database data

9. **Why use a feature branch workflow?**
   - A) Makes code faster
   - B) Isolates work and enables easy rollback
   - C) Required by Git
   - D) Makes deployment automatic
   
   **Answer:** B
   **Explanation:** Feature branches keep main stable and work isolated

10. **What does npx prisma generate do?**
    - A) Creates the database
    - B) Runs migrations
    - C) Generates type-safe Prisma Client from schema
    - D) Creates backup
    
    **Answer:** C
    **Explanation:** Generates Prisma Client with TypeScript types from schema

**Passing Score:** 8/10 (80%)

---

## Additional Resources

### Cheat Sheet
**"Prisma & Database Commands - Quick Reference"**

```
# Prisma Commands
npx prisma init              # Initialize Prisma
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Create & run migration
npx prisma migrate reset     # Reset database (DANGER!)
npx prisma studio           # Open database GUI
npx prisma db push          # Push schema without migration
npx prisma db pull          # Pull schema from database

# Git Commands
git status                   # Check current status
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
git checkout -b branch-name  # Create & switch branch
git push origin branch-name  # Push branch to remote

# npm Commands
npm install                  # Install dependencies
npm install -D package       # Install dev dependency
npm run dev                  # Start dev server
```

### Further Reading
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Neon Documentation](https://neon.tech/docs)
- [Database Schema Design Best Practices](link)

---

## Assessment Criteria

Students should be able to:
- [ ] Initialize a Next.js project from scratch
- [ ] Create a Neon database and get connection string
- [ ] Configure Prisma with config file and schema
- [ ] Write Prisma models with relationships
- [ ] Run migrations successfully
- [ ] Use Prisma Studio to view data
- [ ] Set up Git with feature branches
- [ ] Manage environment variables securely

---

## Module Completion

**To complete this module, submit:**
1. Screenshot of Prisma Studio showing all tables
2. Screenshot of your Git repository with branches
3. Your completed blog platform exercise schema
4. Quiz results (min 80%)

**Estimated Time:** 2-3 hours

**Next Module:** Module 2 - Authentication & User Management

---

## Instructor Notes

**Common Student Mistakes:**
1. Forgetting to add DATABASE_URL to .env
2. Using .env instead of .env.local for DIRECT_URL
3. Not URL encoding special characters in password
4. Forgetting to run `npx prisma generate` before migrate
5. Committing .env files to Git

**Teaching Tips:**
1. Emphasize the importance of environment variables early
2. Show both successful AND failing migrations
3. Walk through error messages and how to debug
4. Demonstrate Git workflow visually
5. Have students verify each step before moving on

**Time Savers:**
- Provide a working .env.example file
- Have pre-written schema sections students can copy
- Create checkpoint branches students can reference
- Record separate shorter videos for each section

---

## Success Metrics

Track student progress:
- [ ] Project initialized
- [ ] Database connected
- [ ] Schema created
- [ ] Migration successful
- [ ] Git repository set up
- [ ] Exercise completed
- [ ] Quiz passed

**Completion Rate Goal:** 90%
**Average Time:** 2.5 hours
**Student Satisfaction Target:** 4.5/5 stars
```
