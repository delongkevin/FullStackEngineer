import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function GoalsScreen({ userId }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!formData.name || !formData.targetAmount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/goals/${userId}`, {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
      });
      setGoals([...goals, response.data]);
      setFormData({ name: '', targetAmount: '', deadline: '' });
      setShowForm(false);
      alert('Goal created successfully!');
    } catch (error) {
      alert('Error creating goal');
    }
  };

  const renderGoal = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalName}>{item.name}</Text>
        <Text style={styles.goalProgress}>
          {Math.round(item.progress)}%
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(item.progress, 100)}%` },
          ]}
        />
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.amount}>
          ${item.currentAmount.toFixed(2)} / ${item.targetAmount.toFixed(2)}
        </Text>
        <Text style={styles.deadline}>
          Due: {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Goal</Text>

          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Emergency Fund"
            value={formData.name}
            onChangeText={(val) =>
              setFormData({ ...formData, name: val })
            }
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Target Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.targetAmount}
            onChangeText={(val) =>
              setFormData({ ...formData, targetAmount: val })
            }
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateGoal}
          >
            <Text style={styles.addButtonText}>Create Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#10B981" />
          ) : (
            <FlatList
              data={goals}
              renderItem={renderGoal}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No goals yet. Create one to start saving!
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
    backgroundColor: '#f9fafb',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
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
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#10B981',
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
    borderColor: '#e5e7eb',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 12,
    color: '#666',
  },
  deadline: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
  },
});
