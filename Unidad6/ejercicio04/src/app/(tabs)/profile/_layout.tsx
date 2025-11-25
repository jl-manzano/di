import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Posts from "./posts";
import Galeria from "./galeria";

const TopTabs = createMaterialTopTabNavigator();

export default function ProfileTabsLayout() {
  return (
    <TopTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "darkgreen",
        tabBarInactiveTintColor: "gray",
        tabBarIndicatorStyle: { backgroundColor: "green" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <TopTabs.Screen
        name="Posts"
        component={Posts}
        options={{ title: "Posts" }}
      />
      <TopTabs.Screen
        name="Galeria"
        component={Galeria}
        options={{ title: "Galería" }}
      />
    </TopTabs.Navigator>
  );
}
