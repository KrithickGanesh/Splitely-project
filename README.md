# 💰 Splitely - Smart Expense Splitting App

A modern, full-featured expense splitting application built with Next.js, Convex, and Clerk. Split bills, track expenses, and get AI-powered insights with automated email notifications.

## ✨ Features

### 🎯 Core Features
- **Smart Expense Splitting**: Equal, percentage, or custom splits
- **Group Management**: Create and manage expense groups
- **Real-time Sync**: Live updates across all devices
- **Settlement Tracking**: Track who owes what to whom
- **Multi-currency Support**: Handle expenses in different currencies

### 🤖 AI-Powered Features
- **Monthly Insights**: AI-generated spending analysis and trends
- **Smart Categorization**: Automatic expense categorization
- **Spending Predictions**: Forecast future expenses
- **Budget Recommendations**: Personalized budget suggestions

### 📧 Automated Email System
- **Monthly Reports**: Comprehensive spending insights sent monthly
- **Daily Reminders**: Payment reminders for pending settlements
- **Real-time Notifications**: Instant updates on group activities
- **Beautiful HTML Emails**: Professional, responsive email templates

### 🔐 Security & Authentication
- **Clerk Authentication**: Secure user management
- **Role-based Access**: Group admin and member permissions
- **Data Encryption**: Secure data storage and transmission

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account
- Clerk account  
- Resend account (for emails)
- Google AI Studio account (for AI features)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd splitely
npm install
```

### 2. Environment Setup
Create `.env.local` with your credentials:

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev

# Resend Email API
RESEND_API_KEY=re_...

# Google AI (Gemini)
GEMINI_API_KEY=AIzaSy...
```

### 3. Database Setup
```bash
# Deploy Convex schema
npx convex dev
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📧 Email System Setup

### Resend Configuration
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your `.env.local`
4. Emails will be sent from `delivered@resend.dev` (Resend's default domain)

### Testing Email System
Visit `/email-admin` to access the comprehensive email testing dashboard:

- **Basic Email Test**: Test core email functionality
- **Direct Resend Test**: Test Resend API integration
- **Monthly Insights**: Send AI-powered monthly reports
- **Payment Reminders**: Send payment reminder emails
- **Automated System**: Test full automation system

### Production Email Automation
The app includes Vercel Cron Jobs configuration in `vercel.json`:

- **Daily Reminders**: 9 AM every day (`0 9 * * *`)
- **Monthly Insights**: 9 AM on 1st of every month (`0 9 1 * *`)

## 🤖 AI Features Setup

### Google AI (Gemini) Configuration
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `GEMINI_API_KEY` to your `.env.local`
3. AI insights will automatically generate monthly spending analysis

### AI Features Include:
- Spending pattern analysis
- Budget recommendations  
- Expense categorization
- Trend predictions
- Personalized insights

## 🏗️ Project Structure

```
splitely/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (main)/                   # Main app pages
│   ├── api/                      # API routes
│   │   ├── automated-emails/     # Email automation
│   │   ├── send-monthly-insights/# Monthly reports
│   │   ├── send-payment-reminders/# Payment reminders
│   │   ├── cron/                 # Cron job endpoints
│   │   └── test-email/           # Email testing
│   ├── email-admin/              # Email admin dashboard
│   └── layout.js                 # Root layout
├── convex/                       # Convex backend
│   ├── email.js                  # Email functions
│   ├── users.js                  # User management
│   ├── groups.js                 # Group management
│   ├── expenses.js               # Expense tracking
│   ├── settlements.js            # Settlement tracking
│   └── schema.js                 # Database schema
├── components/                   # React components
├── lib/                         # Utility functions
└── vercel.json                  # Deployment config
```

## 🔧 API Endpoints

### Email System
- `GET /api/debug-email` - Debug email configuration
- `POST /api/test-email` - Send test email
- `POST /api/send-monthly-insights` - Send monthly insights
- `POST /api/send-payment-reminders` - Send payment reminders
- `POST /api/automated-emails` - Run automated email system

### Cron Jobs (Production)
- `GET /api/cron/daily` - Daily payment reminders
- `GET /api/cron/monthly` - Monthly insights

### AI Features
- `POST /api/ai-insights` - Generate AI insights
- `POST /api/test-ai-all-users` - Test AI for all users

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Make sure to add all environment variables from `.env.local` to your Vercel project settings.

### Cron Jobs
The `vercel.json` file automatically sets up cron jobs for:
- Daily payment reminders at 9 AM
- Monthly insights on the 1st of each month at 9 AM

## 🧪 Testing

### Email Testing
1. Visit `/email-admin` for comprehensive email testing
2. Test individual email functions
3. Run full automation system
4. Monitor email delivery and errors

### Manual Testing Commands
```bash
# Test email configuration
curl -X GET http://localhost:3000/api/debug-email

# Test automated emails
curl -X POST http://localhost:3000/api/automated-emails \
  -H "Content-Type: application/json" \
  -d '{"type": "all", "force": true}'
```

## 📊 Features Overview

### ✅ Completed Features
- [x] User authentication with Clerk
- [x] Expense creation and splitting
- [x] Group management
- [x] Settlement tracking
- [x] Real-time data sync with Convex
- [x] Responsive design
- [x] Email system with Resend
- [x] Monthly insights emails
- [x] Daily payment reminders
- [x] AI-powered spending analysis
- [x] Automated email scheduling
- [x] Comprehensive admin dashboard
- [x] Production-ready deployment

### 🎯 Key Benefits
- **Automated**: Monthly insights and daily reminders sent automatically
- **AI-Powered**: Smart spending analysis and recommendations
- **Real-time**: Live updates across all devices
- **Secure**: Enterprise-grade authentication and data protection
- **Scalable**: Built on modern, scalable infrastructure
- **Beautiful**: Professional UI/UX with responsive design

## 🤝 Support

For issues or questions:
1. Check the `/email-admin` dashboard for email system status
2. Review logs in your Vercel deployment dashboard
3. Test individual components using the provided API endpoints

## 📝 License

This project is licensed under the MIT License.

---

**🎉 Your Splitely app is ready for production!** 

The automated email system will send:
- **Monthly insights** on the 1st of every month at 9 AM
- **Payment reminders** daily at 9 AM (only if there are pending payments)

All emails are sent from `delivered@resend.dev` and include beautiful, responsive HTML templates with your spending data and AI-powered insights.