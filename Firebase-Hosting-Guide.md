# Firebase Hosting Deployment Guide for RankBee

## Overview
This guide will help you deploy your RankBee SEO tools website to Firebase Hosting, making it live on the internet with a custom domain or Firebase subdomain.

## Prerequisites
- Gmail account for Firebase Console access
- Node.js installed on your computer
- Firebase CLI tools
- Built project files

## Step 1: Set Up Firebase Project

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project" or "Add project"
   - Enter project name: `rankbee-seo-tools`
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

3. **Enable Hosting**
   - In your Firebase project, go to "Hosting" from left sidebar
   - Click "Get started"
   - Follow the setup instructions

## Step 2: Prepare Your Project for Deployment

1. **Build Your Project**
   ```bash
   # In your Replit project or local environment
   npm run build
   ```

2. **Create Firebase Configuration**
   - In your project root, create `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
           "headers": [
             {
               "key": "Access-Control-Allow-Origin",
               "value": "*"
             }
           ]
         },
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=604800"
             }
           ]
         },
         {
           "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=604800"
             }
           ]
         }
       ]
     },
     "functions": {
       "source": "server",
       "runtime": "nodejs18"
     }
   }
   ```

## Step 3: Install Firebase CLI

1. **Install Firebase CLI globally**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```
   - This will open a browser window
   - Sign in with your Google account
   - Grant necessary permissions

## Step 4: Initialize Firebase in Your Project

1. **Initialize Firebase**
   ```bash
   firebase init
   ```

2. **Select Services**
   - Choose "Hosting: Configure files for Firebase Hosting"
   - Choose "Functions: Configure a Cloud Functions directory"

3. **Configure Hosting**
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds and deploys: `No` (for now)

## Step 5: Deploy Your Website

1. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

2. **Your site is now live!**
   - Firebase will provide you with URLs:
   - Hosting URL: `https://your-project-id.web.app`
   - Or: `https://your-project-id.firebaseapp.com`

## Step 6: Set Up Custom Domain (Optional)

1. **Add Custom Domain**
   - In Firebase Console, go to Hosting
   - Click "Add custom domain"
   - Enter your domain (e.g., `rankbee.com`)

2. **Configure DNS**
   - Add the provided DNS records to your domain registrar:
   - Type: A Record
   - Name: @ (or your subdomain)
   - Value: Firebase IP addresses provided

3. **SSL Certificate**
   - Firebase automatically provisions SSL certificates
   - This may take 24-48 hours to complete

## Step 7: Environment Variables for Production

1. **Set Production Environment Variables**
   ```bash
   # For Firebase Functions (if using backend)
   firebase functions:config:set database.url="your-production-database-url"
   firebase functions:config:set auth.jwt_secret="your-jwt-secret"
   ```

2. **Update Firebase Configuration**
   - In Firebase Console, go to Project Settings
   - Add your production API keys in "Service accounts"

## Step 8: Configure Backend (If Needed)

### Option A: Deploy Backend to Firebase Functions
1. **Update server/index.ts for Functions**
   ```typescript
   import * as functions from 'firebase-functions';
   import express from 'express';
   // ... your existing server code
   
   const app = express();
   // ... your routes
   
   export const api = functions.https.onRequest(app);
   ```

2. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

### Option B: Use External Backend Service
- Deploy your Express backend to services like:
  - Railway
  - Render  
  - Heroku
  - DigitalOcean App Platform

## Step 9: Database Migration

1. **Export Current Database**
   ```bash
   # From your current environment
   pg_dump $DATABASE_URL > rankbee_backup.sql
   ```

2. **Set Up Production Database**
   - Use Neon, Supabase, or PostgreSQL on cloud providers
   - Import your backup: `psql $PROD_DATABASE_URL < rankbee_backup.sql`

3. **Update Connection Strings**
   - Update your production environment variables
   - Test database connectivity

## Step 10: Post-Deployment Checklist

- ✅ Website loads correctly
- ✅ All SEO tools function properly  
- ✅ Authentication works
- ✅ Database connections are stable
- ✅ SSL certificate is active
- ✅ Custom domain configured (if applicable)
- ✅ Analytics/monitoring set up

## Troubleshooting

### Common Issues:

1. **Build Errors**
   - Check your build logs: `npm run build`
   - Ensure all dependencies are installed
   - Fix TypeScript/ESLint errors

2. **Routing Issues**
   - Verify `firebase.json` rewrites configuration
   - Check that your app handles client-side routing

3. **Environment Variables**
   - Ensure all required environment variables are set
   - Use Firebase Functions config for backend variables

4. **Database Connection**
   - Verify database URL is accessible from production
   - Check firewall settings for database provider

## Maintenance

1. **Regular Deployments**
   ```bash
   npm run build
   firebase deploy
   ```

2. **Monitor Performance**
   - Use Firebase Performance Monitoring
   - Set up error tracking with Firebase Crashlytics

3. **Backup Strategy**
   - Regular database backups
   - Version control for code changes

## Cost Considerations

- **Firebase Hosting**: Free tier includes 10GB storage, 10GB bandwidth
- **Firebase Functions**: Free tier includes 125K invocations/month
- **Database Hosting**: Varies by provider (Neon offers free tier)
- **Custom Domain**: Usually $10-15/year for domain registration

Your RankBee SEO tools website will now be live and accessible to users worldwide!