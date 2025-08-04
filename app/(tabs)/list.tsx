import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DUMMY_LISTS = [
  {
    id: "1",
    name: "My Top 10 Sci-Fi Picks",
    description: "My favorite science fiction films of all time.",
    movies: [
      {
        id: 27205,
        title: "Inception",
        poster_path: "/oYuisf5TqS4hR3t5WJK0P1C5fN.jpg",
      },
      {
        id: 157336,
        title: "Interstellar",
        poster_path: "/gEU2QniE6E77NI6Szz4pIWcpmRw.jpg",
      },
      {
        id: 624860,
        title: "The Matrix",
        poster_path: "/f89U3ADr1rbDPmWyssExT429WE5.jpg",
      },
      {
        id: 82064,
        title: "Blade Runner 2049",
        poster_path: "/gajva2L0rPYkEWjEScFXcCAQj5L.jpg",
      },
    ],
  },
  {
    id: "2",
    name: "Action Packed Adventures",
    description: "Explosions, car chases, and non-stop thrills.",
    movies: [
      {
        id: 19995,
        title: "Avatar",
        poster_path: "/kyeqWdyUXW608qlYkPMhymWtdDs.jpg",
      },
      {
        id: 284053,
        title: "Thor: Ragnarok",
        poster_path: "/rzRwTcFdUSyRwAigwzG35rnAUMj.jpg",
      },
      {
        id: 385128,
        title: "Furious 7",
        poster_path: "/d9Tqf18kQ1cQ9P1Q4lP6p0W5f2G.jpg",
      },
    ],
  },
  {
    id: "3",
    name: "Classic Horror",
    description: "Spooky films that defined the genre.",
    movies: [
      {
        id: 185,
        title: "Alien",
        poster_path: "/vYfUCgB3e5cQOq029E6M1VpQ7eW.jpg",
      },
      {
        id: 601,
        title: "The Shining",
        poster_path: "/xD9UrK6mY718qC1od9s5fLwI4wB.jpg",
      },
    ],
  },
];

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/150/0000FF/FFFFFF?text=No+Image";

const MyLists = () => {
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserLists(DUMMY_LISTS);
      } catch (err) {
        setError("Failed to load your lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLists();
  }, []);

  const handleCreateNewList = () => {
    Alert.alert("Create List", "Navigate to a screen to create a new list.");
  };

  const handleViewList = (listId, listName) => {
    navigation.navigate("ListDetails", { listId, listName });
  };

  const handleEditList = (listId) => {
    Alert.alert("Edit List", `Navigate to edit list: ${listId}`);
  };

  const handleDeleteList = (listId, listName) => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete "${listName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            const updatedLists = userLists.filter((list) => list.id !== listId);
            setUserLists(updatedLists);
            Alert.alert("Deleted", `"${listName}" has been deleted.`);
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderListCard = ({ item }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => handleViewList(item.id, item.name)}
    >
      <View style={styles.listCardHeader}>
        <Text style={styles.listName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.listActions}>
          <TouchableOpacity
            onPress={() => handleEditList(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteList(item.id, item.name)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6347" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.listDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.moviePreviewContainer}>
        {item.movies.slice(0, 3).map((movie) => (
          <Image
            key={movie.id}
            source={{
              uri: movie.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                : PLACEHOLDER_IMAGE,
            }}
            style={styles.moviePreviewImage}
          />
        ))}
        {item.movies.length > 3 && (
          <View style={styles.moreMoviesIndicator}>
            <Text style={styles.moreMoviesText}>+{item.movies.length - 3}</Text>
          </View>
        )}
      </View>
      <Text style={styles.movieCount}>
        {item.movies.length} {item.movies.length === 1 ? "movie" : "movies"}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your lists...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setError(null);
            setLoading(true);
            // In a real app, re-call fetchUserLists here
            // fetchUserLists();
          }}
        >
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lists</Text>
        <TouchableOpacity
          onPress={handleCreateNewList}
          style={styles.createButton}
        >
          <Ionicons name="add-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {userLists.length === 0 ? (
        <View style={styles.noListsContainer}>
          <Ionicons name="folder-open-outline" size={80} color="#555" />
          <Text style={styles.noListsText}>
            You haven't created any lists yet.
          </Text>
          <TouchableOpacity
            style={styles.createListBtn}
            onPress={handleCreateNewList}
          >
            <Text style={styles.createListBtnText}>Create Your First List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userLists}
          keyExtractor={(item) => item.id}
          renderItem={renderListCard}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MyLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
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
    backgroundColor: "#1C1C1E",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3C",
    backgroundColor: "#2C2C2E",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  createButton: {
    padding: 5,
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  listCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E0E0E0",
    flex: 1,
    marginRight: 10,
  },
  listActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
    padding: 3,
  },
  listDescription: {
    fontSize: 14,
    color: "#B0B0B0",
    marginBottom: 10,
  },
  moviePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  moviePreviewImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  moreMoviesIndicator: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreMoviesText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  movieCount: {
    fontSize: 13,
    color: "#AAAAAA",
    textAlign: "right",
    marginTop: 5,
  },
  noListsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noListsText: {
    fontSize: 18,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  createListBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  createListBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
