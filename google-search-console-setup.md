# Google Search Console Setup Guide

## Step 1: Add Your Website to Google Search Console

1. **Go to Google Search Console**
   - Visit: https://search.google.com/search-console
   - Sign in with your Google account

2. **Add a New Property**
   - Click the "Add Property" button (+ icon) in the top left
   - Choose "URL prefix" (not Domain)
   - Enter your full website URL including https:// (e.g., https://yourwebsite.com)
   - Click "Continue"

3. **Verify Ownership**
   - Google will show several verification methods
   - Choose the method that works best for you:
     - **HTML file upload** (easiest for most websites)
     - **HTML tag** (add to your website's head section)
     - **Google Analytics** (if you have GA already set up)
     - **Google Tag Manager**
     - **DNS record**

## Step 2: Grant Access to Your Service Account

1. **Find Your Service Account Email**
   - Your service account email is: `firebase-adminsdk-xyz123@your-project.iam.gserviceaccount.com`
   - (This appears in your KasamaAI dashboard when you can access it)

2. **Add the Service Account as a User**
   - In Google Search Console, click the gear icon (Settings)
   - Select "Users and permissions"
   - Click "Add User"
   - Enter your service account email exactly as shown
   - Select "Owner" permissions
   - Click "Add"

## Step 3: Wait for Data

- It can take 24-48 hours for data to appear in Search Console
- Your KasamaAI dashboard will automatically detect when data is available
- The status will change from "Demo Data" to "Live Data"

## Troubleshooting

**If you see "No sites found":**
- Make sure you added the service account email exactly as shown
- Verify the service account has "Owner" permissions
- Wait up to 24 hours for permissions to take effect

**If verification fails:**
- Try a different verification method
- Make sure your website is publicly accessible
- Check that you're using the correct URL format (https://yourwebsite.com)

## Quick Links

- [Google Search Console](https://search.google.com/search-console)
- [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
- [Search Console Help](https://support.google.com/webmasters/answer/9008080)