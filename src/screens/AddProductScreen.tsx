// AddProductScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import {
  createProduct,
  uploadImage,
  updateOffers,
} from "./../firebase/firebaseAuth";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";

const CATEGORIES = [
  { label: "Restaurantes", value: "restaurantes" },
  { label: "Electrónica", value: "electronica" },
  { label: "Ropa", value: "ropa" },
  // ... otras categorías que desees añadir
];

const AddProductScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].value);
  const navigation = useNavigation();

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      console.log(result.uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado para acceder a la ubicación");
      return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!name.trim()) {
      alert("Por favor, introduce el nombre del producto.");
      return;
    }
    if (!description.trim()) {
      alert("Por favor, introduce una descripción para el producto.");
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      alert("Por favor, introduce un precio válido para el producto.");
      return;
    }
    if (!image) {
      alert("Por favor, selecciona una imagen para el producto.");
      return;
    }

    let location = await getLocation();
    if (location) {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image, `${name}_${Date.now()}`);
      }

      const fechaCreacion = new Date().toISOString(); // Generar la fecha actual

      createProduct(
        name,
        description,
        price,
        location.coords.latitude,
        location.coords.longitude,
        imageUrl,
        selectedCategory,
        fechaCreacion, // Usar la fecha generada
        updateOffers // Agrega updateOffers como argumento
      );

      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      navigation.navigate("Map");
    } else {
      alert("No se puede obtener la ubicación");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginBottom: 16 }}
        />
      )}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre del producto"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción del producto"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Precio del producto"
        keyboardType="numeric"
      />
      <RadioButton.Group
        onValueChange={(newValue) => setSelectedCategory(newValue)}
        value={selectedCategory}
      >
        {CATEGORIES.map((category) => (
          <View key={category.value} style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value={category.value} />
            <Text>{category.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 200,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddProductScreen;
