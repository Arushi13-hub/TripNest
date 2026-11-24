import { GoogleGenAI, Type } from '@google/genai';
import { geocodeLocation } from './geocoding';

// Preset destination landmarks & plans for hyper-realistic fallback generation
const CURATED_DESTINATION_ACTIVITIES = {
  kyoto: {
    'Culture & History': [
      { title: 'Fushimi Inari Senbon Torii Sunrise Walk', location: 'Fushimi Inari Shrine, Kyoto', category: 'Sightseeing', timeSlot: '07:30 AM', notes: 'Wander through thousands of vibrant vermilion gates before crowds arrive.', costBase: 0 },
      { title: 'Kinkaku-ji (Golden Pavilion) Visit', location: 'Golden Pavilion, Kyoto', category: 'Sightseeing', timeSlot: '10:30 AM', notes: 'Marvel at the gold-leaf Zen temple mirrored in the pond.', costBase: 15 },
      { title: 'Traditional Soba & Shojin Ryori Lunch', location: 'Arashiyama, Kyoto', category: 'Food', timeSlot: '01:00 PM', notes: 'Authentic seasonal Japanese buckwheat noodles and tofu delicacies.', costBase: 35 },
      { title: 'Nijo Castle Nightingale Floors Exploration', location: 'Nijo Castle, Kyoto', category: 'Sightseeing', timeSlot: '03:30 PM', notes: 'Explore samurai heritage and historic squeaking floorboards.', costBase: 20 },
      { title: 'Evening Gion Geisha District Walking Tour', location: 'Gion, Kyoto', category: 'Sightseeing', timeSlot: '07:00 PM', notes: 'Stroll past wooden machiya merchant houses and lantern-lit alleys.', costBase: 25 },
      { title: 'Kiyomizu-dera Wooden Stage Views', location: 'Kiyomizu-dera, Kyoto', category: 'Sightseeing', timeSlot: '09:00 AM', notes: 'Take in panoramic valley views from the historic wooden terrace.', costBase: 15 },
      { title: 'Handmade Matcha Tea Whisking Ceremony', location: 'Camellia Tea House Gion', category: 'Food', timeSlot: '02:00 PM', notes: 'Private tea master workshop paired with wagashi confection.', costBase: 45 },
      { title: 'Kiyomizu-yaki Ceramics & Silk Fan Shopping', location: 'Sannenzaka & Ninenzaka, Kyoto', category: 'Shopping', timeSlot: '04:30 PM', notes: 'Browse artisan pottery studios and traditional lacquerware.', costBase: 60 },
    ],
    'Foodie': [
      { title: 'Nishiki Market Morning Street Food Tour', location: 'Nishiki Market, Kyoto', category: 'Food', timeSlot: '09:30 AM', notes: 'Sample dashi tamagoyaki, fresh sashimi skewers, and soy milk donuts.', costBase: 35 },
      { title: 'Artisanal Uji Matcha Parfait Tasting', location: 'Tsujiri Gion, Kyoto', category: 'Food', timeSlot: '12:30 PM', notes: 'Layered rich matcha soft serve with warabi mochi and red bean.', costBase: 18 },
      { title: 'Sake Tasting at Fushimi Brewery District', location: 'Fushimi Sake District, Kyoto', category: 'Food', timeSlot: '03:30 PM', notes: 'Sample centuries-old brewed sake along the historic willow canals.', costBase: 40 },
      { title: 'Multi-Course Seasonal Kaiseki Dinner', location: 'Pontocho Alley, Kyoto', category: 'Food', timeSlot: '07:30 PM', notes: 'Intimate multi-course culinary journey with river views.', costBase: 120 },
      { title: 'Katsura Riverside Morning Bakery Stroll', location: 'Arashiyama Riverside, Kyoto', category: 'Food', timeSlot: '08:30 AM', notes: 'Freshly baked matcha croissants and specialty pour-over coffee.', costBase: 15 },
      { title: 'Wagashi Sweet Making Masterclass', location: 'Kanshunsho Workshop, Kyoto', category: 'Food', timeSlot: '02:00 PM', notes: 'Learn delicate sugar shaping from hereditary masters.', costBase: 50 },
    ],
    'Relaxed': [
      { title: 'Morning Bamboo Grove Contemplation', location: 'Arashiyama Bamboo Grove', category: 'Sightseeing', timeSlot: '08:30 AM', notes: 'Peaceful stroll listening to the wind through towering bamboo stalks.', costBase: 0 },
      { title: 'Riverside Cafe & Matcha Latte', location: 'Arabica Coffee Arashiyama', category: 'Food', timeSlot: '11:00 AM', notes: 'Scenic latte overlooking the Togetsukyo Bridge and green hills.', costBase: 10 },
      { title: 'Zen Meditation at Ryoan-ji Rock Garden', location: 'Ryoan-ji Temple, Kyoto', category: 'Sightseeing', timeSlot: '02:30 PM', notes: 'Meditate beside the famed 15 mysterious dry landscape stones.', costBase: 12 },
      { title: 'Onsen Mineral Baths & Herbal Spa', location: 'Kurama Onsen, Kyoto', category: 'Hotel', timeSlot: '06:00 PM', notes: 'Soak in open-air sulfur mineral hot springs tucked into pine forests.', costBase: 80 },
    ],
    'Adventure': [
      { title: 'Mount Inari Mountain Summit Trail Hike', location: 'Mount Inari, Kyoto', category: 'Sightseeing', timeSlot: '07:00 AM', notes: 'Climb 233 meters past secluded shrines and mossy fox statues.', costBase: 0 },
      { title: 'Hozugawa River Whitewater Gorge Rafting', location: 'Kameoka to Arashiyama, Kyoto', category: 'Sightseeing', timeSlot: '10:30 AM', notes: 'Traditional wooden boat rapid shooting along dramatic canyon walls.', costBase: 55 },
      { title: 'E-Bike Cycling Tour of Historic Northern Canals', location: 'Philosopher\'s Path, Kyoto', category: 'Transit', timeSlot: '02:30 PM', notes: 'Glide along cherry tree lined cobblestone paths and aqueducts.', costBase: 35 },
      { title: 'Sunset Views from Shogunzuka Mound', location: 'Higashiyama Peak, Kyoto', category: 'Sightseeing', timeSlot: '06:30 PM', notes: 'Sweeping 360-degree glass stage view over the entire Kyoto basin.', costBase: 15 },
    ],
  },
  amalfi: {
    'Relaxed': [
      { title: 'Espresso & Lemon Granita on Piazza Duomo', location: 'Piazza Duomo, Amalfi', category: 'Food', timeSlot: '09:00 AM', notes: 'People watch beneath the grand cathedral steps.', costBase: 15 },
      { title: 'Lounge at Spiaggia Grande Beach', location: 'Positano Beach, Amalfi Coast', category: 'Sightseeing', timeSlot: '11:30 AM', notes: 'Sunbathe on colorful umbrellas facing pastel cliffside villas.', costBase: 40 },
      { title: 'Sunset Limoncello Spritz & Crudo', location: 'Ristorante La Sponda, Positano', category: 'Food', timeSlot: '07:00 PM', notes: 'Breathtaking terrace illuminated by candlelights.', costBase: 90 },
    ],
    'Adventure': [
      { title: 'Path of the Gods (Sentiero degli Dei) Cliff Hike', location: 'Bomerano to Nocelle, Amalfi', category: 'Sightseeing', timeSlot: '08:00 AM', notes: 'World-famous cliffside trail floating 500 meters above the Tyrrhenian Sea.', costBase: 10 },
      { title: 'Private Speedboat Tour to Capri Sea Caves', location: 'Marina Grande, Amalfi Coast', category: 'Transit', timeSlot: '01:00 PM', notes: 'Swim through emerald sea grottos and cruise past the Faraglioni rocks.', costBase: 140 },
    ],
  },
};

// Generic multi-destination template pool
const GENERIC_VIBE_POOLS = {
  'Relaxed': [
    { title: 'Scenic Sunrise Coffee & Pastries', category: 'Food', timeSlot: '09:00 AM', notes: 'Slow morning with artisan brew and local pastries.', costBase: 15 },
    { title: 'Botanical Gardens & Park Stroll', category: 'Sightseeing', timeSlot: '11:30 AM', notes: 'Peaceful garden walk admiring local flora and fountains.', costBase: 12 },
    { title: 'Waterfront Terrace Lunch', category: 'Food', timeSlot: '01:30 PM', notes: 'Fresh regional dishes overlooking the water.', costBase: 45 },
    { title: 'Thermal Spa & Wellness Soak', category: 'Hotel', timeSlot: '04:30 PM', notes: 'Recharge with restorative mineral sauna and steam baths.', costBase: 65 },
    { title: 'Sunset Golden Hour Cocktail Stroll', category: 'Food', timeSlot: '07:30 PM', notes: 'Relaxed evening drinks and light appetizers with city lights.', costBase: 35 },
  ],
  'Foodie': [
    { title: 'Historic Central Market Breakfast Safari', category: 'Food', timeSlot: '09:00 AM', notes: 'Sample warm specialties, artisan cheeses, and freshly squeezed juices.', costBase: 25 },
    { title: 'Hidden Alley Street Food Exploration', category: 'Food', timeSlot: '12:30 PM', notes: 'Tour beloved family-run food stalls and regional signature dishes.', costBase: 35 },
    { title: 'Artisan Winery or Craft Tasting Session', category: 'Food', timeSlot: '04:00 PM', notes: 'Guided tasting with local producers learning regional craft.', costBase: 50 },
    { title: 'Signature Chef Tasting Dinner', category: 'Food', timeSlot: '08:00 PM', notes: 'Award-winning multi-course gastronomic dinner showcasing terroir.', costBase: 110 },
  ],
  'Adventure': [
    { title: 'Panoramic Ridge Hiking Trail', category: 'Sightseeing', timeSlot: '08:00 AM', notes: 'Scenic ascent to mountain overlook with sweeping vistas.', costBase: 0 },
    { title: 'Open-Air Offroad or Bike Excursion', category: 'Transit', timeSlot: '11:30 AM', notes: 'Navigate hidden backcountry trails and natural wonders.', costBase: 45 },
    { title: 'Hearty Mountain Lodge Lunch', category: 'Food', timeSlot: '02:00 PM', notes: 'Hearty local energy feast to refuel after trekking.', costBase: 30 },
    { title: 'Water Sports / Kayak Coastal Route', category: 'Sightseeing', timeSlot: '04:30 PM', notes: 'Paddle through secluded sea caves or clear river channels.', costBase: 55 },
    { title: 'Campfire / Stargazing Vantage Point', category: 'Sightseeing', timeSlot: '08:00 PM', notes: 'Observe night sky constellations from an unpolluted peak.', costBase: 10 },
  ],
  'Culture & History': [
    { title: 'Historic Citadel & Ancient Architecture Walk', category: 'Sightseeing', timeSlot: '09:00 AM', notes: 'Explore monumental heritage architecture and ancient courtyards.', costBase: 20 },
    { title: 'National Art & Heritage Museum Tour', category: 'Sightseeing', timeSlot: '11:45 AM', notes: 'Curated gallery walk through legendary national masterpieces.', costBase: 22 },
    { title: 'Traditional Historic Quarter Bistro', category: 'Food', timeSlot: '01:45 PM', notes: 'Centuries-old tavern serving traditional heirloom recipes.', costBase: 38 },
    { title: 'Artisan Guild & Craft Workshops', category: 'Shopping', timeSlot: '04:15 PM', notes: 'Meet local master craftsmen preserving rare handmade goods.', costBase: 45 },
    { title: 'Evening Classical Performance or Folklore Tour', category: 'Sightseeing', timeSlot: '07:30 PM', notes: 'Immersive cultural theatrical or musical showcase.', costBase: 60 },
  ],
};

// Budget multiplier factors
const BUDGET_MULTIPLIERS = {
  'Budget': 0.5,
  'Mid-Range': 1.0,
  'Luxury': 2.8,
};

/**
 * Generates an itinerary using Gemini 2.5 Flash if API key is provided,
 * otherwise falls back to the rich realistic generator.
 */
export async function generateItinerary({
  destination,
  daysCount = 3,
  vibe = 'Culture & History',
  budgetTier = 'Mid-Range',
  customPreferences = '',
}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      return await generateWithGemini({
        apiKey,
        destination,
        daysCount,
        vibe,
        budgetTier,
        customPreferences,
      });
    } catch (err) {
      console.warn('Gemini AI generation failed, falling back to local smart generator:', err);
    }
  }

  // Realistic Smart Fallback Generator
  return await generateMockItinerary({
    destination,
    daysCount,
    vibe,
    budgetTier,
  });
}

/**
 * Call Gemini 2.5 Flash via @google/genai with strict JSON schema
 */
async function generateWithGemini({
  apiKey,
  destination,
  daysCount,
  vibe,
  budgetTier,
  customPreferences,
}) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a world-class travel curator. Create a detailed, day-by-day travel itinerary for a ${daysCount}-day trip to "${destination}".
Travel Vibe: ${vibe}
Budget Tier: ${budgetTier}
${customPreferences ? `Special Interests: ${customPreferences}` : ''}

Generate exactly ${daysCount} days (Day 1 through Day ${daysCount}).
For each day, include 3 to 4 distinct activities logically sequenced through the day (e.g. 09:00 AM morning sightseeing, 12:30 PM lunch/food, 03:30 PM afternoon discovery, 07:00 PM dinner/evening).
Ensure activities have realistic location names in ${destination}, categories (Sightseeing, Food, Transit, Hotel, Shopping), realistic estimated costs in USD matching ${budgetTier} tier, and concise helpful tips.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            description: 'List of days in the itinerary',
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER, description: 'Day number starting from 1' },
                title: { type: Type.STRING, description: 'Day theme title' },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      timeSlot: { type: Type.STRING, description: 'e.g. 09:30 AM' },
                      location: { type: Type.STRING, description: 'Specific venue or landmark name' },
                      category: {
                        type: Type.STRING,
                        enum: ['Sightseeing', 'Food', 'Transit', 'Hotel', 'Shopping'],
                      },
                      cost: { type: Type.INTEGER, description: 'Estimated cost in USD' },
                      notes: { type: Type.STRING, description: 'Helpful advice or tips' },
                    },
                    required: ['title', 'timeSlot', 'location', 'category', 'cost'],
                  },
                },
              },
              required: ['day', 'title', 'activities'],
            },
          },
        },
        required: ['days'],
      },
    },
  });

  const parsed = JSON.parse(response.text);
  if (!parsed.days || !Array.isArray(parsed.days)) {
    throw new Error('Invalid JSON structure from Gemini');
  }

  // Post-process with IDs and geocoding
  const resultDays = [];
  for (const dayItem of parsed.days) {
    const activitiesWithGeo = [];
    for (const act of dayItem.activities) {
      const geo = await geocodeLocation(act.location, destination);
      activitiesWithGeo.push({
        id: `act-ai-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: act.title,
        timeSlot: act.timeSlot || '10:00 AM',
        location: act.location,
        category: act.category || 'Sightseeing',
        cost: Number(act.cost) || 0,
        notes: act.notes || '',
        completed: false,
        lat: geo ? geo.lat : null,
        lng: geo ? geo.lng : null,
      });
    }
    resultDays.push({
      day: dayItem.day,
      title: dayItem.title || `Day ${dayItem.day} Exploration`,
      activities: activitiesWithGeo,
    });
  }

  return { days: resultDays, source: 'gemini' };
}

/**
 * Rich, realistic local mock itinerary generator
 */
async function generateMockItinerary({
  destination,
  daysCount,
  vibe,
  budgetTier,
}) {
  const normDest = (destination || '').toLowerCase();
  const mult = BUDGET_MULTIPLIERS[budgetTier] || 1.0;

  // Check destination specific curation
  let pool = null;
  if (normDest.includes('kyoto') || normDest.includes('japan')) {
    pool = CURATED_DESTINATION_ACTIVITIES.kyoto[vibe] || CURATED_DESTINATION_ACTIVITIES.kyoto['Culture & History'];
  } else if (normDest.includes('amalfi') || normDest.includes('positano') || normDest.includes('italy')) {
    pool = CURATED_DESTINATION_ACTIVITIES.amalfi[vibe] || CURATED_DESTINATION_ACTIVITIES.amalfi['Relaxed'];
  }

  if (!pool || pool.length === 0) {
    pool = GENERIC_VIBE_POOLS[vibe] || GENERIC_VIBE_POOLS['Culture & History'];
  }

  const generatedDays = [];
  const times = ['09:00 AM', '12:30 PM', '03:30 PM', '07:30 PM'];

  for (let d = 1; d <= daysCount; d++) {
    const dayActivities = [];
    // 3 activities per day
    const activitiesPerDay = 3;

    for (let a = 0; a < activitiesPerDay; a++) {
      const templateIndex = ((d - 1) * activitiesPerDay + a) % pool.length;
      const tpl = pool[templateIndex];

      const locationName = tpl.location.includes(destination)
        ? tpl.location
        : `${tpl.location.split(',')[0]}, ${destination}`;

      const rawCost = Math.round((tpl.costBase * mult) / 5) * 5;
      const geo = await geocodeLocation(locationName, destination);

      dayActivities.push({
        id: `act-smart-${d}-${a}-${Date.now()}`,
        title: tpl.title,
        timeSlot: times[a] || '02:00 PM',
        location: locationName,
        category: tpl.category,
        cost: rawCost,
        notes: tpl.notes,
        completed: false,
        lat: geo ? geo.lat : null,
        lng: geo ? geo.lng : null,
      });
    }

    generatedDays.push({
      day: d,
      title: `Day ${d}: ${vibe} Discoveries in ${destination.split(',')[0]}`,
      activities: dayActivities,
    });
  }

  return { days: generatedDays, source: 'smart-mock' };
}
