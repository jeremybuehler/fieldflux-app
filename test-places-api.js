#!/usr/bin/env node

// Test script for Google Places API
require('dotenv').config();

async function testPlacesAPI() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GOOGLE_PLACES_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  console.log('🔑 Testing Google Places API...');
  console.log(`API Key: ${apiKey.substring(0, 15)}...`);
  
  try {
    // Test Places API (New)
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount'
      },
      body: JSON.stringify({
        textQuery: "McDonald's",
        maxResultCount: 3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      
      if (response.status === 403) {
        if (errorData.error?.message?.includes('billing')) {
          console.log('\n💡 Solution: Enable billing in Google Cloud Console');
          console.log('   Visit: https://console.cloud.google.com/billing');
        } else {
          console.log('\n💡 Solution: Enable Places API and check API key restrictions');
          console.log('   Visit: https://console.cloud.google.com/apis/library');
        }
      }
      return;
    }

    const data = await response.json();
    
    if (data.places && data.places.length > 0) {
      console.log('✅ Google Places API is working!');
      console.log(`Found ${data.places.length} businesses:`);
      
      data.places.forEach((place, index) => {
        console.log(`  ${index + 1}. ${place.displayName?.text || 'Unknown'}`);
        console.log(`     Address: ${place.formattedAddress || 'N/A'}`);
        console.log(`     Rating: ${place.rating || 'N/A'} (${place.userRatingCount || 0} reviews)`);
        console.log('');
      });
      
      console.log('🎉 Your FieldFlux app can now fetch real business reviews!');
    } else {
      console.log('✅ API call successful but no results found');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testPlacesAPI();
