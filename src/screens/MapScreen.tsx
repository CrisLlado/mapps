// MapScreen.tsx
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getProducts } from "./../firebase/firebaseAuth";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  userId: string;
  categoria: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const productMarkerImage = require("./../images/offerange_mark_2.png");

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<
    Location.LocationObject["coords"] | null
  >(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de acceso a la ubicación denegado");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const productsFromDB = await getProducts();
      setProducts(productsFromDB);
    })();
  }, []);

  const updateOffers = async () => {
    const productsFromDB = await getProducts();
    setProducts(productsFromDB);
  };

  const renderMarkers = () => {
    return products.map((product, index) => {
      if (
        product.location &&
        typeof product.location.latitude === "number" &&
        typeof product.location.longitude === "number"
      ) {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: product.location.latitude,
              longitude: product.location.longitude,
            }}
            onPress={() =>
              navigation.navigate("OfferDetail", {
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                userId: product.userId,
                categoria: product.categoria,
                location: product.location,
              })
            }
          >
            <Image
              source={productMarkerImage}
              style={{ width: 45, height: 45 }}
            />
          </Marker>
        );
      } else {
        console.warn(
          `Coordenadas inválidas para el producto con índice ${index}`
        );
      }
    });
  };

  return (
    <>
      {location && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Mi ubicación"
          />
          {renderMarkers()}
        </MapView>
      )}
    </>
  );
};

export default MapScreen;
