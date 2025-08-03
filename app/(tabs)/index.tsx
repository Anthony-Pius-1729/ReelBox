import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchData } from "../../services/movieApi";

export default async function Index() {
  try {
    const res = await fetchData();
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log("Error occured: ", error);
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-full">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 w-full mx-auto overflow-hidden mt-4">
          <TextInput
            placeholder="Movie, Drama & Others"
            placeholderTextColor="#666666"
            className="flex-1 py-2 px-7 text-sm border-2 rounded-3xl border-gray-700 focus:outline-none focus:ring-0"
          />
          <Ionicons
            name="search"
            color="#666666"
            size={20}
            className="absolute left-5"
          />
        </View>

        <View className="mt-5 rounded-2xl mx-5">
          <View>
            <TouchableOpacity>
              <ImageBackground
                source={{
                  uri: "https://berkleyspectator.com/wp-content/uploads/2022/01/vgPj2F128qtShMaT9DNa8ODtWUFhqqrFPEUWfTRo-e1642785179405-683x900.jpeg",
                }}
                className="w-10/12 mx-auto h-48 rounded-2xl justify-center items-center overflow-hidden"
                resizeMode="cover"
              >
                <Text className="text-white text-xl font-bold">
                  Content over image
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View className=" mt-4 ">
            <View className="flex flex-row  justify-between items-center">
              <Text className="font-bold text-xl ">Popular Movies</Text>
              <Text className="font-bold text-md underline">See All</Text>
            </View>
            <View className="mt-4">
              <TouchableOpacity>
                <ImageBackground
                  source={{
                    uri: "https://editorial.rottentomatoes.com/wp-content/uploads/2024/05/700MadMax.jpg",
                  }}
                  className="w-10/12 mx-auto h-64 rounded-2xl justify-center items-center overflow-hidden"
                  resizeMode="cover"
                ></ImageBackground>
              </TouchableOpacity>
            </View>
            <View className="mt-4">
              <Text className="font-bold text-xl ">Amazon Movies</Text>
              <TouchableOpacity>
                <ImageBackground
                  source={{
                    uri: "https://assets.vogue.com/photos/67b3e6d010c789d25230be2b/4:3/w_2240,c_limit/OneDay-FirstLook.jpg",
                  }}
                  className="w-10/12 mt-4 mx-auto h-64 rounded-2xl justify-center items-center overflow-hidden"
                  resizeMode="cover"
                ></ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
