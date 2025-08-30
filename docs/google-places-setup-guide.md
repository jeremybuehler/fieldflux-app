# Google Places API Setup Guide for FieldFlux

## Current Status: API Key Added ✅ - Still Getting 403 Error ⚠️

Your Google Places API key is configured with the correct API restrictions (Places API New is selected), but we're still getting: "This API key is not authorized to use this service or API."

## Likely Issues to Check:

### 1. Billing Account Required
The Places API requires a linked billing account even for free usage. Check:
- Go to Google Cloud Console → Billing
- Ensure a billing account is linked to your project
- Even with $200 free credit, billing must be enabled

### 2. API Not Enabled
Even with restrictions set, ensure the API is enabled:
- Go to APIs & Services → Library
- Search for "Places API (New)"
- Click and ensure it shows "ENABLED" (not just restricted)

### 3. Propagation Delay
API changes can take 5-10 minutes to propagate. If you just made changes, wait a few minutes.

## Required Google Cloud Console Configuration

### 1. Enable the Correct APIs
In your Google Cloud Console, you need to enable these specific APIs:

```
1. Places API (New) - REQUIRED
2. Maps JavaScript API - Recommended  
3. Geocoding API - Optional but helpful
```

### 2. API Key Configuration
Your API key needs proper restrictions and permissions:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your API key
3. Under "API restrictions", select "Restrict key"
4. Enable these APIs:
   - Places API (New)
   - Maps JavaScript API
   - Geocoding API

### 3. Billing Requirements
Google Places API requires billing to be enabled:

1. Go to Google Cloud Console → Billing
2. Link a billing account to your project
3. Even with billing enabled, you get free monthly usage quota

## Common Error Solutions

### Error: "REQUEST_DENIED"
- **Cause**: API key doesn't have Places API permissions
- **Solution**: Enable Places API (New) in Google Cloud Console

### Error: "400 Bad Request"  
- **Cause**: Billing not enabled or wrong API version
- **Solution**: Enable billing and ensure "Places API (New)" is enabled

### Error: "OVER_QUERY_LIMIT"
- **Cause**: Exceeded free quota limits
- **Solution**: Check quota usage in Google Cloud Console

## Testing Your Setup

Once configured properly, you'll be able to:

1. **Search for any business**: "Starbucks New York", "Pizza Hut Chicago"
2. **Get real reviews**: Access actual Google reviews with ratings
3. **Business details**: Address, phone, hours, website
4. **Review analytics**: Sentiment analysis on real review data

## Free Usage Limits

Google Places API provides generous free usage:
- Text Search: $17/1000 requests (first $200/month free)
- Place Details: $17/1000 requests (first $200/month free)
- Most small businesses stay within free limits

## Verification Steps

To verify your setup is working:

1. Enable Places API (New) in Google Cloud Console
2. Ensure billing is enabled (required but often free)
3. Test search in FieldPulse Reviews page
4. Should see real business results instead of demo data

## Need Help?

If you continue to see errors:
1. Check Google Cloud Console → APIs & Services → Dashboard
2. Verify "Places API (New)" shows as enabled
3. Check billing account is linked
4. Try a simple search like "McDonald's" to test

Once properly configured, FieldPulse will automatically switch from demo data to real Google reviews and provide authentic business insights.