import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReviewsScreen = ({ route }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const loadReviews = async () => {
    try {
      const reviewsData = await productsAPI.getProductReviews(product.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!newReview.title.trim()) {
      Alert.alert('Error', 'Please enter a review title');
      return;
    }

    try {
      await productsAPI.addProductReview(product.id, newReview);
      Alert.alert('Success', 'Thank you for your review!');
      setNewReview({ rating: 0, title: '', comment: '' });
      setShowReviewForm(false);
      loadReviews(); // Reload reviews
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingSummary}>
              <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={averageRating}
                starSize={20}
                fullStarColor="#FFD700"
                containerStyle={styles.starContainer}
              />
              <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
            </View>
          </View>
        </View>

        {/* Rating Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Breakdown</Text>
          {[5, 4, 3, 2, 1].map(rating => (
            <View key={rating} style={styles.ratingBarContainer}>
              <Text style={styles.ratingLabel}>{rating} stars</Text>
              <View style={styles.ratingBarBackground}>
                <View
                  style={[
                    styles.ratingBarFill,
                    {
                      width: `${(ratingDistribution[rating] / reviews.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.ratingCount}>({ratingDistribution[rating]})</Text>
            </View>
          ))}
        </View>

        {/* Write Review Button */}
        {user && !showReviewForm && (
          <TouchableOpacity
            style={styles.writeReviewButton}
            onPress={() => setShowReviewForm(true)}
          >
            <Text style={styles.writeReviewText}>Write a Review</Text>
          </TouchableOpacity>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <View style={styles.reviewForm}>
            <Text style={styles.formTitle}>Write Your Review</Text>
            
            <View style={styles.ratingInput}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <StarRating
                maxStars={5}
                rating={newReview.rating}
                selectedStar={(rating) => setNewReview({ ...newReview, rating })}
                starSize={30}
                fullStarColor="#FFD700"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Review Title"
              value={newReview.title}
              onChangeText={(text) => setNewReview({ ...newReview, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your review (optional)"
              value={newReview.comment}
              onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowReviewForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reviews List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Customer Reviews ({reviews.length})
          </Text>
          
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
          ) : (
            reviews.map(review => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewerName}>{review.user?.name || 'Anonymous'}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={review.rating}
                    starSize={16}
                    fullStarColor="#FFD700"
                  />
                </View>
                
                {review.title && (
                  <Text style={styles.reviewTitle}>{review.title}</Text>
                )}
                
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))
          )}
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
  productHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  starContainer: {
    marginRight: 10,
  },
  reviewCount: {
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    width: 60,
    fontSize: 14,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    width: 40,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  writeReviewButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  writeReviewText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewForm: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ratingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  reviewItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: '#666',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default ReviewsScreen;