# Git Workflow - Committing Phase 1 Foundation
## InstaBiz Development Branch Management

---

## Current Status Check

First, let's see what we have:

```bash
# Check current branch
git branch

# Should show:
# * feature/phase1-foundation
#   develop
#   main

# Check status
git status
```

---

## Step 1: Review Changes

See what you've done:

```bash
# See all changed files
git status

# See detailed changes
git diff

# See staged changes
git diff --cached
```

---

## Step 2: Stage Your Changes

### Add All Changes:

```bash
# Add everything
git add .
```

### Or Add Selectively:

```bash
# Add specific files
git add app/(auth)/
git add lib/sync-clerk-user.ts
git add lib/auth-helpers.ts
git add prisma/schema.prisma
git add package.json package-lock.json
git add .env.local.example

# Check what's staged
git status
```

**Important:** Make sure `.env.local` is NOT staged:

```bash
# If you accidentally staged .env.local, unstage it:
git reset HEAD .env.local
```

---

## Step 3: Commit Your Work

### Create a Descriptive Commit:

```bash
git commit -m "feat: complete Phase 1 foundation setup

- Initialize Next.js 15 with App Router
- Configure Tailwind CSS v4 with CSS imports
- Set up Prisma ORM with Neon PostgreSQL
- Add complete e-commerce database schema (User, Shop, Product, Order, Review)
- Integrate Clerk authentication
- Create manual user sync utility for development
- Add auth helper functions (requireAuth, requireRole, getOptionalUser)
- Configure Mux for video processing
- Set up UploadThing for file uploads
- Add Clerk sign-in/sign-up pages with catch-all routes
- Update User model with clerkId field
- Run initial database migration

Resolves: #1 Phase 1 Foundation"
```

---

## Step 4: Merge to Develop Branch

### Switch to Develop:

```bash
git checkout develop
```

### Merge Feature Branch:

```bash
git merge feature/phase1-foundation
```

**If there are conflicts:**

```bash
# See conflicted files
git status

# Edit conflicted files, then:
git add <resolved-files>
git commit -m "chore: resolve merge conflicts"
```

---

## Step 5: Push to Remote

### Push Both Branches:

```bash
# Push develop
git push origin develop

# Push feature branch (for backup)
git push origin feature/phase1-foundation
```

---

## Step 6: Tag This Milestone

Create a tag for Phase 1 completion:

```bash
# On develop branch
git tag -a v0.1.0-phase1 -m "Phase 1: Foundation Complete

- Next.js 15 + Tailwind CSS v4
- Prisma + Neon PostgreSQL
- Clerk Authentication
- Complete e-commerce schema
- File upload (UploadThing)
- Video processing (Mux)
"

# Push tag
git push origin v0.1.0-phase1
```

---

## Step 7: Create Next Feature Branch

Prepare for Phase 2:

```bash
# Make sure you're on develop
git checkout develop

# Create Phase 2 branch
git checkout -b feature/phase2-authentication

# Push it
git push -u origin feature/phase2-authentication
```

---

## Complete Workflow Summary

```bash
# 1. Check status
git status

# 2. Stage changes
git add .

# 3. Commit
git commit -m "feat: complete Phase 1 foundation setup"

# 4. Switch to develop
git checkout develop

# 5. Merge feature
git merge feature/phase1-foundation

# 6. Push develop
git push origin develop

# 7. Tag milestone
git tag -a v0.1.0-phase1 -m "Phase 1: Foundation Complete"
git push origin v0.1.0-phase1

# 8. Create next feature branch
git checkout -b feature/phase2-authentication
git push -u origin feature/phase2-authentication
```

---

## Branch Strategy Visualization

```
main (production)
 │
 └─── develop (integration)
       │
       ├─── feature/phase1-foundation ✅ (just completed)
       │    └─── [merge back to develop]
       │
       └─── feature/phase2-authentication ⏳ (next up)
```

---

## Verify Everything Worked

```bash
# Check branches
git branch -a

# Should see:
# * feature/phase2-authentication (current)
#   feature/phase1-foundation
#   develop
#   main
#   remotes/origin/develop
#   remotes/origin/feature/phase1-foundation
#   remotes/origin/feature/phase2-authentication
#   remotes/origin/main

# Check tags
git tag

# Should see:
# v0.1.0-phase1

# Check commit history
git log --oneline --graph --all -10
```

---

## Best Practices You're Following

✅ **Feature branches** - Isolated work
✅ **Descriptive commits** - Clear what changed
✅ **Merge to develop** - Integration branch
✅ **Tags for milestones** - Easy to reference
✅ **Push everything** - Backup and collaboration

---

## What Each Branch Is For

### main
- **Purpose:** Production-ready code
- **Deploy from:** This branch
- **Merge into:** Only from develop after testing
- **Never:** Commit directly to main

### develop
- **Purpose:** Integration and pre-production
- **Merge from:** Feature branches
- **Deploy to:** Staging environment (optional)
- **Test:** Everything before merging to main

### feature/phase1-foundation
- **Purpose:** Phase 1 work (just completed)
- **Status:** ✅ Complete, merged to develop
- **Keep:** Yes, for reference

### feature/phase2-authentication
- **Purpose:** Phase 2 work (next up)
- **Status:** ⏳ In progress
- **Working on:** Authentication features

---

## When to Merge to Main

After Phase 1 is complete and tested on develop:

```bash
# On develop branch, make sure everything works
git checkout develop
npm install
npm run dev
# Test everything...

# If all good, merge to main
git checkout main
git merge develop

# Tag production release
git tag -a v1.0.0 -m "Release 1.0.0: Phase 1 Complete"

# Push
git push origin main
git push origin v1.0.0

# Deploy to production (Vercel, Railway, etc.)
```

---

## Handling Hotfixes

If you need to fix a production bug:

```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/fix-critical-bug

# Make fix
# ... fix code ...

# Commit
git commit -m "fix: critical bug in user authentication"

# Merge to main
git checkout main
git merge hotfix/fix-critical-bug

# Also merge to develop
git checkout develop
git merge hotfix/fix-critical-bug

# Delete hotfix branch
git branch -d hotfix/fix-critical-bug

# Push everything
git push origin main
git push origin develop
```

---

## Common Git Commands Reference

```bash
# Branch Management
git branch                    # List local branches
git branch -a                 # List all branches (including remote)
git checkout <branch>         # Switch branch
git checkout -b <branch>      # Create and switch
git branch -d <branch>        # Delete branch

# Staging
git add <file>                # Stage specific file
git add .                     # Stage all changes
git reset HEAD <file>         # Unstage file

# Committing
git commit -m "message"       # Commit with message
git commit --amend            # Edit last commit

# Syncing
git pull origin <branch>      # Get latest changes
git push origin <branch>      # Push changes
git push -u origin <branch>   # Push and set upstream

# History
git log                       # View commit history
git log --oneline             # Compact history
git log --graph --all         # Visual branch history

# Tagging
git tag                       # List tags
git tag -a v1.0.0 -m "msg"   # Create annotated tag
git push origin v1.0.0        # Push tag

# Undoing
git reset --soft HEAD~1       # Undo last commit, keep changes
git reset --hard HEAD~1       # Undo last commit, discard changes
git checkout -- <file>        # Discard changes to file
```

---

## .gitignore Check

Make sure your `.gitignore` includes:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations/*
!/prisma/migrations/.gitkeep

# editor
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea
*.swp
*.swo
*~
```

**Critical:** Never commit `.env.local` with real keys!

---

## Create .env.example

Create `.env.example` with placeholders for others:

```env
# .env.example

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Mux Video
MUX_TOKEN_ID=xxxxx
MUX_TOKEN_SECRET=xxxxx
MUX_WEBHOOK_SECRET=whsec_xxxxx

# UploadThing
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add to git:

```bash
git add .env.example
git commit -m "docs: add environment variables example"
git push origin develop
```

---

## Ready for Phase 2!

You've successfully:
✅ Committed Phase 1 work
✅ Merged to develop
✅ Tagged the milestone
✅ Created Phase 2 branch
✅ Following best practices

**Current branch:** `feature/phase2-authentication`

**Next steps:**
1. Build authentication features
2. User roles and permissions
3. Protected routes
4. User profile pages

Let's build! 🚀
