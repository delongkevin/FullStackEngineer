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
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other'];

export default function BudgetScreen({ userId }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
  });

  useEffect(() => {
    if (userId) {
      fetchBudgets();
    }
  }, [userId]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/budgets/${userId}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!formData.limit) {
      alert('Please enter a budget limit');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/budgets/${userId}`, {
        category: formData.category,
        limit: parseFloat(formData.limit),
      });
      setBudgets([...budgets, response.data]);
      setFormData({ category: 'Food', limit: '' });
      setShowForm(false);
      alert('Budget created successfully!');
    } catch (error) {
      alert('Error creating budget');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#10B981';
    }
  };

  const renderBudget = ({ item }) => (
    <View style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <Text style={styles.categoryName}>{item.category}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(parseFloat(item.percentUsed), 100)}%`,
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        />
      </View>

      <View style={styles.budgetFooter}>
        <Text style={styles.spent}>
          Spent: ${item.spent.toFixed(2)} / ${item.limit.toFixed(2)}
        </Text>
        <Text style={styles.remaining}>
          Remaining: ${item.remaining.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Budget</Text>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  formData.category === cat &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() =>
                  setFormData({ ...formData, category: cat })
                }
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === cat &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Monthly Limit</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.limit}
            onChangeText={(val) =>
              setFormData({ ...formData, limit: val })
            }
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateBudget}
          >
            <Text style={styles.addButtonText}>Create Budget</Text>
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
              data={budgets}
              renderItem={renderBudget}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No budgets yet. Create one to track spending!
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  categoryButtonSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ecfdf5',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#10B981',
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
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 11,
    fontWeight: 'bold',
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
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spent: {
    fontSize: 12,
    color: '#666',
  },
  remaining: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
  },
});
