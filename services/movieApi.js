const apiKey = process.env.EXPO_PUBLIC_MOVIE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error occured", error.message);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${apiKey}&query=${query}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

// Get detailed information about a specific movie by ID
export const getMovieDetails = async (movieId) => {
  try {
    console.log("Fetching movie details for ID:", movieId);

    const url = `${BASE_URL}/movie/${movieId}?api_key=${apiKey}`;
    console.log("Request URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Movie details received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId, language = "en-US") => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      language: language,
    });

    const url = `${BASE_URL}/movie/${movieId}/credits?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

// Get movie videos (trailers, teasers, etc.)
export const getMovieVideos = async (movieId, language = "en-US") => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      language: language,
    });

    const url = `${BASE_URL}/movie/${movieId}/videos?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

// Get movie reviews
export const getMovieReviews = async (movieId, options = {}) => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }

    const { language = "en-US", page = 1 } = options;

    const params = new URLSearchParams({
      api_key: apiKey,
      language: language,
      page: page.toString(),
    });

    const url = `${BASE_URL}/movie/${movieId}/reviews?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    throw error;
  }
};

// Get similar movies
export const getSimilarMovies = async (movieId, options = {}) => {
  try {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }

    const { language = "en-US", page = 1 } = options;

    const params = new URLSearchParams({
      api_key: apiKey,
      language: language,
      page: page.toString(),
    });

    const url = `${BASE_URL}/movie/${movieId}/similar?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    throw error;
  }
};
