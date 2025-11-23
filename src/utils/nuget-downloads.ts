const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const DEFAULT_OWNER = 'PrismLibrary';

/**
 * Gets the cache key for a specific owner
 */
function getCacheKey(owner: string): string {
  return `prism_nuget_downloads_${owner.toLowerCase()}`;
}

interface CachedData {
  totalDownloads: number;
  timestamp: number;
}

/**
 * Gets cached download count if available and not expired
 * @param owner - The NuGet package owner
 * @returns Cached total downloads or null if cache is expired/missing
 */
function getCachedDownloads(owner: string): number | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  try {
    const cacheKey = getCacheKey(owner);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) {
      return null;
    }

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (within 1 hour)
    if (now - data.timestamp < CACHE_DURATION) {
      console.log(`Using cached downloads for ${owner}:`, data.totalDownloads);
      return data.totalDownloads;
    }

    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Caches the download count with current timestamp
 * @param owner - The NuGet package owner
 * @param totalDownloads - The total downloads count to cache
 */
function setCachedDownloads(owner: string, totalDownloads: number): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  try {
    const cacheKey = getCacheKey(owner);
    const data: CachedData = {
      totalDownloads,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`Cached downloads for ${owner}:`, totalDownloads);
  } catch (error) {
    console.error('Error setting cache:', error);
    // Ignore cache errors, continue without caching
  }
}

/**
 * Fetches all packages owned by a specific owner from NuGet and calculates total downloads
 * Uses localStorage cache to avoid excessive API calls
 * @param owner - The NuGet package owner (defaults to 'PrismLibrary')
 * @returns Promise with total downloads count
 */
export async function fetchTotalDownloads(owner: string = DEFAULT_OWNER): Promise<number> {
  console.log(`Fetching downloads for owner: ${owner}`);
  
  // Check cache first
  const cached = getCachedDownloads(owner);
  if (cached !== null) {
    return cached;
  }

  try {
    let allPackages: any[] = [];
    let skip = 0;
    const take = 30; // NuGet API default page size
    
    console.log(`Starting API fetch for ${owner}...`);
    
    // Fetch all pages of results
    while (true) {
      const searchUrl = `https://azuresearch-usnc.nuget.org/query?q=owner:${encodeURIComponent(owner)}&skip=${skip}&take=${take}`;
      console.log(`Fetching: ${searchUrl}`);
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);
        throw new Error(`NuGet API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.data?.length || 0} packages (totalHits: ${data.totalHits})`);
      
      if (!data.data || data.data.length === 0) {
        console.log('No more packages found');
        break; // No more packages
      }
      
      allPackages.push(...data.data);
      
      // If we got fewer packages than requested, we've reached the end
      if (data.data.length < take) {
        console.log('Reached end of results');
        break;
      }
      
      skip += take;
    }
    
    console.log(`Total packages found: ${allPackages.length}`);
    
    // Sum totalDownloads from all packages
    const totalDownloads = allPackages.reduce((sum, pkg) => {
      return sum + (pkg.totalDownloads || 0);
    }, 0);
    
    console.log(`Total downloads: ${totalDownloads}`);
    
    // Cache the result
    setCachedDownloads(owner, totalDownloads);
    
    return totalDownloads;
  } catch (error) {
    console.error('Error fetching NuGet downloads:', error);
    throw error;
  }
}

/**
 * Rounds down a number to the nearest million
 * @param num - The number to round down
 * @returns The number rounded down to the nearest million
 */
export function roundDownToMillion(num: number): number {
  return Math.floor(num / 1_000_000) * 1_000_000;
}

/**
 * Formats a number in millions with "M+" suffix
 * @param downloads - Total download count
 * @returns Formatted string like "87M+"
 */
export function formatDownloadsInMillions(downloads: number): string {
  const millions = Math.floor(downloads / 1_000_000);
  return `${millions}M+`;
}

/**
 * Clears the cache for a specific owner (useful for testing)
 * @param owner - The NuGet package owner (defaults to 'PrismLibrary')
 */
export function clearCache(owner: string = DEFAULT_OWNER): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  try {
    const cacheKey = getCacheKey(owner);
    localStorage.removeItem(cacheKey);
    console.log(`Cache cleared for ${owner}`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clears all download caches (useful for testing)
 */
export function clearAllCaches(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('prism_nuget_downloads_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('All download caches cleared');
  } catch (error) {
    console.error('Error clearing all caches:', error);
  }
}

