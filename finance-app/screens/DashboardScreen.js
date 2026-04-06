import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';

const API_URL = 'http://localhost:5001/api';
const screenWidth = Dimensions.get('window').width - 40;

export default function DashboardScreen({ userId }) {
  const [analytics, setAnalytics] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/${userId}`),
        axios.get(`${API_URL}/users/${userId}`),
      ]);
      setAnalytics(analyticsRes.data);
      setUser(userRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#ecfdf5',
    backgroundGradientFrom: '#ecfdf5',
    backgroundGradientTo: '#d1fae5',
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {user && (
        <>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user.name}!</Text>
            <Text style={styles.subGreeting}>Your financial overview</Text>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>
              ${user.balance.toFixed(2)}
            </Text>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.smallLabel}>Monthly Income</Text>
                <Text style={styles.smallValue}>
                  ${user.salary.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text style={styles.smallLabel}>Currency</Text>
                <Text style={styles.smallValue}>{user.currency}</Text>
              </View>
            </View>
          </View>

          {analytics && (
            <>
              {/* KPI Cards */}
              <View style={styles.kpiContainer}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>This Month Spent</Text>
                  <Text style={styles.kpiValue}>
                    ${analytics.monthlyExpense.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>This Month Earned</Text>
                  <Text style={[styles.kpiValue, { color: '#059669' }]}>
                    ${analytics.monthlyIncome.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Savings Rate */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Savings Rate</Text>
                <View style={styles.card}>
                  <View style={styles.savingsRow}>
                    <View style={styles.savingsAmount}>
                      <Text style={styles.savingsLabel}>Saved This Month</Text>
                      <Text style={styles.savingsValue}>
                        ${analytics.savingsThisMonth.toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.savingsPercentage,
                        {
                          backgroundColor:
                            parseFloat(analytics.savingsRate) >= 20
                              ? '#ecfdf5'
                              : '#fef2f2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.percentageText,
                          {
                            color:
                              parseFloat(analytics.savingsRate) >= 20
                                ? '#059669'
                                : '#dc2626',
                          },
                        ]}
                      >
                        {analytics.savingsRate}%
                      </Text>
                      <Text style={styles.percentageLabel}>of income</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Top Spending Categories */}
              {Object.keys(analytics.categoryBreakdown).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Top Spending</Text>
                  <View style={styles.card}>
                    {Object.entries(
                      Object.entries(analytics.categoryBreakdown)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                    ).map(([category, amount]) => (
                      <View key={category} style={styles.categoryRow}>
                        <Text style={styles.categoryName}>{category}</Text>
                        <Text style={styles.categoryAmount}>
                          ${amount.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Alerts */}
              {analytics.alerts > 0 && (
                <View style={styles.alertSection}>
                  <View style={styles.alertCard}>
                    <Text style={styles.alertTitle}>⚠️ Fraud Alerts</Text>
                    <Text style={styles.alertText}>
                      You have {analytics.alerts} active alert
                      {analytics.alerts !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#10B981',
    padding: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#d1fae5',
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  smallValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  kpiContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    elevation: 1,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 1,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsAmount: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  savingsPercentage: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentageLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryName: {
    fontSize: 14,
    color: '#374151',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  alertSection: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginBottom: 40,
  },
  alertCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#dc2626',
  },
});
