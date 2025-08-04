import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchData, searchMovies } from "../../services/movieApi.js";
import { useRouter } from "expo-router";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/150/0000FF/FFFFFF?text=No+Image";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const Explore = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Function to load initial popular movies
  const loadPopularMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const popularMovies = await fetchData();
      setMovies(popularMovies);
    } catch (err) {
      setError("Failed to load popular movies. Please try again.");
      console.error("Error loading popular movies:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);
      if (query.trim() === "") {
        setIsSearching(false);
        loadPopularMovies();
        return;
      }

      setIsSearching(true);
      setLoading(true);
      setError(null);
      try {
        const searchResults = await searchMovies(query);
        setMovies(searchResults);
      } catch (err) {
        setError("Failed to search movies. Please try again.");
        console.error("Error searching movies:", err);
      } finally {
        setLoading(false);
      }
    },
    [loadPopularMovies]
  );

  useEffect(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSearchQuery("");
    setIsSearching(false);
    loadPopularMovies();
  }, [loadPopularMovies]);

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => router.push(`./movies/${item.id}`)}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : PLACEHOLDER_IMAGE,
        }}
        style={styles.moviePoster}
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieRating}>
          ⭐ {item.vote_average.toFixed(1)}
        </Text>
        <Text style={styles.movieReleaseDate}>
          {item.release_date
            ? `Release: ${item.release_date.substring(0, 4)}`
            : "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        {isSearching ? "Search Results" : "Explore Movies"}
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for movies..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {isSearching ? "Searching..." : "Loading popular movies..."}
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() =>
              isSearching ? handleSearch(searchQuery) : loadPopularMovies()
            }
          >
            <Text style={styles.retryText}>Tap to Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && movies.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No movies found.</Text>
          {isSearching && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setIsSearching(false);
                loadPopularMovies();
              }}
            >
              <Text style={styles.backToPopularText}>
                Back to Popular Movies
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!loading && !error && movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContentContainer}
          numColumns={2} // Display items in two columns
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    textAlign: "center",
  },
  searchInput: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: "#E0E0E0",
    backgroundColor: "#2C2C2E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#E0E0E0",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#FF6347",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noResultsText: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  backToPopularText: {
    color: "#007AFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  movieItem: {
    flex: 0.5,
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    marginHorizontal: 5,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moviePoster: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  movieInfo: {
    padding: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 5,
  },
  movieRating: {
    fontSize: 14,
    color: "#FFD700",
    marginBottom: 3,
  },
  movieReleaseDate: {
    fontSize: 12,
    color: "#AAAAAA",
  },
});
