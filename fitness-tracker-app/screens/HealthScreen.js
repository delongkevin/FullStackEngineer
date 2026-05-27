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
import { LineChart, BarChart } from 'react-native-chart-kit';
import { API_URL } from '../config/api';
const screenWidth = Dimensions.get('window').width - 40;

export default function HealthScreen({ userId }) {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [wearables, setWearables] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchHealthData();
      fetchWearables();
    }
  }, [userId]);

  const fetchHealthData = async () => {
    try {
      setError('');
      const response = await axios.get(
        `${API_URL}/healthkit/${userId}?metric=all`
      );
      setHealthData(response.data);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Unable to load health metrics right now. Showing the last successful data, if available.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWearables = async () => {
    try {
      const response = await axios.get(`${API_URL}/wearables/${userId}`);
      setWearables(response.data.devices);
    } catch (error) {
      console.error('Error fetching wearables:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await Promise.allSettled([fetchHealthData(), fetchWearables()]);
    setLoading(false);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#e3f2fd',
    backgroundGradientFrom: '#e3f2fd',
    backgroundGradientTo: '#bbdefb',
    color: (opacity = 1) => `rgba(21, 101, 192, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!healthData ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No health data yet</Text>
          <Text style={styles.emptyBody}>
            Pull to refresh or log in again to restore your metrics.
          </Text>
        </View>
      ) : null}

      {/* Heart Rate */}
      {healthData?.heartRate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Heart Rate</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Today</Text>
                <Text style={styles.largeValue}>
                  {healthData.heartRate.today}
                </Text>
                <Text style={styles.unit}>bpm</Text>
              </View>
              <View>
                <Text style={styles.label}>7-day Avg</Text>
                <Text style={styles.largeValue}>
                  {healthData.heartRate.average}
                </Text>
                <Text style={styles.unit}>bpm</Text>
              </View>
            </View>
          </View>
          {healthData.heartRate.data && (
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: healthData.heartRate.data,
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      )}

      {/* Steps */}
      {healthData?.steps && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👟 Steps</Text>
          <View style={styles.card}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        (healthData.steps.today / healthData.steps.goal) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.stepStats}>
                <Text style={styles.stepValue}>{healthData.steps.today}</Text>
                <Text style={styles.stepGoal}>
                  Goal: {healthData.steps.goal}
                </Text>
              </View>
            </View>
          </View>
          {healthData.steps.data && (
            <BarChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: healthData.steps.data,
                  },
                ],
              }}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
        </View>
      )}

      {/* Calories */}
      {healthData?.calories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Calories</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Today</Text>
                <Text style={styles.largeValue}>
                  {healthData.calories.today}
                </Text>
                <Text style={styles.unit}>kcal</Text>
              </View>
              <View>
                <Text style={styles.label}>Goal</Text>
                <Text style={styles.largeValue}>
                  {healthData.calories.goal}
                </Text>
                <Text style={styles.unit}>kcal</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Water Intake */}
      {healthData?.water && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💧 Water Intake</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Today</Text>
                <Text style={styles.largeValue}>
                  {healthData.water.today}
                </Text>
                <Text style={styles.unit}>L</Text>
              </View>
              <View>
                <Text style={styles.label}>Goal</Text>
                <Text style={styles.largeValue}>
                  {healthData.water.goal}
                </Text>
                <Text style={styles.unit}>L</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Sleep */}
      {healthData?.sleep && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>😴 Sleep</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <View>
                <Text style={styles.label}>Last Night</Text>
                <Text style={styles.largeValue}>
                  {healthData.sleep.today}
                </Text>
                <Text style={styles.unit}>hours</Text>
              </View>
              <View>
                <Text style={styles.label}>Goal</Text>
                <Text style={styles.largeValue}>
                  {healthData.sleep.goal}
                </Text>
                <Text style={styles.unit}>hours</Text>
              </View>
            </View>
            <Text style={styles.recommendation}>
              💡 {healthData.sleep.recommendation}
            </Text>
          </View>
        </View>
      )}

      {/* Connected Devices */}
      {wearables.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⌚ Connected Devices</Text>
          {wearables.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text
                  style={[
                    styles.deviceStatus,
                    {
                      color: device.connected ? '#4caf50' : '#ff9800',
                    },
                  ]}
                >
                  {device.connected ? '🟢 Connected' : '🟡 Disconnected'}
                </Text>
              </View>
              <Text style={styles.deviceType}>
                {device.type.replace('_', ' ')}
              </Text>
              <Text style={styles.deviceInfo}>
                Last sync:{' '}
                {new Date(device.lastSync).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff3f3',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 4,
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  largeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  unit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1565C0',
  },
  stepStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  stepGoal: {
    fontSize: 12,
    color: '#999',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 12,
  },
  recommendation: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  deviceType: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  deviceInfo: {
    fontSize: 12,
    color: '#999',
  },
  spacer: {
    height: 40,
  },
});
