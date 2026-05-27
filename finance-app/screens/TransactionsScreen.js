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
import moment from 'moment';
import { API_URL } from '../config/api';
const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other'];

export default function TransactionsScreen({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Other',
    description: '',
  });

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, filterType]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (filterType !== 'all') {
        params.type = filterType;
      }
      const response = await axios.get(`${API_URL}/transactions/${userId}`, {
        params,
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!formData.amount) {
      alert('Please enter an amount');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/transactions`, {
        userId,
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setTransactions([response.data, ...transactions]);
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Other',
        description: '',
      });
      setShowForm(false);
      alert('Transaction added successfully!');
    } catch (error) {
      alert('Error adding transaction');
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View>
          <Text style={styles.categoryName}>{item.category}</Text>
          <Text style={styles.description}>{item.description || 'No description'}</Text>
        </View>
        <Text
          style={[
            styles.amount,
            { color: item.type === 'expense' ? '#ef4444' : '#10B981' },
          ]}
        >
          {item.type === 'expense' ? '-' : '+'}${item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.date}>
        {moment(item.date).format('MMM DD, YYYY')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add Transaction</Text>

          {/* Type Selection */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeSelector}>
            {['expense', 'income'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  formData.type === type && styles.typeOptionSelected,
                ]}
                onPress={() => setFormData({ ...formData, type })}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    formData.type === type && styles.typeOptionTextSelected,
                  ]}
                >
                  {type === 'expense' ? '💸 Expense' : '💰 Income'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.amount}
            onChangeText={(val) =>
              setFormData({ ...formData, amount: val })
            }
            keyboardType="decimal-pad"
          />

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

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            placeholder="Add notes..."
            value={formData.description}
            onChangeText={(val) =>
              setFormData({ ...formData, description: val })
            }
            multiline
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTransaction}
          >
            <Text style={styles.addButtonText}>Add Transaction</Text>
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
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {['all', 'expense', 'income'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filterType === type && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === type && styles.filterButtonTextActive,
                  ]}
                >
                  {type === 'all'
                    ? 'All'
                    : type === 'expense'
                    ? 'Expenses'
                    : 'Income'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAB */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>

          {/* Transactions List */}
          {loading ? (
            <ActivityIndicator size="large" color="#10B981" />
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No transactions yet. Start by adding one!
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  typeOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  typeOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ecfdf5',
  },
  typeOptionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  typeOptionTextSelected: {
    color: '#10B981',
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    borderColor: '#10B981',
    backgroundColor: '#ecfdf5',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#10B981',
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
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
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
