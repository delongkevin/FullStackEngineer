import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { categories } from '../data/products';

const HomeScreen = ({ navigation }) => {
  const { getCartItemCount } = useCart();

  const featuredProducts = [
    {
      id: 'featured-1',
      name: 'Gaming PC Bundle',
      description: 'High-performance gaming setup',
      price: 2499.99,
      image: 'https://via.placeholder.com/350x200/333333/FFFFFF?text=Gaming+PC'
    },
    {
      id: 'featured-2',
      name: 'Workstation Build',
      description: 'Professional content creation',
      price: 1899.99,
      image: 'https://via.placeholder.com/350x200/666666/FFFFFF?text=Workstation'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PC Builder Pro</Text>
          <Text style={styles.subtitle}>Build Your Dream Computer</Text>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Builds</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.featuredCard}
                onPress={() => navigation.navigate('Products')}
              >
                <Image source={{ uri: product.image }} style={styles.featuredImage} />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{product.name}</Text>
                  <Text style={styles.featuredDescription}>{product.description}</Text>
                  <Text style={styles.featuredPrice}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Products', { category: category.id })}
              >
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryIconText}>⚙️</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>Free Shipping</Text>
          <Text style={styles.promoText}>On all orders over $500</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featuredCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  featuredInfo: {
    padding: 15,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featuredDescription: {
    color: '#666',
    marginBottom: 10,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  promoBanner: {
    backgroundColor: '#FF6B35',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  promoText: {
    fontSize: 16,
    color: 'white',
  },
});

export default HomeScreen;