import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config/api';
const WORKOUT_TYPES = ['running', 'cycling', 'swimming', 'gym', 'yoga', 'walking'];
const INTENSITIES = ['light', 'moderate', 'intense', 'very_intense'];

export default function WorkoutsScreen({ userId }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    type: 'running',
    duration: 30,
    distance: 5,
    calories: 300,
    intensity: 'moderate',
    notes: '',
  });

  useEffect(() => {
    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/workouts/${userId}`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    if (!formData.type || !formData.duration) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/workouts`, {
        userId,
        ...formData,
      });
      setWorkouts([response.data, ...workouts]);
      setFormData({
        type: 'running',
        duration: 30,
        distance: 5,
        calories: 300,
        intensity: 'moderate',
        notes: '',
      });
      setShowForm(false);
      alert('Workout logged successfully!');
    } catch (error) {
      alert('Error logging workout');
    }
  };

  const renderWorkout = ({ item }) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutType}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
        <Text style={styles.workoutDate}>
          {moment(item.date).format('MMM DD, YYYY')}
        </Text>
      </View>
      <View style={styles.workoutStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration} min</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{item.distance} km</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Calories</Text>
          <Text style={styles.statValue}>{item.calories}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Intensity</Text>
          <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>
            {item.intensity}
          </Text>
        </View>
      </View>
      {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {showForm && (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>Log Workout</Text>

          <Text style={styles.label}>Workout Type</Text>
          <View style={styles.picker}>
            {WORKOUT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.pickerOption,
                  formData.type === type && styles.pickerOptionSelected,
                ]}
                onPress={() => setFormData({ ...formData, type })}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    formData.type === type && styles.pickerOptionTextSelected,
                  ]}
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={String(formData.duration)}
            onChangeText={(val) =>
              setFormData({ ...formData, duration: parseInt(val) || 0 })
            }
            keyboardType="numeric"
            placeholder="30"
          />

          <Text style={styles.label}>Distance (km)</Text>
          <TextInput
            style={styles.input}
            value={String(formData.distance)}
            onChangeText={(val) =>
              setFormData({ ...formData, distance: parseFloat(val) || 0 })
            }
            keyboardType="decimal-pad"
            placeholder="5.0"
          />

          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.input}
            value={String(formData.calories)}
            onChangeText={(val) =>
              setFormData({ ...formData, calories: parseInt(val) || 0 })
            }
            keyboardType="numeric"
            placeholder="300"
          />

          <Text style={styles.label}>Intensity</Text>
          <View style={styles.picker}>
            {INTENSITIES.map((intensity) => (
              <TouchableOpacity
                key={intensity}
                style={[
                  styles.pickerOption,
                  formData.intensity === intensity &&
                    styles.pickerOptionSelected,
                ]}
                onPress={() => setFormData({ ...formData, intensity })}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    formData.intensity === intensity &&
                      styles.pickerOptionTextSelected,
                  ]}
                >
                  {intensity.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            value={formData.notes}
            onChangeText={(val) =>
              setFormData({ ...formData, notes: val })
            }
            placeholder="Add any notes about your workout..."
            multiline={true}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddWorkout}
          >
            <Text style={styles.addButtonText}>Save Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {!showForm && (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.fabText}>+ Log Workout</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#1565C0" />
          ) : (
            <FlatList
              data={workouts}
              renderItem={renderWorkout}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No workouts yet. Start by logging your first workout!
                </Text>
              }
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: '#f9f9f9',
  },
  pickerOptionSelected: {
    borderColor: '#1565C0',
    backgroundColor: '#e3f2fd',
  },
  pickerOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#1565C0',
  },
  addButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1565C0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    zIndex: 10,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  workoutDate: {
    fontSize: 14,
    color: '#999',
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stat: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  notes: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
