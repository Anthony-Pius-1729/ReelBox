import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          borderWidth: 1,
          borderColor: "#2f95df",
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          //   borderTopColor: "#e0e0e0",
          height: "full",
          marginHorizontal: 15,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 20,
        },
        tabBarActiveTintColor: "#2f95dc",
        tabBarInactiveTintColor: "#gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="list"
        options={{
          title: "My List",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "list" : "list-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={24}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    marginBottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeIconContainer: {
    backgroundColor: "#e3f2fd",
    borderWidth: 2,
    borderColor: "#2f95dc",
  },
});
