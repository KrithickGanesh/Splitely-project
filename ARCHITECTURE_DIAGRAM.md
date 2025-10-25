# Splitely System Architecture

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │    │   (Convex)      │    │   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │ React   │              │Real-  │               │Clerk  │
    │Components│◄────────────►│time   │◄─────────────►│Auth   │
    │         │              │Database│               │       │
    └─────────┘              └───┬───┘               └───────┘
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │Tailwind │              │Convex │               │Resend │
    │CSS      │              │Actions│◄─────────────►│Email  │
    │         │              │       │               │API    │
    └─────────┘              └───┬───┘               └───────┘
                                 │                       │
                             ┌───▼───┐               ┌───▼───┐
                             │Convex │               │Google │
                             │Queries│◄─────────────►│Gemini │
                             │       │               │AI     │
                             └───────┘               └───────┘
```

## Data Flow Architecture

```
User Action → Frontend → Convex Mutation → Database Update → Real-time Sync → All Connected Clients

Example: Add Expense Flow
1. User fills expense form
2. Frontend validates input
3. Convex mutation processes expense
4. Database stores expense + updates balances
5. Real-time sync pushes to all group members
6. Email notifications triggered
7. AI analysis scheduled for monthly insights
```

## Component Architecture

```
app/
├── (auth)/                 # Authentication pages
│   ├── sign-in/
│   └── sign-up/
├── (main)/                 # Main application
│   ├── dashboard/          # User dashboard
│   ├── groups/            # Group management
│   └── expenses/          # Expense tracking
├── api/                   # API endpoints
│   ├── automated-emails/  # Email automation
│   ├── ai-insights/       # AI analysis
│   └── cron/             # Scheduled jobs
└── email-admin/          # Admin dashboard

convex/
├── users.js              # User management
├── groups.js             # Group operations
├── expenses.js           # Expense handling
├── settlements.js        # Payment tracking
├── email.js              # Email functions
└── schema.js             # Database schema
```

## Security Architecture

```
┌─────────────────┐
│   User Request  │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │   Clerk   │ ◄── JWT Token Validation
    │   Auth    │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │  Convex   │ ◄── Server-side Authorization
    │  Backend  │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │ Database  │ ◄── Row-level Security
    │ (Convex)  │
    └───────────┘
```

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │     Convex      │    │   External      │
│   (Frontend)    │    │   (Backend)     │    │   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │Next.js  │              │Edge   │               │Clerk  │
    │App      │◄────────────►│Runtime│◄─────────────►│Auth   │
    │         │              │       │               │       │
    └─────────┘              └───────┘               └───────┘
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │Vercel   │              │Auto   │               │Resend │
    │Cron Jobs│              │Scale  │◄─────────────►│Email  │
    │         │              │       │               │       │
    └─────────┘              └───────┘               └───────┘
                                 │                       │
                             ┌───▼───┐               ┌───▼───┐
                             │Global │               │Google │
                             │CDN    │               │AI API │
                             │       │               │       │
                             └───────┘               └───────┘
```

## Real-time Sync Flow

```
User A adds expense → Convex Database → Real-time push → User B's browser updates
                                    → Email notification → User B gets reminder
                                    → AI analysis queue → Monthly insights data
```

## Email Automation Flow

```
Cron Job (Daily 9 AM) → Check all users → Query pending payments → Generate email → Send via Resend
Cron Job (Monthly 1st) → Check all users → Generate AI insights → Create email → Send via Resend
```