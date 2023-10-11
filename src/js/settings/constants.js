// Define the base URL for the Noroff API
const API_BASE_URL = "https://api.noroff.dev/api/v1/";

// Define URLs for various API endpoints
export const API_URLS = {
  REGISTER: `${API_BASE_URL}social/auth/register`,
  LOGIN: `${API_BASE_URL}social/auth/login`,
  POSTS: `${API_BASE_URL}social/posts`,
  PROFILES: `${API_BASE_URL}social/profiles`,
};

// Define URLs for client-side navigation
export const URLS = {
  FEED: "feed.html",
  INDEX: "index.html",
  PROFILE: "profile.html",
  SEARCH: "searchResults.html",
};
