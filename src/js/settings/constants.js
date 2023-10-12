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

export const DEFAULT_URLS = {
  BANNER:
    "https://images.unsplash.com/photo-1557682260-96773eb01377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80",
  AVATAR:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-avatarture-973460_1280.png",
};
