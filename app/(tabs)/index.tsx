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
import { fetchData } from "../../services/movieApi";

export default function Index() {
  const [data, setData] = useState(null);
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
        console.log("Error occurred: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#666666" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMovieItem = ({ item }) => {
    const imageUrl = getImageUrl(item.poster_path, "w500");

    return (
      <View className="mr-4 w-36">
        <TouchableOpacity
          onPress={() => console.log("Pressed movie:", item.title)}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-2xl justify-end items-center overflow-hidden"
            resizeMode="cover"
            onError={() => console.log("Image failed to load:", imageUrl)}
          >
            <View className="bg-black/60 px-3 py-2 rounded-lg m-2">
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Search Bar */}
        <View className="px-4 pt-10 pb-4">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
            <Ionicons name="search" color="#666666" size={20} />
            <TextInput
              placeholder="Movie, Drama & Others"
              placeholderTextColor="#666666"
              className="flex-1 ml-3 text-base"
            />
          </View>
        </View>

        <View className="mt-5 px-4">
          <View className="h-52">
            <FlatList
              data={data}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
        </View>

        {/* Popular Movies Section */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-xl">Popular Movies</Text>
            <TouchableOpacity>
              <Pressable
                className="bg-blue-600 px-4 py-2 rounded-xl"
                onPress={() => console.log("See All pressed")}
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
          <Text className="font-bold text-xl mb-4">Amazon Movies</Text>
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
