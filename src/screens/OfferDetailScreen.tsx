// OfferDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Platform, Linking } from 'react-native';
import firebase from 'firebase/compat';

const OfferDetailScreen = ({ route }) => {
  const { name, description, price, image, location, userId } = route.params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        if (userDoc.exists) { // Verifica si el documento existe
          setUser(userDoc.data());
        } else {
          console.log('No user found with ID: ', userId);
        }
      } catch (error) {
        console.error('Error fetching user: ', error);
      }
    };

    fetchUser();
  }, []);

  const handleDirections = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${location.latitude},${location.longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url!);
  };
  
  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text>{user.displayName}</Text>
          {user.photoURL && <Image source={{ uri: user.photoURL }} style={{ width: 50, height: 50 }} />}
        </>
      )}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>{price}</Text>
      <Button title="Llevame a la oferta!" onPress={handleDirections} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OfferDetailScreen;
