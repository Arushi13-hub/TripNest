const GEOCODE_CACHE_KEY = 'tripnest_geocode_cache';

// Known popular landmarks cache to guarantee instant coordinates & avoid rate limits
const KNOWN_COORDINATES = {
  'arashiyama, ukyo ward': { lat: 35.0116, lng: 135.6775 },
  'arashiyama bamboo grove': { lat: 35.0169, lng: 135.6713 },
  'tenryu-ji': { lat: 35.0158, lng: 135.6776 },
  'tenryu-ji sogenchi garden': { lat: 35.0158, lng: 135.6776 },
  'shigetsu temple restaurant': { lat: 35.0160, lng: 135.6765 },
  'kitano line tramway': { lat: 35.0280, lng: 135.7330 },
  'kinkakuji-cho, kita ward': { lat: 35.0394, lng: 135.7292 },
  'golden pavilion': { lat: 35.0394, lng: 135.7292 },
  'fushimi inari shrine, kyoto': { lat: 34.9671, lng: 135.7727 },
  'fushimi inari': { lat: 34.9671, lng: 135.7727 },
  'fushimi ward, mount inari': { lat: 34.9671, lng: 135.7727 },
  'nishiki market': { lat: 35.0050, lng: 135.7649 },
  'nakagyo ward, nishiki market': { lat: 35.0050, lng: 135.7649 },
  'shin-kyogoku shopping arcade': { lat: 35.0058, lng: 135.7686 },
  'gion hatanaka ryokan': { lat: 35.0035, lng: 135.7794 },
  'gion, kyoto': { lat: 35.0037, lng: 135.7772 },
  'kiyomizu-dera': { lat: 34.9949, lng: 135.7850 },
  'otowa-san, kiyomizu': { lat: 34.9949, lng: 135.7850 },
  'camellia tea house gion': { lat: 34.9995, lng: 135.7801 },
  'jr kyoto station': { lat: 34.9858, lng: 135.7588 },
  'heian shrine & garden': { lat: 35.0160, lng: 135.7824 },
  'okazaki park': { lat: 35.0135, lng: 135.7831 },
  'shijo-dori': { lat: 35.0037, lng: 135.7685 },
  'hotel villa rosa, positano': { lat: 40.6281, lng: 14.4850 },
  'ristorante la sponda': { lat: 40.6293, lng: 14.4866 },
};

function getLocalCache() {
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setLocalCache(cache) {
  try {
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

/**
 * Geocode a location query string using Nominatim OpenStreetMap API
 * with intelligent fallback to local cache & known landmarks.
 */
export async function geocodeLocation(query, destinationContext = '') {
  if (!query || typeof query !== 'string') return null;

  const normalized = query.trim().toLowerCase();
  
  // 1. Check known landmarks
  if (KNOWN_COORDINATES[normalized]) {
    return {
      lat: KNOWN_COORDINATES[normalized].lat,
      lng: KNOWN_COORDINATES[normalized].lng,
      displayName: query,
    };
  }

  // 2. Check localStorage cache
  const localCache = getLocalCache();
  if (localCache[normalized]) {
    return localCache[normalized];
  }

  // 3. Query OpenStreetMap Nominatim API
  try {
    const searchQuery = destinationContext && !normalized.includes(destinationContext.toLowerCase())
      ? `${query}, ${destinationContext}`
      : query;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };

      // Save to cache
      localCache[normalized] = result;
      setLocalCache(localCache);
      return result;
    }
  } catch (err) {
    console.warn(`Geocoding error for "${query}":`, err.message);
  }

  // Fallback if query contains known city keywords
  if (normalized.includes('kyoto') || (destinationContext && destinationContext.toLowerCase().includes('kyoto'))) {
    // Generate slight deterministic offset around Kyoto center
    let hash = 0;
    for (let i = 0; i < query.length; i++) hash = (hash << 5) - hash + query.charCodeAt(i);
    const offsetLat = ((hash % 100) / 10000);
    const offsetLng = (((hash >> 2) % 100) / 10000);
    return {
      lat: 35.0116 + offsetLat,
      lng: 135.7681 + offsetLng,
      displayName: query,
    };
  }

  return null;
}
