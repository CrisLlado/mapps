import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';

const CATEGORIES = [
  { label: 'Restaurantes', value: 'restaurantes' },
  { label: 'Electrónica', value: 'electronica' },
  { label: 'Ropa', value: 'ropa' },
  // ... otras categorías que desees añadir
];

const FilterScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigation.navigate('MapScreen', { selectedCategory: category });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Selecciona una categoría para filtrar</Text>
      <RadioButton.Group
        onValueChange={(newValue) => setSelectedCategory(newValue)}
        value={selectedCategory}
      >
        {CATEGORIES.map((category) => (
          <View key={category.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value={category.value} />
            <Text>{category.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
      <Button
        title="Aplicar Filtro"
        onPress={() => {
          navigation.goBack();
          navigation.setParams({ category: selectedCategory });
        }}
      />
    </View>
  );
};

export default FilterScreen;
