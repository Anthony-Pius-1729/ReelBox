import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMovieDetails } from "@/services/movieApi";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

const MovieDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(id);
        console.log("Details:", details);
        setData(details);
      } catch (err) {
        console.log("Error occurred:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (budget) => {
    if (!budget || budget === 0) return "N/A";
    return `$${(budget / 1000000).toFixed(1)}M`;
  };

  const openHomepage = async (url) => {
    if (url && (await Linking.canOpenURL(url))) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#e50914" />
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#e50914" />
          <Text style={styles.errorText}>Movie not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {data.title}
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Backdrop Image */}
        {data.backdrop_path && (
          <View style={styles.backdropContainer}>
            <Image
              source={{ uri: `${BACKDROP_BASE_URL}${data.backdrop_path}` }}
              style={styles.backdropImage}
              resizeMode="cover"
            />
            <View style={styles.backdropOverlay} />
          </View>
        )}

        {/* Movie Info Container */}
        <View style={styles.movieInfoContainer}>
          {/* Poster and Basic Info */}
          <View style={styles.posterSection}>
            {data.poster_path && (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${data.poster_path}` }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.basicInfo}>
              <Text style={styles.title}>{data.title}</Text>
              {data.original_title !== data.title && (
                <Text style={styles.originalTitle}>
                  ({data.original_title})
                </Text>
              )}

              {data.tagline && (
                <Text style={styles.tagline}>"{data.tagline}"</Text>
              )}

              {/* Rating and Year */}
              <View style={styles.ratingContainer}>
                <View style={styles.ratingItem}>
                  <Ionicons name="star" size={16} color="#f39c12" />
                  <Text style={styles.ratingText}>
                    {data.vote_average?.toFixed(1) || "N/A"}
                  </Text>
                  <Text style={styles.voteCount}>({data.vote_count})</Text>
                </View>
                <Text style={styles.releaseYear}>
                  {data.release_date
                    ? new Date(data.release_date).getFullYear()
                    : "TBA"}
                </Text>
              </View>

              {/* Genres */}
              {data.genres && data.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {data.genres.map((genre) => (
                    <View key={genre.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Movie Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Release Date:</Text>
              <Text style={styles.detailValue}>
                {formatDate(data.release_date)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Runtime:</Text>
              <Text style={styles.detailValue}>
                {formatRuntime(data.runtime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>
                {formatBudget(data.budget)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>{data.status}</Text>
            </View>

            {data.spoken_languages && data.spoken_languages.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Language:</Text>
                <Text style={styles.detailValue}>
                  {data.spoken_languages
                    .map((lang) => lang.english_name)
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>

          {/* Overview */}
          {data.overview && (
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.overviewText}>{data.overview}</Text>
            </View>
          )}

          {/* Production Companies */}
          {data.production_companies &&
            data.production_companies.length > 0 && (
              <View style={styles.productionSection}>
                <Text style={styles.sectionTitle}>Production Companies</Text>
                <View style={styles.companiesContainer}>
                  {data.production_companies.map((company) => (
                    <View key={company.id} style={styles.companyItem}>
                      {company.logo_path && (
                        <Image
                          source={{
                            uri: `${IMAGE_BASE_URL}${company.logo_path}`,
                          }}
                          style={styles.companyLogo}
                          resizeMode="contain"
                        />
                      )}
                      <Text style={styles.companyName}>{company.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Homepage Link */}
          {data.homepage && (
            <TouchableOpacity
              style={styles.homepageButton}
              onPress={() => openHomepage(data.homepage)}
            >
              <Ionicons name="globe-outline" size={20} color="#fff" />
              <Text style={styles.homepageButtonText}>Visit Homepage</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#e50914",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    height: height * 0.3,
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  movieInfoContainer: {
    backgroundColor: "#1a1a1a",
    marginTop: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  posterSection: {
    flexDirection: "row",
    marginBottom: 24,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 28,
  },
  originalTitle: {
    color: "#ccc",
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
  },
  tagline: {
    color: "#e50914",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  ratingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  voteCount: {
    color: "#999",
    fontSize: 14,
    marginLeft: 4,
  },
  releaseYear: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "500",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  genreTag: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  detailLabel: {
    color: "#ccc",
    fontSize: 16,
    flex: 1,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewText: {
    color: "#e6e6e6",
    fontSize: 16,
    lineHeight: 24,
  },
  productionSection: {
    marginBottom: 24,
  },
  companiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  companyItem: {
    alignItems: "center",
    marginRight: 20,
    marginBottom: 16,
    width: 80,
  },
  companyLogo: {
    width: 60,
    height: 40,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  companyName: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  homepageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e50914",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  homepageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
