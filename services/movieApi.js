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
