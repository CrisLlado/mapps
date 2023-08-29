// BottomTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SavedOffersScreen from "../screens/SavedOffersScreen";
import AddProductScreen from "../screens/AddProductScreen";
import { Image } from "react-native";
import FilterScreen from "../screens/FilterScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator initialRouteName="Map">
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: (props) => (
            <Image
              source={require("./../images/offerange_logo_2.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: "Añadir producto",
        }}
      />
      <Tab.Screen
        name="Filters"
        component={FilterScreen}
        options={{
          title: "Filtros",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Configuración" }}
      /> */}
      {/* <Tab.Screen name="SavedOffers" component={SavedOffersScreen} options={{ title: 'Ofertas guardadas' }} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
