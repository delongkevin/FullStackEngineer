import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
const GOAL_TYPES = ['steps', 'calories', 'distance', 'workouts', 'weight', 'sleep'];

export default function GoalsScreen({ userId }) {
  const [goals, setGoals] = useState([]);

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'steps',
    target: '',
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
    if (!newGoal.name || !newGoal.target) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/goals/${userId}`, {
        ...newGoal,
        target: parseInt(newGoal.target),
      });

      setGoals((prev) => [...prev, response.data]);

      setNewGoal({ name: '', type: 'steps', target: '' });
      setShowNewGoalForm(false);
      alert('Goal created successfully!');
    } catch (error) {
      alert('Error creating goal');
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (type) => {
    const icons = {
      steps: '👟',
      calories: '🔥',
      distance: '🏃',
      workouts: '💪',
      weight: '⚖️',
      sleep: '😴',
    };
    return icons[type] || '🎯';
  };

  const getProgressPercentage = (goal) => {
    return Math.min((goal.progress / goal.target) * 100, 100);
  };

  const renderGoal = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View>
          <Text style={styles.goalName}>
            {getGoalIcon(item.type)} {item.name}
          </Text>
          <Text style={styles.goalType}>{item.type}</Text>
        </View>
        <View style={styles.goalProgress}>
          <Text style={styles.goalProgressText}>
            {item.progress}/{item.target}
          </Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${getProgressPercentage(item)}%` },
          ]}
        />
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.deadline}>
          Due: {new Date(item.deadline).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.percentageText,
            {
              color: getProgressPercentage(item) >= 100 ? '#4caf50' : '#ff9800',
            },
          ]}
        >
          {Math.round(getProgressPercentage(item))}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showNewGoalForm && (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>Create New Goal</Text>

          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Run a 5K"
            value={newGoal.name}
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, name: text })
            }
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Goal Type</Text>
          <View style={styles.typePicker}>
            {GOAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  newGoal.type === type && styles.typeOptionSelected,
                ]}
                onPress={() => setNewGoal({ ...newGoal, type })}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    newGoal.type === type && styles.typeOptionTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Target</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter target number"
            value={newGoal.target}
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, target: text })
            }
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateGoal}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Goal</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowNewGoalForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {!showNewGoalForm && (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowNewGoalForm(true)}
          >
            <Text style={styles.fabText}>+ New Goal</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#1565C0" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={goals}
              renderItem={renderGoal}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={true}
              nestedScrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No goals yet. Create your first goal.</Text>
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
  typePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  typeOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: '#f9f9f9',
  },
  typeOptionSelected: {
    borderColor: '#1565C0',
    backgroundColor: '#e3f2fd',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#1565C0',
  },
  submitButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  goalProgress: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  goalProgressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1565C0',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: '#999',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
