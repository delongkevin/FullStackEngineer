import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [forSale, setForSale] = useState(true);
  const [forRent, setForRent] = useState(false);

  const propertyTypes = ['house', 'condo', 'apartment', 'penthouse', 'townhouse'];
  const cities = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Boston'];
  const bedroomOptions = ['1', '2', '3', '4', '5+'];

  const handleSearch = async () => {
    try {
      const params = {
        search: searchQuery,
        type: selectedType,
        city: selectedCity,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        bedrooms: bedrooms || undefined,
        forSale: forSale ? 'true' : undefined,
        forRent: forRent ? 'true' : undefined
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await axios.get(`${API_BASE_URL}/api/properties`, { params });

      navigation.navigate('PropertyList', {
        properties: response.data,
        title: selectedCity || searchQuery || 'Search Results'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to search properties');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by address, city, or keyword..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Type</Text>
        <View style={styles.filterGrid}>
          {propertyTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipActive
              ]}
              onPress={() => setSelectedType(selectedType === type ? null : type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextActive
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.filterGrid}>
          {cities.map(city => (
            <TouchableOpacity
              key={city}
              style={[
                styles.filterChip,
                selectedCity === city && styles.filterChipActive
              ]}
              onPress={() => setSelectedCity(selectedCity === city ? null : city)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCity === city && styles.filterChipTextActive
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.priceContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min Price"
            value={minPrice}
            onChangeText={setMinPrice}
            keyboardType="number-pad"
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.priceSeparator}>to</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max Price"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="number-pad"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bedrooms</Text>
        <View style={styles.filterGrid}>
          {bedroomOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterChip,
                bedrooms === option && styles.filterChipActive
              ]}
              onPress={() => setBedrooms(bedrooms === option ? '' : option)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  bedrooms === option && styles.filterChipTextActive
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Status</Text>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setForSale(!forSale)}
        >
          <View style={[styles.checkbox, forSale && styles.checkboxActive]}>
            {forSale && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>For Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setForRent(!forRent)}
        >
          <View style={[styles.checkbox, forRent && styles.checkboxActive]}>
            {forRent && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>For Rent</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search Properties</Text>
      </TouchableOpacity>

      <View style={styles.quickLinks}>
        <Text style={styles.quickLinksTitle}>Popular Searches</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedCity('New York');
            setForSale(true);
            setForRent(false);
          }}
        >
          <Text style={styles.quickLink}>Manhattan Penthouses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedCity('San Francisco');
            setForSale(true);
            setForRent(false);
          }}
        >
          <Text style={styles.quickLink}>San Francisco Homes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedCity('Los Angeles');
            setForRent(true);
            setForSale(false);
          }}
        >
          <Text style={styles.quickLink}>LA Rentals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f9fafb'
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff'
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  filterChipText: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '500'
  },
  filterChipTextActive: {
    color: '#fff'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15
  },
  priceSeparator: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#1f2937'
  },
  searchButton: {
    margin: 16,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  quickLinks: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 20
  },
  quickLinksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10
  },
  quickLink: {
    color: '#059669',
    fontSize: 14,
    paddingVertical: 8
  }
});
