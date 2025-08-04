import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Button,
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import {
  fetchData,
  searchMovies,
  getMovieDetails,
} from "../../services/movieApi";
import { useRouter } from "expo-router";

export default function Index() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

  const getImageUrl = (posterPath, size = "w500") => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    return `${TMDB_IMAGE_BASE_URL}${size}${posterPath}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        if (!result) {
          console.log("No Data found");
          throw new Error("Data not found");
        }
        setData(result);
      } catch (error) {
        console.error("Error occurred: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#007AFF" />{" "}
        {/* Use a bright color */}
        <Text className="mt-4 text-gray-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-lg text-center">
            Error: {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // Optionally add a retry mechanism
              setError(null);
              setLoading(true);
              // Call loadData again
              const loadData = async () => {
                try {
                  const result = await fetchData();
                  if (!result) {
                    throw new Error("Data not found");
                  }
                  setData(result);
                } catch (err) {
                  console.error("Error occurred during retry: ", err);
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              };
              loadData();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const router = useRouter();

  const handleMovieId = (id) => {
    router.push(`./movies/${id}`);
  };

  const renderMovieItem = ({ item }) => {
    const imageUrl = getImageUrl(item.poster_path, "w500");

    return (
      <View className="mr-4 w-36">
        <TouchableOpacity
          onPress={() => handleMovieId(item.id)}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-2xl justify-end items-center overflow-hidden"
            resizeMode="cover"
            onError={() => console.log("Image failed to load:", imageUrl)}
          >
            <View className="bg-black/70 px-3 py-2 rounded-lg m-2">
              <Text className="text-white text-sm font-bold text-center">
                {item.title}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View className="px-4 pt-10 pb-4">
          <View className="flex-row items-center bg-gray-800 rounded-2xl px-4 py-3">
            <Ionicons name="search" color="#9CA3AF" size={20} />{" "}
            {/* Light gray for icon */}
            <TextInput
              placeholder="Movie, Drama & Others"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-white"
            />
          </View>
        </View>

        {/* Horizontal Popular Movies FlatList */}
        <View className="mt-5 px-4">
          {data && data.length > 0 ? (
            <View className="h-52">
              <FlatList
                data={data}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
              />
            </View>
          ) : (
            <View className="items-center justify-center h-52">
              <Text className="text-gray-400 text-lg">
                No movies available.
              </Text>
            </View>
          )}
        </View>

        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-xl text-white">
              {" "}
              {/* White text */}
              Popular Movies
            </Text>
            <TouchableOpacity>
              <Pressable
                className="bg-blue-600 px-4 py-2 rounded-xl"
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text className="text-white font-semibold text-center">
                  See All
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <ImageBackground
              source={{
                uri: "https://editorial.rottentomatoes.com/wp-content/uploads/2024/05/700MadMax.jpg",
              }}
              className="w-full h-52 rounded-2xl overflow-hidden"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Amazon Movies Section */}
        <View className="mt-6 px-4">
          <Text className="font-bold text-xl text-white mb-4">
            {" "}
            {/* White text */}
            Amazon Movies
          </Text>
          <TouchableOpacity>
            <ImageBackground
              source={{
                uri: "https://assets.vogue.com/photos/67b3e6d010c789d25230be2b/4:3/w_2240,c_limit/OneDay-FirstLook.jpg",
              }}
              className="w-full h-52 rounded-2xl overflow-hidden"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
